'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Review {
    id: number;
    name: string;
    rating: number;
    date: string;
    text: string;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "Rahul Sharma",
        rating: 5,
        date: "2 weeks ago",
        text: "Excellent service! The team helped us migrate to TallyPrime seamlessly. Their support for GST filing is outstanding."
    },
    {
        id: 2,
        name: "Priya Patel",
        rating: 5,
        date: "1 month ago",
        text: "Reliable and professional. Their 'Never Deny Service Call' policy is real – they solved our billing issue late in the evening."
    },
    {
        id: 3,
        name: "Amit Verma",
        rating: 4,
        date: "2 months ago",
        text: "Very satisfied with the Tally on Cloud solution. It has made our accounting accessible from anywhere. Highly recommended!"
    },
    {
        id: 4,
        name: "Sandeep Gupta",
        rating: 5,
        date: "3 months ago",
        text: "The best Tally partner in Navi Mumbai. They understood our manufacturing requirements and customized the reports perfectly."
    }
];

function StarRating({ rating, size = "w-4 h-4" }: { rating: number, size?: string }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`${size} ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function CustomerReviews() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section 
            ref={sectionRef}
            className="w-full py-24 px-6 bg-slate-50/50 overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section - Google Branding Only */}
                <div className={`flex flex-col items-start transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="relative w-64 h-16 ">
                        <Image 
                            src="/google-reviews.png" 
                            alt="Google Reviews" 
                            fill
                            className="object-contain object-left"
                            sizes="300px"
                        />
                    </div> 
                </div>

                {/* Reviews Grid - 4 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, index) => (
                        <div 
                            key={review.id}
                            className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition-all duration-700 hover:shadow-md hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                            style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-slate-900 font-bold text-[0.8rem] leading-tight">{review.name}</p>
                                            <p className="text-slate-400 text-[0.65rem]">{review.date}</p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} size="w-3 h-3" />
                                </div>
                                <p className="text-slate-600 leading-relaxed text-sm italic">
                                    "{review.text}"
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-[0.6rem] font-black text-slate-300 uppercase tracking-widest">Verified Review</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
