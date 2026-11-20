# 2026-11-15 — Admin dashboard header: the "last updated" caption is inline, so Refresh sits back on the line

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"last refersh ti e takes refreshbutton out of line , readjusy ot"* — the last-refresh timestamp was pushing the Refresh button out of alignment with the system-status chip beside it. |
| **Cause** | The caption added on 2026-11-14 was stacked **under** the button inside a `flex flex-col items-end gap-1` column. That column then stood ~14 px taller than the system chip, and because the header row is `items-center`, the extra height was absorbed symmetrically — lifting the **button** about 7 px above the chip's centre line. The tag was also eating a second line of header height for four characters of text. |
| **Fix (`sarvadnya-advanced/app/admin/page.tsx`)** | The column wrapper became a **row**: `flex items-center gap-2`, caption first, button second. The wrapper is now exactly as tall as the button, so the chip, the caption and the button all share one centre line. |
| **Why the caption sits before the button** | The cluster is right-aligned, so a caption on the right would grow rightwards and shift the button leftwards every time the time changed (and between `Not updated yet` and `Updated 18:32`). Placed on the left, the text grows into the free space and the button never moves. |
| **Why a row wrapper and not a bare sibling** | Keeping the caption and the button inside their own `flex` row means the header's `flex-wrap` wraps them **together**; as separate siblings the timestamp could be stranded on its own line above the button on a narrow screen. |
| **Height matched** | Button padding `py-2.5 → py-2`, so the button's height (32 px) equals the chip's — the two boxes now line up exactly rather than the taller button overhanging by 2 px top and bottom. `shrink-0` keeps the button from being squeezed when the row wraps. |
| **Unchanged** | The caption is still a sibling `<span>` **outside** the `<button>` — not clickable, read as plain status text; `whitespace-nowrap` so it can't break mid-date. `Updated 18:32` / `Not updated yet` wording is unchanged, and nothing else on the page moved. |
| **Verified** | `npx tsc --noEmit` exit 0. No build, no dev server, no browser probe (§3 single-turn mode). Width check at the 360 px floor: chip on one line, caption + button (~198 px) on the next — no horizontal overflow. |
| **Push** | Nested repo → `sarvadnyawebteam/sarvadnya-backend` `main`; this repo → `origin` (`sarvadnyawebteam/sarvadnya-live`) **and** `secondary` (`Orthodox2000/sarvadnya-infotech-2`). |
