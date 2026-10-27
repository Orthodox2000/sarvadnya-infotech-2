// CHANGE: 2026-10-22 — NEW: deterministic regression suite for the catalogue Sara sells from.
//
// WHY: the owner asked Sara to be updated "with our new website content, updated addons and
// details" so she can SUGGEST them instead of only answering. This suite locks that behaviour
// down WITHOUT an LLM: the catalogue is pure data, so every claim below is deterministic.
//
// Runs standalone with plain Node (the .mjs modules need no build step) — no server, no AI,
// no tokens spent.
import {
  PRODUCTS,
  ADDONS_CATALOGUE,
  INSIGHTS_HUB,
  LEARNING_SECTIONS,
  LEARNING_LESSONS,
  buildCatalogPromptBlock,
  buildGuidesPromptBlock,
  suggestCatalog,
  catalogSuggestionReply,
  guideSuggestionReply,
} from '../lib/sara-catalog.mjs';
import { addons } from '../lib/addons.mjs';
// CHANGE: 2026-10-23 — the /shop catalogue is generated from this module, so the suite asserts
// Sara knows every one of the 107 items and links each to its own anchor.
import { TDL_ITEMS } from '../lib/tdl-catalog.mjs';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ${name} ... PASS`);
    passed++;
  } catch (err) {
    console.log(`  ${name} ... FAIL — ${err.message}`);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('\n📦 Sara Catalogue — Products, Add-ons & Guides (no server/AI)\n');

// ─── Add-ons: one source of truth, fully described ──────────────────────────
console.log('🔌 Add-ons catalogue');
test('the add-ons catalogue still holds the 20 published add-ons', () => {
  assert(addons.length === 20, `expected 20 add-ons, got ${addons.length}`);
});
test('every add-on has an id, title, description, useCase and keywords', () => {
  for (const a of addons) {
    assert(a.id && /^[a-z0-9-]+$/.test(a.id), `bad id: ${a.id}`);
    assert(a.title && a.title.length > 3, `bad title: ${a.id}`);
    assert(a.description && a.description.length > 10, `bad description: ${a.id}`);
    assert(a.useCase && a.useCase.length > 10, `no useCase (the "detail"): ${a.id}`);
    assert(Array.isArray(a.keywords) && a.keywords.length >= 3, `no keywords: ${a.id}`);
  }
});
test('add-on ids are unique', () => {
  const seen = new Set();
  for (const a of addons) {
    assert(!seen.has(a.id), `duplicate add-on id: ${a.id}`);
    seen.add(a.id);
  }
});
test('no add-on description contains code markers', () => {
  for (const a of addons) {
    assert(!/\[#Menu:|\[System:|\[Function:|OnAction\s*:|\$\$/.test(a.description), `code in: ${a.id}`);
  }
});

// ─── Products, services and modules ─────────────────────────────────────────
console.log('🏢 Products, services & modules');
test('every product has an id, label, detail, url and keywords', () => {
  for (const p of PRODUCTS) {
    assert(p.id, 'missing id');
    assert(p.label && p.label.length > 2, `bad label: ${p.id}`);
    assert(p.detail && p.detail.length > 10, `no detail: ${p.id}`);
    assert(p.url.startsWith('/'), `bad url: ${p.id}`);
    assert(Array.isArray(p.keywords) && p.keywords.length >= 3, `no keywords: ${p.id}`);
  }
});
test('product ids are unique', () => {
  const seen = new Set();
  for (const p of PRODUCTS) {
    assert(!seen.has(p.id), `duplicate product id: ${p.id}`);
    seen.add(p.id);
  }
});
test('the six industry modules are present', () => {
  const need = ['module-cfa', 'module-housing-society', 'module-salesman', 'module-transport', 'module-container', 'module-garment'];
  for (const id of need) assert(PRODUCTS.some(p => p.id === id), `missing module: ${id}`);
});
test('TSS is in the catalogue and names both renewal paths', () => {
  const tss = PRODUCTS.find(p => p.id === 'tss-renewal');
  assert(tss, 'TSS missing from the catalogue');
  assert(tss.detail.includes('Alt+R'), 'TSS detail is missing the Alt+R path');
  assert(tss.detail.includes('F9'), 'TSS detail is missing the F1 > Settings > License > Manage License > F9 path');
  assert(tss.detail.includes('Silver, Gold and Server'), 'TSS detail must say it works on every edition');
});

// ─── The free learning guides (Tally Insights) ──────────────────────────────
console.log('📚 Tally Insights guides');
test('the hub and 16 lessons are present', () => {
  assert(LEARNING_LESSONS.length === 16, `expected 16 lessons, got ${LEARNING_LESSONS.length}`);
  assert(LEARNING_SECTIONS.length === 13, `expected 13 sections, got ${LEARNING_SECTIONS.length}`);
  assert(INSIGHTS_HUB.url === '/tally-insights', 'hub url changed');
});
test('every lesson url points at a real section and slug', () => {
  const sectionIds = new Set(LEARNING_SECTIONS.map(s => s.id));
  for (const l of LEARNING_LESSONS) {
    assert(sectionIds.has(l.section), `lesson ${l.id} has unknown section ${l.section}`);
    assert(l.url.startsWith(`/tally-insights/${l.section}/`), `bad url for ${l.id}: ${l.url}`);
    assert(l.url.endsWith(`/${l.id}`), `bad url for ${l.id}: ${l.url}`);
  }
});
test('the offline TSS renewal guide is in the catalogue', () => {
  const l = LEARNING_LESSONS.find(x => x.id === 'tss-offline-renewal-how-to-renew');
  assert(l, 'offline TSS renewal guide missing');
});

// ─── The generated prompt blocks ────────────────────────────────────────────
console.log('📝 Generated prompt blocks');
test('the sales block contains every product and every add-on', () => {
  const block = buildCatalogPromptBlock();
  for (const p of PRODUCTS) assert(block.includes(p.label), `block is missing product: ${p.label}`);
  for (const a of addons) assert(block.includes(a.title), `block is missing add-on: ${a.title}`);
  assert(block.includes(ADDONS_CATALOGUE.label), 'block is missing the add-ons catalogue entry');
});
test('the sales block links every add-on to its /addons anchor', () => {
  const block = buildCatalogPromptBlock();
  for (const a of addons) assert(block.includes(`/addons#${a.id}`), `block is missing anchor for: ${a.id}`);
});
// CHANGE: 2026-10-23 — the shop catalogue; a missing item means Sara cannot name it.
// CHANGE: 2026-10-27 — the block no longer carries a description + link for all shop items (that alone
// was ~25,500 chars and pushed every Groq request past the 8,000 tokens-per-minute wall, which
// rejected the whole request). It ships the FEATURED items WITH their /shop anchors plus a
// per-collection NAME LIST for the rest, so Sara can still name the exact item.
// CHANGE: 2026-10-27 — the featured count is DATA, not a contract. This asserted `=== 10`, so the
// shop commit that grew the catalogue (117 items, 13 featured) turned the suite red without a single
// behaviour change: a data edit always breaks a hard-coded count. What the block must guarantee is
// that EVERY featured item is linked and every item is named; the token ceiling below is what
// actually protects the Groq budget.
const CATALOG_BLOCK_CHAR_CEILING = 14_000;
test('the sales block links every featured shop item and names every other one', () => {
  const block = buildCatalogPromptBlock();
  const featured = TDL_ITEMS.filter((i) => i.featured);
  assert(featured.length > 0, 'no shop item is marked featured, so the block links none');
  assert(
    block.length <= CATALOG_BLOCK_CHAR_CEILING,
    `catalogue block is ${block.length} chars (ceiling ${CATALOG_BLOCK_CHAR_CEILING}); Groq rejects the whole request past ~8k tokens`
  );
  for (const item of featured) {
    assert(block.includes(`/shop#${item.slug}`), `block is missing the shop link for: ${item.slug}`);
  }
  for (const item of TDL_ITEMS) {
    assert(block.includes(item.title), `block does not name the shop item: ${item.slug}`);
  }
  assert(block.includes('Tally Shop'), 'block is missing the shop catalogue entry point');
});
test('the guides block contains every lesson title and url', () => {
  const block = buildGuidesPromptBlock();
  for (const l of LEARNING_LESSONS) {
    assert(block.includes(l.title), `guides block is missing: ${l.title}`);
    assert(block.includes(l.url), `guides block is missing url: ${l.url}`);
  }
});
test('every button in both blocks is well formed', () => {
  for (const block of [buildCatalogPromptBlock(), buildGuidesPromptBlock()]) {
    const opens = (block.match(/\[\[/g) || []).length;
    const closes = (block.match(/\]\]/g) || []).length;
    assert(opens === closes, `unbalanced buttons: ${opens} open vs ${closes} close`);
    assert(!/\[\[\s|\s\]\]/.test(block), 'a button has spaces around the pipe');
  }
});
test('neither block contains code markers', () => {
  for (const block of [buildCatalogPromptBlock(), buildGuidesPromptBlock()]) {
    assert(!/\[#Menu:|\[System:|\[Function:|OnAction\s*:|\$\$/.test(block), 'code marker in a prompt block');
  }
});

// ─── The suggestion engine (the "advising" part) ────────────────────────────
console.log('🎯 Suggestion engine');
function expectAddon(query, expectedTitle) {
  const { addons: hits } = suggestCatalog(query);
  assert(hits.length > 0, `"${query}" -> no add-on suggested`);
  assert(hits[0].title === expectedTitle, `"${query}" -> "${hits[0].title}", expected "${expectedTitle}"`);
}
test('"stop billing customers who have not paid" -> Block Billing beyond Due Date', () =>
  expectAddon('stop billing customers who have not paid', 'Block Billing beyond Due Date'));
test('"email the invoice to the customer automatically" -> Auto Email Sales Invoices', () =>
  expectAddon('email the invoice to the customer automatically', 'Auto Email Sales Invoices after Save'));
test('"maker checker approval before posting" -> Single Level Maker & Checker', () =>
  expectAddon('maker checker approval before posting', 'Single Level Maker & Checker'));
test('"discount on discount for wholesalers" -> Double Discount', () =>
  expectAddon('discount on discount for wholesalers', 'Double Discount'));
test('"stop my staff changing the rate in sales" -> Skip Rate Field for Users', () =>
  expectAddon('stop my staff changing the rate in sales', 'Skip Rate Field for Users in Sales Voucher Entry Screen'));
test('"do not sell below the last purchase rate" -> Lock Sales Below Last Purchase Rate', () =>
  expectAddon('do not sell below the last purchase rate', 'Lock Sales Below Last Purchase Rate'));
test('"duplicate supplier invoice entry" -> Duplicate Purchase Block', () =>
  expectAddon('duplicate supplier invoice entry', 'Duplicate Purchase Block based on Supplier Invoice Number & Supplier GSTIN'));
test('"show the last purchase cost while billing" -> Show Last Purchase Cost in Sales', () =>
  expectAddon('show the last purchase cost while billing', 'Show Last Purchase Cost in Sales'));

test('"transport module lorry receipt" -> the Transport Module', () => {
  const { modules } = suggestCatalog('transport module lorry receipt');
  assert(modules.length > 0, 'no module suggested');
  assert(modules[0].id === 'module-transport', `got ${modules[0].id}`);
});
test('"tallydrive scheduled backup" -> TallyDrive', () => {
  const { products } = suggestCatalog('tallydrive scheduled backup');
  assert(products.length > 0, 'no product suggested');
  assert(products[0].id === 'tallydrive', `got ${products[0].id}`);
});
test('"encrypted cloud backup of my data" -> Backup for TallyPrime', () => {
  const { products } = suggestCatalog('encrypted cloud backup of my data');
  assert(products.length > 0, 'no product suggested');
  assert(products[0].id === 'backup-for-tally', `got ${products[0].id}`);
});
test('"cost centre department wise" -> the Cost Centre guide', () => {
  const { guides } = suggestCatalog('cost centre department wise');
  assert(guides.length > 0, 'no guide suggested');
  assert(guides[0].id === 'cost-centre-in-tally', `got ${guides[0].id}`);
});
test('"gst setup and invoicing" -> the GST guide', () => {
  const { guides } = suggestCatalog('gst setup and invoicing');
  assert(guides.length > 0, 'no guide suggested');
  assert(guides[0].id === 'tally-gst', `got ${guides[0].id}`);
});
test('gibberish suggests nothing', () => {
  const r = suggestCatalog('zzzz qqqq wwwww');
  const total = r.products.length + r.addons.length + r.guides.length + r.modules.length + r.learning.length + r.shop.length;
  assert(total === 0, `gibberish matched ${total} items`);
});

// ─── The /shop catalogue (the 107 items) ────────────────────────────────────
// CHANGE: 2026-10-23 — Sara must reach the shop catalogue, not just the 20 add-ons.
console.log('🛒 Shop catalogue suggestions');
test('a shop-only need suggests a shop item', () => {
  const { shop } = suggestCatalog('batch expiry report');
  assert(shop.length > 0, 'no shop item suggested');
  assert(shop[0].url.startsWith('/shop#'), `bad shop url: ${shop[0].url}`);
});
test('catalogSuggestionReply can answer from the shop catalogue', () => {
  const reply = catalogSuggestionReply('batch expiry report');
  assert(reply, 'no reply produced');
  assert(reply.includes('/shop#'), `reply has no shop link: ${reply}`);
  assert(reply.includes('?'), 'reply asks no question');
});
test('an existing /addons item still resolves to its add-on, not the shop copy', () => {
  const { addons: hits } = suggestCatalog('stop billing customers who have not paid');
  assert(hits.length > 0, 'no add-on suggested');
  assert(hits[0].url.startsWith('/addons#'), `add-on should keep its /addons link: ${hits[0].url}`);
});

// ─── The offline reply shape ────────────────────────────────────────────────
console.log('💬 Offline replies');
test('catalogSuggestionReply gives the item, the detail, a button and a question', () => {
  const reply = catalogSuggestionReply('stop billing customers who have not paid');
  assert(reply, 'no reply produced');
  assert(reply.includes('Block Billing beyond Due Date'), 'reply does not name the add-on');
  assert(reply.includes('[[Block Billing beyond Due Date|/addons#block-billing-beyond-due-date]]'), 'reply has no button');
  assert(reply.includes('?'), 'reply asks no question');
});
test('catalogSuggestionReply returns null for gibberish', () => {
  assert(catalogSuggestionReply('zzzz qqqq wwwww') === null, 'gibberish produced a reply');
});
test('guideSuggestionReply points at the exact guide', () => {
  const reply = guideSuggestionReply('cost centre department wise');
  assert(reply, 'no guide reply produced');
  assert(reply.includes('/tally-insights/cost-centres/cost-centre-in-tally'), 'guide reply has the wrong link');
});

const total = passed + failed;
console.log(`\n${'━'.repeat(50)}`);
console.log(`  Total: ${total}  |  PASSED: ${passed}  |  FAILED: ${failed}\n`);
process.exit(failed > 0 ? 1 : 0);
