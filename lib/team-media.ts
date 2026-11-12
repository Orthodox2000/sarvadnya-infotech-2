// CHANGE: 2026-11-12 — single source for the /team hero media paths.
// WHY: the client page renders the <video>/poster and the server layout points the share image
// at the same poster. Two hard-coded copies of a versioned filename is exactly how a stale
// `/videos/...` path survives a rename and 404s the hero.
//
// The clip is the owner's Diwali 2026 celebration recording, re-encoded from 64 MB to 4.0 MB:
// 960x720 (source resolution), H.264 High profile / level 4.0, CRF 30, 2 s keyframes (clean
// loop point), `+faststart` (moov atom first, so streaming starts before the file finishes
// downloading) and no audio track (the hero autoplays muted, so audio was dead weight).
// The poster is generated from the owner's "team thumbnail.png" at 1280x720.
//
// BOTH files are cached `immutable` for a year (next.config.js `/videos/:path*`), so a new clip
// must ship under a NEW filename — editing the bytes in place will not reach returning visitors.
export const TEAM_HERO_VIDEO_PATH = '/videos/team-diwali-2026.mp4';
export const TEAM_HERO_POSTER_PATH = '/videos/team-diwali-2026-poster.webp';
export const TEAM_HERO_VIDEO_UPLOADED_ISO = '2026-11-12';
export const TEAM_HERO_VIDEO_UPLOADED_LABEL = 'Uploaded 12 Nov 2026';
export const TEAM_HERO_VIDEO_TITLE = 'Sarvadnya Infotech — Diwali 2026 team celebration';
export const TEAM_HERO_VIDEO_ALT = 'Sarvadnya Infotech team at the 2026 Diwali celebration';
