# 2026-11-21 — Learning Hub: clicking a video opens the player directly

> Session-history detail. Index: [docs/HISTORY.md](../HISTORY.md)

---

| Fact | Detail |
| :--- | :--- |
| **Ask** | Owner: *"video dont play when clicked, have to press explore, in learning video learning, when clicked on video, open directly."* |
| **Root cause** | In `app/(site)/tutorials/page.tsx` (the "Learning & Support Hub") the `aspect-video` thumbnail/play area had **no click handler** — only the "Explore" button at the bottom of the card called `openDetails(tutorial)`. The hover play icon was also `opacity-0` until hover, so touch devices had no visible affordance either. |
| **Fix** | The thumbnail area is now a real `<button type="button">` with `onClick={() => openDetails(tutorial)}`, `aria-label="Play/Open <title>"` and `w-full block text-left cursor-pointer`. `<Image fill>` still works because the button keeps `relative`. The play icon is now visible on touch (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100`, same for the scale) and the hover shade starts at `bg-black/10` instead of fully transparent. The "Explore" button is kept as a secondary path. |
| **Plays on open** | The modal iframe URL changed from `?autoplay=0` to `?autoplay=1` (with `allow="… autoplay …"` already present) so clicking the video starts playback instead of merely opening a paused player. |
| **Not changed** | `app/(site)/learn-sara/chat/page.tsx` related-tutorial tiles are `<Link href="/tutorials">` by design (they take the visitor to the hub, not straight into a player) — left alone. |
| **Files** | `app/(site)/tutorials/page.tsx` only. |
| **Verified** | Standing single-pass directive (§3): no build, dev server, typecheck or check suite run. Change reviewed statically — JSX tag/comment placement corrected before finishing. |
