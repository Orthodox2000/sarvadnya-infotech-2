import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createRateLimiter } from '@/lib/rate-limit'
import { isIgnoredIp, isIgnoredRequest } from '@/lib/visitors'
import { ensureCaptureIndexes } from '@/lib/capture-indexes'

const limiter = createRateLimiter(60, 60_000)
const MAX_TXT=4000

export async function POST(req:NextRequest){
  try{
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isIgnoredIp(ip) || isIgnoredRequest(req)) return NextResponse.json({ignored:true})
    const rl = limiter.check(ip)
    if (rl.limited) return NextResponse.json({error:'rate_limited',retryAfter:rl.retryAfter},{status:429,headers:{'Retry-After':String(rl.retryAfter)}})
    const body = await req.json()
    const {chatId, sessionId, turn, turns=[]} = body
    if (!chatId||!sessionId) return NextResponse.json({error:'bad_request'},{status:400})
    const toPush:any[]=[]
    if (turn){ toPush.push(normalize(turn)) }
    for (const t of turns){ if (t) toPush.push(normalize(t)) }
    if (toPush.length===0) return NextResponse.json({ok:true})
    const now=new Date()
    const expiresAt=new Date(now.getTime()+30*24*60*60*1000)
    await ensureCaptureIndexes().catch(()=>{})
    const db=await getDb()
    await db.collection('chat_logs').updateOne(
      {chatId, sessionId},
      { $push: { messages: { $each: toPush } as any }, $set: { lastActiveAt: now, expiresAt }, $setOnInsert: { ip } } as any
    )
    return NextResponse.json({ok:true})
  }catch(e:any){ return NextResponse.json({error:'server_error'},{status:500}) }
}

function normalize(t:any){
  const role = t.role==='assistant'?'assistant':'user'
  let text = String(t.text||'').replace(/[\u0000-\u001F\u007F]+/g,' ').trim()
  if (text.length>MAX_TXT) text=text.slice(0,MAX_TXT)
  return {role,text,ts:new Date(t.ts||Date.now()), topic:t.topic||undefined}
}
