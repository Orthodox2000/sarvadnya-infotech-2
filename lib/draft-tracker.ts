// CHANGE: 2026-10-09 — Minimal client-side draft tracker (non-submitted inputs)
// Gradual, batched: debounce + blur + visibilitychange + pagehide. Uses sendBeacon/keepalive.
// Stores full IP via server; client never sends IP. 30-day TTL enforced server-side.

export type EntryPoint = 'form'|'ask-sara'|'learn-sara'|'training'|'generic'

function safeStorage(): Storage|null {
  try { if (typeof window !== 'undefined') return window.sessionStorage } catch { return null }
  return null
}

function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'd_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2)
}

export interface DraftMeta {
  referrer?: string
  userAgent?: string
  utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string
  lang?: string
  viewport?: string
}

export interface StartDraftOpts {
  entryPoint: EntryPoint
  path: string
  source: string
  fields?: Record<string,any>
  meta?: DraftMeta
  sessionId?: string
}

export class DraftTracker {
  private draftId: string|null = null
  private sessionId: string|null = null
  private entryPoint: EntryPoint = 'generic'
  private path = ''
  private source = ''
  private lastSent: Record<string,any> = {}
  private pending: Record<string,any> = {}
  private meta: DraftMeta = {}
  private timer: ReturnType<typeof setTimeout>|null = null
  private lastFlushAt = 0
  private flushInFlight = false

  start(opts: StartDraftOpts) {
    this.entryPoint = opts.entryPoint
    this.path = opts.path
    this.source = opts.source
    this.meta = opts.meta||{}
    this.sessionId = opts.sessionId||this.sessionId
    this.draftId = genId()
    this.lastSent = { ...(opts.fields||{}) }
    this.pending = { ...(opts.fields||{}) }
    const s = safeStorage()
    try { s?.setItem('svd_draft_state', JSON.stringify({draftId:this.draftId,sessionId:this.sessionId,entryPoint:this.entryPoint,path:this.path,source:this.source,lastSent:this.lastSent})) } catch {}
  }

  setSessionId(id:string){ this.sessionId = id }

  onInput(name:string, value:any) {
    if (this.draftId===null) return
    this.pending = { ...this.pending, [name]: value }
    this.schedule(1000)
  }

  private schedule(ms:number) {
    if (this.timer) clearTimeout(this.timer)
    this.timer = setTimeout(()=>this.flush('debounced'), ms)
  }

  flush(reason:'debounced'|'blur'|'visibility'|'unload'|'idle'|'manual'='manual') {
    if (this.draftId===null || this.sessionId===null) return
    const now = Date.now()
    if (reason!=='unload' && reason!=='blur' && now - this.lastFlushAt < 400) return
    const diff:Record<string,any>={}; let changed=false
    const keys = new Set([...Object.keys(this.lastSent), ...Object.keys(this.pending)])
    for (const k of keys) {
      const a=this.lastSent[k], b=this.pending[k]
      if (JSON.stringify(a)===JSON.stringify(b)) continue
      diff[k]=b; changed=true
    }
    if (!changed && reason!=='unload') return
    const payload = {
      draftId:this.draftId, sessionId:this.sessionId,
      path:this.path, entryPoint:this.entryPoint, source:this.source,
      fields:Object.keys(diff).length?diff:this.pending,
      meta:this.meta
    }
    this.lastSent = { ...this.lastSent, ...diff }
    try { const s=safeStorage(); s?.setItem('svd_draft_state', JSON.stringify({draftId:this.draftId,sessionId:this.sessionId})) } catch {}
    if (reason==='unload' && typeof navigator!=='undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(payload)],{type:'application/json'})
      navigator.sendBeacon('/api/drafts/flush', blob)
      this.lastFlushAt=now; return
    }
    this.flushInFlight=true
    fetch('/api/drafts/flush',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),keepalive:reason==='unload'}).catch(()=>{}).finally(()=>{this.flushInFlight=false; this.lastFlushAt=now})
  }

  onBlur(){ this.flush('blur') }
  onVisibilityHidden(){ this.flush('visibility') }
  onPageHide(){ this.flush('unload') }
  destroy(){ if (this.timer) clearTimeout(this.timer) }
}

export function createDraftTracker(){ return new DraftTracker() }
