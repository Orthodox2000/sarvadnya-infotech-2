# 2026-11-05 (14th pass) — Signature: sign-off contact cannot be auto-linked, green restored

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Area | Detail |
| :--- | :--- |
| **Brief** | Owner: the sent mail still shows the employee email and mobile *"like link with underline and blue"*; they must be *"just text, nothing link"*, but in the brand green as before. |
| **Cause** | The block has contained no `<a>` since the earlier passes (0 anchors, 0 `mailto:`, 0 `tel:`). The blue underline is produced by the mail client's **auto-linker**, which turns any contiguous plain-text email address or phone number into a link when it renders the message. No inline colour or `text-decoration` can override that, because the client builds the anchor itself. |
| **Fix** | An invisible zero-width space (`&#8203;`) now sits inside the *fixed* parts of both values: in the domain after `sarvadnya`, and in the dialling code after `+91`. The rendered text is identical, but the client no longer sees a single contiguous address or number, so there is nothing to link. |
| **Editing rule** | Replace only the `name` and the `X` digits; retyping the whole address or the whole number would drop the invisible break and the auto-link would return. This is recorded in the block comment. |
| **Colour** | Back to the brand green `#033B38` at weight 600, no underline, as asked. |
| **Measured** | Rendered DOM of the sign-off at 280 / 320 / 360 / 590 / 700 / 1024 px, with the `<style>` block and with it stripped: **0** anchors, **0** `mailto:`, **0** `tel:`, colour `rgb(3,59,56)`, weight 600, `text-decoration: none`, 2 × U+200B present, and a rendered-text regex finds **no** email or phone pattern; no horizontal overflow, heights unchanged. No build, typecheck, `check:*` or `test:all`. |
