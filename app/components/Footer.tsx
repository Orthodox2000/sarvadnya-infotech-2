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
    facebook_handle: string;
    instagram_handle: string;
    linkedin_handle: string;
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
                    href: `/modules?id=${m._id}`
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
        { name: 'WhatsApp', url: `https://wa.me/${whatsappPhone.replace(/\D/g, '').length === 10 ? '91' + whatsappPhone.replace(/\D/g, '') : whatsappPhone.replace(/\D/g, '')}`, hoverColor: 'hover:bg-[#25D366] hover:border-[#25D366]', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.563 6.024L0 24l6.135-1.608a11.81 11.81 0 005.908 1.567h.005c6.635 0 12.045-5.411 12.047-12.047 0-3.217-1.252-6.242-3.525-8.514z"/></svg>
        )},
        { name: 'Facebook', url: settings?.facebook_url || '#', hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2]', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        )},
        { name: 'Instagram', url: settings?.instagram_url || '#', hoverColor: 'hover:bg-[#E4405F] hover:border-[#E4405F]', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
        )},
        { name: 'LinkedIn', url: settings?.linkedin_url || '#', hoverColor: 'hover:bg-[#0077B5] hover:border-[#0077B5]', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        )}
    ];

    const products = [
        { name: 'TallyPrime Silver', href: '/products#compare' },
        { name: 'TallyPrime Gold', href: '/products#compare' },
        { name: 'TallyPrime Server', href: '/products#compare' },
        { name: 'AWS Cloud Server', href: '/products#cloud' },
        { name: 'NoSky Backup', href: '/services#nosky-backup' }
    ];

    const customizedModules = dynamicModules.length > 0 ? dynamicModules : [
        { name: 'Logistics & Transport', href: '/modules' },
        { name: 'C&F Agencies', href: '/modules' },
        { name: 'Housing Societies', href: '/modules' },
        { name: 'Excel to Tally Import', href: '/modules' },
        { name: 'Garment Module', href: '/modules' },
        { name: 'Sales & Commission', href: '/modules' }
    ];

    const supportOnTally = [
        { name: 'Corporate Training', href: '/services' },
        { name: 'System Design & Implementation', href: '/services' },
        { name: 'Data Integration', href: '/services' },
        { name: 'Tally Consultation Services', href: '/services' },
        { name: 'Tally Customization (TDL)', href: '/services' },
        { name: 'Tally on Mobile', href: '/services' },
        { name: 'Tally AMC Services', href: '/services' }
    ];

    return (
        <footer className="relative bg-[#025b8a] text-white pt-20 pb-8 px-6 overflow-hidden border-t border-white/10">
            {/* Subtle Gradient Overlays */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ABE4]/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E9F1FA]/5 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />
            
            {/* Main Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#025b8a] via-[#014a6e] to-[#001a29] opacity-100 pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16 relative z-10">
                {/* Company Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-white p-1.5 flex items-center justify-center text-[#0371a3]">
                            <svg 
                                viewBox="0 0 50 50" 
                                className="w-full h-full fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M8 2L8 6L4 6L4 48L46 48L46 14L30 14L30 6L26 6L26 2 Z M 10 4L24 4L24 8L28 8L28 46L19 46L19 39L15 39L15 46L6 46L6 8L10 8 Z M 10 10L10 12L12 12L12 10 Z M 14 10L14 12L16 12L16 10 Z M 18 10L18 12L20 12L20 10 Z M 22 10L22 12L24 12L24 10 Z M 10 15L10 19L12 19L12 15 Z M 14 15L14 19L16 19L16 15 Z M 18 15L18 19L20 19L20 15 Z M 22 15L22 19L24 19L24 15 Z M 30 16L44 16L44 46L30 46 Z M 32 18L32 20L34 20L34 18 Z M 36 18L36 20L38 20L38 18 Z M 40 18L40 20L42 20L42 18 Z M 10 21L10 25L12 25L12 21 Z M 14 21L14 25L16 25L16 21 Z M 18 21L18 25L20 25L20 21 Z M 22 21L22 25L24 25L24 21 Z M 32 22L32 24L34 24L34 22 Z M 36 22L36 24L38 24L38 22 Z M 40 22L40 24L42 24L42 22 Z M 32 26L32 28L34 28L34 26 Z M 36 26L36 28L38 28L38 26 Z M 40 26L40 28L42 28L42 26 Z M 10 27L10 31L12 31L12 27 Z M 14 27L14 31L16 31L16 27 Z M 18 27L18 31L20 31L20 27 Z M 22 27L22 31L24 31L24 27 Z M 32 30L32 32L34 32L34 30 Z M 36 30L36 32L38 32L38 30 Z M 40 30L40 32L42 32L42 30 Z M 10 33L10 37L12 37L12 33 Z M 14 33L14 37L16 37L16 33 Z M 18 33L18 37L20 37L20 33 Z M 22 33L22 37L24 37L24 33 Z M 32 34L32 36L34 36L34 34 Z M 36 34L36 36L38 36L38 34 Z M 40 34L40 36L42 36L42 34 Z M 32 38L32 40L34 40L34 38 Z M 36 38L36 40L38 40L38 38 Z M 40 38L40 40L42 40L42 38 Z M 10 39L10 44L12 44L12 39 Z M 22 39L22 44L24 44L24 39 Z M 32 42L32 44L34 44L34 42 Z M 36 42L36 44L38 44L38 42 Z M 40 42L40 44L42 44L42 42Z"/>
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg leading-tight tracking-tight">
                                Sarvadnya
                            </span>
                            <span className="text-[#E9F1FA] font-medium text-[10px] uppercase tracking-wider leading-none">
                                Infotech LLP
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed text-white/90 font-medium">
                        Certified Tally Partner providing end-to-end business solutions, 
                        cloud migration, and professional technical support to streamline your 
                        accounting and compliance workflows.
                    </p>

                    <div className="flex gap-4">
                        {socialLinks.map((social) => (
                            <a 
                                key={social.name}
                                href={social.url}
                                className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center ${social.hoverColor} hover:text-white transition-all duration-300 bg-white/5`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#00ABE4] transition-colors flex items-center gap-2 group/link">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ABE4] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#00ABE4] transition-colors flex items-center gap-2 group/link">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ABE4] opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            Terms & Conditions
                        </Link>
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Tally Products</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        {products.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-[#E9F1FA] transition-colors hover-underline-animation py-1 font-bold">
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
                                <Link href={item.href} className="hover:text-[#E9F1FA] transition-colors hover-underline-animation py-1 font-bold">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support on Tally */}
                <div>
                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-8">Support on Tally</h3>
                    <ul className="space-y-4 text-sm text-white/80">
                        {supportOnTally.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-[#E9F1FA] transition-colors hover-underline-animation py-1 font-bold">
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
                            <svg className="w-5 h-5 text-[#00ABE4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${supportEmail}`} className="hover:text-[#E9F1FA] transition-colors font-bold">{supportEmail}</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#00ABE4] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div className="flex flex-col gap-3">
                                {supportPhone.split(',').map((num, i) => (
                                    <a key={i} href={`tel:${num.trim()}`} className="hover:text-[#E9F1FA] transition-colors block leading-tight font-black">
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
                <div className="flex gap-6">
                    <Link href="/careers" className="hover:text-white transition-colors">Careers</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
                </div>
            </div>
        </footer>
    );
}
