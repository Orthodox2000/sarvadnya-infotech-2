'use client';

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { Partner } from "@/lib/partners";
import { fetchWithCache } from "@/lib/client-api";

const CertifiedPartners = ({ initialData }: { initialData?: Partner[] }) => {
    const [partners, setPartners] = useState<Partner[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const section = document.getElementById('partners-section');
        if (section) observer.observe(section);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (initialData) return;
        const fetchPartners = async () => {
            try {
                const data = await fetchWithCache('/api/admin/partners?type=brand');
                if (Array.isArray(data)) {
                    setPartners(data);
                }
            } catch (err) {
                console.error('Failed to fetch partners:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, [initialData]);

    if (loading) return (
        <div className="w-full py-24 bg-white flex items-center justify-center">
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-32 h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />
                ))}
            </div>
        </div>
    );

    if (partners.length === 0) return null;

    return (
        <section 
            id="partners-section"
            className="w-full py-16 md:py-24 bg-white border-y border-[#E9F1FA] overflow-hidden"
        >
            <div className={`max-w-7xl mx-auto px-6 mb-12 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00ABE4] mb-3">Our Global Network</p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Certified Industry Partners</h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 px-6 max-w-7xl mx-auto">
                {partners.map((partner, index) => (
                    <div 
                        key={partner._id || partner.name} 
                        style={{ transitionDelay: `${index * 100}ms` }}
                        className={`group relative w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 bg-white rounded-2xl border border-[#E9F1FA] shadow-sm flex items-center justify-center p-3 sm:p-4 transition-all duration-700 hover:shadow-xl hover:border-[#00ABE4]/20 hover:-translate-y-2
                            ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
                    >
                        <div className="relative w-full h-full transition-all duration-500 group-hover:scale-110">
                            <Image
                                src={partner.imageUrl}
                                alt={partner.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
                                priority={index < 5}
                            />
                        </div>
                        {/* Shimmer Effect on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#00ABE4]/0 via-[#00ABE4]/5 to-[#00ABE4]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(CertifiedPartners);