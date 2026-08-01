export type Tutorial = {
  _id: string;
  title: string;
  folder: string;
  tags?: string[];
  type: string;
  url: string;
  description?: string;
  date?: string;
  thumbnail?: string;
  thumbnailOption?: string;
};

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
  'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over',
  'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when',
  'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'about', 'also', 'and',
  'or', 'but', 'if', 'that', 'this', 'these', 'those', 'it', 'its',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his',
  'she', 'her', 'they', 'them', 'their', 'what', 'which', 'who', 'whom',
  'want', 'need', 'like', 'know', 'tell', 'show', 'help', 'make', 'get',
  'use', 'using', 'used', 'try', 'thing', 'things', 'something', 'anything'
]);

// Synonym map — expand query keywords to catch more matches
const SYNONYMS: Record<string, string[]> = {
  invoice: ['billing', 'bill', 'sale', 'sales', 'purchase', 'voucher'],
  billing: ['invoice', 'sale', 'sales', 'voucher'],
  tax: ['gst', 'taxation', 'duty', ' duties'],
  gst: ['tax', 'taxation', 'gstr', 'returns', 'filing'],
  accounting: ['books', 'ledger', 'journal', 'entries', 'profit', 'loss', 'balance'],
  inventory: ['stock', 'items', 'godown', 'warehouse', 'batch', 'barcode'],
  bank: ['banking', 'reconciliation', 'brs', 'cheque', 'payment', 'neft', 'rtgs'],
  payroll: ['salary', 'employee', 'pf', 'esi', 'attendance', 'payslip'],
  report: ['reports', 'analysis', 'balance sheet', 'profit loss', 'cash flow'],
  shortcut: ['shortcuts', 'keyboard', 'hotkey', 'keys', '快捷'],
  cloud: ['hosting', 'remote', 'server', 'online', 'access'],
  setup: ['install', 'configuration', 'configure', 'initial', 'start'],
  backup: ['restore', 'data', 'recovery'],
  error: ['issue', 'problem', 'trouble', 'fix', 'solve'],
  company: ['firm', 'business', 'organization'],
};

function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set(keywords);
  for (const kw of keywords) {
    const syns = SYNONYMS[kw];
    if (syns) syns.forEach(s => expanded.add(s));
  }
  return Array.from(expanded);
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

function scoreTutorial(tutorial: Tutorial, questionKeywords: string[], expandedKeywords: string[], questionLower: string): number {
  let score = 0;
  const titleLower = tutorial.title.toLowerCase();
  const descLower = (tutorial.description || '').toLowerCase();
  const folderLower = (tutorial.folder || '').toLowerCase();
  const tagsLower = (tutorial.tags || []).map(t => t.toLowerCase());

  // Exact phrase match in title
  if (titleLower.includes(questionLower)) score += 50;

  // Title keyword matches (original keywords get full score, synonyms get half)
  const titleKeywords = extractKeywords(tutorial.title);
  for (const kw of questionKeywords) {
    if (titleKeywords.includes(kw)) score += 10;
    if (titleLower.includes(kw)) score += 5;
  }
  // Synonym matches in title (lower weight)
  const onlySynonyms = expandedKeywords.filter(k => !questionKeywords.includes(k));
  for (const kw of onlySynonyms) {
    if (titleLower.includes(kw)) score += 4;
  }

  // Tag matches
  for (const tag of tagsLower) {
    for (const kw of questionKeywords) {
      if (tag === kw || tag.includes(kw) || kw.includes(tag)) score += 15;
    }
    for (const kw of onlySynonyms) {
      if (tag.includes(kw) || kw.includes(tag)) score += 6;
    }
  }

  // Folder/category match
  for (const kw of expandedKeywords) {
    if (folderLower.includes(kw)) score += 8;
  }

  // Description match
  const descKeywords = extractKeywords(tutorial.description || '');
  for (const kw of questionKeywords) {
    if (descKeywords.includes(kw)) score += 4;
    if (descLower.includes(kw)) score += 2;
  }
  for (const kw of onlySynonyms) {
    if (descLower.includes(kw)) score += 2;
  }

  return score;
}

// Words that appear in nearly every Tally tutorial and carry no discriminating
// value. They are ignored when deciding whether ALL query keywords match.
const ALL_MATCH_NOISE = new Set([
  'tally', 'tallyprime', 'business', 'software', 'company', 'book', 'books', 'account', 'accounts', 'accounting',
]);

// Strict full match: EVERY meaningful query keyword must appear in the
// tutorial's title or tags (substring). This guarantees the tutorial covers
// the main content of the question — a partial or tangential match never
// qualifies. Returns false when there is nothing meaningful to match.
function hasFullMatch(tutorial: Tutorial, questionKeywords: string[]): boolean {
  const coreKeywords = questionKeywords.filter(k => !ALL_MATCH_NOISE.has(k));
  if (coreKeywords.length === 0) return false;

  const haystack = `${tutorial.title} ${(tutorial.tags || []).join(' ')}`.toLowerCase();
  return coreKeywords.every(k => haystack.includes(k));
}

export function findMatchingTutorials(
  tutorials: Tutorial[],
  query: string,
  maxResults: number = 4,
  minScore: number = 5,
  strict: boolean = false
): Tutorial[] {
  const questionLower = query.toLowerCase();
  const questionKeywords = extractKeywords(query);
  const expandedKeywords = expandKeywords(questionKeywords);

  if (expandedKeywords.length === 0) return [];

  const scored = tutorials
    .map(t => ({
      tutorial: t,
      score: scoreTutorial(t, questionKeywords, expandedKeywords, questionLower),
      full: hasFullMatch(t, questionKeywords),
    }))
    .filter(s => {
      if (s.score < minScore) return false;
      if (!strict) return true;
      // Strict mode: only full-content matches (every meaningful keyword in
      // title/tags) are eligible, capped at 2 suggestions.
      return s.full;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, strict ? Math.min(2, maxResults) : maxResults);

  return scored.map(s => s.tutorial);
}
