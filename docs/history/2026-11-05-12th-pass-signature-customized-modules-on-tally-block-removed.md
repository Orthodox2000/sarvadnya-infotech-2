# 2026-11-05 (12th pass) — Signature: "Customized Modules on Tally" block removed

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: *"and remove customised module"* — the whole `Customized Modules on Tally` block, quoted in full (label plus all ten pointers and `and many more…`). |
| **Change** | The dashed divider, the 9px label linking to `/services/tdl`, and the eleven pointer lines were deleted from the Services cell — 3,903 characters, 11 `&bull;` rows. The Services row now ends after the six service links (`TallyPrime Licences · TSS Renewal · AMC & Support · TDL Customisation · Tally on Cloud · HRMS & Payroll`). |
| **Kept** | The Services line itself, the partner strip, the two-column brand/Contact row with the social icons under Contact, and the legal line are untouched. No asset is orphaned: the block used no image. |
| **Docs** | The header comment no longer lists the modules block as part of the layout and records that it was removed on request. |
| **Measured** | Probe at 280 / 320 / 360 / 390 / 480 / 600 / 820 / 1024 / 1280 px, with the `<style>` block and with it stripped: `scrollWidth == clientWidth`, zero elements past the right edge, the text `Customized Modules` / `BUSINESS BOOSTERS` / `and many more` is absent from the rendered body, the Services links are still present. Page height drops from **1064 → 666 px at 320** and **757 → 492 px at 1024**. No build, typecheck, `check:*` or `test:all`. |
