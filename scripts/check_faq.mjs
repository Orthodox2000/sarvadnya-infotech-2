import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const [key, ...value] = line.split("=");
    if (key && value) {
      process.env[key.trim()] = value.join("=").trim().replace(/^["']|["']$/g, '');
    }
  });
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const col = db.collection('site_content');
    const doc = await col.findOne({ section: 'home_faq' });
    if (doc) {
        console.log("FAQ Data found:", doc.content?.length, "items");
    } else {
        console.log("FAQ Data NOT found for section 'home_faq'");
    }
  } finally {
    await client.close();
  }
}

run();
