export type ProductSubItem = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export type ProductItem = {
  label: string;
  href: string;
  subItems: ProductSubItem[];
};

export const productItems: ProductItem[] = [
  {
    label: "Business Software",
    href: "/",
    subItems: [
      {
        id: "business-software-erp",
        label: "ERP Workflows",
        href: "/",
        description: "Operational tools for billing, inventory, and day-to-day process control.",
      },
      {
        id: "business-software-accounting",
        label: "Accounting Stack",
        href: "/",
        description: "Core finance-focused modules designed for reliable business record keeping.",
      },
      {
        id: "business-software-reporting",
        label: "Management Reports",
        href: "/",
        description: "Decision-ready summaries and dashboards for owners and operations teams.",
      },
    ],
  },
  {
    label: "Implementation",
    href: "/",
    subItems: [
      {
        id: "implementation-onboarding",
        label: "Onboarding",
        href: "/",
        description: "Structured rollout support for setting up teams, data, and workflows.",
      },
      {
        id: "implementation-migration",
        label: "Data Migration",
        href: "/",
        description: "Transition legacy records into the new setup with minimal operational friction.",
      },
      {
        id: "implementation-customization",
        label: "Customization",
        href: "/",
        description: "Tailored configuration for specific operating models and reporting needs.",
      },
    ],
  },
  {
    label: "Training",
    href: "/",
    subItems: [
      {
        id: "training-team",
        label: "Team Enablement",
        href: "/",
        description: "Hands-on sessions that help staff adopt new systems with confidence.",
      },
      {
        id: "training-admin",
        label: "Admin Coaching",
        href: "/",
        description: "Advanced guidance for internal owners managing usage, settings, and controls.",
      },
      {
        id: "training-reference",
        label: "Reference Material",
        href: "/",
        description: "Repeatable documentation for ongoing support after initial rollout.",
      },
    ],
  },
  {
    label: "Support",
    href: "/",
    subItems: [
      {
        id: "support-helpdesk",
        label: "Helpdesk",
        href: "/",
        description: "Issue resolution for operational blockers, user questions, and maintenance.",
      },
      {
        id: "support-audits",
        label: "System Audits",
        href: "/",
        description: "Periodic review of setup quality, controls, and process consistency.",
      },
      {
        id: "support-improvements",
        label: "Continuous Improvement",
        href: "/",
        description: "Ongoing refinement to keep tools aligned with evolving business needs.",
      },
    ],
  },
];
