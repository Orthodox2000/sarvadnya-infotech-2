'use client';

import Image from "next/image";
import { memo } from "react";
import { staticPartners } from "@/lib/partners";

const CertifiedPartners = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7338a0] mb-3">Our Global Network</p>
                <h2 className="text-3xl md:text-4xl font-black text-[#0f0529]">Certified Industry Partners</h2>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-6 max-w-7xl mx-auto">
                {staticPartners.map((partner, index) => (
                    <div 
                        key={partner.name} 
                        className="group relative w-40 h-24 sm:w-52 sm:h-28 md:w-64 md:h-36 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-4 sm:p-6 transition-all duration-500 hover:shadow-xl hover:border-[#7338a0]/20 hover:-translate-y-1"
                    >
                        <div className="relative w-full h-full transition-all duration-500">
                            <Image
                                src={partner.imageUrl}
                                alt={partner.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 160px, (max-width: 1024px) 256px, 300px"
                                priority={index < 4}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(CertifiedPartners);
