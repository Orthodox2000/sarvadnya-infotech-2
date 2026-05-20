export type Partner = {
    _id?: string;
    name: string;
    imageUrl: string;
    createdAt?: Date;
};

export const staticPartners: Partner[] = [
    {
        name: "Tally Software",
        imageUrl: "/PartnerBrands/Tally-Software.png"
    },
    {
        name: "AWS",
        imageUrl: "/PartnerBrands/AWS.png"
    },
    {
        name: "Biz Analyst",
        imageUrl: "/PartnerBrands/BizAnalyst.png"
    },
    {
        name: "CredFlow",
        imageUrl: "/PartnerBrands/CredFlow.png"
    }
];
