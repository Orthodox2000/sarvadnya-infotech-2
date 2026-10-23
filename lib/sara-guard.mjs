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

/**
 * True when the reply asks the visitor something that actually gathers
 * information (a real question, not just an offer to expand).
 */
export function hasDiscoveryQuestion(text) {
  if (!text) return false;
  const stripped = text.replace(DEEPEN_OFFER_RE, '');
  return countQuestions(stripped) > 0;
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
  const button = isTdlRequest(userQuery)
    ? '[[TDL Customization|/services/tdl]]'
    : '[[Talk to a Specialist|/contact]]';

  if (isLearn) {
    return `One more thing so I can point you at the right screen: what are you trying to achieve there? ${button}`;
  }

  return `Quick check so I brief our technical team properly:

${DISCOVERY_QUESTIONS}

${button}`;
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
 * @returns {{ reply: string, action: 'none'|'blocked-code'|'added-discovery'|'soft-length-nudge' }}
 */
export function applyConsultantGuard(reply, userQuery = '', options = {}) {
  const isLearn = !!options.isLearn;
  const text = typeof reply === 'string' ? reply : '';

  // HARD RULE — never hand a visitor code.
  if (containsProgrammingCode(text)) {
    return { reply: buildNoCodeReply(userQuery, { isLearn }), action: 'blocked-code' };
  }

  // A build request that produced no question must become a conversation.
  if (isCustomBuildRequest(userQuery) && !hasDiscoveryQuestion(text)) {
    return {
      reply: `${text.replace(/\s+$/, '')}\n\n${buildDiscoveryBlock(userQuery, { isLearn })}`.trim(),
      action: 'added-discovery',
    };
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
