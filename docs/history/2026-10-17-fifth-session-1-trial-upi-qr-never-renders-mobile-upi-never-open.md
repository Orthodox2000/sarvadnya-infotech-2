# 26. 2026-10-17 (fifth session) — ₹1-trial UPI QR never renders / mobile UPI never opens GPay: **Razorpay account-side (UPI + Netbanking broken)** — documented only, **NO code change**

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

**Owner:** *"checkout/trial opens modal but it doesnt open qr for payment, it shows refresh but doesn't refresh at all"* → *"i think something is still showing test mode … clicking netbanking caused auto complete screen same as now before failing"* → *"for 1rs payment, it doesnt open gpay, it just doesnt redirect to payment portal"* → *"forget it, document issue and update daily logs and csv."*

**Verdict: not our code, not test mode, not the amount, not the logo/image, not CSP. On live account `rzp_live_TowJo1sMjOAMdp` only **Card + EMI** work; **UPI and Netbanking are broken** — that is why the QR never renders and why mobile UPI never hands off to an app.**

| Symptom (owner) | Razorpay call measured | Result |
| :--- | :--- | :--- |
| Desktop `/checkout` UPI-QR tab shows only "Refresh QR", never a QR | `POST /v1/standard_checkout/checkout/order` | **500 `SERVER_ERROR`** |
| Mobile: tapping Pay/PhonePe never opens GPay/PhonePe | `POST /v1/standard_checkout/payments/create/ajax` | **500 `SERVER_ERROR`** → **no `upi://` intent fired** |
| Netbanking: bank list appears, then fails | `POST /v1/standard_checkout/payments/create/ajax` | **400 `BAD_REQUEST_ERROR` — "Terminal not found."** |
| Control — our site bypassed entirely, direct API with the live keys | `POST /v1/payments/qr_codes` at ₹1 / ₹1,000 / ₹5,000 | **500 `SERVER_ERROR`** (all three) |

Razorpay's docs classify `SERVER_ERROR` / *"We are facing some trouble completing your request at the moment…"* as an **internal** error (`Source: internal`). "Refresh QR" merely re-issues the same failing call, which is why it appears to do nothing.

**Ruled out, with evidence:**
- **Our code** — the order is valid: `GET /v1/orders/order_…` → 200, `amount 100`, `currency INR`, `status created`, `notes { cartItems, mode:'live', source:'cart' }`.
- **"Something is still in test mode"** — production `/api/cart/order` returns **`testMode:false`** + **`keyId:"rzp_live_TowJo1sMjOAMdp"`**; `notes.mode:'live'`; the Razorpay frame URL carries **`traffic_env=production`**; the modal contains **no** "test mode"/"sandbox" text; our amber "no real money" banner is **absent**; and the attempts appear in the **live** Payments list (test-mode payments never do). The "autocomplete screen" seen on Netbanking is simply Razorpay's normal **bank search list** — it renders in live checkout too. (If the app were in test mode, `assertKeys()` would have made `/api/cart/order` return **503**, not a live order.)
- **Amount** — identical failure at ₹1, ₹1,000 and ₹5,000.
- **Logo / `image`** — `CheckoutContents.tsx` passes **no `image` at all**, so the pasted "logo not showing / server-to-server redirect form" advice does not apply (and a logo fault could never make the order API return 500). We use inline `checkout.js`, not a redirect.
- **CSP** — zero `securitypolicyviolation` events on our page; the QR lives inside Razorpay's own iframe anyway.

**Account history (live API) — the decisive evidence:**

| Method | Last **captured** payment | Today |
| :--- | :--- | :--- |
| card | **2026-05-28** (includes a captured **₹1** card payment) | ✅ works |
| emi | 2025-12-04 | ✅ works |
| **upi** | **2023-03-31** | ❌ every attempt `SERVER_ERROR` |
| **netbanking** | **2020-12-22** | ❌ `Terminal not found.` |

So UPI has not worked on this account since **March 2023**, and Netbanking since **2020** — **customers cannot pay by UPI at all** (neither QR nor app). Card/EMI are unaffected.

**Owner action (Razorpay dashboard — cannot be done from code):**
1. **Account & Settings → Payment Methods** → check the **UPI** / **Netbanking** status (expect inactive/not provisioned).
2. Raise a Razorpay support ticket with these refs: orders `order_ToypkJuk3jU0Lo`, `order_ToymcBMmcDzap7`; payments `pay_ToyfyFcRe0E9MG` (upi → `SERVER_ERROR`), `pay_Toyms4J1H2VFOi` (netbanking → "Terminal not found.").
3. Until UPI is restored, the **₹1 trial completes via the Cards tab** in the same modal (card path verified working, including ₹1).

**No code was changed** — nothing in this repo can make the QR or the GPay hand-off appear while the gateway refuses to create the UPI payment. Probe scripts (`/tmp/opencode/repro-v5…v10.cjs`) are throwaway. An optional UX follow-up (**NOT applied**, owner has not asked for it): land the modal on **Cards** (`config.display` ordering) and/or show a note on `/checkout/trial` to use Cards while UPI is down.
