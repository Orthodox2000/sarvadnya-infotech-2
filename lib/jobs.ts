export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  shortDescription: string;
  fullDescription: string;
  postedAt: string; // ISO format
  requirements: string[];
  benefits: string[];
};

export const jobs: Job[] = [
  {
    id: "tally-support-exec",
    title: "Tally Support Executive",
    department: "Customer Success",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Provide technical support and training for TallyPrime to our growing client base.",
    fullDescription: "As a Tally Support Executive, you will be the first point of contact for our clients. You will resolve technical issues, provide product demonstrations, and ensure clients are maximizing the value of TallyPrime in their business operations.",
    postedAt: "2026-05-10T09:00:00Z",
    requirements: [
      "In-depth knowledge of TallyPrime and Tally.ERP 9",
      "Basic understanding of accounting principles and GST",
      "Excellent communication and problem-solving skills",
      "Ability to provide on-site and remote support",
      "Previous experience in Tally support is a plus"
    ],
    benefits: [
      "Competitive salary and performance bonuses",
      "Continuous learning and certification opportunities",
      "Exposure to diverse industry verticals",
      "Friendly and collaborative work environment"
    ]
  },
  {
    id: "it-sales-manager",
    title: "IT Sales Manager",
    department: "Sales",
    location: "Belapur, Navi Mumbai",
    type: "Full-time",
    shortDescription: "Lead our sales efforts for Cloud solutions and Tally customization modules.",
    fullDescription: "We are looking for a dynamic Sales Manager to drive the adoption of our AWS Cloud services and specialized Tally modules. You will identify new business opportunities, build relationships with SMEs, and close deals for our premium IT services.",
    postedAt: "2026-05-12T14:30:00Z",
    requirements: [
      "2+ years of experience in IT software/services sales",
      "Proven track record of meeting and exceeding sales targets",
      "Strong understanding of Cloud computing and ERP solutions",
      "Exceptional negotiation and presentation skills",
      "Willingness to travel for client meetings"
    ],
    benefits: [
      "Attractive commission structure",
      "Remote work flexibility",
      "Annual sales retreats",
      "Health insurance and travel allowances"
    ]
  },
  {
    id: "tally-developer-intern",
    title: "Tally Developer Intern",
    department: "Development",
    location: "Belapur, Navi Mumbai",
    type: "Internship",
    shortDescription: "Learn TDL (Tally Definition Language) and help build custom Tally modules.",
    fullDescription: "Kickstart your career in ERP development. As an intern, you will assist our senior developers in creating specialized TDL customizations. You will learn how to extend Tally's functionality to meet unique business requirements.",
    postedAt: "2026-05-14T08:00:00Z",
    requirements: [
      "Basic knowledge of any programming language (C, Java, Python)",
      "Strong logical and analytical skills",
      "Eagerness to learn TDL and ERP architecture",
      "Final year students or recent graduates in CS/IT"
    ],
    benefits: [
      "Hands-on training by industry experts",
      "Stipend during the internship period",
      "Certificate of completion",
      "Opportunity for full-time conversion"
    ]
  }
];
