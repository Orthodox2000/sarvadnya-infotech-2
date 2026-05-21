'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';

const FAQ = () => {
    const [faqData, setFaqData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [supportPhone, setSupportPhone] = useState("+919876543210");
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('/api/settings');
                const data = await response.json();
                if (data.support_phone) {
                    setSupportPhone(data.support_phone);
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
                const response = await fetch('/api/content?section=home_faq');
                const data = await response.json();
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


    useEffect(() => {
        setIsVisible(true);
        const currentRef = sectionRef.current;
        if (!window.IntersectionObserver) {
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

    const filteredFaq = useMemo(() => {
        if (!searchQuery) return faqData;
        return faqData.filter(item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, faqData]);

    // Show only 5 if not expanded and no search query is active
    const displayedFaq = useMemo(() => {
        if (searchQuery || isExpanded) return filteredFaq;
        return filteredFaq.slice(0, 5);
    }, [filteredFaq, isExpanded, searchQuery]);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading) return (
        <section id="faq" className="w-full py-12 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3">Service & Support</h2>
                    <h1 className="font-sans text-[2.25rem] font-extrabold leading-tight text-slate-900 sm:text-[3rem] mb-6">Still have questions? <br className="hidden sm:block" /> We got them answered</h1>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 py-12">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-[#7338a0] rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Loading FAQs...</p>
                </div>
            </div>
        </section>
    );

    return (
        <section 
            id="faq"
            ref={sectionRef}
            className="w-full py-12 px-6 transition-colors duration-300"
            style={{ backgroundColor: 'var(--background-color, #ffffff)' }}
        >
            <div className="max-w-4xl mx-auto">
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 mb-3">
                        Service & Support
                    </h2>
                    <h1 className="font-sans text-[2.25rem] font-extrabold leading-tight text-slate-900 sm:text-[3rem] mb-6">
                        Still have questions? <br className="hidden sm:block" /> We got them answered
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Whether you are looking for Tally Prime implementation, cloud migration, 
                        or complex GST troubleshooting, our expert team is here to guide you 
                        through every step of your business journey.
                    </p>
                </div>

                <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for keywords (e.g. Cloud, Upgrade, GST...)"
                            className="block w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-slate-900 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {searchQuery && (
                        <p className="mt-4 text-sm text-slate-500">
                            Found {filteredFaq.length} results for "{searchQuery}"
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {displayedFaq.length > 0 ? (
                        <>
                            {displayedFaq.map((item, index) => (
                                <div 
                                    key={index}
                                    className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-700 bg-white shadow-sm ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                                    style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                                >
                                    <button
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors duration-300"
                                    >
                                        <span className="text-[1.05rem] font-bold text-slate-800 pr-8">
                                            {item.question}
                                        </span>
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center transition-all duration-300 ${activeIndex === index ? 'rotate-180 border-slate-900 bg-slate-900 text-white' : 'text-slate-500'}`}>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-[500px]' : 'max-h-0'}`}
                                    >
                                        <div className="p-6 pt-0">
                                            <p className="text-slate-600 leading-relaxed text-[1.05rem] mb-6">
                                                {item.answer}
                                            </p>
                                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-slate-800 font-bold text-sm">Need more details?</p>
                                                    <p className="text-slate-500 text-xs mt-0.5">Call our expert support team for immediate assistance.</p>
                                                </div>
                                                <a 
                                                    href={`tel:${supportPhone}`}
                                                    className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 hover:bg-[var(--secondary-color,#4a2574)] hover:text-white transition-all shadow-sm active:scale-95"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    Call Support
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {!searchQuery && filteredFaq.length > 5 && (
                                <div className="pt-6 text-center">
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="inline-flex items-center px-8 py-3 bg-[var(--primary-color,#7338a0)] text-white text-sm font-bold rounded-full hover:bg-[var(--secondary-color,#4a2574)] transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-slate-900/20"
                                    >
                                        {isExpanded ? 'Hide Questions' : 'Show All Questions'}
                                        <svg className={`ml-2 w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No matching questions found. Try different keywords.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(FAQ);