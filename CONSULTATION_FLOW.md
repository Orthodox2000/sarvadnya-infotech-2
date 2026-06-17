# Find Solution: Strategic Consultation Engine

This document defines the logic, flow, and knowledge base for the interactive consultation engine located at `/find-solution`.

## Overview
The "Find Solution" engine is a multi-step questionnaire designed to analyze a business's current state, industry, and scale to provide a prioritized strategic roadmap. It uses a combination of logic-based branching and AI-driven analysis.

---

## 1. Questionnaire Flow (The Tree)

The questionnaire follows a branching logic based on user selections.

### Phase 1: Business Context
| Question ID | Title | Options | Next Step |
| :--- | :--- | :--- | :--- |
| `business_status` | Business Status | New Business | `industry` |
| | | Existing Tally User | `tss_status` |
| | | Migration from Other Software | `industry` |
| `tss_status` | TSS Maintenance | Active / Expired / Not Sure | `industry` |

### Phase 2: Industry Specialization
| Question ID | Title | Options | Next Step |
| :--- | :--- | :--- | :--- |
| `industry` | Industry Vertical | Logistics & Transport | `logistics_focus` |
| | | Manufacturing / ERP | `manufacturing_focus` |
| | | Garment / Fashion | `garment_focus` |
| | | Retail / Trading | `user_scale` |
| | | C&F Agency | `user_scale` |
| `logistics_focus` | Fleet Operations | Own Fleet Mgt / Brokerage | `user_scale` |
| `manufacturing_focus` | Production Detail | Wastage Tracking / Basic BOM | `user_scale` |
| `garment_focus` | Inventory Logic | Size & Color Matrix / SKU Tracking | `user_scale` |

### Phase 3: Scale & Infrastructure
| Question ID | Title | Options | Next Step |
| :--- | :--- | :--- | :--- |
| `user_scale` | User Capacity | 1 / 2-5 / 6-15 / 15+ Users | `employee_count` |
| `employee_count` | Organization Strength | < 20 / 20-100 / 100+ Employees | `infrastructure` |
| `infrastructure` | Work Model | Local Office / Hybrid / Multi-Branch | `modernization` |

### Phase 4: Modernization & Timing
| Question ID | Title | Options | Next Step |
| :--- | :--- | :--- | :--- |
| `modernization` | Growth Priority | WhatsApp / Mobile App / Excel Automation / Security | `timeline` |
| `timeline` | Timeline | ASAP / Evaluation | **ANALYSIS START** |

---

## 2. Analysis Knowledge Base

The analysis engine maps user answers against the following Sarvadnya Infotech offerings:

### Core Software
- **TallyPrime Silver:** Single User.
- **TallyPrime Gold:** Multi-User.
- **TallyPrime Server:** Enterprise level (50+ users).

### Cloud Solutions
- **AWS Cloud for Tally:** Official partnership for reliable hosting.
- **Windows Dedicated VM:** Full desktop experience on cloud.
- **NoSky Backup:** Automated encrypted cloud backup.

### Vertical Modules (Industry Specific)
- **Logistics & Transport:** Fleet management, trip sheets.
- **C&F Agencies:** Container tracking.
- **Housing Societies:** Maintenance billing.
- **Garment Module:** Size/Color/Fabric matrix.

### Utility Modules
- **Excel to Tally Import:** Bulk data automation.
- **Sales & Commission Automation.**

### Services
- **Tally AMC:** Priority annual support.
- **TDL Customization:** Bespoke feature development.
- **Corporate Training.**
- **Tally on Mobile:** Real-time reporting.
- **Tally to WhatsApp:** Direct document sharing.

---

## 3. Analysis Logic (Strategic Rules)

The AI Analyst (Senior Strategic Unit) follows these internal rules when generating the roadmap:

1. **Precision Rule:** If recommending "TDL Customization", it must be descriptive and industry-specific (e.g., "Brokerage Commission Reconciliation TDL").
2. **Category Prioritization:** Recommendations are categorized into CORE SOFTWARE, CLOUD, SECURITY, AUTOMATION (TDL), MOBILE, COMPLIANCE, and TRAINING.
3. **Priority Levels:** CRITICAL, HIGH, or STRATEGIC.
4. **Collective Voice:** Uses "We recommend" or "Our Unit suggests" for professional authority.
5. **Sanitization:** Automatically strips all markdown markers (asterisks, bold markers) for a clean UI presentation.

---

## 4. Visual & Theme Architecture

The consultation engine is built on the "Deep Blue" and "Radiant Sky" brand identity:
- **Primary Colors:** Bright Blue (`#00ABE4`), Deep Blue (`#0371a3`), Midnight (`#0f172a`).
- **Foundations:** Pure White (`#ffffff`) with Sky Blue tints (`#f0f9ff`, `#e0f2fe`).
- **Interactive States:** High-contrast borders, shadow-elevated cards, and smooth HSLA-based atmospheric blobs for cinematic depth.
- **Density:** High-density "Dashboard" aesthetic with scaled-down interactive elements for vertical efficiency.

---

## 5. Admin Integration & Lead Capture

### Lead Implementation Protocol
When a user clicks "Ready for Growth?", a specialized **Lead Capture Modal** is activated:
- **Data Points:** Full Name, Work Email, Phone Number, Business Name.
- **Validation:** Strict numeric enforcement for phone numbers (allows only digits and '+').
- **Submission:** Results are bundled with the user's answers and AI advice and sent to `/api/contact`.

### Admin Dashboard Traceability
- **Submissions Hub:** All consultation leads are automatically stored in the `form_submissions` collection.
- **Real-Time Stats:** The Admin Dashboard (`/admin`) tracks these leads under the "Submissions" stat card.
- **Inspection:** Administrators can view the full strategic roadmap and questionnaire history within the Submissions management interface.

---

## 6. Technical Implementation
- **Location:** `app/find-solution/page.tsx`
- **Model:** Groq Llama-3.3-70b-versatile (via `/api/chat`)
- **State Management:** React `useState` for tracking `history` (path) and `answers`.
- **Formatting:** Results are parsed from a structured "TABLE_START...TABLE_END" format generated by the AI.
- **Version Tracking:** Operates under Strategic Protocol v1.1.361+.
