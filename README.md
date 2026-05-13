# Sarvadnya Infotech

Next.js 16 starter for the Sarvadnya Infotech site, featuring a professional multi-page layout, interactive components, and centralized theme management.

## Core Features & Updates (May 2026)

### 🚀 Performance & Stability
- **Robust Component Logic:** Implemented safety checks and optional chaining across all dynamic navigation components (e.g., `Productbar`) to prevent runtime crashes.
- **Optimized Assets:** High-priority hero images and localized branding for peak performance.

### 💎 Interactive UI Components
- **Advanced News Feed:** A marquee-style news ticker with hover-to-pause functionality. Provides detailed descriptions and "Learn More" links via interactive popovers on hover.
- **Lead Generation:** Integrated `QuickSupportModal` across all key landing sections, allowing for 15-minute response time service requests.
- **Dynamic Megamenus:** Apple-style `Productbar` with multi-level nested navigation for Products, Modules, and Services.

### 📍 Localized Branding
- **Region-Specific Focus:** Primary landing page messaging optimized for "Navi Mumbai" and "Tally Certification".
- **Enhanced Visuals:** Increased logo visibility in the navbar and updated hero slides with certified partner branding (`certified.png`).

### 🛠️ Navigation & Connectivity
- **100% Link Integrity:** All CTAs (Request Quote, Get Started, Consultation) are wired to functional support paths or the Contact page.
- **Simplified Access:** Clear paths to Products, Services, Modules, and Training via the navbar and footer.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4 & Vanilla CSS (Theme Variables)
- **Type Safety:** TypeScript
- **Database:** MongoDB (Server-side ready)

## Project Structure

```text
app/
  about/          - Company profile
  components/     - Reusable UI (Navbar, NewsFeed, Productbar, etc.)
  contact/        - Lead capture forms
  products/       - Tally Editions & Custom Modules
  services/       - AMC, Support & Cloud Hosting
  tutorials/      - Master Tally webinars
  theme-settings/ - Theme preview
lib/
  mongodb.ts      - Shared database client
  product-nav.ts  - Centralized navigation data
  theme.ts        - Global design tokens
public/
  certified.png   - Certified partner badge
  TallyCertificate.png
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create `.env.local` and add:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/sarvadnya-infotech
   MONGODB_DB=sarvadnya-infotech
   ```

3. **Development:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

## Theme Customization

Update `lib/theme.ts` to modify global design tokens:
- `primaryColor` (Brand Primary)
- `headingColor` (Typography)
- `backgroundColor` (Site Background)

Preview changes at `/theme-settings`.
