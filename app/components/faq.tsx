'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchWithCache } from '@/lib/client-api';

const CATEGORIES = ['All', 'Products', 'Services', 'Technical', 'Contact'];

const FAQ = ({ initialData, initialSettings }: { initialData?: any[], initialSettings?: any }) => {
    const [faqData, setFaqData] = useState<any[]>(initialData || []);
    const [loading, setLoading] = useState(!initialData);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialData) return;
        const fetchData = async () => {
            try {
                const data = await fetchWithCache('/api/content?section=home_faq');
                if (Array.isArray(data)) setFaqData(data);
            } catch (err) {
                console.error('Failed to fetch FAQ data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [initialData]);

    const filteredFaq = activeCategory === 'All' ? faqData : faqData.filter(item => item.category === activeCategory);

    const ERP_NOTICE = {
        question: "Has Tally stopped ERP renewals?",
        answer: "Yes. Tally has officially discontinued legacy ERP renewals. Upgrading to TallyPrime with an active TSS subscription is now the only way to stay compliant with the latest GST rules, E-invoicing mandates, and statutory updates. Contact us to upgrade today."
    };

    const toggleIndex = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading && faqData.length === 0) return (
        <div className="w-full h-96 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#006569] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <section ref={sectionRef} className="w-full py-16 md:py-20 bg-[linear-gradient(90deg,_rgba(249,251,245,1)_0%,_rgba(244,242,234,1)_53%,_rgba(238,236,223,1)_100%)]">
            <div className="max-w-[800px] mx-auto flex flex-col items-center px-6">
                <h2 className="text-[32px] font-semibold text-[#1C1B1B] text-center mb-10">
                    Frequently Asked Questions
                </h2>

                <div className="flex flex-wrap justify-center gap-2 mb-10 bg-white p-2 rounded-xl shadow-sm border border-[#E9F1FA]">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => { setActiveCategory(cat); setActiveIndex(null); }}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
                                activeCategory === cat
                                    ? 'bg-[#006569] text-white'
                                    : 'bg-transparent text-[#5D5F5F] hover:bg-[#f0f9ff] hover:text-[#006569]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="w-full flex flex-col gap-4">
                    {/* Pinned ERP Renewal Notice */}
                    {activeCategory === 'All' && (
                        <div className={`w-full border rounded-xl overflow-hidden transition-colors ${
                            activeIndex === -1
                                ? 'bg-amber-50 shadow-sm border-amber-300'
                                : 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                        }`}>
                            <div
                                onClick={() => setActiveIndex(activeIndex === -1 ? null : -1)}
                                className="w-full px-6 py-5 flex justify-between items-center cursor-pointer"
                            >
                                <span className="text-base font-bold text-slate-900 pr-4 flex items-center gap-2">
                                    <span className="shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 border border-amber-200">IMPORTANT</span>
                                    {ERP_NOTICE.question}
                                </span>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                    activeIndex === -1 ? 'bg-amber-500 rotate-180' : 'bg-amber-100'
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-4 h-4 ${activeIndex === -1 ? 'text-white' : 'text-amber-600'}`}><path d="m6 9 6 6 6-6"></path></svg>
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === -1 ? 'max-h-96' : 'max-h-0'}`}>
                                <div className="px-6 pb-6 pt-0">
                                    <p className="text-base text-slate-600 leading-[1.6] border-t border-amber-200 pt-4">
                                        {ERP_NOTICE.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredFaq.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-[#E9F1FA] rounded-xl">
                            <p className="text-[#5D5F5F]">No FAQs found for this category.</p>
                        </div>
                    ) : (
                        filteredFaq.map((item, index) => (
                            <div
                                key={index}
                                className={`w-full border rounded-xl overflow-hidden transition-colors ${
                                    activeIndex === index
                                        ? 'bg-white shadow-sm border-[#006569]/30'
                                        : 'bg-white border-[#E9F1FA] hover:bg-[#f0f9ff]/50 hover:border-[#006569]/20'
                                }`}
                            >
                                <div
                                    onClick={() => toggleIndex(index)}
                                    className="w-full px-6 py-5 flex justify-between items-center cursor-pointer"
                                >
                                    <span className="text-base font-bold text-[#1C1B1B] pr-4">
                                        {item.question}
                                    </span>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                                        activeIndex === index ? 'bg-[#006569] rotate-180' : 'bg-[#f0f9ff]'
                                    }`}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24" height="24" viewBox="0 0 24 24"
                                            fill="none" stroke="currentColor"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                            className={`w-4 h-4 ${activeIndex === index ? 'text-white' : 'text-[#006569]'}`}
                                        >
                                            <path d="m6 9 6 6 6-6"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    activeIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}>
                                    <div className="px-6 pb-6 pt-0">
                                        <p className="text-base text-[#5D5F5F] leading-[1.6] border-t border-[#E9F1FA] pt-4">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
