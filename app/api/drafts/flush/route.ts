import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createRateLimiter } from '@/lib/rate-limit'
import { isIgnoredIp, isIgnoredRequest } from '@/lib/visitors'
import { ensureCaptureIndexes } from '@/lib/capture-indexes'
import { shouldCaptureDraft } from '@/lib/draft-contact.mjs'
import { ObjectId } from 'mongodb'

const limiter = createRateLimiter(40, 60_000)
const MAX_FIELDS=25
const MAX_CHARS=2000

export async function POST(req:NextRequest){
  try{
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isIgnoredIp(ip) || isIgnoredRequest(req)) return NextResponse.json({ignored:true})
    const rl = limiter.check(ip)
    if (rl.limited) return NextResponse.json({error:'rate_limited',retryAfter:rl.retryAfter},{status:429,headers:{'Retry-After':String(rl.retryAfter)}})
    const body = await req.json()
    const {draftId, sessionId, path, entryPoint, source, fields={}, meta={}} = body
    if (!draftId||!sessionId) return NextResponse.json({error:'bad_request'},{status:400})
    const f:Record<string,any>={}
    let c=0
    for (const [rawKey,v] of Object.entries(fields)){
      if (c>=MAX_FIELDS) break
      // CHANGE: 2026-10-27 — key names are now sanitised before they become Mongo
      // field paths (below). Previously a key like `a.b` / `$x` was written into
      // `fields` as a literal key; as a dotted path it would nest or throw.
      const k = rawKey.replace(/[^A-Za-z0-9_]/g,'_').slice(0,64)
      if (!k) continue
      if (typeof v==='string'){ const t=v.slice(0,MAX_CHARS); f[k]=t.trim(); c++ }
      else if (v!=null){ try{ f[k]=JSON.parse(JSON.stringify(v).slice(0,MAX_CHARS*2)) } catch{} c++ }
    }
    // CHANGE: 2026-10-27 — SERVER-side half of the chat-draft gate (owner: no draft
    // from Ask Sara without a real email). Enforced here too so a stale cached client
    // — or a direct POST — can never create the blank "Form Drafts" row the owner saw.
    // Non-chat entry points are unaffected (see lib/draft-contact.mjs).
    const now=new Date()
    const expiresAt=new Date(now.getTime()+30*24*60*60*1000)
    await ensureCaptureIndexes().catch(()=>{})
    const db=await getDb()
    const col=db.collection('drafts')
    // CHANGE: 2026-10-27 — the gate must see the WHOLE picture, not this request's diff.
    // WHY: the tracker only sends what CHANGED after the first flush, so a chat that
    // flush()es name+email and then phone arrives as `fields:{phone}` — which on its own
    // contains no email and was refused, silently dropping the phone (caught by the
    // runtime probe: the stored doc kept name+email but never gained the number).
    // The client gate merges `lastSent + pending`; the server has to merge the STORED
    // fields for the same decision. The lookup only happens when the diff is refused,
    // so an ordinary form draft still costs exactly one write and no read.
    if (!shouldCaptureDraft(entryPoint, f)) {
      const prior = await col.findOne({draftId, sessionId}, {projection:{fields:1}})
      const carried:Record<string,any> = (prior && prior.fields) || {}
      if (!shouldCaptureDraft(entryPoint, {...carried, ...f})) {
        return NextResponse.json({ok:true, skipped:'no_contact'})
      }
    }
    // CHANGE: 2026-10-27 — MERGE the new fields instead of replacing the object.
    // The tracker only sends the DIFF after the first flush, so `$set:{fields:f}`
    // used to wipe earlier fields (a chat draft flushed name, then email, then phone
    // ended up holding only the phone — with no email in the admin contact cell).
    const fieldSet:Record<string,any>={}
    for (const [k,v] of Object.entries(f)) fieldSet[`fields.${k}`]=v
    await col.updateOne(
      {draftId, sessionId},
      {
        $setOnInsert:{_id:new ObjectId(), createdAt:now},
        $set:{path, entryPoint, source, ...fieldSet, meta, lastActiveAt:now, updatedAt:now, expiresAt, status:'active'},
      },
      {upsert:true}
    )
    return NextResponse.json({ok:true,draftId})
  }catch(e:any){ return NextResponse.json({error:'server_error'},{status:500}) }
}
