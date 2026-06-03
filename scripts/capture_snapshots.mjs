import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const SNAPSHOT_DIR = path.join(process.cwd(), 'snapshots');

if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR);
}

async function capture() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('📸 Capturing Homepage slides...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

  // Wait for initial animation
  await new Promise(r => setTimeout(r, 2000));

  // Capture Homepage - Slide 1
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'home_slide_1.png'), fullPage: false });
  console.log('✅ Captured Home Slide 1');

  // Increase to 8 slides to be safe, and wait 8.2s to stay in sync with the 8s cycle
  for (let i = 2; i <= 8; i++) {
    console.log(`Waiting for Slide ${i} transition...`);
    await new Promise(r => setTimeout(r, 8200));
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, `home_slide_${i}.png`), fullPage: false });
    console.log(`✅ Captured Home Slide ${i}`);
  }

  // Capture Full Homepage (Scroll through to trigger animations)
  console.log('📸 Capturing Full Homepage...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
  // Wait for all animations to settle
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'home_full.png'), fullPage: true });
  console.log('✅ Captured Full Homepage');

  // Capture Products Page
  console.log('📸 Capturing Products Page...');
  await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'products_main.png'), fullPage: true });
  console.log('✅ Captured Products Main');

  // Capture Product Details Popups
  const productNames = ['Silver', 'Gold', 'Server'];
  for (const name of productNames) {
    console.log(`📸 Capturing details for TallyPrime ${name}...`);
    await page.evaluate((pName) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('View Full Details') && b.closest('div.relative')?.querySelector('h3')?.innerText.includes(pName));
      if (btn) btn.click();
    }, name);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, `products_details_${name.toLowerCase()}.png`) });
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
    console.log(`✅ Captured ${name} details`);
  }

  // Capture Cloud Page
  console.log('📸 Capturing Cloud Page...');
  await page.goto(`${BASE_URL}/cloud`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'cloud_main.png'), fullPage: true });
  console.log('✅ Captured Cloud Main');

  // Capture Cloud Details Popups
  const cloudNames = ['AWS Cloud Server', 'Windows VM', 'NoSky Backup'];
  for (const name of cloudNames) {
    console.log(`📸 Capturing details for ${name}...`);
    await page.evaluate((cName) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('View Full Details') && b.closest('div.group')?.querySelector('h3')?.innerText.includes(cName));
      if (btn) btn.click();
    }, name);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, `cloud_details_${name.toLowerCase().replace(/\s+/g, '_')}.png`) });
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
    console.log(`✅ Captured ${name} details`);
  }

  // Capture Services Page and its details
  console.log('📸 Capturing Services Page...');
  await page.goto(`${BASE_URL}/services`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'services_main.png'), fullPage: true });

  const serviceTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(h3 => h3.innerText).filter(t => t.length > 0);
  });

  for (const title of serviceTitles) {
    console.log(`📸 Capturing details for Service: ${title}...`);
    const opened = await page.evaluate((t) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('view details') && b.closest('div.group')?.querySelector('h3')?.innerText === t);
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, title);

    if (opened) {
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(SNAPSHOT_DIR, `services_details_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`) });
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
      console.log(`✅ Captured ${title} details`);
    } else {
      console.log(`❌ Could not find 'View Details' button for ${title}`);
    }
  }

  // Capture Services Sub-Routes
  const serviceSubRoutes = [
    'amc', 'corporate-training', 'mobile-app-biz', 'tally-on-whatsapp', 'tdl', 'tss'
  ];
  for (const route of serviceSubRoutes) {
    console.log(`📸 Capturing /services/${route}...`);
    await page.goto(`${BASE_URL}/services/${route}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, `services_route_${route.replace(/-/g, '_')}.png`), fullPage: true });
    console.log(`✅ Captured /services/${route}`);
  }

  // Capture Modules Page and its details
  console.log('📸 Capturing Modules Page...');
  await page.goto(`${BASE_URL}/modules`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000)); // Wait for API fetch
  await page.screenshot({ path: path.join(SNAPSHOT_DIR, 'modules_main.png'), fullPage: true });

  const moduleTitles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(h3 => h3.innerText).filter(t => t.length > 0);
  });

  // Capture up to 5 module details to avoid bloating but show variety
  for (const title of moduleTitles.slice(0, 5)) {
    console.log(`📸 Capturing details for Module: ${title}...`);
    const opened = await page.evaluate((t) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.toLowerCase().includes('explore details') && b.closest('div.group')?.querySelector('h3')?.innerText === t);
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, title);

    if (opened) {
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(SNAPSHOT_DIR, `modules_details_${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`) });
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 500));
      console.log(`✅ Captured ${title} details`);
    } else {
      console.log(`❌ Could not find 'Explore Details' button for ${title}`);
    }
  }

  // Other pages
  const otherPages = ['about', 'careers', 'contact', 'team', 'capabilities', 'mic-test'];
  for (const p of otherPages) {
    console.log(`📸 Capturing /${p}...`);
    await page.goto(`${BASE_URL}/${p}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SNAPSHOT_DIR, `page_${p}.png`), fullPage: true });
    console.log(`✅ Captured /${p}`);
  }

  await browser.close();
  console.log('\n🎉 All snapshots captured in ./snapshots directory!');
}

capture().catch(err => {
  console.error('❌ Error during capture:', err);
  process.exit(1);
});
