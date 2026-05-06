# Sarvadnya Infotech

Next.js 16 starter for the Sarvadnya Infotech site, with a simple branded landing page, shared theme tokens, and a MongoDB connection utility ready for server-side features.

## Current Scope

- Landing page at `/`
- Theme preview page at `/theme-settings`
- Shared navbar with logo, brochure download link, and contact action
- Centralized theme tokens in `lib/theme.ts`
- Reusable MongoDB client in `lib/mongodb.ts`

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript
- MongoDB Node.js driver

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local` and add:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/sarvadnya-infotech
MONGODB_DB=sarvadnya-infotech
```

`lib/mongodb.ts` throws at startup if `MONGODB_URI` is missing, so set the environment variable before using Mongo-backed features.

## Project Structure

```text
app/
  components/Navbar.tsx
  theme-settings/page.tsx
  layout.tsx
  page.tsx
lib/
  mongodb.ts
  theme.ts
public/
  TallyCertificate.png
```

## Theme Customization

Update `lib/theme.ts` to change the global design tokens used across the app:

- `primaryColor`
- `secondaryColor`
- `primaryButtonColor`
- `secondaryButtonColor`
- `headingColor`
- `paragraphColor`
- `backgroundColor`

Use `/theme-settings` to preview the current values in the browser.

## Scripts

- `npm run dev` starts the local development server
- `npm run build` creates the production build
- `npm run start` runs the production server
