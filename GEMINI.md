# Project Conventions

## Versioning
- Always mention the application version number when presenting changes or updates.
- Versioning follows the format `v1.1.x`.
- Increment the patch version automatically for every iteration/significant set of changes.
- Current Version: v1.1.88

## Recent Changes (v1.1.88)
- **Contact Page Type Alignment:** Resolved a TypeScript build error by updating the `SiteSettings` type definition within `app/contact/page.tsx`. Added the missing `whatsapp_phone` field to ensure full compatibility with the dynamic settings API and established project standards.
- **Version Bump:** Updated application version to v1.1.88.

## Recent Changes (v1.1.87)

## Recent Changes (v1.1.86)

## Recent Changes (v1.1.83)

## Recent Changes (v1.1.82)

## Recent Changes (v1.1.81)

## Recent Changes (v1.1.80)

## Recent Changes (v1.1.77)

## Recent Changes (v1.1.76)

## Recent Changes (v1.1.75)

## Recent Changes (v1.1.73)

## Recent Changes (v1.1.72)
- **Dedicated WhatsApp Setting:** Integrated a new `NEXT_PUBLIC_WHATSAPP_PHONE` field into the site settings and admin panel. All WhatsApp buttons and links across the site (Hover Button, Footer, Quick Access Hub, FAQ, Contact Page) now use this dedicated dynamic number with an automatic fallback to the primary support phone.
- **Dynamic Partner Grid Optimization:** Refactored the `CertifiedPartners` component to be fully database-driven. Optimized the grid layout and reduced logo sizes to ensure 5 industry partners fit seamlessly in a single row on desktop viewports.
- **Version Bump:** Updated application version to v1.1.72.

## Recent Changes (v1.1.71)

## Recent Changes (v1.1.70)

## Recent Changes (v1.1.69)

## Recent Changes (v1.1.68)

## Recent Changes (v1.1.66)


## Recent Changes (v1.1.65)

## Recent Changes (v1.1.64)

## Recent Changes (v1.1.63)

## Recent Changes (v1.1.62)

## Recent Changes (v1.1.61)

## Recent Changes (v1.1.60)

## Recent Changes (v1.1.59)

## Recent Changes (v1.1.58)

## Recent Changes (v1.1.57)

## Recent Changes (v1.1.56)

## Recent Changes (v1.1.55)

## Recent Changes (v1.1.54)
- **Partner Visibility Fix:** Resolved an issue where the Certified Partners section was invisible due to white logos on a white background. Implemented a light slate background (`bg-slate-50/50`) and white card containers with shadows to ensure visibility for all logo types.
- **Enhanced Brand Presentation:** Redesigned the partner grid with responsive card layouts and interactive hover effects, significantly improving the section's visual hierarchy and professionalism.
- **Version Bump:** Updated application version to v1.1.54.

## Recent Changes (v1.1.53)
- **HomeHero Transition Polish:** Implemented a smooth cross-fade animation for hero slides. The entire content block (text and visuals) now fades out and blurs slightly before switching content, followed by a crisp fade-in.
- **Slower Typing Effect:** Reduced the typing speed to 80ms per character to improve readability and create a more natural "expert assistant" feel.
- **Synchronized Cross-Fade:** Integrated an `isTransitioning` state to coordinate the exit and entry phases of slide changes, ensuring a seamless visual flow without abrupt content jumps.
- **Version Bump:** Updated application version to v1.1.53.

## Recent Changes (v1.1.52)
- **TypeScript Type Alignment:** Resolved a type mismatch in `UnifiedContactModal` by adding the `'demo'` variant to the `FormType` union. Updated internal mapping logic to provide unique titles ("Book a Free Demo") and badges ("Live Showcase") for the demo request workflow.
- **Version Bump:** Updated application version to v1.1.52.

## Recent Changes (v1.1.51)
- **Mobile Navigation UX Overhaul:** Added explicit "Close Menu" buttons to the top and bottom of the mobile navigation drawer to ensure effortless unexpansion.
- **Megamenu Hardening:** Integrated dedicated mobile-only "Close Menu" buttons within the `Productbar` megamenus, resolving navigation friction on small screens.
- **Drawer Alignment Fix:** Corrected mobile drawer positioning from `fixed` to `absolute top-full`, ensuring perfectly synchronized scrolling with the sticky navigation header.
- **Version Bump:** Updated application version to v1.1.51.

## Recent Changes (v1.1.50)
- **HomeHero Cinematic Transitions:** Extended the hero slide duration to 10 seconds for better content digestibility. Implemented synchronized "fade-up" animations for both text and visual elements using deep slide-in offsets and smooth opacity ramps.
- **Improved Interaction Feedback:** Added subtle scale transitions to hero buttons and badges to enhance the premium feel of the landing page.
- **Version Bump:** Updated application version to v1.1.50.

## Recent Changes (v1.1.49)
- **HomeHero Mobile Spacing Optimization:** Reduced vertical margins and minimum height constraints for the `HomeHero` section on mobile devices. Optimized the title and description wrappers to minimize excessive whitespace during the typing animation.
- **Improved Typography Scaling:** Adjusted text sizes and line heights for mobile viewports to ensure a compact and balanced presentation of hero content.
- **Version Bump:** Updated application version to v1.1.49.

## Recent Changes (v1.1.48)
- **Productbar Navigation Fixes:** Refactored the `Productbar` to support explicit click-to-toggle behavior for megamenus, ensuring full functionality on mobile and touch devices.
- **Logo Link Correction:** Updated the company logo link in the `Productbar` to navigate to the homepage (`/`) for a more intuitive user experience.
- **Event Propagation Management:** Implemented `e.stopPropagation()` on megamenu interactions to prevent accidental menu closures during content selection.
- **Improved Responsiveness:** Optimized hover/click logic to distinguish between desktop and mobile viewport behaviors, preventing conflicting state updates.
- **Version Bump:** Updated application version to v1.1.48.

## Recent Changes (v1.1.47)
- **HomeHero Animation Overhaul:** Implemented a high-performance typing effect for the main headline and integrated smooth enter/exit animations using key-based transitions.
- **Layout Stability:** Resolved height inconsistency issues in the `HomeHero` during slide transitions by implementing invisible placeholders and fixed-minimum height containers, preventing content jumping.
- **Bug Fixes:** Corrected state update typos and added defensive property checks to ensure the hero section renders reliably even with partial database data.
- **Version Bump:** Updated application version to v1.1.47.

## Recent Changes (v1.1.46)
- **AI Behavior Refinement:** Trained the AI assistant to never mention specific prices, redirecting users to the sales team instead. Enforced proactive product promotion and requirement gathering in every interaction.
- **Navbar Enhancement:** Added a temporary "Palette" access button to the primary navbar for quick brand identity management.
- **UI Overflow Fix:** Resolved a mobile display issue in the `Productbar` megamenu where dropdown options would overflow the screen. Implemented responsive positioning logic for better edge-case handling.
- **Version Bump:** Updated application version to v1.1.46.

## Recent Changes (v1.1.45)
- **Runtime Error Fix:** Resolved a critical "Cannot read properties of null (reading 'error')" error by implementing defensive null checks on all API response data before accessing the `.error` property.
- **Global API Safety:** Updated `lib/client-api.ts`, `QuickSupportModal`, `Footer`, and all Admin management pages to safely handle potentially null or empty API responses.
- **Admin Sidebar Stability:** Added array validation to the Admin Sidebar to prevent crashes when fetching settings fails or returns an unexpected format.
- **Version Bump:** Updated application version to v1.1.45.

## Recent Changes (v1.1.44)
- **AI Chat Optimization:** Refined the AI assistant to provide concise, point-based responses. Enforced strict Markdown formatting (bolding and proper line breaks) for improved readability.
- **Multi-API Key Rotation:** Implemented a secure rotation system for Groq API keys. Administrators can now manage a comma-separated list of keys in the settings panel to ensure high availability and bypass rate limits.
- **Local Asset Migration:** Migrated all image storage from MongoDB binary/base64 to the local filesystem (`public/uploads`). This significantly improves page load times, reduces database bloat, and resolves previous file serving errors.
- **Surgical File Replacement:** Enhanced the upload API to automatically delete and replace old local files when assets are updated. This maintains filesystem hygiene and ensures 'renaming' behavior for site assets.
- **Unified Upload Logic:** Consolidated all admin image uploads (Branding, Pages, Modules, Learning) to use the new local-storage upload system.
- **Version Bump:** Updated application version to v1.1.44.

## Recent Changes (v1.1.43)
- **Dynamic Content Engine:** Refactored `HomeHero`, `HomeStat`, and `QuickAccessHub` to be fully database-driven. Administrators can now manage carousel slides, live statistics, and hub navigation links directly from the admin panel.
- **Enhanced Asset Visualization:** Redesigned `Manage Pages` and `Asset Management` interfaces with explicit "Slot Identification" labels (e.g., "[About Page Top]", "[Leadership Section]") and helpful tips to clarify where each image replacement appears on the public site.
- **Live Preview Links:** Added "View Live Page" shortcuts to admin management screens, allowing for instant verification of content and image updates.
- **Admin Navigation Cleanup:** Integrated `Manage Pages` into the primary admin sidebar and removed redundant/unused content sections to streamline the management workflow.
- **Version Bump:** Updated application version to v1.1.43.

## Recent Changes (v1.1.42)
- **Build Stabilization:** Resolved multiple TypeScript build errors preventing production deployment.
- **Next.js 16 Compatibility:** Updated `revalidateTag` calls in `lib/mongodb-utils.ts` to include the mandatory second argument (`profile`) required by the updated Next.js 16 cache API.
- **Productbar Type Safety:** Fixed implicit `any` errors in the `Productbar` megamenu by explicitly typing nested navigation items and state.
- **Module Interface Update:** Added `_id` support to the `Module` interface in `lib/modules.ts` to ensure compatibility with MongoDB-sourced data in the `Modules` gallery.
- **Version Bump:** Updated application version to v1.1.42.

## Recent Changes (v1.1.41)
- **GroqCloud AI Integration:** Successfully integrated the GroqCloud API into the "Ask Our AI Expert" chatbot. The system now uses the high-performance `llama-3.3-70b-versatile` model for real-time, context-aware conversations.
- **Custom System Prompt:** Implemented a detailed system prompt that provides the AI with deep context about Sarvadnya Infotech, its history, services, and TallyPrime product pricing/expertise.
- **Secure API Backend:** Created a new secure API route `/api/chat` to handle communication with Groq, ensuring API keys are never exposed on the frontend.
- **Improved Chat UX:** Updated the chat interface with message persistence across the current session and real-time response streaming feel.
- **Version Bump:** Updated application version to v1.1.41.

## Recent Changes (v1.1.40)
- **Modules Key Fix:** Resolved a React "unique key" prop warning on the `Modules` page by ensuring the database-native `_id` is used as the primary key for map iterations.
- **Tutorial Card Optimization:** Reduced the visual footprint of video cards in the `Learning Hub`. Increased the grid density to 4 columns on desktop and streamlined typography/padding for a more compact and readable list view.
- **Cloud Product Action Buttons:** Replaced simple text-based "Learn More" links with high-action "View Full Details" buttons on the `Cloud Solutions` page, aligning them with the site's primary product action patterns.
- **Version Bump:** Updated application version to v1.1.40.

## Recent Changes (v1.1.39)
- **NewsFeed Layering Fix:** Resolved a UI issue where the `Navbar` would overlap the `NewsFeed` hover popover. Increased the `NewsFeed` container's z-index to `2100` to ensure it always renders above the header and navigation elements.
- **Version Bump:** Updated application version to v1.1.39.

## Recent Changes (v1.1.38)
- **Expanded Asset Management:** Transformed "Partner Management" into a unified "Assets & Partners" manager. Administrators can now manage Brand Partners, About Us Gallery images, and Our Team photos from a single interface.
- **Dynamic Team Grid:** Refactored the `Team` page to dynamically fetch and display team members from the database, allowing for easy updates to staff listings and roles.
- **About Us Gallery:** Integrated a dynamic masonry-style gallery into the `About Us` page that pulls from the newly created asset management system.
- **Enhanced Database Utilities:** Updated MongoDB utility functions to support type-based asset retrieval and caching revalidation for all asset categories.
- **Version Bump:** Updated application version to v1.1.38.

## Recent Changes (v1.1.37)
- **Refined Consent UI:** Simplified the caching consent banner to remove technical details and focus on a clear "Accept" message.
- **Corner Notification:** Moved the consent banner from a full-width bottom bar to a compact notification in the bottom-left corner.
- **Extended Visibility:** Increased the auto-dismiss timer for the consent window from 5 to 10 seconds to allow for better readability.
- **Version Bump:** Updated application version to v1.1.37.

## Recent Changes (v1.1.36)
- **Advanced Database Caching:** Implemented a robust 5-hour caching layer for all database GET queries (Settings, Modules, Tutorials, Partners, Reviews) using Next.js `unstable_cache`. This drastically reduces MongoDB load and improves site responsiveness.
- **Smart Cache Invalidation:** Added `revalidateTag` logic to all mutation functions (update/add/delete). This ensures that the cache is instantly purged and refreshed whenever an administrator makes changes in the admin panel.
- **Automatic Consent Window:** Created a `CacheConsent` component that notifies users of the caching policy for performance optimization. The window features a sleek design, smooth animations, and automatically dismisses itself after 5 seconds to minimize intrusion.
- **Session Persistence:** The consent window uses `sessionStorage` to ensure it only appears once per user session.
- **Version Bump:** Updated application version to v1.1.36.

## Recent Changes (v1.1.35)
- **Functional AI Chatbot:** Refactored the "Ask Our AI Expert" panel into a fully functional chat interface with message history, typing indicators, and auto-scrolling.
- **Simulated AI Intelligence:** Implemented keyword-based response logic for common Tally queries (Pricing, GST, Cloud, WhatsApp) to provide instant value while awaiting API integration.
- **UI Refinement:** Reduced the size of the "Ask AI" and "WhatsApp" support buttons and their respective tooltips for a more balanced and less intrusive user experience.
- **Enhanced Chat UX:** Added a clear close button to the chat window and optimized its positioning and shadow depth.
- **Version Bump:** Updated application version to v1.1.35.

## Recent Changes (v1.1.34)
- **Custom Video Thumbnails:** Added support for uploading custom thumbnails for "External Link" content in the Learning Admin.
- **Logo Thumbnail Option:** Introduced an option to use the company logo as a default thumbnail for external guides and articles.
- **Tutorial UI Fixes:** Resolved an issue where the video modal would clip under the sticky navbar by increasing the z-index to `3000`.
- **Responsive Video Scaling:** Reduced the maximum width of the embedded video player to `max-w-4xl` for better focus and readability on larger screens.
- **Data Integrity:** Fixed a potential MongoDB error in tutorial updates by ensuring the `_id` field is stripped before update operations.
- **Version Bump:** Updated application version to v1.1.34.

## Recent Changes (v1.1.33)
- **Navigation Cleanup:** Removed redundant "Products", "Services", "Modules", "Learning", and "About" links from the main `Navbar`, as they are now centrally managed and displayed in the `Productbar` megamenu.
- **UI Optimization:** Streamlined the desktop and mobile headers to eliminate visual clutter and improve navigation focus.
- **Version Bump:** Updated application version to v1.1.33 across the project.

## Recent Changes (v1.1.32)
- **Content Restoration:** Restored the original "Capabilities" page (`/capabilities`) with its point-based presentation and interactive category navigator.
- **Dynamic Theme System:** Implemented a fully functional theme application system. Brand palettes selected in the admin panel are now saved to MongoDB and applied site-wide via CSS variables in the Root Layout.
- **New Admin Route:** Created `/admin/palette` for the Color Palette Selector, allowing administrators to preview and finalize brand identities.
- **Admin Navigation Update:** Integrated the new Theme Palette manager into the admin sidebar and mobile navigation.
- **Version Bump:** Updated application version to v1.1.32.

## Recent Changes (v1.1.31)
- **Module Update Fix:** Resolved a bug where updating a module image would fail due to `_id` field collision in MongoDB payloads.
- **Dynamic Productbar Modules:** The "Modules" dropdown in the `Productbar` is now fully database-driven, automatically reflecting newly added modules.
- **Dynamic Footer & Hub:** Integrated dynamic module sourcing into the `Footer` and `QuickAccessHub` components.
- **Global Contact Modularization:** Refactored `SupportButton`, `FAQ`, and `QuickAccessHub` to fetch contact information directly from site settings, ensuring site-wide consistency.
- **Version Bump:** Updated application version to v1.1.31.

## Recent Changes (v1.1.30)
- **Admin Sidebar Optimization:** Removed unnecessary scrolling from the admin sidebar and optimized item spacing for a more compact view.
- **MongoDB Media Storage:** Implemented a native image storage system in MongoDB (`media` collection) to replace external dependencies for core branding assets.
- **Branding Management:** Added a "Branding" section to the Site Settings, allowing administrators to replace the Company and Admin Panel logos directly.
- **Dynamic Admin Branding:** The admin panel now dynamically displays the custom logo configured in settings.
- **Version Bump:** Updated application version to v1.1.30.

## Recent Changes (v1.1.29)
- **Color Palette Selector:** Transformed the "Capabilities" page into an interactive "Color Palette Selector" tool.
- **Dynamic Brand Theming:** Implemented a system to showcase and preview various color schemes with variable background shades and color combinations.
- **Interactive Preview UI:** Developed a high-fidelity preview interface that reacts in real-time to selected brand tokens.
- **New Asset:** Created `lib/palettes.ts` to manage curated color architectures.
- **Version Bump:** Updated application version to v1.1.29.

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
