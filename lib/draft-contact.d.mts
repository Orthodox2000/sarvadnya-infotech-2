// Hand-written types for lib/draft-contact.mjs (no build step, house pattern).

export declare const EMAIL_PATTERN: RegExp
export declare const CHAT_ENTRY_POINTS: readonly string[]

export declare function isValidEmail(value: unknown): boolean
export declare function findEmail(fields: Record<string, unknown> | null | undefined): string | null
export declare function hasValidEmail(fields: Record<string, unknown> | null | undefined): boolean
export declare function isChatEntryPoint(entryPoint: unknown): boolean
export declare function shouldCaptureDraft(
  entryPoint: unknown,
  fields: Record<string, unknown> | null | undefined,
): boolean
