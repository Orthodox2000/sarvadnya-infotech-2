'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function CertifiedPartners() {
    const images = [
        "/PartnerBrands/Tally-Software.png",
        "/PartnerBrands/AWS.png",
        "/PartnerBrands/BizAnalyst.png",
        "/PartnerBrands/CredFlow.png",
    ];

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        // Fallback for older browsers or if observer fails
        if (!window.IntersectionObserver) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Once visible, we can stop observing
                    if (sectionRef.current) observer.unobserve(sectionRef.current);
                }
            },
            { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
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
            className="flex flex-col justify-center items-center gap-10 py-20 px-6 overflow-hidden bg-white"
        >
            <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 mb-3">
                    Our Network
                </h2>
                <h1 className="font-sans text-[1.75rem] font-extrabold leading-tight text-[var(--heading-color)] sm:text-[2.5rem] md:text-[3rem]">
                    Certified Partners
                </h1>
            </div>
            
            <div className="w-full max-w-5xl grid grid-cols-2 md:flex md:flex-nowrap justify-items-center items-center gap-6 sm:gap-12 md:gap-16 lg:gap-24">
                {images.map((item, index) => (
                    <div 
                        key={index}
                        className={`relative w-full h-20 sm:h-28 md:w-80 md:h-40 transition-all duration-1000 ${isVisible ? 'animate-rise-up' : 'opacity-0'}`}
                        style={{ 
                            animationDelay: isVisible ? `${index * 250}ms` : '0ms',
                        }}
                    >
                        <Image
                            src={item}
                            alt={`Partner ${index + 1}`}
                            fill
                            className="object-contain p-2 transition-transform duration-300 hover:scale-110"
                            sizes="(max-width: 640px) 150px, (max-width: 768px) 256px, 320px"
                            priority={index < 2}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
