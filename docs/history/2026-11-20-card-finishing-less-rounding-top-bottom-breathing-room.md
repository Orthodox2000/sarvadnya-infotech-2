# 2026-11-20 (card finishing) — less rounding + top/bottom breathing room

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"the template main container has rounded edges which kills [the] show and [has] no padding on top and bottom — add those, and reduce rounding."* |
| **Correction** | The first attempt put padding **inside** the card (18px white spacer rows; inner cell 32px → 40px). Owner: *"wrong padding, return to previous — I meant padding in the background teal-ish tint and [the] container which is rounded, padding for it."* Those inner changes were reverted; the reduced corner radius was kept. |
| **`license-expiry-email.html`** | Main card corner radius **14px → 4px**; CTA radius **8px → 4px**. Padding added to the **outer teal-tinted (`#E8F0F0`) table: 24px 12px → 40px 24px**, so the rounded white card now sits inside a visible tinted margin; a `.outer` media rule drops it back to 24px 12px under 620px. |
| **`license-expiry-email-copy-paste.html`** | Outer grey tinted table padding **24px 12px → 40px 24px**; inner cell restored to its original **32px 24px**. Corners deliberately stay square per the earlier *"no curvy ends"* ruling. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. |
