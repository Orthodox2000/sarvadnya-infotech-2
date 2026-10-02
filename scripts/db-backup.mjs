// CHANGE: 2026-10-02 — MongoDB backup dump (SP-1 cart build / Vercel migration prep).
// WHY: the cart + price manager + the rest of the site share ONE Atlas database. Before
// any migration, seed or destructive admin change, dump the collections to disk so a
// rollback is one `mongorestore` (or `mongosh --file`) away.
//
// Driver-based, zero extra dependencies (no mongodump binary required). Reads MONGODB_URI
// from .env like every other script. Dumps EVERY collection by default (ordered by _id so
// backups are byte-stable); set BACKUP_COLLECTIONS (comma-separated) to pick specific ones.
//
// Usage:
//   npm run backup:db                          # all collections
//   BACKUP_COLLECTIONS=prices,modules,news node scripts/db-backup.mjs
//
// Output: backups/<YYYY-MM-DD-HHmmss-Z>/<collection>.json + manifest.json
// ⚠️ .env points at the LIVE Atlas cluster (there is no dev DB) — this dumps PRODUCTION.

import { config as loadEnv } from 'dotenv';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not set (missing .env or environment variable).');
  process.exit(1);
}

/** BSON → JSON-safe replacer (ObjectId → hex, Date → ISO, Binary → base64, …). */
function bsonReplacer(_key, value) {
  if (value && value._bsontype === 'ObjectId') return value.toHexString();
  if (value instanceof Date) return value.toISOString();
  if (value && value._bsontype === 'Binary') return value.toString('base64');
  if (value && value._bsontype === 'Decimal128') return String(value);
  if (value && value._bsontype === 'Long') return value.toString();
  return value;
}

/**
 * Host-only mask for the manifest — NEVER emits credentials. The password is allowed to
 * contain characters that make `new URL()` throw (e.g. an unescaped @), so parse with a
 * regex on the raw string instead: take the part before any '/' after the scheme, drop a
 * `user:pass@` prefix, keep only the host[:port] portion.
 */
function maskUriHost(uri) {
  try {
    const withoutAuth = String(uri).replace(/^mongodb(\+srv)?:\/\/([^@/]+)@/, 'mongodb$1://');
    const hostPart = withoutAuth.split('/').slice(0, 3).join('/');
    const u = new URL(hostPart + '/');
    return u.host;
  } catch {
    // Last resort: never the raw uri — just the bit between '//' and the first '/' or '@'.
    const m = String(uri).match(/^mongodb(\+srv)?:\/\/(?:[^@/]+@)?([^/]+)/);
    return m ? m[2] : '(unparsable uri)';
  }
}

function collectionLimit() {
  const raw = process.env.BACKUP_COLLECTIONS;
  if (!raw) return null;
  return new Set(raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
}

async function main() {
  const client = new MongoClient(uri, { connectTimeoutMS: 15000, serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const db = client.db();
  const dbName = db.databaseName;

  const all = (await db.listCollections().toArray()).map((c) => c.name);
  const allowed = collectionLimit();
  const collections = allowed ? all.filter((n) => allowed.has(n.toLowerCase())) : all;
  if (collections.length === 0) {
    console.error(`No collections matched BACKUP_COLLECTIONS (${process.env.BACKUP_COLLECTIONS}).`);
    await client.close();
    process.exit(1);
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ts = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())}_${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const outDir = path.join(ROOT, 'backups', ts);
  fs.mkdirSync(outDir, { recursive: true });

  const manifest = { createdAt: now.toISOString(), database: dbName, uriHost: maskUriHost(uri), collections: [] };

  let totalDocs = 0;
  for (const name of collections) {
    const docs = await db.collection(name).find({}).sort({ _id: 1 }).toArray();
    const file = `${name}.json`;
    const count = docs.length;
    const size = JSON.stringify(docs, bsonReplacer, 2).length;
    await fs.promises.writeFile(path.join(outDir, file), JSON.stringify(docs, bsonReplacer, 2));
    totalDocs += count;
    manifest.collections.push({ name, count, bytes: size });
    console.log(`  ${file.padEnd(34)} ${String(count).padStart(7)} docs  ${(size / 1024).toFixed(1)} KB`);
  }

  await fs.promises.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nBackup complete: ${outDir}`);
  console.log(`  ${collections.length} collection(s), ${totalDocs} document(s), host ${manifest.uriHost}`);
  await client.close();
}

main().catch((err) => {
  console.error('Backup failed:', err?.message ?? err);
  process.exit(1);
});