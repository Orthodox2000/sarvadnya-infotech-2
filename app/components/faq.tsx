'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { fetchWithCache } from '@/lib/client-api';

const FAQ = () => {
    const [faqData, setFaqData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [supportPhone, setSupportPhone] = useState("+919876543210");
    const [whatsappPhone, setWhatsappPhone] = useState("+919876543210");
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await fetchWithCache('/api/settings');
                if (data.support_phone) {
                    setSupportPhone(data.support_phone);
                }
                if (data.whatsapp_phone) {
                    setWhatsappPhone(data.whatsapp_phone);
                } else if (data.support_phone) {
                    setWhatsappPhone(data.support_phone);
                }
            } catch (err) {
                console.error('Failed to fetch FAQ settings:', err);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const data = await fetchWithCache('/api/content?section=home_faq');
                if (data && !data.error && Array.isArray(data)) {
                    setFaqData(data);
                } else {
                    setFaqData([]);
                }
            } catch (err) {
                console.error('Error fetching FAQ:', err);
                setFaqData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFaq();
    }, []);

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
                        Expert <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Guidance</span>
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
                                    {item.answer}
                                    <div className="mt-4 flex gap-4">
                                        <a href={`tel:${supportPhone}`} className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Call for details</a>
                                        <a href={`https://wa.me/${whatsappPhone.replace(/\D/g, '')}`} className="text-[10px] font-black uppercase text-emerald-600 hover:underline">WhatsApp Us</a>
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
