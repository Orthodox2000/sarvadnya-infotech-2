'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+919876543210";
    const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@sarvadnyainfotech.com";
    const officeAddress = process.env.NEXT_PUBLIC_OFFICE_ADDRESS || "123, Business Center, Main Road, Pune - 411001";
    const mapUrl = process.env.NEXT_PUBLIC_MAP_IFRAME_URL || "";
    
    const socialLinks = [
        { name: 'WhatsApp', url: `https://wa.me/${supportPhone.replace(/\D/g, '')}`, hoverColor: 'hover:bg-[#25D366] hover:border-[#25D366]', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.002 12.048c0 2.12.54 4.19 1.563 6.024L0 24l6.135-1.608a11.81 11.81 0 005.908 1.567h.005c6.635 0 12.045-5.411 12.047-12.047 0-3.217-1.252-6.242-3.525-8.514z"/></svg>
        )},
        { name: 'Facebook', url: process.env.NEXT_PUBLIC_FACEBOOK_URL || '#', hoverColor: 'hover:bg-[#1877F2] hover:border-[#1877F2]', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        )},
        { name: 'Instagram', url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#', hoverColor: 'hover:bg-[#E4405F] hover:border-[#E4405F]', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
        )},
        { name: 'LinkedIn', url: process.env.NEXT_PUBLIC_LINKEDIN_URL || '#', hoverColor: 'hover:bg-[#0077B5] hover:border-[#0077B5]', icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
        )}
    ];

    const products = [
        { name: 'TallyPrime Silver', href: '/products#compare' },
        { name: 'TallyPrime Gold', href: '/products#compare' },
        { name: 'AWS Cloud Server', href: '/products#cloud' },
        { name: 'NoSky Backup', href: '/services#nosky-backup' },
        { name: 'Excel to Tally Import', href: '/products#modules' }
    ];

    const services = [
        { name: 'TSS Renewal', href: '/products' },
        { name: 'Annual Support (AMC)', href: '/products' },
        { name: 'C&F / Transport Module', href: '/products#modules' },
        { name: 'Garment / Retail Module', href: '/products#modules' },
        { name: 'Corporate Training', href: '/tutorials' }
    ];

    return (
        <footer className="bg-[var(--heading-color)] text-white pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Company Info */}
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-lg bg-white p-1">
                            <Image 
                                src="/logo.png" 
                                alt="Sarvadnya Infotech" 
                                fill
                                className="object-contain"
                                sizes="40px"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg leading-tight tracking-tight">
                                Sarvadnya
                            </span>
                            <span className="text-white/80 font-medium text-[10px] uppercase tracking-wider leading-none">
                                Infotech LLP
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm leading-relaxed text-white/90">
                        Certified Tally Partner providing end-to-end business solutions, 
                        cloud migration, and expert technical support to streamline your 
                        accounting and compliance workflows.
                    </p>

                    <div className="flex gap-4">
                        {socialLinks.map((social) => (
                            <a 
                                key={social.name}
                                href={social.url}
                                className={`w-10 h-10 rounded-full border border-white/20 flex items-center justify-center ${social.hoverColor} hover:text-white transition-all duration-300`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h3 className="text-white font-bold mb-6">Our Products</h3>
                    <ul className="space-y-4 text-sm text-white/90">
                        {products.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-white transition-colors hover-underline-animation py-1">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-white font-bold mb-6">Our Services</h3>
                    <ul className="space-y-4 text-sm text-white/90">
                        {services.map((service) => (
                            <li key={service.name}>
                                <Link href={service.href} className="hover:text-white transition-colors hover-underline-animation py-1">
                                    {service.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Map */}
                <div className="space-y-6">
                    <h3 className="text-white font-bold mb-6">Get In Touch</h3>
                    <ul className="space-y-4 text-sm mb-6 text-white/90">
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${supportEmail}`} className="hover:text-white transition-colors">{supportEmail}</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${supportPhone}`} className="hover:text-white transition-colors">{supportPhone}</a>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{officeAddress}</span>
                        </li>
                    </ul>
                    
                    {/* Map Iframe */}
                    {mapUrl && (
                        <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <iframe 
                                src={mapUrl}
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
                    <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
