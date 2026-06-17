import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const OUTPUT_FILE = path.join(process.cwd(), 'WEBSITE_CONTENT_SOFT_COPY.md');

const ROUTES = [
  '/',
  '/about',
  '/capabilities',
  '/careers',
  '/cloud',
  '/contact',
  '/demo',
  '/find-solution',
  '/mic-test',
  '/modules',
  '/news',
  '/privacy',
  '/products',
  '/services',
  '/services/amc',
  '/services/corporate-training',
  '/services/mobile-app-biz',
  '/services/tally-on-whatsapp',
  '/services/tdl',
  '/services/tss',
  '/team',
  '/terms',
  '/tutorials'
];

async function extractTextFromPage(page, route) {
  console.log(`🔍 Extracting text from: ${route}`);
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'load', timeout: 60000 });
  } catch (e) {
    console.log(`⚠️ Timeout on ${route}, attempting to proceed anyway...`);
  }
  
  // Wait for dynamic content
  await new Promise(r => setTimeout(r, 2000));

  let data = await page.evaluate((rPath) => {
    const results = [];
    results.push(`\n# Route: ${rPath}\n`);

    const grab = (selector) => Array.from(document.querySelectorAll(selector)).map(el => el.innerText.trim()).filter(t => t.length > 0);

    const h1s = grab('h1');
    if (h1s.length > 0) results.push(`## Titles (H1)\n- ${h1s.join('\n- ')}`);

    const h2s = grab('h2');
    if (h2s.length > 0) results.push(`### Subtitles (H2)\n- ${h2s.join('\n- ')}`);

    const h3s = grab('h3');
    if (h3s.length > 0) results.push(`#### Sections (H3)\n- ${h3s.join('\n- ')}`);

    const ps = Array.from(document.querySelectorAll('p'))
      .map(el => el.innerText.trim())
      .filter(t => t.length > 20)
      .slice(0, 30); 
    if (ps.length > 0) results.push(`##### Descriptions\n- ${ps.join('\n- ')}`);

    const buttons = Array.from(document.querySelectorAll('button, a'))
      .map(el => el.innerText.trim())
      .filter(t => t.length > 0 && t.length < 100);
    const uniqueButtons = [...new Set(buttons)];
    if (uniqueButtons.length > 0) results.push(`##### Actions (Buttons/CTAs)\n- ${uniqueButtons.join('\n- ')}`);

    return results.join('\n\n');
  }, route);

  // Specialized logic for /find-solution to capture all questions
  if (route === '/find-solution') {
    data += `\n\n###### Strategic Consultation Path Details\n`;
    const questions = [];
    // We'll iterate through a few "Next" clicks to see more questions if possible, 
    // but since it's a review, let's try to extract the known tree from the page if we can or just click a bit.
    for (let i = 0; i < 5; i++) {
       const qTitle = await page.evaluate(() => document.querySelector('h1')?.innerText || "End of path");
       const qSub = await page.evaluate(() => document.querySelector('p.text-slate-500')?.innerText || "");
       const options = await page.evaluate(() => Array.from(document.querySelectorAll('button.group span.font-black')).map(s => s.innerText));
       
       if (!questions.includes(qTitle)) {
         questions.push(qTitle);
         data += `\n**Question ${i+1}:** ${qTitle}\n*Subtitle:* ${qSub}\n*Options:* ${options.join(', ')}\n`;
       }
       
       const nextBtn = await page.$('button.bg-\\[\\#00ABE4\\]:not([disabled])');
       if (nextBtn) {
         // Select first option to move forward
         await page.evaluate(() => {
           const firstOpt = document.querySelector('button.group.relative');
           if (firstOpt) firstOpt.click();
         });
         await new Promise(r => setTimeout(r, 500));
         await page.click('button.bg-\\[\\#00ABE4\\]');
         await new Promise(r => setTimeout(r, 1000));
       } else {
         break;
       }
    }
  }

  let fullContent = data;

  // Handle specific popups
  if (route === '/products' || route === '/cloud' || route === '/services' || route === '/modules') {
    const detailButtons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button'))
        .filter(b => b.innerText.toLowerCase().includes('details') || b.innerText.toLowerCase().includes('explore'))
        .map(b => b.innerText);
    });

    if (detailButtons.length > 0) {
      fullContent += `\n\n###### Detailed Popups for ${route}\n`;
      for (const btnText of detailButtons.slice(0, 5)) {
        try {
          await page.evaluate((txt) => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText === txt);
            if (btn) btn.click();
          }, btnText);
          await new Promise(r => setTimeout(r, 1000));
          
          const popupTextContent = await page.evaluate(() => {
            const modal = document.querySelector('div[role="dialog"], div.fixed.inset-0.z-\\[100000\\]');
            if (!modal) return "No modal found";
            return modal.innerText.replace(/\n+/g, '\n').trim();
          });
          
          fullContent += `\n**Popup [${btnText}]:**\n${popupTextContent}\n`;
          await page.keyboard.press('Escape');
          await new Promise(r => setTimeout(r, 500));
        } catch (e) { }
      }
    }
  }

  return fullContent;
}

async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let finalMarkdown = `# Sarvadnya Infotech LLP - Total Website Content Soft Copy\n`;
  finalMarkdown += `**Generated:** ${new Date().toLocaleString()}\n`;
  finalMarkdown += `**Application Version:** v1.1.370\n\n---\n`;

  for (const route of ROUTES) {
    const content = await extractTextFromPage(page, route);
    finalMarkdown += content + `\n\n---\n`;
  }

  fs.writeFileSync(OUTPUT_FILE, finalMarkdown);
  await browser.close();
  console.log(`\n✅ Soft copy generated successfully: ${OUTPUT_FILE}`);
}

run().catch(err => {
  console.error('❌ Error generating soft copy:', err);
  process.exit(1);
});
