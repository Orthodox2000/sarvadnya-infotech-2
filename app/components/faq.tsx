'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

const faqData = [
    {
        question: "What if I do not upgrade to TallyPrime? Will Tally.ERP 9 support still applicable?",
        answer: "Yes, support for Tally.ERP 9 will continue. However, upgrading to TallyPrime is recommended to take advantage of the latest features, improved performance, and advanced capabilities like E-invoicing and direct E-way bill generation."
    },
    {
        question: "How Tally on cloud works?",
        answer: "Tally on Cloud serves Tally Desktop Application over Cloud. With proper internet connectivity, users can access Tally on Cloud with their Username and Password using RDP Client from their device. With Tally on Cloud admin panel, your Administrators can easily manage Tally on Cloud Users, Data, Printers, backups, etc."
    },
    {
        question: "Explain what is group in Tally ERP 9?",
        answer: "Group is a collection of ledgers of the same nature. In the business, expenses like electric bills, telephone bill, conveyance, etc. are commonly included in groups. Ledger based on these expenses are created to be used while accounting vouchers are entered."
    },
    {
        question: "What services do you provide for Tally Prime?",
        answer: "We offer complete Tally Prime services including license sales, implementation, customization, data synchronization, troubleshooting, and annual maintenance contracts (AMC). Our expert team ensures your business software runs smoothly without any downtime."
    },
    {
        question: "Do you offer on-site support for technical issues?",
        answer: "Yes, we provide both remote and on-site support. Our 'Never Deny Service Call' policy ensures that we respond to every customer request promptly. For critical issues that cannot be resolved remotely, our technicians will visit your premises."
    },
    {
        question: "How can I renew my Tally Software Services (TSS)?",
        answer: "You can renew your TSS directly through us. Renewal gives you access to latest product updates, banking features (E-invoicing, E-way bill), and Tally reports on mobile. Contact our support team with your serial number for a quick renewal."
    },
    {
        question: "Do you provide customized billing solutions?",
        answer: "Absolutely. We specialize in tailoring billing and accounting workflows to match your specific industry needs. Whether you are in retail, manufacturing, or service, we can customize Tally to generate the exact reports and invoice formats you require."
    },
    {
        question: "What is your 'Never Deny Service Call' policy?",
        answer: "It is our commitment to customer satisfaction. We guarantee that no service call will be turned away. Regardless of the complexity of the issue or the time of the request, our team will acknowledge and provide a path to resolution for every client."
    },
    {
        question: "Can I access Tally reports on my mobile phone?",
        answer: "Yes, with a valid TSS, you can access your TallyPrime reports securely on any mobile device through a web browser. You can view balance sheets, profit & loss statements, stock summaries, and much more in real-time."
    },
    {
        question: "What are the benefits of a Tally AMC?",
        answer: "An Annual Maintenance Contract (AMC) provides you with priority support, regular system health checks, data backup assistance, and unlimited remote troubleshooting. It ensures your accounting operations never stop due to technical glitches."
    },
    {
        question: "How do I upgrade from Tally.ERP 9 to TallyPrime?",
        answer: "Upgrading is simple if you have an active TSS. We can assist you in migrating your data safely to TallyPrime, ensuring all your previous records and customizations are preserved while you enjoy the new, enhanced user experience."
    },
    {
        question: "Is TallyPrime GST compliant?",
        answer: "Absolutely. TallyPrime is designed to be fully GST compliant, helping you generate GSTR-1, GSTR-3B, and GSTR-9 reports easily. It also supports E-invoicing and E-way bill generation directly from the software."
    }
];

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+919876543210";

    useEffect(() => {
        if (!window.IntersectionObserver) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
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

    const filteredFaq = useMemo(() => {
        return faqData.filter(item => 
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Show only 5 if not expanded and no search query is active
    const displayedFaq = useMemo(() => {
        if (searchQuery || isExpanded) return filteredFaq;
        return filteredFaq.slice(0, 5);
    }, [filteredFaq, isExpanded, searchQuery]);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section 
            id="faq"
            ref={sectionRef}
            className="w-full py-24 px-6 bg-slate-50/50"
        >
            <div className="max-w-4xl mx-auto">
                <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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

                <div className={`mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
                                                    className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
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
                                        className="inline-flex items-center px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-slate-900/20"
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
}
