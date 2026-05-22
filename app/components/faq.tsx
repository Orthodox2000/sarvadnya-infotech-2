'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { fetchWithCache } from '@/lib/client-api';

const FAQ = ({ initialData, initialSettings }: { initialData?: any[], initialSettings?: any }) => {
    const [faqData, setFaqData] = useState<any[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [supportPhone, setSupportPhone] = useState(initialSettings?.support_phone || "9821309060");
    const [whatsappPhone, setWhatsappPhone] = useState(initialSettings?.whatsapp_phone || initialSettings?.support_phone || "9821309060");
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialData && initialSettings) return;
        const fetchSettings = async () => {
            try {
                const [data, settingsData] = await Promise.all([
                    fetchWithCache('/api/content?section=home_faq'),
                    fetchWithCache('/api/settings')
                ]);
                if (Array.isArray(data)) setFaqData(data);
                if (settingsData && !settingsData.error) {
                    setSupportPhone(settingsData.support_phone);
                    setWhatsappPhone(settingsData.whatsapp_phone || settingsData.support_phone);
                }
            } catch (err) {
                console.error('Failed to fetch FAQ data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [initialData, initialSettings]);

    const filteredFaq = useMemo(() => {
        if (!searchQuery.trim()) return faqData;
        const query = searchQuery.toLowerCase();
        return faqData.filter(item => 
            item.question.toLowerCase().includes(query) || 
            item.answer.toLowerCase().includes(query)
        );
    }, [faqData, searchQuery]);

    const displayFaq = isExpanded ? filteredFaq : filteredFaq.slice(0, 6);

    const toggleIndex = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading && faqData.length === 0) return (
        <div className="w-full h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <section 
            ref={sectionRef}
            className="w-full py-16 md:py-24 bg-white overflow-hidden"
        >
            <div className="max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Common Questions</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#0f0529] tracking-tight">
                        Professional <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Guidance</span>
                    </h2>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                        Find instant answers to the most common queries about TallyPrime, Cloud Hosting, and our support services.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-12 group">
                    <input 
                        type="text" 
                        placeholder="Search for answers..."
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* FAQ Grid */}
                <div className="space-y-4">
                    {displayFaq.map((item, index) => (
                        <div 
                            key={index}
                            className={`group rounded-3xl transition-all duration-300 border ${activeIndex === index ? 'bg-slate-50 border-indigo-100 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                        >
                            <button 
                                onClick={() => toggleIndex(index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`text-sm md:text-base font-bold transition-colors ${activeIndex === index ? 'text-indigo-600' : 'text-[#0f0529] group-hover:text-indigo-600'}`}>
                                    {item.question}
                                </span>
                                <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeIndex === index ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="p-6 pt-0 text-sm leading-relaxed text-slate-500 font-medium border-t border-indigo-50/50">
                                    <div className="py-4">
                                        {item.answer}
                                    </div>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <a 
                                            href={`tel:${supportPhone}`} 
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 border border-indigo-100 shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            Call for Details
                                        </a>
                                        <a 
                                            href={`https://wa.me/${whatsappPhone.replace(/\D/g, '')}`} 
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100 shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.563 6.024L0 24l6.135-1.608a11.81 11.81 0 005.908 1.567h.005c6.635 0 12.045-5.411 12.047-12.047 0-3.217-1.252-6.242-3.525-8.514z"/></svg>
                                            WhatsApp Us
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredFaq.length > 6 && !searchQuery && (
                        <div className="text-center pt-8">
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="px-8 py-3 rounded-2xl bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95"
                            >
                                {isExpanded ? 'Show Less' : 'Show All Questions'}
                            </button>
                        </div>
                    )}

                    {filteredFaq.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <p className="text-slate-500">No matching questions found. Try different keywords.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(FAQ);
