// CHANGE: 2026-10-23 — `role` (e.g. "CA") and optional `rating` added for the curated
// homepage review wall (owner: "mention if someone is a CA"). Imported Google reviews may not
// carry a star count, so `rating` is optional and the UI renders stars only when present —
// inventing a rating would be fake social proof. `source` records where a review came from so
// an imported review can be labelled honestly in the admin panel.
export type Review = {
    id?: string;
    _id?: string;
    name: string;
    rating?: number;
    /** Short credential/role shown as a pill next to the name, e.g. "CA". */
    role?: string;
    text: string;
    date: string;
    /** Provenance, e.g. "Google". Optional — pre-existing rows have none. */
    source?: string;
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
        text: "Professional team and great technical knowledge. Their Tally modules work perfectly for our large data volume.",
        date: "3 weeks ago"
    },
    {
        name: "Priya Sharma",
        rating: 5,
        text: "Highly recommend for Tally AMC. Their response time is very fast and they resolve issues on the first call.",
        date: "1 week ago"
    }
];
