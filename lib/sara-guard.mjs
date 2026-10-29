// CHANGE: 2026-10-22 — Sara is a business consultant, NOT a programmer.
//
// Owner ruling (2026-10-22): Sara must never answer with raw code, and she must
// not monologue. When a visitor asks for something custom (a TDL, a custom
// report, an integration, a script) she must FIRST gather the requirements with
// a few SHORT questions and route the build to the technical team.
//
// The live failure this fixes (owner transcript, 22/10/2026 17:04): a visitor
// asked "CAN YOU DRAFT TDL" -> "DRAFT TDL FOR ADD PENDING INVOICES IN SALES
// INVOICE" -> Sara pasted a raw TDL snippet. The visitor was handed code they
// could not evaluate, with no questions asked, and the conversation died.
//
// This module is the DETERMINISTIC half of the rule; the prompt in
// app/api/chat/route.ts is the soft half. It is pure ESM, zero dependencies and
// isomorphic, so the exact same rules run on the server route, in the
// client-side topic fallback (lib/sara-topics.ts) and in the plain-node
// regression suite (scripts/sara-guard-test.mjs).

// ---------------------------------------------------------------------------
// 1. Does this text contain programming code?
// ---------------------------------------------------------------------------

// Tally TDL markers — unambiguous, no false positives on business English.
const TDL_SIGNALS = [
  /\[#Menu:/i,
  /\[System:/i,
  /\[Function:/i,
  /\[Form:/i,
  /\[Field:/i,
  /\[Report:/i,
  /\[Line:/i,
  /\bOnAction\s*:/i,
  /\$\$/, // TDL variables: $$Fetch, $$String, $$List
  /^\s*\d{2}\s*:\s*[A-Z]{3,}\b/m, // TDL statements: "01 : CALL   : Fetch"
];

// Generic programming code. NOTE: a ```text fence is NOT flagged — the site
// uses ```text for Tally MENU PATHS (e.g. "F11 > Company Features > GST").
const CODE_SIGNALS = [
  /```(?:javascript|js|jsx|typescript|ts|tsx|python|py|java|c|cpp|csharp|cs|php|ruby|go|rust|sql|json|xml|yaml|html|css|bash|sh|shell|vb|vbs|aspnet|node|perl|swift|kotlin|dart|scala|lua)\b/i,
  /\bfunction\s+[A-Za-z_$][\w$]*\s*\(/,
  /\b(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=/,
  /\bclass\s+[A-Za-z_$][\w$]*\s*\{/,
  /\bdef\s+[A-Za-z_]\w*\s*\(/,
  /<\/?(?:script|html|body|head|form|table|iframe)\b[^>]*>/i,
  /\bSELECT\b[\s\S]{0,120}\bFROM\b/i,
  /=>\s*[{([]/,
  /\bpublic\s+(?:static\s+)?(?:void|int|String|class)\b/,
];

/**
 * True when the text contains programming code (TDL or any other language).
 * Menu paths, shortcuts and config values are NOT code and never match.
 */
export function containsProgrammingCode(text) {
  if (!text || typeof text !== 'string') return false;
  for (const re of [...TDL_SIGNALS, ...CODE_SIGNALS]) {
    if (re.test(text)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// 2. Is the visitor asking for something to be BUILT?
// ---------------------------------------------------------------------------

// ACTION verbs - an action always means "build it for me".
const BUILD_VERB_RE =
  /\b(?:draft|write|create|make|build|develope?d?|develop|generate|code|implement|design|automate|setup|set\s+up)\b/i;

// NOUN-form verbs ("customisation", "customization"). These are also the name
// of the thing being asked about, so they only mean "build" when the question
// is not clearly informational ("difference between a TDL and report
// customization" is a question, not a commission).
const CUSTOMISATION_RE = /customi[sz](?:e|ed|es|ing|ation|ations)\b/i;

// "I want a TDL" / "need a custom report" — a COMMISSION. The object has to
// come straight after the verb (optionally with a determiner), so an
// informational line like "I need info about custom reports" is NOT a build.
const REQUEST_VERB_RE = /\b(?:need|want|require)\s+(?:an?|the|my|some)?\s*/i;

// STRONG custom objects: unambiguous. A request involving one of these is a
// build request on its own ("tdl", "plugin", "custom report", "webhook" ...).
const CUSTOM_OBJECT_RE =
  /\b(?:tdl|plugin|macro|webhook|bot)\b|\bcustom\s+(?:report|voucher|field|screen|invoice|form|workflow|print|menu|feature|button|template|statement)\b|\bapi\s+(?:integration|hook|connector)\b/i;

// WEAK custom objects: "script" and "program" are also everyday nouns
// ("which script for GST?"), so they only count next to a build verb.
const WEAK_OBJECT_RE = /\b(?:script|program)\b/i;

// A clearly INFORMATIONAL question ("what is a TDL?", "difference between ...")
// is NOT a build request, even when it names a custom object. Checked only
// when NO build verb was found, so "how do I create a custom field" (a real
// build) is still treated as a build.
const INFORMATIONAL_RE =
  /\b(?:what(?:'s|\s+is|\s+are)|meaning\s+of|difference\s+between|info(?:rmation)?\s+(?:about|on)|details\s+(?:about|on)|help\s+with|explain|tell\s+me\s+about|how\s+does\s+\w+\s+work)\b/i;

// The object list, anchored, so it can be matched at a position.
const CUSTOM_OBJECT_HEAD_RE =
  /^(?:tdl|plugin|macro|webhook|bot|script|program)\b|^custom\s+(?:report|voucher|field|screen|invoice|form|workflow|print|menu|feature|button|template|statement)\b|^api\s+(?:integration|hook|connector)\b/i;

// True when a "need / want / require" verb is immediately followed by the
// custom object (optionally with a determiner in between).
function requestObjectFollows(text) {
  const m = REQUEST_VERB_RE.exec(text);
  if (!m) return false;
  const after = text.slice(m.index + m[0].length);
  return CUSTOM_OBJECT_HEAD_RE.test(after);
}

/**
 * True when the visitor is asking Sara/our team to BUILD something.
 * "Can you draft a TDL?" -> true. "What is TDL?" -> false.
 * "I need info about custom reports" -> false (informational).
 */
export function isCustomBuildRequest(text) {
  if (!text || typeof text !== 'string') return false;

  const strong = CUSTOM_OBJECT_RE.test(text);
  const weak = WEAK_OBJECT_RE.test(text);
  if (!strong && !weak) return false;

  // An action verb always means a build request.
  if (BUILD_VERB_RE.test(text)) return true;

  // Weak verbs: the object must follow the verb directly.
  if (requestObjectFollows(text)) return true;

  // A clearly informational question is never a build request.
  if (INFORMATIONAL_RE.test(text)) return false;

  // No action verb: a STRONG custom object ("custom report for GST") or the
  // noun-form verb ("TDL customization") is still a build request.
  return strong || CUSTOMISATION_RE.test(text);
}

// ---------------------------------------------------------------------------
// 3. Question detection
// ---------------------------------------------------------------------------

// "Want me to go into more detail?" is NOT a discovery question — it only
// offers depth, it gathers nothing. It is stripped before counting.
const DEEPEN_OFFER_RE =
  /\b(?:want\s+me\s+to\s+go\s+into\s+(?:more\s+detail|depth)|want\s+(?:a|more|the)\s+(?:detailed|full|step[-\s]by[-\s]step)|shall\s+i\s+(?:go\s+into|explain|walk\s+you\s+through|elaborate)|would\s+you\s+like\s+me\s+to\s+(?:explain|go\s+into|walk\s+you\s+through|show))\b[^?.!]{0,40}\??/gi;

/** Number of '?' in the text. */
export function countQuestions(text) {
  if (!text) return 0;
  return (text.match(/\?/g) || []).length;
}

// CHANGE: 2026-10-29 — a reply can gather information WITHOUT a question mark
// ("Tell me what you are trying to achieve on screen, and I will teach you the
// TallyPrime way"). Counting only '?' treated those as "asked nothing", so the
// guard appended a SECOND discovery block on top of a reply that had already
// asked — the live I2 defect: the same question and the same CTA button twice.
const INFO_REQUEST_RE =
  /\b(?:tell\s+me|let\s+me\s+know|share\s+(?:with\s+me|a\s+bit|more)|describe|help\s+me\s+understand|which\s+(?:screen|version|edition|module|one|part|product)|what\s+(?:are|is)\s+you(?:r)?\s+(?:trying|looking|using|seeing|hoping)|how\s+many\s+(?:users|people|companies|godowns|locations|branches))\b/i;

/**
 * True when the reply asks the visitor something that actually gathers
 * information (a real question or a plain-spoken request for details — not
 * just an offer to expand).
 */
export function hasDiscoveryQuestion(text) {
  if (!text) return false;
  const stripped = text.replace(DEEPEN_OFFER_RE, '');
  return countQuestions(stripped) > 0 || INFO_REQUEST_RE.test(stripped);
}

/**
 * True when the reply already carries a [[Label|/url]] button.
 * CHANGE: 2026-10-29 — used so the guard never appends a second copy of a
 * CTA the reply has already rendered (the duplicate-button half of I2).
 */
export function hasCtaButton(text) {
  return !!text && /\[\[[^\]]+\]\]/.test(text);
}

// ---------------------------------------------------------------------------
// 4. The canned replies
// ---------------------------------------------------------------------------

const DISCOVERY_QUESTIONS = `1. Where should it live — the screen you use every day, or a separate report?
2. What exactly should it show or do (and should it print, send or update anything)?
3. How many people will use it, and how often?`;

/** True when the request is TDL-specific (gets the TDL page button). */
export function isTdlRequest(text) {
  return !!text && /\btdl\b/i.test(text);
}

/**
 * The "I am not a programmer" reply used when the model produced code.
 * It replaces the reply entirely — the visitor gets questions, not a snippet.
 */
export function buildNoCodeReply(userQuery = '', options = {}) {
  const isLearn = !!options.isLearn;
  const tdl = isTdlRequest(userQuery);
  const button = tdl ? '[[TDL Customization|/services/tdl]]' : '[[Talk to a Specialist|/contact]]';

  if (isLearn) {
    return `I don't write code, so I won't hand you a script — custom development is done by our technical team. ${button}

Meanwhile, tell me what you're trying to achieve on screen and I'll show you the closest way to do it in TallyPrime itself.`;
  }

  return `I don't write code — custom TDL and development work is done by our technical team, and a guessed snippet would only waste your time. So let me get the brief right first:

${DISCOVERY_QUESTIONS}

${button}`;
}

/**
 * The discovery block appended to a reply that answered a build request
 * without asking anything. Keeps the model's own (correct) content and adds
 * the requirement questions the owner asked for.
 */
export function buildDiscoveryBlock(userQuery = '', options = {}) {
  const isLearn = !!options.isLearn;
  // CHANGE: 2026-10-29 — the caller can suppress the button when the reply
  // already shows one, so a visitor never sees the same CTA twice.
  const withButton = options.includeButton !== false;
  const button = isTdlRequest(userQuery)
    ? '[[TDL Customization|/services/tdl]]'
    : '[[Talk to a Specialist|/contact]]';

  if (isLearn) {
    const line = 'One more thing so I can point you at the right screen: what are you trying to achieve there?';
    return withButton ? `${line} ${button}` : line;
  }

  return withButton
    ? `Quick check so I brief our technical team properly:

${DISCOVERY_QUESTIONS}

${button}`
    : `Quick check so I brief our technical team properly:

${DISCOVERY_QUESTIONS}`;
}

// ---------------------------------------------------------------------------
// 4b. Off-topic pitching + discount neutrality
// ---------------------------------------------------------------------------
// WHY THIS IS CODE AND NOT A PROMPT RULE (2026-10-29): the 22-case chat battery
// produced "That would be Narendra Modi. [[Explore TallyInsights|/tally-insights]]"
// and "We do not offer a flat 10% multi-year discount" — even though the prompt
// already forbade pitching on off-topic answers and already said neither to
// promise NOR deny a multi-year discount (our own /services/tss table shows
// "10% OFF" on the 2-year TSS rows). The prompt is a request; this is the gate.
//
// Keep this list narrow. A false negative costs one unwanted button; a false
// positive would strip a real product answer, so only clearly non-business
// subjects are listed.
const OFF_TOPIC_RE = new RegExp(
  [
    // politics / current affairs
    'prime\\s+minister',
    '\\bpresident\\b',
    '\\belection',
    '\\bpolitic',
    '\\bmodi\\b',
    '\\bparliament\\b',
    '\\bcongress\\b',
    '\\bbjp\\b',
    // creative writing
    '\\bpoem\\b',
    '\\bpoetry\\b',
    '\\bwrite\\s+me\\s+a\\s+story\\b',
    '\\bjoke\\b',
    '\\blyrics?\\b',
    '\\brhyme\\b',
    // weather / nature
    '\\bweather\\b',
    '\\brain(?:ing|y)?\\b',
    '\\btemperature\\b',
    '\\bclimate\\b',
    // sports / entertainment
    '\\bcricket\\b',
    '\\bfootball\\b',
    '\\bolympic',
    '\\bworld\\s+cup\\b',
    '\\bipl\\b',
    '\\bmovie\\b',
    '\\bfilm\\b',
    '\\bbollywood\\b',
    '\\bnetflix\\b',
    // general knowledge
    'capital\\s+of',
    '\\btallest\\b',
    '\\bpopulation\\s+of\\b',
  ].join('|'),
  'i'
);

// A genuine business question can incidentally contain an off-topic keyword
// ("how do i show the capital of the firm in the balance sheet"). When the query
// is plainly about Tally, accounts or a licence, keep the normal answer and its
// button — the cost of a wrong strip is a lost call to action on a real lead.
const BUSINESS_CONTEXT_RE =
  /\b(?:tally|tallyprime|erp|gst|tds|tcs|hsn|e-?way|invoice|voucher|ledger|entry|entries|account|accounts|accounting|balance\s+sheet|stock|inventory|godown|payroll|salary|attendance|licen[cs]e|tss|subscription|renewal|module|add-?on|reconcil\w*|company|firm|business|software|report|export)\b/i;

/** True when the visitor is clearly chatting about something that is not business software. */
export function isOffTopicQuery(query = '') {
  if (!query || !OFF_TOPIC_RE.test(query)) return false;
  return !BUSINESS_CONTEXT_RE.test(query);
}

/**
 * Remove every [[Label|/url]] button from a reply.
 * CHANGE: 2026-10-29 — used on off-topic answers, where a product button reads
 * as a pitch (a poem followed by "Explore TallyDrive" kills the conversation).
 */
export function stripCtaButtons(text = '') {
  return String(text)
    .replace(/[ \t]*\[\[[^\]]+\]\][ \t]*/g, ' ')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Multi-year / discount questions. "scheme" is deliberately NOT included: in
// Tally it usually means the GST composition scheme, which is a real business
// question and must keep its normal answer.
const DISCOUNT_RE = /\b(?:discount|discounted|concession|cheaper|any\s+offer|special\s+price)\b|\bmulti[\s-]*year\b/i;

/** True when the visitor is asking about a discount or a multi-year price. */
export function isDiscountQuery(query = '') {
  return !!query && DISCOUNT_RE.test(query);
}

/**
 * The only correct answer to a discount question: send the visitor to the live
 * price table. It never promises and never denies, because the 2-year TSS rows
 * genuinely carry a saving while other products have no duration options.
 */
export function buildDiscountReply(query = '') {
  // A 1-year / 2-year term only exists for TSS on our price list, so a question
  // about paying for "2 years" is a TSS question even when the word TSS is absent
  // (the live G2 case was exactly "is there a 10% discount if i pay for 2 years").
  const tss = /\btss\b|software\s+services|renew|licen[cs]e|subscription|\b(?:2|two|multi)[\s-]*years?\b/i.test(query);
  if (tss) {
    return (
      'Our TSS pricing table answers that better than I can: it lists the 1-year and 2-year options side by side, ' +
      'so you can see exactly what each term costs before deciding.\n\n[[View TSS Pricing|/services/tss]]'
    );
  }
  return (
    'Rather than quote a figure I cannot verify here, let me point you at the exact numbers: ' +
    'our pricing page shows the current amount for every option we sell.\n\n[[View Pricing|/products]]'
  );
}

// ---------------------------------------------------------------------------
// 5. The guard itself
// ---------------------------------------------------------------------------

// A sales reply longer than this is a wall of text, not a chat turn. Learn
// Sara is exempt: teaching step-by-step is her job.
export const SALES_LONG_REPLY_CHARS = 1200;

/**
 * Apply the "consultant, not programmer" rules to a model reply.
 *
 * @param {string} reply        the model's reply (already cleaned)
 * @param {string} userQuery    the visitor's last message
 * @param {{ isLearn?: boolean }} options
 * @returns {{ reply: string, action: 'none'|'blocked-code'|'added-discovery'|'soft-length-nudge'|'pricing-redirect'|'stripped-offtopic-cta' }}
 */
export function applyConsultantGuard(reply, userQuery = '', options = {}) {
  const isLearn = !!options.isLearn;
  const text = typeof reply === 'string' ? reply : '';
  const buildRequest = isCustomBuildRequest(userQuery);

  // HARD RULE — never hand a visitor code.
  if (containsProgrammingCode(text)) {
    return { reply: buildNoCodeReply(userQuery, { isLearn }), action: 'blocked-code' };
  }

  // HARD RULE — a discount is never improvised, promised or denied. The live
  // price table is the answer. Skipped for custom-build requests, where
  // "discount on my TDL project" belongs in the brief, not a price list.
  if (!buildRequest && isDiscountQuery(userQuery)) {
    return { reply: buildDiscountReply(userQuery), action: 'pricing-redirect' };
  }

  // A build request that produced no question must become a conversation.
  if (buildRequest && !hasDiscoveryQuestion(text)) {
    const block = buildDiscoveryBlock(userQuery, {
      isLearn,
      includeButton: !hasCtaButton(text),
    });
    return {
      reply: `${text.replace(/\s+$/, '')}\n\n${block}`.trim(),
      action: 'added-discovery',
    };
  }

  // HARD RULE — an off-topic answer keeps its words but loses the pitch.
  if (isOffTopicQuery(userQuery) && hasCtaButton(text)) {
    const stripped = stripCtaButtons(text);
    if (stripped) return { reply: stripped, action: 'stripped-offtopic-cta' };
  }

  // SOFT RULE — a long monologue becomes a short offer to go deeper.
  if (!isLearn && text.length > SALES_LONG_REPLY_CHARS && !hasDiscoveryQuestion(text)) {
    return {
      reply: `${text.replace(/\s+$/, '')}\n\nWant me to walk you through it step by step?`,
      action: 'soft-length-nudge',
    };
  }

  return { reply: text, action: 'none' };
}
