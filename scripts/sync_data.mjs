import { MongoClient, ServerApiVersion } from "mongodb";
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
  console.error("Missing MONGODB_URI environment variable.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db();
    
    // 1. Sync Application Version in Settings
    const settingsCol = db.collection('settings');
    const version = 'v1.1.251';
    await settingsCol.updateOne(
      { key: 'NEXT_PUBLIC_APP_VERSION' },
      { $set: { value: version, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log(`Synced version to database: ${version}`);

    // 2. Sync About Page Content
    const contentCol = db.collection('site_content');
    const aboutContent = {
      hero_title: 'SARVADNYA INFOTECH LLP',
      hero_subtitle: 'Your Solution Partner',
      hero_description: 'Sarvadnya Infotech LLP is a Certified Tally Partner having more than 1,500+ satisfied clients for Tally Software and related Services since 2008. Clients count us for our quality services and transparent consultancy on investment in Softwares Services as we believe in making Business happy and satisfied by providing right Solutions. With the help of our expert and an excellent team who understands the need and pain areas of Client’s Business in a short span of time and fulfill their needs at maximum saturation level too very quickly! We are known for providing the Solutions with ultimate satisfaction.',
      hero_image: 'https://t6sd8rtn777vye6j.public.blob.vercel-storage.com/about-hero-image-1779440951513.jfif',
      partner1_name: 'Suman Sawant',
      partner1_quote: 'She is the Co-founder of Sarvadnya Infotech LLP. An MBA in HR and Finance, She has a rich experience of working in diversified industries and work profiles. With great interest in Accounts & Finance and a zeal towards excellent delivery of each project she handles, she observed and found the Businesses strugging with the knowledge gap with right technology adaption for the proper finance management for the business. She enjoys assisting Businesses in adapting skills which help them manage their Business process and finance in an effective way and replace Manual work with System automation in Accounts & Finance. Out of great passion towards Training people, she also provides occasional lectures in ICAI on the subject of Tally technology for Audit.',
      partner1_image: '',
      partner2_name: 'Mr. Madhukar Sawant',
      partner2_quote: '“Hello, I’m Pranit, The Founder of Sarvadnya Infotech LLP. With over 15 years of extensive experience in the field of Computer Hardware and Networking, I have had the privilege of assisting numerous customers in selecting the ideal technology solutions for their businesses. My expertise lies in providing tailored recommendations and expert guidance to ensure seamless technology adoption.\n\nThroughout my career, I have successfully helped businesses of all sizes find the right technological fit, enabling them to enhance their efficiency and productivity. I take pride in my ability to understand the unique requirements of each client and deliver personalized solutions that align with their goals.\n\nIf you’re seeking a trusted advisor who can help you navigate the complex world of technology, I am here to assist you. Let’s connect and explore how I can contribute to your business’s success.”',
      partner2_image: '',
      gallery_badge: 'Inside Sarvadnya',
      gallery_title: 'Our Workspace & Culture',
      gallery_description: 'A glimpse into our daily operations and the environment where excellence is crafted.'
    };

    await contentCol.updateOne(
      { section: 'about' },
      { $set: { content: aboutContent, updatedAt: new Date() } },
      { upsert: true }
    );
    console.log('Synced About page content to database');

    console.log("Database sync completed successfully");
  } catch (err) {
    console.error('Sync failed:', err);
  } finally {
    await client.close();
  }
}

run();
