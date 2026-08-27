export type Partner = {
    _id?: string;
    name: string;
    imageUrl: string;
    createdAt?: Date;
};

// CHANGE: 2026-08-26 — Canonical home "Certified Industry Partners" list in display order:
// AWS → Biz Analyst → TallyPrime → OTU → NoSky. The frontend owns this list (admin panel is
// a separate deployment); getPartners('brand') reconciles the DB to it on every read.
export const staticPartners: Partner[] = [
    {
        name: "AWS",
        imageUrl: "/PartnerBrands/AWS.png"
    },
    {
        name: "Biz Analyst",
        imageUrl: "/PartnerBrands/BizAnalyst.png"
    },
    {
        name: "TallyPrime",
        imageUrl: "/tallyprime logo.png"
    },
    {
        name: "OTU",
        imageUrl: "/PartnerBrands/OTU.png"
    },
    {
        name: "NoSky",
        imageUrl: "/PartnerBrands/Nosky.webp"
    }
];