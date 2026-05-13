'use client';

import Image from "next/image";
import { useEffect, useRef, useState, memo } from "react";

const CertifiedPartners = () => {
    const images = [
        "/PartnerBrands/Tally-Software.png",
        "/PartnerBrands/AWS.png",
        "/PartnerBrands/BizAnalyst.png",
        "/PartnerBrands/CredFlow.png",
    ];

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

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
            className="flex flex-col justify-center items-center gap-10 py-16 px-6 overflow-hidden transition-colors duration-300"
            style={{ backgroundColor: 'var(--background-color, white)' }}
        >
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 mb-3">
                    Our Network
                </h2>
                <h1 className="font-sans text-[1.75rem] font-extrabold leading-tight text-[var(--heading-color)] sm:text-[2.5rem] md:text-[3rem]">
                    Certified Partners
                </h1>
            </div>
            
            <div className="w-full max-w-5xl flex flex-row flex-wrap md:flex-nowrap items-center justify-center gap-2 sm:gap-12 md:gap-16 lg:gap-24 px-2">
                {images.map((item, index) => (
                    <div 
                        key={index}
                        className={`relative flex-1 min-w-[70px] sm:min-w-0 h-12 sm:h-28 md:h-40 bg-white/50 rounded-lg sm:rounded-2xl border border-black/[0.03] shadow-sm transition-all duration-1000 ${isVisible ? 'animate-rise-up' : 'opacity-0'}`}
                        style={{ 
                            animationDelay: isVisible ? `${index * 250}ms` : '0ms',
                        }}
                    >
                        <Image
                            src={item}
                            alt={`Partner ${index + 1}`}
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