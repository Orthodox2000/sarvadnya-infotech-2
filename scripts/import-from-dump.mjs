import fs from 'fs'
import { MongoClient } from 'mongodb'

const DST = process.env.MONGODB_URI
if (!DST) { console.error('missing'); process.exit(1) }

const dir = 'public/sarvadnya-infotech'
async function run(){
  const c = new MongoClient(DST)
  await c.connect()
  const db = c.db()
  const files = fs.readdirSync(dir).filter(f=>f.endsWith('.json'))
  for(const f of files){
    const name = f.replace('.json','')
    const data = JSON.parse(fs.readFileSync(dir+'/'+f))
    const col = db.collection(name)
    await col.deleteMany({})
    if(Array.isArray(data) && data.length>0){
      await col.insertMany(data,{ordered:false})
    }
    console.log(name+':'+(Array.isArray(data)?data.length:0))
  }
  await c.close()
  console.log('done')
}
run().catch(e=>{console.error(e);process.exit(1)})
