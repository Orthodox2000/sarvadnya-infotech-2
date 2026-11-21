# 2026-11-20 — Email signature: horizontal scrollbar in the received email

Back to [docs/HISTORY.md](../HISTORY.md).

## Owner report

> "email signature i still get scroll bar for some reason , instigate"

Clarified: the bar is **horizontal (bottom)** and appears in the **received email**, not
when opening the HTML file.

## Investigation

Measured `email-signature.html` in headless Chrome at 280, 320, 360, 375, 414, 600, 768,
1024, 1280 and 1440 px, both as the standalone file and as the bare paste region (first
`<table>` to last `</table>`, no `<body>` rules):

- `document.documentElement.scrollWidth === clientWidth` at every width.
- Zero elements with `right > viewport`, zero with `scrollWidth > clientWidth`.
- Forcing wide fallback fonts (monospace, DejaVu Sans, Liberation Serif) at 320–600 px
  still produced zero overflow.
- No unexpectedly tall blank row; section heights accounted for the full document height.

So the file has no browser-level overflow. The remaining suspects were mail-client
rendering quirks and the body scroll container.

## Root cause

Two issues, both in the wrapper:

1. The outer `width="100%"` table had `padding:24px 12px` on its single cell. Outlook's
   Word renderer adds cell padding to a percentage-width table, so the received message
   was `100% + 24px` wide → permanent horizontal scrollbar. Mail clients strip `<body>`
   styles, so the inherited `overflow-x:hidden` could never suppress it.
2. `overflow-x:hidden` sat on `<body>` alone after the old `<style>` block was removed.
   CSS forces `overflow-y` to compute to `auto` in that case, turning the body into a
   scroll container (measured: `overflow-x:hidden / overflow-y:auto`).

## Fix (`email-templates/email-signature.html`)

- Removed `overflow-x:hidden` from `<body>`.
- Replaced the padded 100%-width cell with **real spacer rows and gutter cells**:
  - `<tr><td height="24" style="height:24px;line-height:24px;font-size:0;">&nbsp;</td></tr>`
    above and below,
  - a nested `width="100%"` table whose first/last cells are `width="12"` spacers, with
    the `width="600" align="left"` card in the middle cell.
- Visual result is unchanged: measured card left 12px, top 24px, width 600px on desktop;
  27 anchors and 10 images intact; correct DOM nesting confirmed.

## Verification

Chrome re-measurement at 280–1440 px: `scrollWidth === clientWidth`, **zero** overflowing
elements, body computed to `visible/visible`. No build, dev server, typecheck or check
suite (AGENTS.md §3 single-pass directive). A visual re-send through the actual mail
client is still the final confirmation the owner needs to make.

Docs: `email-templates/README.md` (file table + new "No horizontal scrollbar" section),
daily log §22, tracker row 148.
