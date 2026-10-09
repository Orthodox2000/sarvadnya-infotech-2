import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createRateLimiter } from '@/lib/rate-limit'
import { isIgnoredIp, isIgnoredRequest } from '@/lib/visitors'
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
    for (const [k,v] of Object.entries(fields)){
      if (c>=MAX_FIELDS) break
      if (typeof v==='string'){ const t=v.slice(0,MAX_CHARS); f[k]=t.trim(); c++ }
      else if (v!=null){ try{ f[k]=JSON.parse(JSON.stringify(v).slice(0,MAX_CHARS*2)) } catch{} c++ }
    }
    const now=new Date()
    const expiresAt=new Date(now.getTime()+30*24*60*60*1000)
    const db=await getDb()
    const col=db.collection('drafts')
    await col.updateOne(
      {draftId, sessionId},
      {$setOnInsert:{_id:new ObjectId(), createdAt:now}, $set:{path, entryPoint, source, fields:f, meta, lastActiveAt:now, updatedAt:now, expiresAt, status:'active'}},
      {upsert:true}
    )
    return NextResponse.json({ok:true,draftId})
  }catch(e:any){ return NextResponse.json({error:'server_error'},{status:500}) }
}
