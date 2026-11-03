// CHANGE: 2026-11-03 — consistency guard for the six TallyPrime vertical-solution pages.
//
// WHY: the owner's complaint was not "a page is broken", it was "the pages are not consistent and
// the theme is animated". Six pages rendered by one template can silently drift — a missing
// gallery, a stray gradient, a seventh module with no simulator, a hero image deleted from
// public/, a meta description that truncates in the SERP. None of that fails `next build`, so it
// shipped once and had to be fixed by hand. This suite pins the shape of all six pages.
//
// WHAT IT CHECKS (static file reads only — no network, no database, no server):
//   1. Catalogue parity      every canonical id has a curated entry and a unique simulator
//   2. Complete record       every required field present, `id` matches its map key
//   3. Assets on disk        hero image, every gallery image, every brochure PDF
//   4. Video rule            exactly one real video, placeholder rejected, no outbound fallback
//   5. Simulator wiring      component exists, is imported, is branched, uses the shared chrome
//   6. Theme                 no gradients, animation, glow blur or hover zoom on module surfaces
//   7. Section rhythm        the documented dark/light/white order, identical on every page
//   8. Mobile floor          every section carries px-5 + sm:px-6
//   9. SEO budgets           metaTitle <= 60, metaDescription <= 122 characters
//  10. Preferred source      one 5-second session-scoped appearance, /modules on the allow-list
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (path) => readFileSync(join(ROOT, path), 'utf8');
const exists = (path) => existsSync(join(ROOT, path));

const DETAILS = 'lib/module-details.ts';
const PAGE = 'app/(site)/modules/[slug]/page.tsx';
const LISTING = 'app/(site)/modules/page.tsx';
const CARD = 'app/components/ModuleCard.tsx';
const MODULES_LIB = 'lib/modules.ts';
const VIDEO = 'app/components/modules/ModuleVideo.tsx';
const CTA = 'app/components/modules/ModuleCta.tsx';
const PREFERRED = 'app/components/PreferredSource.tsx';
const GATE = 'app/components/PreferredSourceGate.tsx';
const MODULES_DIR = 'app/components/modules';

// The six shipped modules. Every page may carry a video, but only a real, embeddable YouTube id
// is ever rendered — the database placeholder (`dQw4w9WgXcQ`) must never reach the page.
const EXPECTED = [
  { id: 'container-handling', simulator: 'container', component: 'ContainerSimulator' },
  { id: 'cf-agencies', simulator: 'cfa', component: 'CfaSimulator' },
  { id: 'housing-societies', simulator: 'society', component: 'SocietySimulator' },
  { id: 'sales-commission', simulator: 'agent', component: 'AgentSimulator' },
  { id: 'logistics-transport', simulator: 'transport', component: 'TransportSimulator' },
  { id: 'garment-retail', simulator: 'garment', component: 'GarmentSimulator' },
];

const REQUIRED_FIELDS = [
  'id',
  'title',
  'eyebrow',
  'heroLead',
  'suitedFor',
  'image',
  'imageAlt',
  'videoUrl',
  'brochureUrl',
  'shortDescription',
  'fullDescription',
  'metaTitle',
  'metaDescription',
  'keywords',
  'features',
  'benefits',
  'problem',
  'flow',
  'steps',
  'gallery',
  'galleryCopy',
  'simulator',
  'faqs',
];

// moduleDetails is a Record<slug, ModuleDetail> built from named consts. Split the source into
// top-level `const NAME: ModuleDetail = { ... };` blocks, then map const name -> block body.
function parseDetailBlocks(source) {
  const blocks = new Map();
  const re = /^const ([A-Z0-9_]+): ModuleDetail = \{$/gm;
  let match;
  while ((match = re.exec(source))) {
    const start = match.index;
    const end = source.indexOf('\n};', start);
    if (end === -1) continue;
    blocks.set(match[1], source.slice(start, end));
  }
  return blocks;
}

function parseRecord(source) {
  const start = source.indexOf('export const moduleDetails: Record<string, ModuleDetail> = {');
  if (start === -1) return [];
  const end = source.indexOf('\n};', start);
  const body = source.slice(start, end);
  return [...body.matchAll(/"([^"]+)":\s*([A-Z0-9_]+),/g)].map((m) => ({
    id: m[1],
    constName: m[2],
  }));
}

const field = (block, name) => {
  // Matches `  name: "value"` on one line and `  name:\n    "value"` over two lines.
  const m = block.match(new RegExp(`^  ${name}:\\s*(?:\\n\\s*)?"([^"]*)"`, 'm'));
  return m ? m[1] : null;
};
const hasKey = (block, name) => new RegExp(`^  ${name}[:?]`, 'm').test(block);

const failures = [];
const notes = [];
function check(label, ok, detail = '') {
  if (ok) {
    notes.push(`  PASS  ${label}`);
  } else {
    failures.push(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
  return ok;
}

const source = read(DETAILS);
const blocks = parseDetailBlocks(source);
const record = parseRecord(source);

// ── 1. Catalogue parity ────────────────────────────────────────────────────────────────────────
check(
  'moduleDetails maps exactly the six canonical ids',
  record.length === EXPECTED.length && EXPECTED.every((m) => record.some((r) => r.id === m.id)),
  `found [${record.map((r) => r.id).join(', ')}]`,
);
check(
  'every mapped id points at its own const block',
  record.every((r) => blocks.has(r.constName)),
  record.filter((r) => !blocks.has(r.constName)).map((r) => r.id).join(', '),
);

const simulators = [];
for (const module of EXPECTED) {
  const entry = record.find((r) => r.id === module.id);
  const block = entry ? blocks.get(entry.constName) : null;
  if (!block) {
    check(`${module.id}: curated entry exists`, false, 'no const block');
    continue;
  }

  // ── 2. Complete record ───────────────────────────────────────────────────────────────────────
  const missing = REQUIRED_FIELDS.filter((name) => !hasKey(block, name));
  check(`${module.id}: every required field present`, missing.length === 0, `missing ${missing.join(', ')}`);
  check(`${module.id}: id matches its map key`, field(block, 'id') === module.id, `id is "${field(block, 'id')}"`);

  const simulator = field(block, 'simulator');
  check(`${module.id}: simulator is "${module.simulator}"`, simulator === module.simulator, `is "${simulator}"`);
  if (simulator) simulators.push(simulator);

  // ── 3. Assets on disk ───────────────────────────────────────────────────────────────────────
  const image = field(block, 'image');
  check(`${module.id}: hero image ${image} exists`, Boolean(image) && exists(join('public', image.replace(/^\//, ''))));

  const brochure = field(block, 'brochureUrl');
  check(`${module.id}: brochure ${brochure} exists`, Boolean(brochure) && exists(join('public', brochure.replace(/^\//, ''))));

  const gallery = [...block.matchAll(/src: "([^"]+)"/g)].map((m) => m[1]);
  const missingImages = gallery.filter((src) => !exists(join('public', src.replace(/^\//, ''))));
  check(
    `${module.id}: all ${gallery.length} gallery image(s) exist`,
    gallery.length > 0 && missingImages.length === 0,
    missingImages.length ? `missing ${missingImages.join(', ')}` : 'gallery empty',
  );

  // ── 4. Video rule ───────────────────────────────────────────────────────────────────────────
  const video = field(block, 'videoUrl');
  check(
    `${module.id}: curated videoUrl is empty or a real id (never the placeholder)`,
    !video.includes('dQw4w9WgXcQ') && (video === '' || /youtu\.be\/[A-Za-z0-9_-]{11}/.test(video)),
    `videoUrl is "${video}"`,
  );

  // ── 9. SEO budgets ─────────────────────────────────────────────────────────────────────────
  const title = field(block, 'metaTitle') || '';
  const description = field(block, 'metaDescription') || '';
  check(`${module.id}: metaTitle ${title.length} <= 60 chars`, title.length > 0 && title.length <= 60);
  check(
    `${module.id}: metaDescription ${description.length} <= 122 chars`,
    description.length > 0 && description.length <= 122,
  );
}

check('every module has a distinct simulator', new Set(simulators).size === simulators.length);

// ── 5. Simulator wiring ───────────────────────────────────────────────────────────────────────
const pageSource = read(PAGE);
for (const module of EXPECTED) {
  const file = join(MODULES_DIR, `${module.component}.tsx`);
  const wired = pageSource.includes(`from "../../../components/modules/${module.component}"`);
  const branched = pageSource.includes(`return <${module.component} />`);
  check(`${module.component}: exists, imported and branched in the template`, exists(file) && wired && branched);

  if (exists(file)) {
    const component = read(file);
    check(
      `${module.component}: renders inside the shared TallyChrome shell`,
      component.includes('from "./TallyChrome"') && component.includes('<TallyChrome'),
    );
  }
}

// ── 4b. The video guard itself ────────────────────────────────────────────────────────────────
const modulesLib = read(MODULES_LIB);
const videoSource = read(VIDEO);
check(
  'placeholder video id is rejected by the shared helper',
  /PLACEHOLDER_VIDEO_IDS = new Set\(\["dQw4w9WgXcQ"\]\)/.test(modulesLib),
);
check(
  'the template falls back to the DB video when the curated entry has none',
  /const dbVideo = fromDb && hasEmbeddableVideo\(fromDb\.videoUrl\)/.test(pageSource) &&
    /hasEmbeddableVideo\(curated\.videoUrl\) \? curated\.videoUrl : dbVideo/.test(pageSource),
);
check('ModuleVideo renders nothing when there is no real id', /if \(!id\) return null;/.test(videoSource));
check(
  'ModuleVideo has no outbound YouTube fallback link',
  !/<a[\s\S]{0,200}?href=\{?videoUrl/.test(videoSource),
);

// ── 6. Theme ──────────────────────────────────────────────────────────────────────────────────
const THEME_FILES = [
  PAGE,
  LISTING,
  CARD,
  ...readdirSync(join(ROOT, MODULES_DIR))
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => join(MODULES_DIR, name)),
];

const FORBIDDEN = [
  [/\bbg-gradient-to-/, 'gradient background'],
  [/\bbg-clip-text\b/, 'gradient-clipped text'],
  [/\banimate-/, 'animation'],
  [/\b(?:backdrop-)?blur-(?:2xl|3xl)\b/, 'glow blur'],
  [/\bgroup-hover:scale-|\bhover:scale-/, 'hover zoom'],
  [/\btransition-transform\b|\btransition-all\b/, 'transform/all transition'],
  [/\btext-(?:green|emerald)-\d{3}\b|\bbg-(?:green|emerald)-\d{3}\b|\bborder-(?:green|emerald)-\d{3}\b/, 'retired green brand colour'],
];

for (const file of THEME_FILES) {
  const body = read(file);
  const hits = FORBIDDEN.filter(([re]) => re.test(body)).map(([, label]) => label);
  check(`${file}: flat teal theme (no ${FORBIDDEN.map(([, l]) => l).join(' / ')})`, hits.length === 0, hits.join(', '));
}

// ── 7. Section rhythm ────────────────────────────────────────────────────────────────────────
const sectionBackgrounds = [...pageSource.matchAll(/<section[^>]*className="([^"]*)"/g)].map((m) => {
  const cls = m[1];
  if (cls.includes('bg-[#033B38]')) return 'dark';
  if (cls.includes('bg-[#E5F4F4]')) return 'light';
  if (cls.includes('bg-white')) return 'white';
  return 'none';
});
const EXPECTED_RHYTHM = [
  'dark', // hero
  'light', // video (conditional)
  'white', // the everyday headache
  'light', // simulator
  'white', // what you get
  'light', // how it works
  'white', // gallery
  'light', // benefits
  'white', // faq
  'white', // related modules
];
check(
  `section rhythm is ${EXPECTED_RHYTHM.join(' → ')}`,
  sectionBackgrounds.length === EXPECTED_RHYTHM.length &&
    sectionBackgrounds.every((bg, index) => bg === EXPECTED_RHYTHM[index]),
  `found ${sectionBackgrounds.join(' → ')}`,
);

const ctaBackground = (read(CTA).match(/<section[^>]*className="([^"]*)"/) || [])[1] || '';
check(
  'the CTA band is light (#E5F4F4) so the rhythm holds around it',
  ctaBackground.includes('bg-[#E5F4F4]'),
);

// ── 8. Mobile floor ─────────────────────────────────────────────────────────────────────────
for (const file of [PAGE, LISTING]) {
  const body = read(file);
  const sections = [...body.matchAll(/<section[^>]*className="([^"]*)"/g)].map((m) => m[1]);
  const offenders = sections.filter((cls) => !cls.includes('px-5') || !cls.includes('sm:px-6'));
  check(`${file}: every section uses px-5 sm:px-6`, offenders.length === 0, `${offenders.length} section(s) off-grid`);
}

// ── One <h1> per page ────────────────────────────────────────────────────────────────────────
for (const file of [PAGE, LISTING]) {
  const count = (read(file).match(/<h1[\s>]/g) || []).length;
  check(`${file}: exactly one <h1>`, count === 1, `found ${count}`);
}

// ── 10. Preferred source ─────────────────────────────────────────────────────────────────────
const preferred = read(PREFERRED);
check('PreferredSource shows for 5 seconds', /const VISIBLE_MS = 5000;/.test(preferred));
check(
  'PreferredSource is session-scoped through sessionStorage',
  /const STORAGE_KEY = "svd_preferred_source_seen";/.test(preferred) &&
    /sessionStorage\.getItem\(STORAGE_KEY\)/.test(preferred) &&
    /sessionStorage\.setItem\(STORAGE_KEY, "1"\)/.test(preferred),
);
check(
  'PreferredSource reads storage in an effect and clears its timer',
  /useEffect\(\(\) => \{[\s\S]*sessionStorage[\s\S]*clearTimeout\(timer\)/.test(preferred),
);
const gate = read(GATE);
check("preferred-source allow-list includes '/modules'", /ALLOWED_PREFIXES = \[[^\]]*'\/modules'/.test(gate));
check(
  'the gate is segment-exact (no bare startsWith)',
  /pathname === prefix \|\| pathname\.startsWith\(`\$\{prefix\}\/`\)/.test(gate),
);

// ── Internal links go through moduleHref ────────────────────────────────────────────────────
check('ModuleCard builds module links with moduleHref()', read(CARD).includes('moduleHref(id)'));
check(
  'ModuleCard renders "Watch Video" only for a real video',
  /hasVideo\s*&&/.test(read(CARD)) && !/href="https:\/\/www\.youtube/.test(read(CARD)),
);

// ── Report ──────────────────────────────────────────────────────────────────────────────────
const total = notes.length + failures.length;
console.log(`[module-pages] ${EXPECTED.length} curated module pages, ${total} assertions, ${THEME_FILES.length} themed files\n`);
for (const line of notes) console.log(line);

if (failures.length) {
  console.log('');
  for (const line of failures) console.log(line);
  console.log(`\nFAIL: ${failures.length} of ${total} assertion(s) failed.`);
  process.exit(1);
}

console.log(
  `\nPASS: all ${total} assertions hold — the six module pages share one template, one flat teal theme, one section rhythm and one video rule.`,
);
