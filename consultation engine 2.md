# IMPLEMENTATION PROMPT: SARVADNYA INFOTECH SMART CONSULTATION ENGINE V2

You are a Senior Product Architect, UX Strategist, Conversion Optimization Expert, Tally Solutions Consultant, and Senior Full Stack Engineer.

Your task is to redesign and implement the existing "Find Solution" consultation engine into a highly optimized business consultation system that:

1. Generates qualified sales leads.
2. Provides genuine business consultation.
3. Recommends Sarvadnya Infotech products and services.
4. Maintains high completion rates.
5. Avoids overwhelming users.
6. Creates trust before requesting contact information.
7. Produces structured business assessment reports.

The system must replace the current basic questionnaire flow.

---

## BUSINESS OBJECTIVE

This consultation engine is NOT a survey.

It is a sales qualification and solution discovery system.

Every question must contribute toward recommending one or more of the following offerings:

CORE PRODUCTS

* TallyPrime Silver
* TallyPrime Gold
* TallyPrime Server

SERVICES

* TSS Renewal
* AMC Support
* Corporate Training
* TDL Customization
* Tally on WhatsApp
* BizAnalyst Mobile App

CLOUD & SECURITY

* AWS Cloud for Tally
* Tally Cloud Hosting
* TallyDrive Backup
* NoSky Backup

VERTICAL MODULES

* Logistics Module
* Manufacturing Module
* Garment Module
* C&F Module
* Industry Specific Solutions

If a question does not help qualify or recommend one of these offerings, remove it.

---

## UX RULES

Maximum visible questions:
15

Maximum options per question:
5

Ideal completion time:
2 to 3 minutes

Do not show unnecessary questions.

Use conditional branching.

Users should only see relevant questions.

Never display technical jargon.

Questions should feel like business consultation.

Not software sales.

---

## QUESTION FLOW

PHASE 1
BUSINESS PROFILE

Question ID:
business_type

Question:
What best describes your business?

Options:

* New Business
* Existing Business
* Growing Business
* Multi-Branch Business
* Enterprise Business

---

Question ID:
industry

Question:
Which industry best matches your operations?

Options:

* Trading & Distribution
* Manufacturing
* Logistics & Transport
* Garments & Fashion
* Services & Others

---

Question ID:
users

Question:
How many people need access to your accounting system?

Options:

* 1 User
* 2-5 Users
* 6-15 Users
* 15-50 Users
* 50+ Users

SCORING

1 User
→ TallyPrime Silver

2-15 Users
→ TallyPrime Gold

50+ Users
→ TallyPrime Server

---

PHASE 2
CURRENT SYSTEM ANALYSIS
-----------------------

Question ID:
current_setup

Question:
How are you currently managing accounts?

Options:

* TallyPrime
* Other Software
* Excel & Manual Work
* Multiple Systems
* Starting Fresh

---

IF TallyPrime

Question ID:
tss

Question:
What is your TSS status?

Options:

* Active
* Expired
* Not Sure

SCORING

Expired
+25 TSS Renewal

Not Sure
+15 TSS Renewal

---

Question ID:
data_location

Question:
Where is your business data stored?

Options:

* Single Computer
* Office Server
* Multiple Locations
* Cloud
* Not Sure

SCORING

Single Computer

* Cloud Opportunity

Multiple Locations

* AWS Cloud

Office Server

* Backup Opportunity

---

PHASE 3
BUSINESS CHALLENGES
-------------------

Question ID:
challenge

Question:
What is your biggest challenge today?

Options:

* Too Much Manual Work
* Inventory Management
* Reporting & Visibility
* Multi-Branch Operations
* Data Security & Backup

---

Question ID:
improvement

Question:
Which area would you most like to improve?

Options:

* Sales Process
* Purchase Process
* Inventory Control
* Financial Reporting
* Staff Productivity

---

Question ID:
excel_dependency

Question:
How often do you rely on Excel?

Options:

* Daily
* Frequently
* Sometimes
* Rarely
* Never

SCORING

Daily

* Automation
* TDL
* Import Tools

---

PHASE 4
GROWTH & AUTOMATION
-------------------

Question ID:
growth_focus

Question:
What would help your business grow faster?

Options:

* Mobile Access
* WhatsApp Automation
* Process Automation
* Better Reports
* Secure Remote Access

SCORING

Mobile Access
→ BizAnalyst

WhatsApp Automation
→ WhatsApp Integration

Process Automation
→ TDL

Secure Remote Access
→ Cloud

---

Question ID:
access_type

Question:
How would you prefer to access your business data?

Options:

* Office Only
* Mobile
* Laptop Anywhere
* Multiple Branches
* Entire Team Access

---

Question ID:
industry_module

Question:
Do you require industry specific functionality?

Options:

* Logistics
* Manufacturing
* Garments
* C&F Agency
* Not Required

---

Question ID:
customization

Question:
Would custom workflows improve your operations?

Options:

* Definitely
* Maybe
* Not Sure
* No

SCORING

Definitely
+30 TDL

Maybe
+15 TDL

---

PHASE 5
IMPLEMENTATION READINESS
------------------------

Question ID:
timeline

Question:
When are you planning improvements?

Options:

* Immediately
* Within 30 Days
* Within 3 Months
* Exploring Options

Lead Score:

Immediate
+30

30 Days
+20

3 Months
+10

---

Question ID:
support_level

Question:
What type of support do you expect?

Options:

* Basic Support
* Priority Support
* Dedicated Assistance
* Staff Training
* Fully Managed Service

SCORING

Priority Support
→ AMC

Dedicated Assistance
→ AMC

Staff Training
→ Corporate Training

---

## SCORING ENGINE

Create a recommendation scoring system.

Example:

scores = {
tallySilver: 0,
tallyGold: 0,
tallyServer: 0,
tss: 0,
cloud: 0,
backup: 0,
amc: 0,
tdl: 0,
mobile: 0,
whatsapp: 0,
training: 0,
industryModule: 0
}

Each answer adds points.

After completion:

Sort recommendations by score.

Return top 3 recommendations.

---

## RESULT PAGE

Do NOT immediately ask for lead details.

First provide value.

Display:

Business Efficiency Score
0-100

Growth Readiness
0-100

Automation Potential
Low / Medium / High

Business Risk Level
Low / Medium / High

---

Display:

TOP RECOMMENDATIONS

Example:

1. TallyPrime Gold
2. AWS Cloud for Tally
3. Tally AMC

---

Display:

WHY WE RECOMMEND THIS

Generate personalized explanations using actual answers.

Example:

"Because your business has multiple users, relies heavily on Excel, and requires remote access, we recommend TallyPrime Gold with AWS Cloud deployment."

---

## LEAD CAPTURE

Only AFTER showing recommendations.

Display:

Get Your Detailed Business Roadmap

Benefits:

* Full Solution Blueprint
* Estimated Costing
* Implementation Plan
* Expert Consultation

Fields:

* Full Name
* Mobile Number
* Email Address
* Company Name

Mandatory validation.

Attach:

* All answers
* Recommendation scores
* Business scores
* Generated report

to submission payload.

---

## TECHNICAL REQUIREMENTS

Implement all questions as configurable JSON.

Example:

{
"id": "growth_focus",
"title": "What would help your business grow faster?",
"type": "single",
"options": [...]
}

Support:

* conditional rendering
* scoring
* recommendation engine
* future expansion

No hardcoded question logic.

Build a reusable engine architecture.

The consultation should feel premium, professional, and business-focused while maximizing lead conversion and product recommendation accuracy.
