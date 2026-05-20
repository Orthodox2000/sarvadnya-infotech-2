# Project Conventions

## Versioning
- Always mention the application version number when presenting changes or updates.
- Versioning follows the format `v1.1.x`.
- Increment the patch version automatically for every iteration/significant set of changes.
- Current Version: v1.1.28

## Recent Changes (v1.1.28)
- **Build Error Fix:** Resolved a critical TypeScript error in `app/api/admin/partners/route.ts` where string `_id` values were being incorrectly passed to MongoDB's `insertMany` during seeding.
- **Improved Type Safety:** Implemented proper destructuring to omit `_id` when inserting static partner data, ensuring compatibility with MongoDB's `ObjectId` type.
- **Version Bump:** Updated application version to v1.1.28 across all relevant files.

## Recent Changes (v1.1.27)
- **Dynamic Partner Management:** Migrated the "Certified Partners" section from hard-coded local assets to a fully database-driven model.
- **Partner Admin UI:** Developed a new admin interface (`/admin/partners`) for managing partner logos, including image upload support.
- **Improved Data Integrity:** Introduced a dedicated `partners` collection in MongoDB for better scalability and management.
- **Version Bump:** Updated application version to v1.1.27 across all relevant files.

## Recent Changes (v1.1.26)
- **Deep Admin Integration:** Integrated all major admin routes (Careers, Modules, Learning, Settings, etc.) directly into the mobile hamburger menu.
- **Improved Management UX:** Allowed administrators to jump straight to specific management areas on mobile without going through the main dashboard.
- **Consistent Icons:** Mirrored the admin panel's icon system within the mobile navigation drawer for visual continuity.
- **Scrollable Menu:** Optimized the mobile drawer with a scrollable container to accommodate the expanded list of links comfortably.

## Recent Changes (v1.1.25)
- **Mobile Navigation Overhaul:** Implemented a responsive hamburger menu in the main `Navbar`, ensuring all critical links (including Admin) are accessible on mobile.
- **AI Chat Panel:** Refactored the "Ask AI" feature from a full-screen modal to a compact, fixed chat panel in the top-right corner for better multitasking.
- **Improved Header UI:** Modernized the mobile menu drawer with a grid-based layout and better visual hierarchy for primary CTAs.
- **Accessibility Fixes:** Ensured the Admin panel is reachable via the new mobile navigation menu.

## Recent Changes (v1.1.24)
- **Admin Mobile Optimization:** Implemented a fully responsive, collapsible sidebar for the admin panel.
- **Responsive Navigation:** Added a mobile-only header with a hamburger menu and a smooth-sliding sidebar drawer for smaller screens.
- **Enhanced Sidebar UI:** Integrated descriptive SVG icons for all admin navigation items and improved the overall visual hierarchy.
- **UX Improvements:** Added a backdrop overlay for mobile navigation and auto-closing behavior upon link selection on mobile devices.

## Recent Changes (v1.1.23)
- **Light Theme Support UI:** Redesigned the "Priority Support" and "Request a Callback" sections to follow a clean, light-themed aesthetic.
- **Modern Light UI:** Implemented white/light-gray backgrounds with vibrant brand accents (violets and indigos) for a professional and approachable look.
- **Consistent Styling:** Updated all support modals and landing page callback boxes to ensure a unified light-themed experience across the site.
- **Enhanced Readability:** Improved text contrast and input field visibility in the new light-themed layouts.

## Recent Changes (v1.1.22)
- **Performance Fixes:** Resolved build errors caused by using `ssr: false` in Server Components (`app/layout.tsx` and `app/page.tsx`).
- **Dynamic Import Refinement:** Cleaned up dynamic imports by removing redundant `ssr` flags, maintaining code-splitting benefits while ensuring compatibility with Next.js App Router Server Components.
- **Async Loading:** Verified that landing page sections (`CertifiedPartners`, `CustomerReviews`, `FAQ`, etc.) are correctly code-split and loaded asynchronously with appropriate loading skeletons.

## Recent Changes (v1.1.20)
- **Landing Page Optimization:** Refactored the main landing page to use dynamic imports for all middle and bottom sections (`CertifiedPartners`, `QuickAccessHub`, `CustomerReviews`, `FAQ`, `Footer`).
- **Shell Optimization:** Optimized the `RootLayout` by dynamically loading `NewsFeed`, `SupportButton`, and `NotificationToast`, reducing the initial blocking time of the page shell.
- **Improved Skeletons:** Added meaningful loading skeletons for all dynamically loaded components to maintain layout stability during async loading.

## Recent Changes (v1.1.19)
- **Learning Admin Panel:** Created a full-featured management interface (`/admin/learning`) for videos and external links.
- **Categorization (Folders):** Added ability to group learning content into different folders/categories for organized user browsing.
- **Tagging & Search:** Implemented tag-based metadata and real-time search functionality on both admin and public interfaces.
- **Dynamic Portal:** Refactored the public Tutorials page to be entirely database-driven with folder-based tabs and search filters.
- **Auto-Thumbnails:** Integrated automatic YouTube thumbnail generation for video content.

## Recent Changes (v1.1.18)

## Recent Changes (v1.1.17)

## Recent Changes (v1.1.16)

## Database & Storage
- **MongoDB** is the primary database for all site data including careers, settings, and page content.
- **Mega.nz** is used for storing and fetching resumes and site assets (images).
- Resumes are stored in the `resumes` folder on Mega.nz.
- Site assets are stored in the `site-assets` folder on Mega.nz.
