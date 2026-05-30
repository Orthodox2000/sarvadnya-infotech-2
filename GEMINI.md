# Project Conventions

## Versioning
- Always mention the application version number when presenting changes or updates.
- Versioning follows the format `v1.1.x`.
- Increment the patch version automatically for every iteration/significant set of changes.
- Current Version: v1.1.308

## Recent Changes (v1.1.308)
- **Modal UX Optimization (Scroll Lock):** Implemented a robust scroll-lock mechanism across all primary interactive components.
    *   **Universal Scroll Prevention:** Integrated `useEffect` hooks in `UnifiedContactModal`, `JobApplicationModal`, `ModuleModal`, and all detail popups (`DescriptionPopup`, `ServiceDetailPopup`) to disable background scrolling when active.
    *   **Focused Interaction:** Prevents the background content from shifting or scrolling while a user is filling out a form or reading detailed information, ensuring a more stable and focused mobile and desktop experience.
- **Syntax Resolution:** Fixed a mismatched React Fragment in `HomeHero.tsx` that caused a parsing error after the modal relocation.
- **Version Bump:** Updated application version to v1.1.308.

## Recent Changes (v1.1.307)
- **UI Layering & Stacking Context Optimization:** Resolved persistent issues where modals and contact forms appeared behind the navigation header.
    *   **Universal Modal Elevation:** Standardized the z-index of all primary interactive modals (`UnifiedContactModal`, `JobApplicationModal`, `ModuleModal`, and `DescriptionPopup`) to `z-[100000]`, ensuring they remain on top of all other elements including sticky headers and news tickers.
    *   **Stacking Context Fix:** Relocated the `UnifiedContactModal` in `HomeHero.tsx` outside of the `main` tag to bypass the container's opacity-driven stacking context, restoring perfect visibility.
    *   **Cross-Page Synchronization:** Updated all specialized service and product pages to use the new standardized layering architecture.
- **Version Bump:** Updated application version to v1.1.307.

## Recent Changes (v1.1.306)
- **Partner Identity & Display Refinement:** Finalized the correction for Partner 2's identity and visual presentation.
    *   **Full Name Update:** Updated the name variable to **'Mr. Pranit Sawant'** across the `About` page defaults, `Admin` configuration, and `sync_data` scripts.
    *   **Display Precision:** Refined the JSX in `app/about/page.tsx` to exactly match the user's request, removing the hardcoded ", Partner" suffix to present the name as a standalone authoritative title.
- **Version Bump:** Updated application version to v1.1.306.

## Recent Changes (v1.1.305)
- **AI Chat UX Enhancement (Focus Management):** Optimized the interaction flow for "Ask Sara" to ensure a more seamless and consistent chat experience.
    *   **Autofocus on Open:** Implemented an `inputRef` and `useEffect` hook in `QuickSupportModal.tsx` to automatically focus the chat input field as soon as the panel is opened.
    *   **Focus Retention:** Added logic to ensure the input field regains focus immediately after a user sends a message and once the AI assistant finishes its response, allowing for uninterrupted conversation.
- **Version Bump:** Updated application version to v1.1.305.

## Recent Changes (v1.1.304)
- **Partner Identity Correction:** Corrected the name and biography of the second partner to reflect the current leadership.
    *   **Name Correction:** Updated all occurrences of 'Mr. Madhukar Sawant' to **'Pranit Sawant'** across the `About` page, `Admin` configuration, and database synchronization scripts.
    *   **Biography Refinement:** Overhauled the partner's quote and biography in `app/about/page.tsx` to align with Pranit Sawant's role in driving digital transformation and modernizing business infrastructure.
    *   **Data Integrity:** Synchronized the default state in `app/admin/pages/page.tsx` and the `scripts/sync_data.mjs` utility to ensure the corrected identity persists across database resets.
- **Version Bump:** Updated application version to v1.1.304.

## Recent Changes (v1.1.303)
- **Visual Polish & Theme Synchronization:** Finalized the transition to the "Deep Blue" brand identity across all user-facing forms and interactive elements.
    *   **Support Button Refinement:** Removed the redundant and "jumping" "Ask Sara" badge from the support button in `SupportButton.tsx` for a cleaner, more stable UI.
    *   **Unified Submission Theme:** Overhauled `UnifiedContactModal.tsx` to align with the new brand palette, replacing all legacy purple/indigo elements with high-contrast Deep Blue (#0371a3) and Bright Blue (#00ABE4) accents.
    *   **Admin Dashboard Sync:** Updated the admin submissions dashboard to use theme-consistent sky-blue and deep-blue badges for inquiry types, eliminating remaining violet tones.
    *   **Hero Wording Optimization:** Enhanced the primary Tally-related hero slides with more sophisticated and diverse messaging, including "Navi Mumbai's Premier Tally Solutions Partner" and "Revolutionizing Business with Smart Tally Automation".
- **Version Bump:** Updated application version to v1.1.303.

## Recent Changes (v1.1.302)
- **Ask Sara Search & Sitemap Integration:** Enhanced discoverability and accessibility of the AI Assistant.
    *   **Search Awareness:** Integrated "Ask Sara" into the Search API (`siteMap` and `staticPages`) and the `SEMANTIC_INDEX`. Search queries for "ai", "chat", or "sara" now directly suggest the AI assistant.
    *   **Dynamic Interaction:** Updated the search results page to handle "Ask Sara" results by triggering the chat modal instead of standard navigation.
    *   **Sitemap Expansion:** Added a virtual `/ask-sara` route to the dynamic XML sitemap (`app/sitemap.ts`) and the AI-readable `SITEMAP.md`.
    *   **Governance & SEO:** Implemented a "not open" strategy by disallowing `/ask-sara` in `robots.txt` and creating a dedicated redirect page that guides users back to the homepage while activating the assistant.
- **Version Bump:** Updated application version to v1.1.302.

## Recent Changes (v1.1.301)
- **Hero Component Visibility Enhancement:** Reduced background transparency across all hero elements for a more grounded and solid UI.
    *   **Opacitiy Recalibration:** Increased the base opacity for background atmospheric blobs and `ShapeGrid` patterns by 100% (from 0.1 to 0.2, and 0.2 to 0.4 respectively).
    *   **Solid Foundations:** Bumped the glassmorphism opacities for content badges and feature icon containers (`bg-white/20`), ensuring they maintain a clear presence against the high-energy deep blue gradient.
    *   **Typographic Clarity:** Refined the "Why Choose" subtitle and description text opacities to ensure consistent legibility on the vibrant foundation.
- **Version Bump:** Updated application version to v1.1.301.

## Recent Changes (v1.1.300)
- **Deep Blue Hero Overhaul:** Deployed a high-contrast, vibrant deep blue theme across the hero section.
    *   **Signature Background:** Applied the requested `HSLA(221, 83%, 53%)` to `HSLA(192, 91%, 36%)` gradient as the definitive background for all hero segments.
    *   **Contrast Optimization:** Transitioned all primary typography to crisp white and light-aqua (#70f2f2) to ensure perfect legibility against the darker, high-energy foundation.
    *   **Component Sync:** Updated badges, feature icons, and CTA buttons (White primary / Transparent secondary) to align with the new "Electric Blue" visual identity.
- **Version Bump:** Updated application version to v1.1.300.

## Recent Changes (v1.1.299)
- **Definitive Hero Accent Unification:** Standardized all visual highlights and atmospheric elements to a single accent color (#00ABE4) for maximum brand clarity.
    *   **Single-Color Highlighting:** Removed multi-color gradients from title highlights, replacing them with a crisp Bright Blue-to-Sky-Blue shimmer.
    *   **Unified Atmospheric Glows:** Recalibrated all background blobs and glow effects to use the primary accent color exclusively, eliminating contrasting tints.
    *   **Component Synchronization:** Updated badge backgrounds, icon colors, and interactive button states to align with the standardized single-color aesthetic.
- **Version Bump:** Updated application version to v1.1.296.

## Recent Changes (v1.1.295)
- **Hero Visual Scale Optimization:** Reduced the hero image dimensions by an additional 10% to restore optimal spatial harmony and classic proportions.
    *   **Geometric Calibration:** Set the standard visual mosaic to `scale-[0.8]` and the cloud ecosystem to `scale-[1.0]`.
    *   **Layout Integrity:** Maintained the balanced 1:1 grid split while providing more "breathing room" for text and visual separation.
- **Version Bump:** Updated application version to v1.1.295.

## Recent Changes (v1.1.294)
- **Hero Visual Scale Refinement:** Reduced the hero image dimensions by 10% to achieve a more sophisticated and balanced spatial composition.
    *   **Geometric Adjustments:** Recalibrated the standard mosaic scale to `0.9` and the cloud ecosystem to `1.1`.
    *   **Spatial Integrity:** Maintained the balanced 1:1 grid split while ensuring the larger imagery has enough "breathing room" within the viewport.
- **Version Bump:** Updated application version to v1.1.294.

## Recent Changes (v1.1.293)
- **Unified Hero Color Branding:** Standardized the color palette across all hero segments to match the official "Why Choose Certified Partner?" scheme.
    *   **Palette Synchronization:** Enforced `#232F3E` (Midnight Blue) and `#00ABE4` (Bright Blue) as the global hero colors in the `processHeroData` engine.
    *   **Demo Route Alignment:** Reverted the demo hero colors from experimental cyan to the official brand palette for site-wide consistency.
- **Version Bump:** Updated application version to v1.1.293.

## Recent Changes (v1.1.292)
- **Hero Layout Balancing & Visual Expansion:** Re-engineered the hero section for a symmetrical and prominent presentation.
    *   **1:1 Grid Split:** Updated the hero grid to a perfectly balanced layout (`lg:col-span-6` for both text and visuals), as requested.
    *   **20% Visual Upscaling:** Increased the primary visual mosaic scale (Standard: `scale-[1.0]`, Ecosystem: `scale-[1.2]`) while maintaining proportional distancing to maximize brand impact.
- **Version Bump:** Updated application version to v1.1.292.

## Recent Changes (v1.1.291)
- **Hero Layout Balancing & Visual Upscaling:** Re-engineered the hero section for a more symmetrical and high-impact presentation.
    *   **Balanced Grid:** Updated the hero grid to a 1:1 split (`lg:col-span-6` for both text and visuals), providing a perfectly centered aesthetic on desktop viewports.
    *   **20% Visual Expansion:** Upscaled the image mosaic container and all associated visual layers by 20% (Standard: `scale-[1.0]`, Ecosystem: `scale-[1.2]`) to maximize brand presence while maintaining proportional distancing.
- **Version Bump:** Updated application version to v1.1.292.

## Recent Changes (v1.1.291)
- **Hero Layout Restoration:** Reverted the `HomeHero` component to its stable v1.1.277 configuration to resolve "messed up" layout and image sizing.
    *   **Geometric Stability:** Restored the balanced 8:4 grid split and the reliable `scale-[0.8]` visual container footprint.
    *   **Preserved Upgrades:** Maintained all functional improvements, including the React reference fix, the "Our Custom Tally Modules" line break, and the aqua-to-sky-blue HSLA gradient background.
- **Version Bump:** Updated application version to v1.1.291.

## Recent Changes (v1.1.290)
- **Hero Visual & Typographic Enhancement:** Substantially upscaled the hero section's visual impact and readability.
    *   **Visual Dominance:** Re-calibrated the hero grid to `lg:col-span-7` (Text) and `lg:col-span-5` (Visuals), increasing the image mosaic's maximum footprint to `640px` for a more cinematic presence.
    *   **Advanced Text Wrapping:** Integrated Tailwind's `text-balance` for headlines and `text-pretty` for descriptions, ensuring titles wrap elegantly without awkward line breaks.
- **Version Bump:** Updated application version to v1.1.278.

## Recent Changes (v1.1.277)
- **Aesthetic Upgrade & Stability Fix:** Resolved a critical runtime error and enhanced the visual palette.
    *   **Runtime Resolution:** Fixed the "React is not defined" error in `HomeHero.tsx` by transitioning from `React.Fragment` to shorthand fragment syntax (`<span className="contents">`).
    *   **Custom Signature Background:** Implemented a sophisticated aqua-to-sky-blue gradient (`hsla(180, 79%, 76%, 1)` to `hsla(194, 52%, 92%, 1)`) as the new foundation for the `radiant` hero variant, delivering a fresh and modern "Radiant Sky" aesthetic.
- **Version Bump:** Updated application version to v1.1.277.

## Recent Changes (v1.1.276)
- **Mobile & Hero Layout Refinement:** Polished the interactive and structural elements of the homepage.
    *   **Floating Button Elevation:** Raised the AI and WhatsApp support buttons on mobile viewports (`bottom-24`) to improve visibility and avoid overlap with system-level navigation bars.
    *   **Strategic Title Breaks:** Implemented a forced line break for the "Our Custom Tally Modules" hero title, ensuring a clean "Our Custom Tally" | "Modules" split for better messaging hierarchy.
    *   **Grid Stability Fix:** Resolved a grid-wrap issue by strictly calibrating the hero columns to `lg:col-span-8` (text) and `lg:col-span-4` (visuals), ensuring side-by-side presentation on all desktop and laptop displays.
- **Version Bump:** Updated application version to v1.1.276.

## Recent Changes (v1.1.275)
- **Definitive 2-Line Hero Constraint:** Achieved a strict 2-line limit for hero descriptions on all desktop viewports.
    *   **Maximized Text Column:** Further increased the hero text container to `lg:col-span-8` (~66% width), providing ample horizontal space for detailed cloud and backup messaging.
    *   **Visual Side Calibration:** Synchronized the visual side to `lg:col-span-4` to maintain a balanced, premium composition while prioritizing textual readability.
- **Version Bump:** Updated application version to v1.1.275.

## Recent Changes (v1.1.274)
- **Hero Description Compaction:** Enforced a strict 2-line limit for hero descriptions on desktop viewports.
    *   **Grid Re-proportioning:** Shifted the hero layout to a 12-column grid, increasing the text column width to `lg:col-span-7` (~58% width).
    *   **Horizontal Expansion:** Upscaled the description paragraph to `max-w-4xl` to utilize the additional column space, successfully preventing text from breaking into a third line.
- **Version Bump:** Updated application version to v1.1.274.

## Recent Changes (v1.1.273)
- **Hero Layout Optimization:** Expanded the horizontal footprint of the hero text area to accommodate longer descriptions.
    *   **Spatial Expansion:** Increased the text container max-width to `800px` and the description paragraph to `max-w-3xl`.
    *   **Improved Readability:** Reduced premature text wrapping, ensuring that detailed messaging (specifically for cloud and backup solutions) remains authoritative and visually balanced.
- **Version Bump:** Updated application version to v1.1.273.

## Recent Changes (v1.1.272)
- **Dynamic Hero Color Engine:** Re-engineered the `HomeHero` component to be fully responsive to database-driven color schemes.
    *   **Creative Variant Synchronization:** Replaced all hardcoded blue values in the `creative` variant with dynamic `colorFrom` and `colorTo` variables for background effects, gradients, and interactive elements.
    *   **Demo Hero Customization:** Applied the requested `#70f2f2` (Bright Cyan) color to the `/demo` route hero, achieving a vibrant and distinct visual identity.
- **Version Bump:** Updated application version to v1.1.272.

## Recent Changes (v1.1.271)
- **Hero Highlight Refinement:** Isolated specific keywords for improved messaging focus in the cloud segment.
    *   **Cloud Slide Precision:** Updated the highlighting engine to target **only "Reliable" and "Backup"** in the cloud title, removing the highlight from "Zero-Loss" to align with user branding preferences.
- **Version Bump:** Updated application version to v1.1.271.

## Recent Changes (v1.1.270)
- **Mobile UI Fix - Oval Icon Resolution:** Resolved a visual issue where prefix circles and check icons would appear oval on mobile devices due to flex compression.
    *   **Geometric Stability:** Integrated the `shrink-0` utility into icon containers across `HomeHero`, `Products`, and `Corporate Training` pages.
    *   **Responsive Integrity:** Ensured that all list indicators maintain their intended round or square aspect ratios regardless of text wrapping or viewport constraints.
- **Version Bump:** Updated application version to v1.1.270.

## Recent Changes (v1.1.269)
- **Hero Design Precision Upgrades:** Finalized the aesthetic and interactive patterns for the `HomeHero` component.
    *   **Isolated Highlighting:** Recalibrated the shimmering gradient engine to highlight **only "90%"** in support slides, ensuring optimal messaging focus.
    *   **Unified CTA Branding:** Standardized all primary action buttons to the official Midnight Blue (`#232F3E`) to achieve absolute consistency with the site-wide navigation.
    *   **Imagery Naturalization:** Eliminated all remaining `grayscale` filters from sub-images and backdrop layers, restoring a vibrant and cohesive color palette across the mosaic.
    *   **Button Typography Sync:** Synchronized font scales (`text-[11px]`) and weights across both primary and secondary button variants.
- **Version Bump:** Updated application version to v1.1.269.

## Recent Changes (v1.1.268)
- **Hero Detail & Highlight Refinement:** Fine-tuned the `HomeHero` visual logic and interaction patterns.
    *   **Precision Highlighting:** Updated the shimmer engine to isolate the "90%" keyword in blue for support slides, improving messaging hierarchy.
    *   **Button Synchronization:** Unified primary and secondary buttons with consistent dimensions (`px-7 py-3.5`), border radius (`rounded-xl`), and crisp typography (`text-[11px]`).
    *   **Imagery Restoration:** Removed remaining grayscale filters from all sub-images and backdrop layers to restore natural, vibrant brand colors.
    *   **Mosaic Layering:** Permanently positioned the secondary image at the top-right with high-priority layering (`z-50`) to appear on top of the central visual.
- **Version Bump:** Updated application version to v1.1.268.

## Recent Changes (v1.1.267)
- **Hero Spatial & UI Refinement:** Optimized the `HomeHero` for a more balanced and professional aesthetic site-wide.
    *   **Vertical Spacing Relaxation:** Slightly increased internal gaps (reverted to `space-y-5`) to eliminate the "squished" feel while preserving the compact, high-density layout.
    *   **CTA Button Downsizing:** Reduced primary and secondary button dimensions by 15% (`px-7 py-3.5`) and refined typography to `text-[11px]` for a more elegant, "fine-art" presence.
    *   **Typographic Hierarchy:** Scaled down the brand badges (`text-[9px]`) and sub-text descriptions for improved readability and focus on the main headlines.
    *   **Elevated Visual Positioning:** Permanently moved the image mosaic container higher on desktop viewports (`lg:-mt-16`) to achieve a more cohesive integration with the site header.
- **Version Bump:** Updated application version to v1.1.267.

## Recent Changes (v1.1.266)
- **Site-Wide Creative Hero Upgrade:** Applied the "Creative" formatting and color scheme to the main landing page.
    *   **Aesthetic Synchronization:** Integrated the sophisticated mesh gradient foundation and floating glassmorphism shapes site-wide.
    *   **Geometric Refinement:** Applied the 20% size reduction to all visual mosaic cards and logos for a more elegant, premium feel.
    *   **Factual Preservation:** Maintained all existing database-driven text and data, ensuring the upgrade is purely visual and stylistic.
- **Version Bump:** Updated application version to v1.1.266.

## Recent Changes (v1.1.265)
- **Refined Creative Demo Aesthetics:** Fine-tuned the `/demo` route visuals for a more compact and premium feel.
    *   **Geometric Scaling:** Reduced the size of all visual mosaic cards, floating shapes, and logos by 20%, resulting in a more elegant and less crowded layout.
    *   **Background Optimization:** Removed the rotating dashed ring and shifted the mesh gradient palette to "cooler" cyan (`#7dd3fc`) and deep blue tones.
    *   **Subtle Textures:** Lowered the `ShapeGrid` opacity to 20% and reduced animation speeds to create a more sophisticated, low-profile interactive background.
    *   **Enhanced Depth:** Added unique multi-layer glow effects and refined glassmorphism borders for improved visual hierarchy.
- **Version Bump:** Updated application version to v1.1.265.

## Recent Changes (v1.1.264)
- **HomeHero Component Restoration:** Resolved a critical parsing error ("Expected '</', got '<eof>'") caused by truncated file content.
    *   **Full Implementation:** Restored all logic for `standard`, `radiant`, and `creative` variants, ensuring 100% syntactical integrity.
    *   **Placeholder Removal:** Eliminated all inadvertent placeholders to prevent future build failures.
- **Ultra-Creative Finalization:** Solidified the visual identity of the `/demo` route.
    *   **Vibrant Foundations:** Confirmed the implementation of multi-layer mesh gradients and floating 3D geometry for the `creative` variant.
    *   **Professional Depth:** Synchronized high-energy visual effects with authoritative brand-blue accents and navbar-consistent palettes.
- **Version Bump:** Updated application version to v1.1.264.

## Recent Changes (v1.1.263)
- **Ultra-Creative Demo Experience:** Delivered a high-impact visual overhaul for the `/demo` route.
    *   **"Creative" Hero Variant:** Implemented a sophisticated multi-layer mesh gradient foundation with moving light leaks and floating glassmorphism geometry (spheres and 3D cards).
    *   **3D Visual Stack:** Upgraded the visual side with a dynamic parallax stack, including a dashed orbiting ring and enhanced shadow depth for a true "3rd dimension" feel.
    *   **Vibrant Typography:** Expanded the highlight engine to support "Revolutionize", "Smart", and "Potential" with multi-color shimmering gradients.
    *   **Interactive Professionalism:** Balanced the high-energy visuals with strict adherence to the Navbar's midnight palette (#232F3E) and high-contrast professional typography.
- **Version Bump:** Updated application version to v1.1.263.

## Recent Changes (v1.1.262)
- **Demo Aesthetics Overhaul:** Significantly enhanced the `/demo` route with a premium, high-impact visual identity.
    *   **Radiant Hero Variant:** Implemented a new `radiant` mode for `HomeHero` featuring a cinematic `#dff0f5` (Radiant Sky) background.
    *   **Dynamic Visual Depth:** Added pulsing atmospheric glows (Brand Blue/Bright Blue) and increased `ShapeGrid` definition to eliminate "dullness" while preserving the light-theme directive.
    *   **Typography Precision:** Upgraded the title highlight engine to support "Witness", "Future", and "Automation" keywords with shimmering multi-color gradients.
    *   **Interaction Refinement:** Synchronized primary CTA buttons with the Navbar's midnight palette (`#232F3E`) for a more authoritative presence.
- **Version Bump:** Updated application version to v1.1.262.

## Recent Changes (v1.1.261)
- **Demo Route Hero Synchronization:** Integrated the production-grade `HomeHero` into the `/demo` route.
    *   **Placement:** Positioned the cinematic hero at the absolute top of the demo page, replacing the legacy dark-themed placeholder.
    *   **Light Theme Enforcement:** Maintained a pure white background (`bg-white`) with high-contrast typography, adhering to the "light theme only" directive.
    *   **Navbar Palette Sync:** Synchronized all hero accents and primary text with the navbar's midnight blue (`#232F3E`) and official bright blue (`#00ABE4`).
    *   **Content Optimization:** Provided attractive, demo-specific content highlighting live dashboards, WhatsApp integration, and cloud simulations.
- **Global Brand Color Synchronization:** Updated the primary "Midnight" color spectrum site-wide.
    *   **Palette Alignment:** Transitioned from legacy `#131921` to the official navbar-matching `#232F3E` across the `HomeHero` component logic and visual layers.
    *   **Dynamic Data Support:** Enhanced `processHeroData` to respect custom `colorFrom` and `colorTo` fields, allowing for slide-specific branding overrides.
- **Version Bump:** Updated application version to v1.1.261.

## Recent Changes (v1.1.260)
- **Finalized Tutorial Card Compaction:** Achieved maximum vertical efficiency for the resource gallery.
    *   **Label Elimination:** Removed explicit "Webinar" and "Article" text labels, relying on visual icons to distinguish resource types.
    *   **Geometric Tightening:** Reduced internal padding to `p-4` and minimized vertical margins between metadata, title, and tags.
    *   **CTA Streamlining:** Shortened the primary action button to a concise "Explore" label with reduced vertical padding.
- **Version Bump:** Updated application version to v1.1.260.

## Recent Changes (v1.1.259)
- **Video Card Geometry Optimization:** Resolved the "squished" aesthetic while significantly reducing vertical footprint.
    *   **Proportional Restoration:** Transitioned video thumbnails to standard `aspect-video` (16/9), eliminating the overly compressed 16/6 look.
    *   **Aggressive Compaction:** Removed descriptions from the card view and reduced internal padding (`p-3`), resulting in a truly compact card that doesn't feel "long" despite the larger thumbnail.
- **Version Bump:** Updated application version to v1.1.258.

## Recent Changes (v1.1.257)
- **Mobile Form Compaction:** Optimized the vertical footprint of all contact and application forms for mobile devices.
    *   **Contact Page:** Reduced vertical spacing (`space-y-4`) and input padding (`py-2.5`) for a 10% shorter mobile form.
    *   **Unified Contact Modal:** Scaled down container padding, item gaps, and button heights specifically for mobile viewports.
    *   **Job Application Modal:** Adjusted form margins and internal spacing to ensure better visibility and reduced scrolling on small screens.
- **Version Bump:** Updated application version to v1.1.257.

## Recent Changes (v1.1.256)
- **Productbar Learning Menu Reconfiguration:** Optimized the secondary navigation's educational resources.
    *   **"Learning" Section Overhaul:** Updated the Learning menu in the Productbar to feature two strategic segments: "Video Learning" (deep-linking to the Tutorials hub) and "Capabilities of Tally" (linked to the specialized capabilities showcase).
    *   **Navigation Logic Sync:** Updated `lib/product-nav.ts` with the new labels and descriptions for a consistent megamenu experience.
- **Version Bump:** Updated application version to v1.1.256.

## Recent Changes (v1.1.255)
- **"Old Style" Navbar Overhaul:** Re-implemented the high-contrast dark theme for the primary navigation.
    *   **Midnight Foundation:** Transitioned Navbar background to `#131921` and updated branding text to crisp white.
    *   **Blue Accent Synchronization:** Replaced all red (`#891E1E`) branding and buttons with official blue spectrums (`#00ABE4`, `#0371a3`), fulfilling the "blue and dark" aesthetic request.
    *   **SearchBar Calibration:** Optimized the global search input with low-profile dark transparency and white typography for seamless integration.
- **Tutorial Hub Optimization:** Enhanced the video resource gallery for better information density.
    *   **Card Compaction:** Shortened video thumbnails from `aspect-4/3` to `aspect-video`, reducing vertical footprint.
    *   **Tag Visibility:** Integrated metadata tags directly into the card layout, allowing users to scan topics without opening modals.
- **Version Bump:** Updated application version to v1.1.255.

## Recent Changes (v1.1.254)
- **Navigation Styling Refinement:** Optimized the header hierarchy by isolating the light theme to the primary Navbar.
    *   **Navbar Foundation:** Locked the main Navbar to `#fafafa` with high-contrast `slate-900` typography for a clean, modern aesthetic.
    *   **Productbar Restoration:** Reverted the secondary Productbar to "Midnight Black" (#131921) to maintain brand depth and ensure legibility of white navigation elements.
    *   **Visual Balance:** Synchronized text colors and logo filters across both bars to ensure professional contrast and consistent branding.

## Recent Changes (v1.1.253)
- **TypeScript Build Fix:** Resolved a critical 'IntrinsicAttributes' type error in the homepage.
    *   **Prop Alignment:** Updated the `QuickAccessHub` component to explicitly accept and handle `initialData`, `initialModules`, and `initialSettings` props passed from the server-side home page.
    *   **Dynamic Synchronization:** Implemented `useState` and `useEffect` hooks within the hub to reactively update navigation cards when database-sourced data is provided.
- **Version Bump:** Updated application version to v1.1.253.

## Recent Changes (v1.1.252)
- **Admin Control Restoration:** Re-enabled full text editing capabilities for the About and Team pages.
    *   **Editing UI:** Replaced the branding restriction notice with high-performance form controls for all descriptive text, including hero titles, subtitles, and detailed partner biographies.
    *   **Unified Persistence:** Implemented a "Save All Changes" workflow that synchronizes both visual assets and text content with MongoDB in a single action.
    *   **UX Refinement:** Optimized the admin interface with responsive textareas and real-time state management for a more fluid content management experience.
- **Version Bump:** Updated application version to v1.1.252.

## Recent Changes (v1.1.251)
- **About Page Content Update:** Revised the company and partner biographies for better alignment with current branding and leadership history.
    *   **Strategic Hero Text:** Shortened the main description to focus on the 2008 founding date, 1,500+ client milestone, and core automation expertise.
    *   **Partner Biographies:** Updated profiles for Suman Sawant and Mr. Madhukar Sawant, highlighting specialized finance automation, ICAI lectures, and 15+ years of infrastructure expertise.
- **Version Bump:** Updated application version to v1.1.251.

## Recent Changes (v1.1.250)
- **Site-Wide Visual Standardization:** Completed the transition to pure white foundations across all major public routes.
    *   **Overlay Elimination:** Removed the `bgggg.png` background overlay from all remaining pages including Modules, Capabilities, Products, About, Careers, Contact, Search, and Team.
    *   **High-Contrast Branding:** Set all page headers to solid white (#ffffff) and updated border-accents to the official brand-blue spectrum (`border-[#0371a3]/10`).
    *   **Unified Architecture:** Synchronized the background effects (blurs and glows) across all "use case" related pages for a cohesive, modern professional look.
- **Version Bump:** Updated application version to v1.1.250.

## Recent Changes (v1.1.249)
- **Service Route Standardization:** Unified the visual identity of all pages under the `/services` route.
    *   **Overlay Removal:** Stripped the background image overlay (`bgggg.png`) from all service headers for a cleaner, high-contrast look.
    *   **Pure White Foundations:** Set all service hero backgrounds to solid white (#ffffff) to ensure perfect legibility and a modern aesthetic.
    *   **Unified Blending:** Standardized the cinematic image gradients to use a `from-white via-white/80` transition across all specialized service pages.
- **Version Bump:** Updated application version to v1.1.249.

## Recent Changes (v1.1.248)
- **TSS Page Visual Refinement:** Transitioned the TSS Renewal page hero to a pure white foundation.
    *   **Background Overhaul:** Updated the section background to solid white (#ffffff).
    *   **Seamless Blending:** Re-engineered the cinematic blend gradient to use white anchors (`from-white via-white/80`), ensuring the `/tss-icon.png` asset melts perfectly into the page layout.
- **Version Bump:** Updated application version to v1.1.248.

## Recent Changes (v1.1.247)
- **Service Hub Palette Sync:** Synchronized all service routes with a refined light-sky background for improved cinematic depth.
    *   **Background Optimization:** Updated the primary header background to `#f3fafc` across the main Services directory and all specialized sub-routes (AMC, Training, Mobile, WhatsApp, TDL, TSS).
    *   **Gradient Calibration:** Recalibrated the cinematic image blend gradients to use `#f3fafc` anchors, ensuring a seamless, professional transition between imagery and brand foundations.
- **Version Bump:** Updated application version to v1.1.247.

## Recent Changes (v1.1.246)
- **Mobile App Page Fix:** Resolved an issue where the analytics preview image in the "Data-Driven Decision Making" section was not visible.
    *   **Class Correction:** Fixed an invalid Tailwind class `object-fit` by replacing it with the standard `object-cover` property, ensuring the `/biz.jpg` asset renders correctly across all viewports.
- **Version Bump:** Updated application version to v1.1.246.

## Recent Changes (v1.1.245)
- **Support Hub Remake:** Overhauled the `Learning & Support Hub` for improved content density and user engagement.
    *   **Compact Grid Architecture:** Transitioned to a high-density 5-column grid (xl) with scaled-down cards for maximum visibility of resources.
    *   **Detailed View Integration:** Implemented a new modal-based "Detailed View" system for tutorials, allowing users to inspect full descriptions, metadata, and embedded previews before navigating.
    *   **CTA Optimization:** Streamlined the "Specialized Training" section, reducing its vertical footprint while maintaining high-impact branding and clear action paths.
- **Version Bump:** Updated application version to v1.1.245.

## Recent Changes (v1.1.244)
- **FAQ Call Button Fix:** Resolved a visual issue where the 'Call for Details' SVG icon in the FAQ section appeared only half-colored or misaligned.
    *   **SVG Optimization:** Replaced the legacy phone icon path with a robust, centered solid handset icon and recalibrated the viewBox for perfect alignment.
    *   **Visual Consistency:** Ensured the icon properly inherits brand-blue and white colors across all interaction states (default, hover, active).
- **Version Bump:** Updated application version to v1.1.244.

## Recent Changes (v1.1.243)
- **Services Hub Redesign:** Transitioned the services route to a modern, icon-driven card system.
    *   **Iconic Navigation:** Replaced large hero imagery with professional SVG icons for all service categories (AMC, Training, WhatsApp, TDL, etc.).
    *   **Unified Card Model:** Implemented a high-contrast 4-column grid with standardized interaction feedback and persistent "Rise Up" entrance effects.
    *   **Deep-Link Preservation:** Maintained all specialized routes and detailed deliverable popups, ensuring no loss of technical depth.
    *   **Branding Synchronization:** Aligned the hub with the Brand Blue and Midnight Black palette for a cohesive ecosystem feel.
- **Version Bump:** Updated application version to v1.1.243.

## Recent Changes (v1.1.242)

## Recent Changes (v1.1.214)
- **Definitive Hero Fix & Optimization:** Resolved all persistent branding, animation, and performance issues in the `HomeHero` centerpiece.
    *   **Absolute Title Enforcement:** Implemented a hardcoded title whitelist ("Trusted Tally Partner in Navi Mumbai" & "Reliable Cloud & Zero-Loss Backup") that overrides all database strings, permanently eliminating unwanted suffixes.
    *   **Phase-Based Entry Animations:** Introduced a dedicated `isEntering` state to trigger smooth "Rise Up" entrance effects *after* content swaps, ensuring animations are always visible and stable.
    *   **Carousel Precision:** Calibrated the cycle to a strict 8-second window with distinct Exit (800ms) and Entry (1000ms) phases.
    *   **Image Performance:** Resolved all Next.js browser warnings by adding mandatory `sizes` props to all "fill" hero images and optimizing preloading logic.
    *   **Subtitle Integration:** Properly synchronized the "Why Choose Sarvadnya Infotech LLP?" subtitle with the new animation engine.
- **Version Bump:** Updated application version to v1.1.213.

## Recent Changes (v1.1.212)
- **Homepage Motion Upgrade:** Implemented a unified "Rise Up" scroll animation system across all major landing page sections.
    *   **Intersection Observer Integration:** All sections (Quick Access Hub, Customer Reviews, Home Statistics, FAQ) now utilize the Intersection Observer API for precise scroll-triggered entry.
    *   **Rise Up Aesthetic:** Applied a smooth `translate-y` and `opacity` transition to sections and their child elements, creating a professional "entering the stage" effect.
    *   **Staggered Card Entries:** Implemented cumulative delays for grid items (Quick Access cards, Review cards, FAQ items) to provide a sophisticated, sequential reveal as users scroll.
    *   **Visual Polish:** Refined transition durations (700ms - 1000ms) and easing functions to ensure animations feel premium and responsive across all devices.
- **Version Bump:** Updated application version to v1.1.214.

## Recent Changes (v1.1.213)
- **Universal Title Enforcement:** Implemented a robust data-processing layer to strictly enforce clean hero titles across all slides, regardless of the data source (Server or Client).
    *   **Suffix Stripping:** Forcefully removed all manual branding suffixes (e.g., "- Why Choose Sarvadnya Infotech LLP?") from database strings to prevent redundancy with the permanent JSX subtitle.
    *   **Branding Consistency:** Locked the Tally slide title to "Trusted Tally Partner in Navi Mumbai" and the Cloud slide title to "Reliable Cloud & Zero-Loss Backup".
    *   **Unified Processing:** Refactored the `HomeHero` to process both `initialData` (server-fetched) and dynamic updates through a central `processHeroData` helper, ensuring visual consistency across initial load and carousel cycles.
- **Version Bump:** Updated application version to v1.1.212.

## Recent Changes (v1.1.211)
- **Branding Enforcement & Title Cleanup:** Enforced a clean, professional title for the `HomeHero` and resolved redundant text issues.
    *   **Custom Branding:** Overrode all Tally-related database titles with the requested "Trusted Tally Partner in Navi Mumbai" to ensure absolute consistency.
    *   **Redundancy Removal:** Stripped the manual "Why Choose Sarvadnya Infotech LLP?" suffix from all database strings, as it is now a permanent, standalone UI subtitle.
    *   **Ecosystem Integrity:** Maintained the "Reliable Cloud & Zero-Loss Backup" title for specialized ecosystem slides to preserve content diversity.
    *   **Image Fit Optimization:** Verified that all carousel visuals use the "Blurred Backdrop + Contained Foreground" strategy for uncropped, crystal-clear presentation.
- **Version Bump:** Updated application version to v1.1.210.

## Recent Changes (v1.1.209)
- **Hero Performance & Content Refinement:** Optimized the carousel experience and enhanced the content structure.
    *   **Animation Cleanup:** Removed staggered entry animations to prevent mid-transition resets and flickering. Content now appears immediately upon slide change for a crisper feel.
    *   ** subtitle Integration:** Added the "Why Choose Sarvadnya Infotech LLP?" subtitle in a small, professional font positioned between the badge and main title.
    *   **Precision Timing Fix:** Recalibrated the entire hero engine to maintain a strict 8-second interval, resolving an issue where transitions were significantly delayed.
    *   **Cloud Segment Restoration:** Guaranteed the presence of the "Reliable Cloud & Zero-Loss Backup" segment in the hero loop with its specialized ecosystem layout.
- **Version Bump:** Updated application version to v1.1.207.

## Recent Changes (v1.1.206)
- **Global Network Scroll Animations:** Implemented a high-performance "Appear on Scroll" effect for the `CertifiedPartners` section.
    *   **Intersection Observer:** Integrated the native Intersection Observer API to trigger animations precisely when the section enters the viewport.
    *   **Staggered Entry:** Added cumulative transition delays to partner logos, creating a smooth "wave" entrance effect.
    *   **Visual Polish:** Enhanced partner cards with subtle scaling, shimmer overlays on hover, and high-contrast shadow elevations.
- **Database Synchronization:** Updated the primary `site_content` collection via `bootstrap.mjs` to include the "Reliable Cloud & Zero-Loss Backup" hero segment, ensuring its permanent presence in the carousel.
- **Version Bump:** Updated application version to v1.1.206.

## Recent Changes (v1.1.205)
- **Critical Hero Calibration:** Fixed carousel timing, resolved animation reset glitches, and restored the Cloud & Backup segment.
    *   **Precision Timing:** Calibrated the carousel to an exact 8-second (8000ms) interval, with a faster 800ms transition to maximize content visibility.
    *   **Animation Stability:** Refactored the typing engine and transition states using `useRef` to prevent mid-animation resets and re-render glitches.
    *   **Content Restoration:** Explicitly ensured the "Reliable Cloud & Zero-Loss Backup" segment is always present in the hero loop, even when fetching dynamic data from the API.
    *   **Visual Smoothness:** Optimized entry delays and transition easing to provide a professional, flicker-free cross-fade between slides.
- **Version Bump:** Updated application version to v1.1.205.

## Recent Changes (v1.1.204)
- **Homepage Streamlining:** Removed the `CloudBackupSection` from the main landing page to ensure a more focused and direct user journey. The component remains active on the dedicated Cloud page to preserve technical depth for interested users.
- **Version Bump:** Updated application version to v1.1.204.

## Recent Changes (v1.1.203)
- **Dynamic Hero Pacing:** Adjusted the `HomeHero` slide interval to exactly 8 seconds (8000ms). This provides a faster, more engaging experience for homepage visitors while ensuring sufficient time for entrance animations and core feature readability.
- **Version Bump:** Updated application version to v1.1.203.

## Recent Changes (v1.1.202)
- **Hero Type Safety & Stability Fix:** Resolved a critical TypeScript error and improved carousel reliability.
    *   **Type Assertion:** Explicitly cast the dynamic `layout` property to the union type `'standard' | 'ecosystem'`, resolving the "string not assignable" error.
    *   **Transition Stability:** Reduced the hero slide duration to 30 seconds (down from 50) to provide a better balance between content retention and interactive feedback, ensuring the carousel feels active and functional.
    *   **Dependency Optimization:** Updated the transition engine's `useEffect` to depend on `heroContents.length`, preventing unnecessary interval resets and ensuring a smoother loop.
- **Version Bump:** Updated application version to v1.1.202.

## Recent Changes (v1.1.200)
- **Advanced Hero Layouts & Cloud Page Sync:** Implemented a multi-layout engine for the `HomeHero` and synchronized the Cloud experience.
    *   **Dynamic Layout Switching:** Refactored `HomeHero` to support `standard` (Mosaic) and `ecosystem` (Rotation Group) layouts. The hero now automatically switches to the Ecosystem layout for Cloud-related slides.
    *   **Cloud Page Enrichment:** Transferred the "Cloud & Backup Ecosystem" logic to the dedicated Cloud page, adding a professional infrastructure comparison table and the cinematic ecosystem section.
    *   **Intelligent Image Fit:** Deployed a "Blurred Backdrop + Contained Foreground" strategy across all hero and ecosystem visuals, ensuring 100% visibility of assets without cropping.
    *   **Rotation Group Effect:** Implemented a specialized 3-layer rotating visual stack for the ecosystem layout, featuring AWS and NoSky satellite cards with independent motion.
- **Version Bump:** Updated application version to v1.1.200.

## Recent Changes (v1.1.199)
- **Cloud & Backup Ecosystem Section:** Implemented a new cinematic section on the homepage to highlight Sarvadnya's advanced cloud capabilities.
    *   **Strategic Partnerships:** Showcased official AWS and NoSky Cloud infrastructures with dedicated high-contrast visual cards.
    *   **Feature Integration:** Highlighted Automated Backups (TallyDrive), 100% Uptime, and Zero-Loss security protocols.
    *   **Visual Mosaic:** Created a complex 3-layer visual side using `dedicated-to-cloud-hosting.jpg`, `AWS.png`, and `brand-nosky.webp` with independent hover rotations.
    *   **Universal Consistency:** Standardized the section on a pure white foundation to match the new homepage aesthetic.
- **Version Bump:** Updated application version to v1.1.199.

## Recent Changes (v1.1.198)
- **Maximized Hero Visibility:** Extended the `HomeHero` slide interval to exactly 50 seconds (50000ms). This provides an expansive, stable window for visitors to engage with the cinematic mosaic and core features, prioritizing content retention and professional presence over frequent transitions.
- **Version Bump:** Updated application version to v1.1.198.

## Recent Changes (v1.1.197)
- **Unified White Homepage Foundations:** Standardized all landing page section backgrounds to pure white (#ffffff) to ensure visual consistency across PC and mobile viewports.
    *   **Certified Partners:** Removed the Slate-50 tint in favor of a solid white foundation.
    *   **Home Statistics:** Replaced the light blue background with pure white to match the global aesthetic.
    *   **Quick Access Hub:** Transitioned from a bluish tint foundation to high-contrast white, ensuring all interactive cards "pop" consistently on mobile.
    *   **Cross-Device Continuity:** Eliminated conditional bluish tints that appeared more prominently on mobile devices, achieving perfect synchronization with the new white Hero foundation.
- **Version Bump:** Updated application version to v1.1.197.

## Recent Changes (v1.1.196)
- **Extended Hero Visibility:** Increased the `HomeHero` slide duration to exactly 30 seconds (30000ms). This provides a more deliberate and authoritative pace, ensuring every visitor has ample time to digest the cinematic mosaic, typing animations, and core feature lists before the next transition.
- **Version Bump:** Updated application version to v1.1.196.

## Recent Changes (v1.1.195)
- **High-Contrast White Hero:** Transitioned the `HomeHero` background to pure white (#ffffff) while maintaining structural synchronization with the Midnight headers.
    *   **Typography Overhaul:** Updated titles to Slate-900 and descriptions to Slate-600 for maximum legibility on the light foundation.
    *   **Midnight CTA Synchronization:** Set the primary "Explore" button to Midnight Black (#131921) with white text, creating a direct visual link to the `Navbar` and `Productbar`.
    *   **Mosaic Refinement:** Optimized card borders and shadows to ensure the multi-layered mosaic thrives on a white background.
    *   **Grid Optimization:** Softened the background `ShapeGrid` and `bgggg.png` overlay to provide a clean, modern aesthetic without cluttering the canvas.
- **Version Bump:** Updated application version to v1.1.195.

## Recent Changes (v1.1.194)
- **Midnight Palette Synchronization:** Synchronized the `HomeHero` with the high-contrast "Midnight Black" (#131921) brand scheme to match the `Navbar` and `Productbar`.
    *   **Premium Foundation:** Transitioned hero background to #131921 with white typography and Bright Blue accents.
    *   **Hero Asset Organization:** Created `/public/hero` folder and moved/renamed core hero images (`hero-main.png`, `hero-sub1.png`, `hero-sub2.png`, `hero-logo.png`) for streamlined management.
    *   **Visual Polish:** Updated `ShapeGrid` and animated accents to thrive on the dark background with lower opacity and brand-blue borders.
    *   **Interactive Refinement:** Redesigned hero badges and secondary buttons with glassmorphism and high-contrast dark-mode styling.
- **Version Bump:** Updated application version to v1.1.194.

## Recent Changes (v1.1.193)
- **Standardized Hero Timing:** Adjusted the `HomeHero` slide interval to exactly 8 seconds (8000ms). This ensures a consistent and optimized pace for the carousel, allowing sufficient time for all mosaic transitions and typing animations to conclude before the next content cycle.
- **Version Bump:** Updated application version to v1.1.192.

## Recent Changes (v1.1.191)
- **Intelligent Hero Image Fit:** Implemented a sophisticated dual-layer fit system for all cards in the `HomeHero` mosaic.
    *   **Anti-Cropping Logic:** Transitioned from simple `object-cover` to a "Blurred Backdrop + Contained Foreground" strategy, ensuring 100% visibility of all product and service imagery regardless of original aspect ratios.
    *   **Cinematic Filling:** Used a high-blur (20px+) version of the same image as a subtle background layer to eliminate empty space within the mosaic cards.
    *   **High-Contrast Foundations:** Updated card backgrounds to ultra-clean white and refined internal inset paddings to provide a "framed" gallery feel for fitted assets.
- **Version Bump:** Updated application version to v1.1.191.

## Recent Changes (v1.1.190)
- **Floating Mosaic Hero Visuals:** Overhauled the `HomeHero` visual side with a multi-layered, high-density grid system.
    *   **Quad-Card Architecture:** Implemented a complex grid featuring a Primary Hero card, a grayscale Secondary card, a Contrast Detail card, and a branded Abstract card.
    *   **Asynchronous Transitions:** Each card in the mosaic enters and exits with unique staggered delays and independent parallax offsets, creating a deep 3D-depth effect.
    *   **Creative Presentation:** Integrated grayscale-to-color transitions, orbiting cinematic particles, and floating "Verified Solution" badges for a premium industrial aesthetic.
    *   **Responsive Fluidity:** Optimized the mosaic layout with `cubic-bezier` easing for ultra-smooth "springy" motions on hover and slide changes.
- **Version Bump:** Updated application version to v1.1.190.

## Recent Changes (v1.1.189)
- **Cinematic Double-Stack Hero:** Re-engineered the `HomeHero` visual side with a creative multi-layered stacking effect.
    *   **Layered Visuals:** Implemented a two-card system featuring a high-contrast primary card (Current Slide) and a stylized ghost card (Next Slide Preview) translated to opposite corners.
    *   **Dynamic Motion:** Added complex 3D-transform animations where cards "fly" in opposite directions during transitions and reactively drift on hover.
    *   **Spatial Optimization:** Reduced the hero image container size for a more focused, high-end aesthetic, complemented by an orbiting dashed ring and decorative corner anchors.
    *   **Advanced Overlays:** Integrated glassmorphism content badges and brand-blue tint overlays into the new card system.
- **Version Bump:** Updated application version to v1.1.189.

## Recent Changes (v1.1.188)
- **Homepage Palette Synchronization:** Fully synchronized the landing page and hero section with the "Radiant Sky" brand identity.
    *   **Hero Overhaul:** Updated the `HomeHero` background to the official Radiant Sky foundation (#dff0f5) and integrated the immersive `bgggg.png` overlay at 10% opacity.
    *   **Color Correction:** Replaced legacy indigo/purple defaults and fallbacks with official Brand Blue (#0371a3) and Bright Blue (#00ABE4) spectrums site-wide.
    *   **Section Refinement:** Applied subtle light blue and slate tints to the `CertifiedPartners` and `HomeStat` sections to improve visual hierarchy and section separation while maintaining brand cohesion.
    *   **Typography & Gradients:** Updated the global `text-highlight-gradient` in `globals.css` to the brand-blue palette for a unified high-impact aesthetic.
- **Version Bump:** Updated application version to v1.1.188.

## Recent Changes (v1.1.187)
- **Standard SEO Implementation:** Deployed production-grade sitemap and crawler instructions.
    *   **Dynamic XML Sitemap:** Implemented `app/sitemap.ts` to automatically generate `sitemap.xml`, ensuring all public routes are indexed by Google, Bing, and other search engines.
    *   **Crawler Governance:** Implemented `app/robots.ts` to guide search engine bots, specifically allowing full site crawling while protecting sensitive `/admin` and `/api/admin` routes from public indexing.
- **Version Bump:** Updated application version to v1.1.187.

## Recent Changes (v1.1.186)
- **Header UI Synchronization:** Aligned the vertical dimensions of the global search bar with the primary navigation buttons.
    *   **SearchBar Scaling:** Increased search input vertical padding to `py-2` to match the exact height of the 'Support' and 'Careers' buttons.
- **Version Bump:** Updated application version to v1.1.186.

## Recent Changes (v1.1.185)
- **Services Palette Synchronization:** Completed the final phase of the brand overhaul by synchronizing the Services hub and all specialized sub-routes.
    *   **Hub Overhaul:** Updated the main Services page with the 'Radiant Sky' palette (`#dff0f5` background, Slate-900 typography, and Brand Blue accents).
    *   **Specialized Routes:** Synchronized all dedicated service pages (**AMC**, **Corporate Training**, **Mobile App**, **WhatsApp Integration**, **TDL**, and **TSS**) with modern cinematic heroes and shimmering brand-blue gradients.
    *   **Asset Refresh:** Updated all service imagery to the latest high-resolution assets, including correct cinematic hero photos and process-flow diagrams.
    *   **UX Enhancements:** Refined the service detail popups with high-contrast deliverables and improved interactive feedback.
- **Version Bump:** Updated application version to v1.1.185.

## Recent Changes (v1.1.182)
- **Footer Legal Visibility:** Enhanced the visibility of mandatory legal documents in the site footer.
    *   **Prominent Placement:** Integrated direct links to 'Privacy Policy' and 'Terms & Conditions' into the 'Company Info' column for immediate accessibility.
    *   **Consistent Aesthetic:** Applied high-contrast black weights and interactive brand-blue highlights to the new links to match the premium footer design.
    *   **Bottom Bar Preservation:** Maintained redundant links in the bottom copyright bar for compliance and standard navigation patterns.
- **Version Bump:** Updated application version to v1.1.182.

## Recent Changes (v1.1.181)
- **Admin Access Relocation:** Restructured the primary navigation to prioritize public content while maintaining secure admin access.
    *   **Navbar Cleanup:** Removed the 'Admin' link from the primary navigation header for a cleaner, customer-focused visual experience.
    *   **Productbar Integration:** Relocated administrative access to the 'Company' section of the Productbar megamenu as 'Admin Access'.
- **Version Bump:** Updated application version to v1.1.181.

## Recent Changes (v1.1.180)
- **Desktop Spacing Optimization:** Aggressively reduced the vertical gap between the primary navigation and the hero section on desktop.
    *   **Negative Margin:** Increased the desktop negative top margin to `lg:-mt-10` to pull the hero section further under the transparent navbar area.
    *   **Padding Reduction:** Halved the desktop top padding (`lg:pt-8`) to elevate the headline and description closer to the top of the viewport.
- **Version Bump:** Updated application version to v1.1.180.

## Recent Changes (v1.1.177)
- **Admin Isolation & Typography Refinement:** Decoupled business inquiries from job applications for better data governance.
    *   **Data Isolation:** Reverted the unified submissions view; `/admin/submissions` now exclusively handles business leads, while `/admin/careers` remains the dedicated hub for applicant tracking.
    *   **Column Optimization:** Separated **Contact Person** and **Phone Number** into distinct columns across all submission tables, improving scanability and enabling targeted sorting.
    *   **Typography Overhaul:** Refined the visual weight of the administration panel. Transitioned from heavy `font-black` to balanced `font-bold` and `font-semibold` weights for a more elegant, professional aesthetic.
    *   **Layout Polish:** Standardized table padding and spacing to ensure maximum legibility on high-density displays.
- **Version Bump:** Updated application version to v1.1.177.

## Recent Changes (v1.1.176)
- **Form Submissions Unified Dashboard:** Overhauled the admin submissions management system.
    - Created a unified, tabbed interface to manage both General Inquiries and Job Applications.
    - Implemented advanced multi-column sorting (Date, Name, Type, Service, Experience) with visual indicators.
    - Added a detailed view modal to inspect full submission data and download resumes directly.
    - Fixed form submission logic on the Contact Page, enabling real-time POST requests to the backend with success/loading feedback.
    - Standardized API routes for submissions and applications, including robust DELETE support.
- **Version Bump:** Updated application version to v1.1.176.

## Recent Changes (v1.1.175)
- **Admin Sidebar Enhancement:** Implemented a custom thin scrollbar for the admin navigation.
    - Added `custom-scrollbar` utility with specialized thin styling (5px) and low-profile transparency.
    - Enabled vertical scrolling on the admin sidebar with proper padding for better navigation usability on smaller vertical viewports.
- **Version Bump:** Updated application version to v1.1.175.

## Recent Changes (v1.1.172)
- **AI Search Enhancement:** Expanded the AI sitemap strategy to the search results page.
    - Updated the search summary generator to include interactive navigation buttons (`[[Label|URL]]`) for highly relevant results.
    - Refined the search UI to parse and render these buttons within the "Quick AI Overview" section.
- **Version Bump:** Updated application version to v1.1.172.

## Recent Changes (v1.1.171)
- **AI Chat Navigation Enhancement:** Integrated the site map into the AI Assistant's logic to support direct navigation via interactive buttons.
    - Updated the system prompt with a full knowledge map of the site (Products, Services, Modules, Learning Hub, etc.).
    - Implemented a bracket-based parsing system (`[[Label|URL]]`) that allows the AI to suggest specific pages as clickable buttons within replies.
    - Refined the integrated call-to-action to "Contact Our Team" with professional expert-advice prompting.
- **Version Bump:** Updated application version to v1.1.170.

## Recent Changes (v1.1.169)
- **Search & Capabilities Synchronization:** Refined the search experience and fully synchronized the Capabilities page with the "Radiant Sky" brand identity.
    - Updated the global search placeholder in `SearchBar.tsx` to "Search Sarvadnya..." for improved brand alignment.
    - Overhauled the Capabilities page (`app/capabilities/page.tsx`) with the `#dff0f5` hero background and immersive `bgggg.png` overlay.
    - Transitioned all capabilities typography to high-contrast Slate-900/600 and implemented the shimmering brand-blue gradient for the "Core Capabilities" headline.
    - Upgraded the "Experience the Full Suite" CTA section with a professional Slate-950 foundation and interactive brand-blue elements.
    - Preserved the unique styling and color spectrum of the AI Assistant (bot) to maintain its distinct visual identity.
- **Version Bump:** Updated application version to v1.1.165.

## Recent Changes (v1.1.164)
- **Admin Panel Palette Sync & Locking:** Fully synchronized the administration panel with the "Radiant Sky" brand identity and deprecated the dynamic palette selector.
    - Updated all admin routes (`Dashboard`, `Careers`, `Modules`, `Learning`, `FAQ`, `Reviews`, `News`, `Page Images`, `Assets`, `Settings`) to use high-contrast Slate-900 typography and official Brand Blue (#0371a3) accents.
    - Disabled the 'Theme Palette' functionality to ensure site-wide branding consistency. Commented out all associated navigation links in the `Navbar` and `AdminSidebar`.
    - Implemented a "Locked for Brand Consistency" overlay on the Palette page and disabled all interactive selection logic.
    - Synchronized all admin form inputs, buttons, and status badges with the finalized professional palette.
- **Version Bump:** Updated application version to v1.1.164.

## Recent Changes (v1.1.163)
- **Search Page Palette Sync:** Fully synchronized the Search results page (`app/search/page.tsx`) with the "Radiant Sky" brand identity.
    - Implemented a dedicated hero section with the `#dff0f5` background and immersive `bgggg.png` overlay at 10% opacity.
    - Transitioned the entire page to a high-contrast Slate-900/600 typography system and implemented the shimmering brand-blue gradient for the "Search Results" title.
    - Upgraded all interactive result cards, AI summaries, and empty-state UI with official brand-blue accents (#0371a3).
    - Refined the "Still can't find what you need?" CTA with a high-contrast Slate-950 foundation and interactive brand-blue highlights.
- **Version Bump:** Updated application version to v1.1.163.

## Recent Changes (v1.1.162)
- **Navigation & Hero Refinement:** Optimized the `Productbar` visibility and refined the Products page visual hierarchy.
    - Updated `Productbar` text to be solid white before hover, ensuring maximum contrast and legibility against the dark background.
    - Adjusted the Products page hero headline to remove the gradient from "Editions & Licensing" while maintaining it on "TallyPrime", focusing brand emphasis on the product name.
- **Version Bump:** Updated application version to v1.1.162.

## Recent Changes (v1.1.161)
- **Product Page Title Gradient:** Expanded the shimmering brand-blue gradient to include the "TallyPrime" text in the hero section, creating a unified and high-impact visual hierarchy for the "TallyPrime Editions & Licensing" headline.
- **Version Bump:** Updated application version to v1.1.161.

## Recent Changes (v1.1.160)
- **Product Page Refinement:** Optimized the "Official TallyPrime Partner" badge to a vibrant yellowish-gold aesthetic.
    - Transitioned from the amber spectrum to a brighter yellow palette (`bg-yellow-400/10`, `border-yellow-500/20`, `text-yellow-600`) to eliminate orange tones and ensure a premium, radiant feel.
- **Version Bump:** Updated application version to v1.1.160.

## Recent Changes (v1.1.159)
- **Product Page Refinement:** Upgraded the "Official TallyPrime Partner" badge to a premium golden aesthetic.
    - Implemented a high-contrast amber spectrum (`bg-amber-400/10`, `border-amber-500/20`, `text-amber-700`) with an active pulse animation to emphasize the brand's certified status.
- **Version Bump:** Updated application version to v1.1.159.

## Recent Changes (v1.1.158)
- **Products & Cloud Palette Sync:** Fully synchronized the Products (`app/products/page.tsx`) and Cloud (`app/cloud/page.tsx`) routes with the "Radiant Sky" brand identity.
    - Updated all hero backgrounds to `#dff0f5` and implemented the immersive `bgggg.png` overlay at 10% opacity.
    - Transitioned all page typography to high-contrast Slate-900/600 and implemented brand-blue shimmering gradients for key titles.
    - Upgraded product pricing cards and cloud solution grids with white foundations and professional brand-blue accents (#0371a3).
    - Refined the "Why move Tally to Cloud?" banner with a professional high-contrast layout and interactive brand-blue elements.
    - Synchronized all `DescriptionPopup` modals with the new visual language, including sky-blue foundations and brand-blue accents.
- **Version Bump:** Updated application version to v1.1.158.

## Recent Changes (v1.1.157)
- **Module Section Palette Sync:** Fully synchronized the Modules gallery (`app/modules/page.tsx`), `ModuleCard`, and `ModuleModal` with the "Radiant Sky" brand identity.
    - Updated the hero section background to `#dff0f5` and implemented the immersive `bgggg.png` overlay at 10% opacity.
    - Transitioned all module typography to high-contrast Slate-900/600 and updated the "Industry Logic" keyword with the shimmering brand-blue gradient.
    - Upgraded the "Need a Custom Solution?" CTA section with a professional Slate-950 foundation and interactive brand-blue elements (#0371a3).
    - Refined all interactive cards and modals with brand-blue accents, sky-blue badges, and professional high-contrast layouts.
- **Version Bump:** Updated application version to v1.1.157.

## Recent Changes (v1.1.156)
- **Legal & UX Cleanup:** Standardized site-wide legal documentation and streamlined the user experience.
    - Removed the legacy "Data Caching" consent popup from the entire application.
    - Created dedicated, high-contrast `Privacy Policy` and `Terms & Conditions` pages using the "Radiant Sky" palette.
    - Implemented a mandatory legal disclosure in the Terms stating that product availability may vary depending on stock and regional factors.
    - Standardized the footer copyright notice to "Sarvadnya Infotech LLP. All Rights Reserved." and integrated direct links to all legal documents.
- **Version Bump:** Updated application version to v1.1.156.

## Recent Changes (v1.1.155)
- **Global Services Palette Sync:** Fully synchronized all specialized service pages (`AMC`, `Corporate Training`, `Mobile App`, `WhatsApp Integration`, `TDL`, and `TSS`) with the finalized "Radiant Sky" brand identity.
    - Updated all hero backgrounds to `#dff0f5` and implemented the immersive `bgggg.png` overlay at 10% opacity.
    - Transitioned hero titles to shimmering brand-blue gradients and upscaled typography to high-contrast Slate-900/600.
    - Standardized all CTA sections with compact sizing (50% reduction), Slate-950 foundations, and brand-blue interactive elements.
    - Unified all feature grids and process steps with white foundations and professional brand-blue accents (#0371a3).
- **Version Bump:** Updated application version to v1.1.155.

## Recent Changes (v1.1.154)
- **AMC Service Palette Sync:** Fully synchronized the Tally AMC service page (`app/services/amc/page.tsx`) with the "Radiant Sky" brand identity.
    - Updated the cinematic hero background to `#dff0f5` and added the immersive `bgggg.png` layer at 10% opacity.
    - Transitioned hero typography to high-contrast dark shades (Slate-900, Slate-600) and implemented the shimmering brand-blue gradient for the "Contract (AMC)" keyword.
    - Upgraded feature cards and process steps with white foundations and brand-blue (#0371a3) accents.
    - Redesigned the CTA section with a high-contrast Slate-950 foundation and official brand-blue highlights.
- **Version Bump:** Updated application version to v1.1.154.

## Recent Changes (v1.1.153)
- **Our Team Palette Sync:** Fully synchronized the Team page (`app/team/page.tsx`) with the "Radiant Sky" brand identity.
    - Updated the hero section background to `#dff0f5` and added the immersive `bgggg.png` layer at 10% opacity.
    - Transitioned hero typography to high-contrast dark shades (Slate-900, Slate-600) and implemented the shimmering brand-blue gradient for the "Experts" keyword.
    - Redesigned the team grid with upscaled member cards, white foundations, and brand-blue (#0371a3) accents.
    - Refined the "Employee Culture" and "Team Reviews" sections with professional high-contrast layouts and interactive elevations.
- **Version Bump:** Updated application version to v1.1.153.

## Recent Changes (v1.1.152)
- **Careers Route Palette Sync:** Fully synchronized the Careers page (`app/careers/page.tsx`) with the "Radiant Sky" brand identity.
    - Updated the hero section background to `#dff0f5` and added the immersive `bgggg.png` layer at 10% opacity.
    - Transitioned hero typography to high-contrast dark shades (Slate-900, Slate-600) and implemented the shimmering brand-blue gradient for the headline.
    - Upgraded the "Life at Sarvadnya" perks section with a neutral `bg-slate-50/50` foundation and brand-blue (#0371a3) interactive elements.
- **Version Bump:** Updated application version to v1.1.152.

## Recent Changes (v1.1.151)
- **About Us Palette Sync:** Fully synchronized the About Us page (`app/about/page.tsx`) with the "Radiant Sky" brand identity.
    - Updated the hero section background to `#dff0f5` and added the immersive `bgggg.png` layer at 10% opacity.
    - Transitioned the entire page to a neutral white background with high-contrast dark typography (Slate-900, Slate-600).
    - Upgraded leadership and strategic vision sections with professional brand-blue badges and accents (#0371a3).
    - Refined the masonry gallery with immersive brand-gradient overlays and enhanced interactive elevations.
- **Version Bump:** Updated application version to v1.1.151.

## Recent Changes (v1.1.150)
- **News Route Palette Sync:** Fully synchronized the News route (`app/news/page.tsx`) with the finalized "Radiant Sky" brand identity.
    - Updated global and hero backgrounds to `#dff0f5`.
    - Transitioned all typography to high-contrast dark shades (Slate-900, Slate-600).
    - Implemented the shimmering brand-blue gradient for the hero title.
    - Added the immersive `bgggg.png` background layer with 10% opacity.
    - Updated card accents and category tags to the official brand blue spectrum (#0371a3).
- **Version Bump:** Updated application version to v1.1.150.

## Recent Changes (v1.1.149)
- **Productbar Desktop Optimization:** Substantially increased the visibility and presence of the secondary navigation bar on desktop viewports.
    - Upscaled height from `36px` to `40px` for a more authoritative presence.
    - Increased primary option font size to `13.5px` and expanded horizontal padding to `28px` (`px-7`) for improved legibility and touch targets.
    - Optimized logo spacing and internal gaps to maintain perfect visual balance with the new dimensions.
- **Version Bump:** Updated application version to v1.1.149.

## Recent Changes (v1.1.148)
- **Contact Typography Refinement:** Optimized the Contact page hero typography for the new background image. Transitioned titles and descriptions to high-contrast dark shades (Slate-900, Slate-600) and upgraded the "Touch" keyword with a vibrant brand-blue gradient.
- **Version Bump:** Updated application version to v1.1.148.

## Recent Changes (v1.1.147)
- **Contact Page Background:** Enhanced the Contact page hero section with an immersive background image (`bgggg.png`) while maintaining the brand's light blue foundation.
- **Version Bump:** Updated application version to v1.1.147.

## Recent Changes (v1.1.146)
- **Navbar Dark Theme:** Overhauled the primary navigation header with a high-contrast dark palette.
    - Set background to **Midnight Black (#131921)** and transitioned brand text and links to crisp white.
    - Refined the "Support" button with a **Bright Blue (#00ABE4)** foundation and high-contrast hover states.
- **Contact Gradient Refinement:** Iterated on the Contact hero section with a specific metallic silver gradient for the "Touch" keyword.
- **Version Bump:** Updated application version to v1.1.146.

## Recent Changes (v1.1.145)
- **AI Behavior Refinement:** Trained the AI assistant to be less interrogatory and more polite. It now asks only one polite question at a time to maintain a professional conversational flow.
- **AI Chat UI Upgrade:** Synchronized the `QuickSupportModal` with the **Blue, Sky & White** brand palette. Added a professional "Call Our Team" button within the chat interface that deep-links to the contact section for more detailed assistance.
- **Version Bump:** Updated application version to v1.1.145.

## Recent Changes (v1.1.144)
- **Contact Page Branding:** Synchronized the Contact experience with the **Blue, Sky & White** palette.
    - Replaced legacy indigo/purple with **Bright Blue (#00ABE4)**, **Deep Blue (#0371a3)**, and **Sky Tint (#f0f9ff)**.
    - Upgraded the "Request a Callback" section with a high-contrast Deep Blue foundation and interactive Bright Blue highlights.
- **Version Bump:** Updated application version to v1.1.144.

## Recent Changes (v1.1.143)
- **Footer Palette Refinement:** Darkened the footer's color spectrum for a more authoritative and high-contrast aesthetic. 
    - Shifted the base and gradient start to **Deep Blue (#025b8a)** and implemented a new ultra-dark anchor **(#001a29)** for maximum visual depth.
- **Version Bump:** Updated application version to v1.1.143.

## Recent Changes (v1.1.142)
- **Careers Route Branding:** Synchronized the entire Careers experience (Public Page, Job Accordion, Application Modal) with the **Blue, Sky & White** palette.
    - Replaced legacy indigo/purple with **Bright Blue (#00ABE4)**, **Deep Blue (#0371a3)**, and **Sky Tint (#f0f9ff)**.
    - Upgraded job cards with professional rounded corners and interactive hover elevations.
- **Learning Admin Synchronization:** Fully updated the Learning & Support Hub administration panel with the new brand identity, including high-contrast inputs and authoritative deep blue actions.
- **Admin Shell Overhaul:** Re-engineered the `AdminSidebar` with a modern high-contrast foundation (Slate-950) and Bright Blue highlights.
- **Critical Restoration:** Recovered the `app/careers/page.tsx` file from source control following a corruption event.
- **Version Bump:** Updated application version to v1.1.141.

## Recent Changes (v1.1.140)
- **Learning Route Branding:** Synchronized the 'Learning & Support Hub' with the new Blue, Sky & White palette.
    - Updated search bar and folder tabs with **Bright Blue (#00ABE4)** and **Deep Blue (#0371a3)** interactive states.
    - Re-styled tutorial cards with **Light Blue (#E9F1FA)** borders and atmospheric hover effects.
    - Upgraded the 'Specialized Training' section with a high-contrast Deep Blue foundation and atmospheric glow effects.
- **Version Bump:** Updated application version to v1.1.140.

## Recent Changes (v1.1.139)
- **Search Deep-Linking:** Upgraded the search engine to provide direct, exact links to specific module details (`/modules?id=...`) and specialized service pages (AMC, TDL, TSS, etc.), eliminating generic category redirects.
- **AI-Readable Sitemap:** Created a comprehensive `SITEMAP.md` file that maps the entire site architecture. This serves as a foundational knowledge source for AI assistants and improves user discoverability of core services.
- **Expanded Search Map:** Refined the internal search siteMap to include all 6+ specialized service categories, ensuring maximum coverage for AI recommendations and keyword matching.
- **Version Bump:** Updated application version to v1.1.136.

## Recent Changes (v1.1.135)
- **Search Experience Optimization:** Re-engineered the search workflow to provide more intelligent and proactive assistance.
- **AI-Generated Search Summaries:** Integrated a "Quick AI Answer" feature that summarizes how the search results relate to the user's query, providing instant context.
- **"No Exact Match" Intelligence:** Implemented specific messaging for cases where no title matches the query perfectly, clearly distinguishing between exact and partial matches.
- **Proactive Support Integration:** Added a persistent help footer to the search page, encouraging users to contact the support team or use the AI Chatbot for more complex inquiries.
- **Version Bump:** Updated application version to v1.1.135.

## Recent Changes (v1.1.134)
- **Navbar Logo Integration:** Enhanced the primary navigation by adding a dedicated, square company logo (favicon-derived) right before the brand name. This strengthens brand identity while maintaining the professional "Certified Tally Partner" badge.
- **Improved Visual Consistency:** Applied precise square dimensions (`w-8 h-8` on desktop) and rounded borders to the new logo, ensuring it aligns with the modern, high-contrast UI system.
- **Version Bump:** Updated application version to v1.1.134.

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
