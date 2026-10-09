import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { createRateLimiter } from '@/lib/rate-limit'
import { isIgnoredIp, isIgnoredRequest } from '@/lib/visitors'
import { ObjectId } from 'mongodb'

const limiter = createRateLimiter(40, 60_000)

export async function POST(req:NextRequest){
  try{
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isIgnoredIp(ip) || isIgnoredRequest(req)) return NextResponse.json({ignored:true})
    const rl = limiter.check(ip)
    if (rl.limited) return NextResponse.json({error:'rate_limited',retryAfter:rl.retryAfter},{status:429,headers:{'Retry-After':String(rl.retryAfter)}})
    const body = await req.json()
    const {sessionId,path,entryPoint='ask-sara-modal',meta={}} = body
    if (!sessionId) return NextResponse.json({error:'bad_request'},{status:400})
    const chatId = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
    const now=new Date()
    const expiresAt=new Date(now.getTime()+30*24*60*60*1000)
    const db=await getDb()
    await db.collection('chat_logs').insertOne({
      _id:new ObjectId(), chatId, sessionId, ip, path, entryPoint, startedAt:now, lastActiveAt:now, messages:[], context:{}, meta, expiresAt, endedReason:undefined
    })
    return NextResponse.json({ok:true,chatId})
  }catch(e:any){ return NextResponse.json({error:'server_error'},{status:500}) }
}
