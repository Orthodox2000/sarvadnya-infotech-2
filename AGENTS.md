# Project Documentation & Architecture

## Core Mandate: "Never Deny Service"
The application is designed to reflect the company's core values: immediate response, certified expertise, and accessibility for all business sizes.

## Technical Architecture

### 1. Framework & Core Technologies
- **Next.js 16 (React 19):** Utilizing the latest App Router and React Compiler capabilities.
- **Tailwind CSS 4:** For high-performance, utility-first styling.
- **TypeScript:** Strict typing across the codebase for reliability.
- **MongoDB:** Backend data persistence (as seen in `lib/mongodb.ts`).

### 2. Performance Engineering (Optimized for Low-End Systems)
The application implements several advanced optimization strategies to ensure smooth 60fps rendering even on resource-constrained devices:

- **Visibility-Aware Rendering:**
    - Components like `HomeHero`, `CustomerReviews`, and `FAQ` use `IntersectionObserver` to halt animations and transitions when off-screen.
    - **Tab Visibility Management:** The Page Visibility API is used to detect when a user leaves the tab. All animations and timers are paused and "soft reset" upon return to prevent animation stacking and "catch-up" flashes.
    - `content-visibility: auto` is applied globally to skip the rendering of non-visible sections.
- **Computational Efficiency:**
    - **Memoization:** Critical UI components (`Productbar`, `CustomerReviews`, `FAQ`) are wrapped in `React.memo` and use `useCallback` to prevent redundant main-thread work.
    - **Resource Management:** Background scripts (like the `swirl.js` canvas effect) use `Float32Array` for memory-efficient particle management and reduce complexity automatically on mobile devices.
- **Load Timing:**
    - **Lazy Loading:** Non-critical components like `QuickSupportModal` are loaded using `next/dynamic` only when requested.
    - **Image Optimization:** Extensive use of `next/image` with proper `sizes` and `priority` attributes to minimize Layout Shift (CLS).

### 3. Key Components Catalog

| Component | Responsibility | Performance Features |
| :--- | :--- | :--- |
| `HomeHero` | Primary landing content with dynamic slide themes. | `IntersectionObserver` pauses, visibility-aware typing effect. |
| `Productbar` | Apple-style navigation for deep-diving into products. | Memoized icons, `useCallback` click handlers, backdrop-blur. |
| `CustomerReviews` | Displays verified social proof. | Staggered entrance animations, memoized star ratings. |
| `CertifiedPartners` | Showcases network reliability. | Automated Rise-up animations, lazy-loaded partner logos. |
| `FAQ` | Dynamic accordion with keyword search. | `useMemo` for search filtering, partial list rendering (Expandable). |
| `QuickSupportModal` | High-priority lead generation. | Dynamically imported, zero initial bundle impact. |

## Developer Guidelines
- **Surgical Updates:** Always prefer targeted `replace` over complete file rewrites for existing files.
- **Accessibility:** Maintain high contrast ratios and ensure interactive elements have clear focus states.
- **Mobile First:** All new components must be verified for performance and layout on small screens (minimum 360px).
- **GPU Hints:** Use `will-change` and `translateZ(0)` sparingly for elements with complex animations.

---
*Last Updated: 2026-05-12*
