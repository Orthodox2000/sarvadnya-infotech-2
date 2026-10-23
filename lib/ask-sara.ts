// CHANGE: 2026-10-23 — NEW: one tiny helper so any page can open Ask Sara with a question
// already written into the chat input.
//
// WHY: the /shop catalogue wants a per-card "Ask Sara about this" and a "not sure what you
// need?" wizard. Ask Sara is a single global widget mounted in the (site) layout, so a page
// cannot call its setState directly. A window CustomEvent keeps the coupling to one string
// and lets SupportButton stay the only owner of "is the chat open".
//
// Usage (client components only):
//   import { askSara } from '@/lib/ask-sara';
//   askSara('I need help choosing the right TDL for my business');

export const SARA_ASK_EVENT = 'sara:ask';

export interface SaraAskDetail {
  question: string;
}

/** Opens Ask Sara with `question` pre-typed in the input (it does NOT auto-send). */
export function askSara(question: string): void {
  if (typeof window === 'undefined') return;
  const text = String(question || '').trim();
  if (!text) return;
  window.dispatchEvent(new CustomEvent<SaraAskDetail>(SARA_ASK_EVENT, { detail: { question: text } }));
}
