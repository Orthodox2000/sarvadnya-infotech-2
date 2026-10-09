import clientPromise from './mongodb'
import { MongoClient } from 'mongodb'

let dstClient: MongoClient|null = null
let dstReady = false

async function getDst(){
  if (dstReady && dstClient) return dstClient
  const uri = process.env.DST_MONGODB_URI || process.env.MONGODB_URI_NEW
  if (!uri) return null
  try{
    dstClient = new MongoClient(uri)
    await dstClient.connect()
    dstReady=true
    return dstClient
  }catch(e){ return null }
}

export async function withDual<T>(fn:(db:any)=>Promise<T>, dbName?:string):Promise<T>{
  const src = await (await clientPromise).db(dbName)
  const res = await fn(src)
  const dst = await getDst()
  if (dst){ try{ await fn(dst.db(dbName)) } catch(e){} }
  return res
}
