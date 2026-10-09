import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createRateLimiter } from '@/lib/rate-limit'
import { isIgnoredIp, isIgnoredRequest } from '@/lib/visitors'
import { ensureCaptureIndexes } from '@/lib/capture-indexes'

const limiter = createRateLimiter(30, 60_000)

export async function POST(req:NextRequest){
  try{
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isIgnoredIp(ip) || isIgnoredRequest(req)) return NextResponse.json({ignored:true})
    const rl = limiter.check(ip)
    if (rl.limited) return NextResponse.json({error:'rate_limited',retryAfter:rl.retryAfter},{status:429,headers:{'Retry-After':String(rl.retryAfter)}})
    const body = await req.json()
    const {chatId, sessionId, endedReason='closed'} = body
    if (!chatId||!sessionId) return NextResponse.json({error:'bad_request'},{status:400})
    const now=new Date()
    const expiresAt=new Date(now.getTime()+30*24*60*60*1000)
    await ensureCaptureIndexes().catch(()=>{})
    const db=await getDb()
    await db.collection('chat_logs').updateOne(
      {chatId, sessionId},
      {$set:{endedAt:now, endedReason, lastActiveAt:now, expiresAt}}
    )
    return NextResponse.json({ok:true})
  }catch(e:any){ return NextResponse.json({error:'server_error'},{status:500}) }
}
