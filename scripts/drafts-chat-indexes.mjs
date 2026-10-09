#!/usr/bin/env node
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) { console.error('MONGODB_URI missing'); process.exit(1) }
const client = new MongoClient(uri)
async function run(){
  await client.connect()
  const db = client.db()
  await db.collection('drafts').createIndex({draftId:1,sessionId:1},{unique:true})
  await db.collection('drafts').createIndex({sessionId:1,lastActiveAt:-1})
  await db.collection('drafts').createIndex({path:1,createdAt:-1})
  await db.collection('drafts').createIndex({entryPoint:1,createdAt:-1})
  await db.collection('drafts').createIndex({expiresAt:1},{expireAfterSeconds:0})
  await db.collection('chat_logs').createIndex({chatId:1},{unique:true})
  await db.collection('chat_logs').createIndex({sessionId:1,lastActiveAt:-1})
  await db.collection('chat_logs').createIndex({path:1,startedAt:-1})
  await db.collection('chat_logs').createIndex({entryPoint:1,startedAt:-1})
  await db.collection('chat_logs').createIndex({expiresAt:1},{expireAfterSeconds:0})
  console.log('indexes ok')
  await client.close()
}
run().catch(e=>{console.error(e);process.exit(1)})
