'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export type SiteSettings = {
    support_phone: string;
    whatsapp_phone: string;
    support_email: string;
    office_address: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    youtube_url: string;
    facebook_handle: string;
    instagram_handle: string;
    linkedin_handle: string;
    youtube_handle: string;
    map_iframe_url: string;
};

export default function Footer({ settings: initialSettings }: { settings?: SiteSettings | null }) {
    const [year, setYear] = useState<number>(2026);
    const [settings, setSettings] = useState<SiteSettings | null>(initialSettings || null);
    const [dynamicModules, setDynamicModules] = useState<any[]>([]);

    useEffect(() => {
        setYear(new Date().getFullYear());
        if (!initialSettings) fetchSettings();
        fetchModules();
    }, [initialSettings]);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            if (data && !data.error) {
                setSettings(data);
            }
        } catch (err) {
            console.error('Failed to fetch footer settings:', err);
        }
    };

    const fetchModules = async () => {
        try {
            const response = await fetch('/api/modules');
            const data = await response.json();
            if (Array.isArray(data)) {
                setDynamicModules(data.slice(0, 6).map(m => ({
                    name: m.title,
                    href: `/modules?id=${m.id || m._id}`
                })));
            }
        } catch (err) {
            console.error('Failed to fetch modules for footer:', err);
        }
    };

    const supportPhone = settings?.support_phone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || "9821309060";
    const whatsappPhone = settings?.whatsapp_phone || supportPhone;
    const supportEmail = settings?.support_email || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@sarvadnyainfotech.com";
    const officeAddress = settings?.office_address || process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "123, Business Center, Main Road, Pune - 411001";
    const mapUrl = settings?.map_iframe_url || process.env.NEXT_PUBLIC_MAP_IFRAME_URL || "";
    
    // Helper to extract src from iframe tag if provided
    const getMapSrc = (input: string) => {
        if (!input) return "";
        if (input.includes('<iframe')) {
            const match = input.match(/src=["']([^"']+)["']/i);
            return match ? match[1] : "";
        }
        return input;
    };

    const mapSrc = getMapSrc(mapUrl);
    
    const formatPhoneDisplay = (phone: string) => {
        const cleaned = phone.trim();
        if (cleaned.startsWith('+')) return cleaned;
        if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`;
        if (cleaned.length === 10) return `+91${cleaned}`;
        return cleaned;
    };

    const socialLinks = [
        // CHANGE: 2026-08-24 — Removed WhatsApp from footer social icons per user request (floating WhatsApp button elsewhere is unaffected).
        { name: 'Facebook', url: settings?.facebook_url || '#', hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2]', icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        )},
        { name: 'Instagram', url: settings?.instagram_url || '#', hoverColor: 'hover:bg-[#E4405F] hover:border-[#E4405F]', icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
        )},
        { name: 'LinkedIn', url: settings?.linkedin_url || '#', hoverColor: 'hover:bg-[#0077B5] hover:border-[#0077B5]', icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        )},
        { name: 'YouTube', url: settings?.youtube_url || 'https://www.youtube.com/@sarvadnyainfotechtally', hoverColor: 'hover:bg-[#FF0000] hover:border-[#FF0000]', icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        )},
    ];

    const products = [
        { name: 'TallyPrime Silver', href: '/products/silver' },
        { name: 'TallyPrime Gold', href: '/products/gold' },
        { name: 'TallyPrime Server', href: '/products/server' },
    ];

    const doMoreWithTally = [
        { name: 'Tally Cloud Access', href: '/cloud/tallycloudaccess' },
        { name: 'TallyDrive Backup', href: '/products/tallydrive' },
        { name: 'Backup for Tally', href: '/cloud/backup-for-tally' },
        { name: 'HRMS Solution', href: '/hrms' },
        { name: 'TallyCapital', href: '/products/tallycapital' },
    ];

    const customizedModules = dynamicModules.length > 0 ? dynamicModules : [
        { name: 'CFA Module (Clearing & Forwarding)', href: '/modules?id=cf-agencies' },
        { name: 'Housing Society Module', href: '/modules?id=housing-societies' },
        { name: 'SalesMan / Agent Module', href: '/modules?id=sales-commission' },
        { name: 'Transport Module', href: '/modules?id=logistics-transport' },
        { name: 'Container Handling Module', href: '/modules?id=container-handling' },
        { name: 'Garment / Footwear Module', href: '/modules?id=garment-retail' }
    ];

    const supportOnTally = [
        { name: 'TSS Renewal', href: '/services/tss' },
        { name: 'Annual Support (AMC)', href: '/services/amc' },
        { name: 'Corporate Training', href: '/services/corporate-training' },
        { name: 'TDL Customization', href: '/services/tdl' },
        { name: 'Tally on Mobile', href: '/services/mobile-app-biz' },
        { name: 'Tally to WhatsApp', href: '/services/tally-on-whatsapp' },
    ];

    return (
        <footer className="relative text-white pt-20 pb-8 px-6 overflow-hidden border-t border-white/10" style={{ background: 'linear-gradient(0deg, #033B38 0%, #045A57 100%)' }}>
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#006569]/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D4EAEA]/10 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16 relative z-10">
                {/* Company Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/footerlogo.png"
                            alt="Sarvadnya Infotech LLP"
                            width={120}
                            height={40}
                            className="h-11 w-auto object-contain rounded-xs"
                        />
                    </Link>
                    <p className="text-sm leading-relaxed text-white/90 font-medium">
                        Certified Tally Partner providing end-to-end business solutions, 
                        cloud migration, and professional technical support to streamline your 
                        accounting and compliance workflows.
                    </p>

                    <div className="flex gap-3">
                        {/* CHANGE: 2026-08-24 — Square-ish buttons instead of circles per user request. */}
                        {socialLinks.map((social) => (
                            <a 
                                key={social.name}
                                href={social.url}
                                className={`w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center ${social.hoverColor} hover:text-white transition-all duration-300 bg-white/5`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    {/* CHANGE: 2026-08-24 — Removed duplicate legal links here; they now live only once in the bottom bar (single line). */}
                </div>

                {/* TallyPrime Products */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">TallyPrime Products</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        {products.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-[#B8DEDE] transition-colors hover-underline-animation py-1 font-bold">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Do More with Tally */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Do More with Tally</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        {doMoreWithTally.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-[#B8DEDE] transition-colors hover-underline-animation py-1 font-bold">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customized Modules */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Custom Modules</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        {customizedModules.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-[#B8DEDE] transition-colors hover-underline-animation py-1 font-bold">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support on Tally */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Services</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        {supportOnTally.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-[#B8DEDE] transition-colors hover-underline-animation py-1 font-bold">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Map */}
                <div className="space-y-8">
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Get In Touch</h3>
                    <ul className="space-y-5 text-sm mb-6 text-white/90">
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {/* CHANGE: 2026-08-24 — break-all + min-w-0 so the long email wraps instead of overflowing to the right. */}
                            <a href={`mailto:${supportEmail}`} className="hover:text-[#B8DEDE] transition-colors font-bold break-all min-w-0">{supportEmail}</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-white shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div className="flex flex-col gap-3">
                                {/* CHANGE: 2026-08-26 — Landline (022-49742200 / 49647959) added above the support mobile.
                                    Hardcoded so it always shows even if DB settings only hold the mobile number.
                                    2026-08-26 — Removed whitespace-nowrap: it forced the line onto one width and
                                    overflowed the narrow (1/6) footer column on PC. It now wraps naturally. */}
                                <a href="tel:+912249742200" className="hover:text-[#B8DEDE] transition-colors block leading-tight font-black">
                                    022-49742200 / 49647959
                                </a>
                                {supportPhone.split(',').map((num, i) => (
                                    <a key={i} href={`tel:${num.trim()}`} className="hover:text-[#B8DEDE] transition-colors block leading-tight font-black">
                                        {formatPhoneDisplay(num.trim())}
                                    </a>
                                ))}
                            </div>
                        </li>
                    </ul>
                    
                    {/* Map Iframe */}
                    {mapSrc && (
                        <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <iframe 
                                src={mapSrc}
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen={false} 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
                <p>© {year} Sarvadnya Infotech LLP. All Rights Reserved.</p>
                {/* CHANGE: 2026-08-24 — Single legal-links row (added Report a Problem) — the left-column duplicates were removed. */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link>
                    <Link href="/eula" className="hover:text-white transition-colors">EULA</Link>
                    <Link href="/report-problem" className="hover:text-white transition-colors">Report a Problem</Link>
                </div>
            </div>
        </footer>
    );
}
