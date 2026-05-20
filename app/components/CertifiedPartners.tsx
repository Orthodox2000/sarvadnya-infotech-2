'use client';

import Image from "next/image";
import { useEffect, useRef, useState, memo } from "react";

interface Partner {
    _id: string;
    name: string;
    imageUrl: string;
}

const CertifiedPartners = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch('/api/admin/partners');
                const data = await response.json();
                if (data && !data.error) {
                    setPartners(data);
                }
            } catch (err) {
                console.error('Error fetching partners:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);

    useEffect(() => {
        const currentRef = sectionRef.current;
        if (!window.IntersectionObserver) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (currentRef) observer.unobserve(currentRef);
                }
            },
            { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="flex flex-col justify-center items-center gap-10 py-16 px-6 overflow-hidden transition-colors duration-300 bg-[#290f4d]"
        >
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3">
                    Our Network
                </h2>
                <h1 className="font-sans text-[1.75rem] text-white font-extrabold leading-tight text-slate-900 sm:text-[2.5rem] md:text-[3rem]">
                    Certified Partners
                </h1>
            </div>

            <div className="w-full max-w-5xl flex flex-row flex-wrap md:flex-nowrap items-center justify-center gap-4 sm:gap-12 md:gap-16 lg:gap-24 px-2">
                {partners.map((item, index) => (
                    <div
                        key={item._id || index}
                        className={`relative flex-1 min-w-[100px] sm:min-w-0 h-20 sm:h-28 md:h-40 bg-slate-50 rounded-lg sm:rounded-2xl border border-slate-100 shadow-sm transition-all duration-1000 ${isVisible ? 'animate-rise-up' : 'opacity-0'}`}
                        style={{
                            animationDelay: isVisible ? `${index * 250}ms` : '0ms',
                        }}
                    >
                        <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-contain p-1.5 sm:p-4 transition-transform duration-300 hover:scale-110"
                            sizes="(max-width: 640px) 25vw, (max-width: 768px) 256px, 320px"
                            priority={index < 2}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(CertifiedPartners);