import clientPromise from './mongodb'

export async function getDb() {
  const client = await clientPromise
  return client.db()
}
