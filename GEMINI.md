# Project Conventions

## Versioning
- Always mention the application version number when presenting changes or updates.
- Versioning follows the format `v1.1.x`.
- Increment the patch version automatically for every iteration/significant set of changes.
- Current Version: v1.1.133

## Recent Changes (v1.1.133)
- **Aggressive Cache Revalidation:** Drastically reduced the database cache revalidation time from 5 hours to 60 seconds across all entities (Settings, Content, Modules, Partners, etc.). This ensures that database updates, including image path changes, are reflected nearly instantly while maintaining basic server-side performance benefits.
- **Version Bump:** Updated application version to v1.1.133.

## Recent Changes (v1.1.132)
- **Dynamic Hero Visuals:** Updated the `HomeHero` visual side to dynamically pull the image source from the database (`current.image`), ensuring content flexibility across slides.
- **Visual Scale Optimization:** Re-engineered the hero image container to maintain a perfect 1:1 (square) aspect ratio and occupy the full width of its grid column, providing a more impactful and balanced presence.
- **Refined Image Presentation:** Applied `object-cover` to the dynamic images to ensure they fill the square container entirely without white gaps, maintaining the high-end immersive aesthetic.
- **Version Bump:** Updated application version to v1.1.132.

## Recent Changes (v1.1.131)
- **Hero Branding Integration:** Re-engineered the `HomeHero` visual section to include a high-impact, immersive branding overlay. Replaced the static card with a full-fill `BG3-1.png` background and professional text overlay ("Certified Tally Partner", "Verified Solutions Since 2008").
- **Partner Grid Restoration:** Reverted the `CertifiedPartners` section from a billboard banner back to its professional industry logo grid, ensuring a balanced ecosystem display.
- **Visual Depth Enhancement:** Added sophisticated gradient overlays, backdrop blurs, and corner decorations to the hero visual to align with the premium high-contrast design system.
- **Version Bump:** Updated application version to v1.1.131.

## Recent Changes (v1.1.130)
- **Productbar Compaction:** Reduced the product navigation bar height by 30% (from 40px to 28px on desktop, and 28px to 20px on mobile).
- **Responsive UI Refinement:** Scaled down navigation icons, logos, and typography to ensure perfect fit and legibility within the more compact vertical space.
- **Improved Layout Density:** Optimized internal padding and gap spacing across all header navigation elements for a more streamlined user experience.
- **Version Bump:** Updated application version to v1.1.129.

## Recent Changes (v1.1.128)
- **News Feed Compaction:** Reduced the top news feed height by 50% (from 40px to 20px) for a more streamlined and professional header layout.
- **UI Scaling:** Synchronized the news feed loading skeletons and container heights across the application to ensure layout stability.
- **Version Bump:** Updated application version to v1.1.128.

## Recent Changes (v1.1.127)
- **Deep Content Enrichment:** Refined 'Cloud Solutions' and 'Products & Licensing' pages by removing all 'limitations' to present a more authoritative and professional brand image.
- **'What You Get' Sections:** Implemented a new "What You Get:" section in product and cloud popups, highlighting high-value inclusions like Official AWS, PrimeBanking, and Perpetual Licensing.
- **Documentation Sync:** Updated `products.md` and the AI Assistant system prompt to reflect the growth-oriented messaging and the latest TallyPrime 7.0 feature sets.
- **Version Bump:** Updated application version to v1.1.127.

## Recent Changes (v1.1.126)
- **Dedicated Search Results Page:** Transitioned from live-dropdown search to a request-based model with a dedicated `/search` route. This improves performance and provides a professional "Google-style" results layout.
- **Desktop Visibility Boost:** Optimized the `SearchBar` visibility to appear on all desktop viewports (lg breakpoint and above) for maximum utility.
- **Version Bump:** Updated application version to v1.1.124.

## Recent Changes (v1.1.123)
- **Hero Branding Integration:** Automatically appended the branding slogan "Why Choose Sarvadnya Infotech LLP?" to every hero tagline.
- **Dynamic Content Sanitization:** Implemented logic in the `HomeHero` component to strip trailing punctuation from base taglines before appending the branding suffix, ensuring a clean and professional appearance.
- **Bootstrapping Update:** Refreshed the default hero configurations in both the source code and bootstrap scripts to align with the new branding requirements.
- **Version Bump:** Updated application version to v1.1.122.

## Recent Changes (v1.1.121)
- **Aggressive Mobile Compaction:** Shortened mobile navigation heights to their absolute minimums for maximum vertical content space.
    - **Navbar:** Mobile height reduced to `h-12` (48px).
    - **Productbar:** Mobile height reduced to `h-[28px]`.
- **Mobile-First UI Scaling:** Scaled down all mobile assets and typography to ensure perfect fit without horizontal or vertical overflow.
    - **Logos:** Reduced mobile widths to `w-24` (Navbar) and `w-[14px]` (Productbar).
    - **Typography:** Refined mobile text to `text-[12px]` (Navbar) and `text-[9px]` (Productbar).
- **Desktop Integrity:** Maintained the enhanced `h-16` and `h-[40px]` heights for desktop (lg breakpoint) to preserve widescreen visibility.
- **Version Bump:** Updated application version to v1.1.121.

## Recent Changes (v1.1.120)
- **Responsive Navigation Scaling:** Implemented dynamic height and font-size scaling for the `Navbar` and `Productbar` based on viewport breakpoints.
    - **Mobile/Tablet:** Restored original compact heights (`h-14` for Navbar, `h-[32px]` for Productbar) and base font sizes to ensure layout stability and prevent screen overflow.
    - **Desktop (lg+):** Maintained the enhanced visibility heights (`h-16` for Navbar, `h-[40px]` for Productbar) and upscaled typography for a premium widescreen experience.
- **Smart Logo Scaling:** Added responsive width/height constraints to all header logos, ensuring they scale naturally between mobile and desktop views.
- **Improved Megamenu Anchoring:** Refactored the `Productbar` megamenu to use `top-full` positioning, automatically adapting to the bar's responsive height changes.
- **Version Bump:** Updated application version to v1.1.120.

## Recent Changes (v1.1.119)
- **News Ticker Bulletproofing:** Resolved the persistent "stuck" animation by implementing a React `key` strategy on the marquee container. This forces a clean re-initialization of the CSS animation state whenever new news data is loaded from the server.
- **Animation Integrity:** Renamed internal keyframes and classes to unique identifiers (`news-ticker-scroll`, `animate-marquee-infinite`) to prevent any collisions with legacy CSS or third-party libraries.
- **Maximum Megamenu Visibility:** Achieved the final targeted font sizes for `Productbar` sub-items:
    - Labels: `text-[14px]` with crisp bolding.
    - Descriptions: `text-[12px]` with medium weight and improved line-height.
- **Enhanced Spatial Balance:** Increased internal padding (`p-5`) and expanded container width (`max-w-[480px]`) to ensure the larger text elements breathe correctly within the high-end UI layout.
- **Version Bump:** Updated application version to v1.1.119.

## Recent Changes (v1.1.118)
- **News Ticker Stabilization:** Resolved the "stuck" news bar issue by re-engineering the marquee animation with GPU-accelerated `translate3d` and enforced `animation-play-state`. Moved animation definitions to the CSS root for maximum precedence.
- **Megamenu Visibility Boost:** Further increased font sizes for `Productbar` sub-items and descriptions (+15%). 
    - Sub-item labels: `text-[13px]` → `text-[14px]`.
    - Descriptions: `text-[11px]` → `text-[12px]`.
- **Layout Optimization:** Expanded the megamenu maximum width and internal padding to accommodate larger text without crowding.
- **Improved Hierarchy:** Enhanced nested navigation item visibility and added bold font weight to descriptions for better legibility on high-resolution displays.
- **Version Bump:** Updated application version to v1.1.118.

## Recent Changes (v1.1.117)
- **Navigation Visibility Overhaul:** Substantially increased the height of primary navigation bars for better visual presence.
    - **Navbar:** Height increased from `h-14` (56px) to `h-16` (64px).
    - **Productbar:** Height increased from `h-[31px]` to `h-[40px]`.
- **Typography Upscaling:** Increased base font sizes across all navigation elements by ~15-20% to improve legibility and professional aesthetic.
- **Enhanced Branding:** Adjusted logo scaling and spacing in both headers to maintain perfect proportions with the new heights.
- **Improved Interaction:** Increased horizontal padding and icon sizes in the `Productbar` to provide better touch targets and visual balance.
- **Version Bump:** Updated application version to v1.1.117.

## Recent Changes (v1.1.116)
- **Admin Panel Sync:** Synchronized the `AdminSidebar` version display with the current application build (v1.1.115/v1.1.116).
- **Image Optimization:** Resolved Next.js browser warnings regarding `/logo.png` by implementing modern Tailwind-based aspect ratio controls (`w-[15px] h-auto`) in the `Productbar` component.
- **Maintenance Polish:** Conducted a sweep of hardcoded version strings to ensure global consistency across the administration and public interfaces.
- **Version Bump:** Updated application version to v1.1.116.

## Recent Changes (v1.1.115)
- **AI Chat Robustness:** Re-engineered the `/api/chat` route with a high-availability retry mechanism. The system now shuffles and iterates through all configured Groq API keys if a failure occurs (e.g., account restriction, rate limiting).
- **Intelligent Error Handling:** Added specific detection for `organization_restricted` errors, allowing the assistant to transparently fallback to alternative keys or provide clear account-status feedback to administrators.
- **Improved Distribution:** Transitioned from random rotation to a shuffled-loop strategy, ensuring that every available key is tried before reporting a service outage.
- **Version Bump:** Updated application version to v1.1.115.

## Recent Changes (v1.1.114)
- **Robust Map Rendering:** Re-engineered the `getMapSrc` helper on the Contact page and Footer to use a flexible regex that extracts the source URL from anywhere within an iframe embed string. This resolves the "Map Not Configured" issue when iframes are wrapped in other HTML tags.
- **Unified WhatsApp Update:** Updated the default WhatsApp and Support phone number to `9821309060` across the entire application, including hardcoded fallbacks in the Contact page, Footer, Navbar, Support Button, FAQ, and Quick Access Hub.
- **Dynamic Hover Button:** Ensured the hover support button prioritized database-driven WhatsApp settings with the new default fallback, maintaining full synchronization with the admin panel.
- **Version Bump:** Updated application version to v1.1.114.

## Recent Changes (v1.1.113)

## Recent Changes (v1.1.112)
- **Productbar Mobile Optimization:** Resolved UI issues where "Learning" and "Services" megamenus were overflowing the viewport or appearing too wide on mobile devices.
- **Smart Alignment Logic:** Implemented responsive alignment logic for megamenus: left-aligned for start items (Products, Modules), centered for middle items (Services), and right-aligned for end items (Learning, Company). This ensures menus are always contained within the mobile screen.
- **Improved Visual Balance:** Reduced the maximum width of mobile megamenus to `240px` and width to `85vw` to create a more compact and elegant interface that aligns with modern mobile design standards.
- **Version Bump:** Updated application version to v1.1.112.

## Recent Changes (v1.1.111)
- **News Route Optimization:** Converted the `/news` page into a high-performance Server Component, eliminating redundant client-side fetch calls and improving SEO.
- **1-Hour Data Caching:** Implemented a robust 1-hour caching layer for news data using Next.js `unstable_cache`. This drastically reduces database load and ensures sub-second response times for the news hub and ticker.
- **Smart Cache Invalidation:** Integrated automatic cache purging via `revalidateTag` for all news management operations, ensuring that administrator updates are instantly live while maintaining the benefits of aggressive caching for public visitors.
- **Version Bump:** Updated application version to v1.1.111.

## Recent Changes (v1.1.110)
- **ShapeGrid Build Stabilization:** Resolved a TypeScript error in the `ShapeGrid` component by providing an explicit initial value to the `requestRef` hook. This fix ensures the project passes strict type checking during production builds.
- **Version Bump:** Updated application version to v1.1.110.

## Recent Changes (v1.1.109)
- **Careers Content Expansion:** Enhanced the Careers management system with dedicated fields for "About the Role", "What We're Looking For", and "Why Join Us?".
- **Admin Interface Upgrade:** Integrated high-capacity text areas into the Careers Admin panel, allowing administrators to provide detailed, multi-section job descriptions.
- **Dynamic Job Accordion:** Updated the public `JobAccordion` component to intelligently render the new content sections. Added automatic list formatting (via newline splitting) for the "Looking For" and "Why Join Us?" areas, ensuring a professional and organized presentation of job details.
- **Version Bump:** Updated application version to v1.1.109.

## Recent Changes (v1.1.108)
- **Footer Menu Restoration:** Restored the 5-column footer layout and the "Support on Tally" menu section that was unintentionally modified. Re-synchronized the menu options with the established project structure while preserving the recent server-side settings integration.
- **Version Bump:** Updated application version to v1.1.108.

## Recent Changes (v1.1.107)
- **Desktop Layout Optimization:** Reduced the vertical gap between the `Productbar` and `HomeHero` content on desktop viewports using a negative top margin (`lg:-mt-6`) and adjusted minimum height. Mobile and tablet views remain unaffected to preserve their optimal spacing.
- **Background Softening:** Lightened the hero background color to a soft off-white (`#fafafa`) and reduced the `ShapeGrid` opacity to `50%` for a cleaner, more elegant visual balance.
- **Version Bump:** Updated application version to v1.1.107.

## Recent Changes (v1.1.106)
- **High-Contrast Grid Patterns:** Re-engineered the `ShapeGrid` lightness logic to optimize visibility on light-themed backgrounds. Substituted the legacy "whiter" border logic with a dynamic darkening approach (L-15), ensuring hexagons "pop" with clear definition.
- **Enhanced Pattern Presence:** Increased the `HomeHero` background pattern opacity to `60%`, creating a more vibrant and interactive atmosphere while maintaining brand color synchronization.
- **Version Bump:** Updated application version to v1.1.106.

## Recent Changes (v1.1.105)
- **Hero Visual Refinement:** Completed a comprehensive visual overhaul of the `HomeHero` to perfectly match the new light background. Darkened all typography (Slate-900 titles, Slate-600 descriptions) for maximum contrast and legibility. 
- **Premium Image Presentation:** Redesigned the product visual container with a solid white card, refined Slate-200 borders, and optimized soft shadows, replacing the previous glassmorphism effect for a cleaner, more grounded aesthetic on the light canvas.
- **Improved UI Accents:** Updated badges and secondary CTAs with subtle indigo and slate tints to maintain brand identity while ensuring a professional, modern feel.
- **Version Bump:** Updated application version to v1.1.105.

## Recent Changes (v1.1.104)
- **Light Theme Typography Optimization:** Completely overhauled the `HomeHero` typography and UI elements to perfectly complement the new white ripple background. Transitioned all light-on-dark text to high-contrast dark-on-light shades (Slate-900, Slate-600) and refined brand accents (Indigo-600) for maximum legibility and a clean, modern aesthetic.
- **Version Bump:** Updated application version to v1.1.104.

## Recent Changes (v1.1.103)
- **Upload API Type Fix:** Resolved a TypeScript build error in the Vercel Blob upload route by correcting the SDK property from `addSizeToPlainName` to `addRandomSuffix`. This ensures stable builds while maintaining descriptive, predictable filenames for cloud assets.
- **Version Bump:** Updated application version to v1.1.103.

## Recent Changes (v1.1.102)
- **Responsive Grid Density:** Implemented dynamic `squareSize` for the `HomeHero` background pattern. The grid now automatically scales to `40` on desktop screens and `25` on mobile devices, ensuring optimal visual density and performance across all viewports.
- **Version Bump:** Updated application version to v1.1.102.

## Recent Changes (v1.1.101)
- **Fluid Color Flow:** Re-engineered the `ShapeGrid` component to support internal color interpolation (lerping) and position-based hue shifting.
- **Dynamic Atmosphere:** The hero background now features a smooth, multi-color "flow" that evolves over time and space, while remaining perfectly synchronized with the active slide's brand palette.
- **Improved Performance:** Consolidated the dual-layered grid system into a single, highly efficient canvas renderer that handles both brand tints and "whiter" border highlights natively.
- **Version Bump:** Updated application version to v1.1.101.

## Recent Changes (v1.1.100)
- **Grid Pattern Refinement:** Optimized the `HomeHero` background by reducing the hexagon size to `25` for a denser, more intricate texture.
- **Enhanced Border Visibility:** Implemented a dual-layered grid system to achieve "whiter" hexagon borders while maintaining dynamic color synchronization, significantly improving pattern definition against the dark background.
- **Version Bump:** Updated application version to v1.1.100.

## Recent Changes (v1.1.99)
- **Dynamic Grid Synchronization:** Implemented real-time color synchronization between the `ShapeGrid` and the active hero slide. The hexagon borders and hover effects now reactively update to match each slide's unique brand palette (`colorFrom` and `colorTo`).
- **Background Streamlining:** Removed the legacy "Animated Glow" element to eliminate visual clutter and allow the geometric `ShapeGrid` to serve as the primary immersive background layer.
- **Version Bump:** Updated application version to v1.1.99.

## Recent Changes (v1.1.98)
- **ShapeGrid Enhancement:** Integrated a sophisticated ReactBits-inspired `ShapeGrid` component into the `HomeHero` background. Added support for hexagons, triangles, and circles with dynamic trail effects and slide-synchronized colors.
- **Critical Bug Fix:** Resolved a `ReferenceError: fetchWithCache is not defined` in the `CertifiedPartners` component by adding the missing client-api import.
- **Workspace Cleanup:** Removed redundant source files for the ShapeGrid component to maintain project hygiene.
- **Version Bump:** Updated application version to v1.1.98.

## Recent Changes (v1.1.96)
- **TypeScript Prop Stabilization:** Resolved "IntrinsicAttributes" errors by correctly defining and implementing props for the `Footer` and `Productbar` components. They now natively accept initial settings data from the server.
- **Robust Data Serialization:** Refined the `serializeData` utility to recursively handle nested objects and explicitly convert MongoDB `ObjectId` instances to strings, preventing Client Component serialization failures.
- **Layout Consistency:** Ensured that the `Productbar` and `Navbar` are synchronized with the same server-fetched settings to prevent "flash of unstyled content" for contact information.
- **Version Bump:** Updated application version to v1.1.96.

## Recent Changes (v1.1.95)
- **Terminology Refinement:** Removed or replaced 'Expert' and 'Experts' labels across the site to maintain a more professional and grounded tone.
- **Support Interface Updates:** Changed '50+ Experts Online' to '50+ Support Team Online' on the Contact page and updated 'Expert Support' to 'Technical Support' in the Hub.
- **AI Chat Branding:** Renamed 'AI Expert' to 'AI Assistant' in the quick support modal and updated associated greeting messages.
- **CTA Updates:** Replaced 'Get Expert Support' with 'Get Priority Support' in the navigation and 'Get Expert Help' with 'Get Professional Help' in the Hub.
- **Version Bump:** Updated application version to v1.1.90.

## Recent Changes (v1.1.89)
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
