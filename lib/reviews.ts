export type Review = {
    id?: string;
    _id?: string;
    name: string;
    rating: number;
    text: string;
    date: string;
};

export const staticReviews: Review[] = [
    {
        name: "Vijay Kulkarni",
        rating: 5,
        text: "Excellent support for Tally customization. They helped us automate our transport billing which saved us hours every week.",
        date: "2 months ago"
    },
    {
        name: "Anita Deshmukh",
        rating: 5,
        text: "The Tally on Cloud solution provided by Sarvadnya Infotech is very stable. Our team can now work from anywhere seamlessly.",
        date: "1 month ago"
    },
    {
        name: "Suresh Mehta",
        rating: 4,
        text: "Professional team and great technical knowledge. The Excel to Tally import tool works perfectly for our large data volume.",
        date: "3 weeks ago"
    },
    {
        name: "Priya Sharma",
        rating: 5,
        text: "Highly recommend for Tally AMC. Their response time is very fast and they resolve issues on the first call.",
        date: "1 week ago"
    }
];
