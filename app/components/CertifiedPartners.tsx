'use client';

import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { Partner } from "@/lib/partners";

const CertifiedPartners = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch('/api/admin/partners?type=brand');
                const data = await response.json();
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
    }, []);

    if (loading) return (
        <div className="w-full py-24 bg-slate-50/50 flex items-center justify-center">
            <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="w-32 h-20 bg-white rounded-2xl animate-pulse border border-slate-100" />
                ))}
            </div>
        </div>
    );

    if (partners.length === 0) return null;

    return (
        <section className="w-full py-16 md:py-24 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7338a0] mb-3">Our Global Network</p>
                <h2 className="text-3xl md:text-4xl font-black text-[#0f0529]">Certified Industry Partners</h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 px-6 max-w-7xl mx-auto">
                {partners.map((partner, index) => (
                    <div 
                        key={partner._id || partner.name} 
                        className="group relative w-32 h-20 sm:w-40 sm:h-24 md:w-48 md:h-28 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-3 sm:p-4 transition-all duration-500 hover:shadow-xl hover:border-[#7338a0]/20 hover:-translate-y-1"
                    >
                        <div className="relative w-full h-full transition-all duration-500">
                            <Image
                                src={partner.imageUrl}
                                alt={partner.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 120px, (max-width: 1024px) 160px, 200px"
                                priority={index < 5}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(CertifiedPartners);
