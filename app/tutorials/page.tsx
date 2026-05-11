'use client';

import { useState } from 'react';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function TutorialsPage() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const tutorials = [
        {
            id: 'MLQaGdscgQg',
            title: 'TallyPrime 4.1 - Multi-GSTIN & More',
            description: 'A comprehensive guide to the latest multi-GSTIN features and operational enhancements in TallyPrime 4.1.',
            category: 'Webinar',
            date: 'May 2026',
            thumbnail: 'https://img.youtube.com/vi/MLQaGdscgQg/maxresdefault.jpg'
        },
        {
            id: 'YrM_gQwiYCs',
            title: 'TallyPrime 5.0 - New Features & Updates',
            description: 'Learn about the latest features in TallyPrime 5.0 including GST updates, multi-GSTIN management, and more.',
            category: 'Webinar',
            date: 'May 2026',
            thumbnail: 'https://img.youtube.com/vi/YrM_gQwiYCs/maxresdefault.jpg'
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--background-color)]">
            {/* Navbar is provided by RootLayout */}
            
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-[var(--heading-color)] mb-4">Webinars & Tutorials</h1>
                    <p className="text-lg text-[var(--para-color)] max-w-2xl mx-auto">
                        Explore our collection of video resources to master TallyPrime and streamline your business operations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutorials.map((video) => (
                        <div 
                            key={video.id} 
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                            onClick={() => setSelectedVideo(video.id)}
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <Image 
                                    src={video.thumbnail} 
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-[#7338a0] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--secondary-btn-color)] text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider">
                                        {video.category}
                                    </span>
                                    <span className="text-slate-400 text-sm">{video.date}</span>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--heading-color)] mb-2 group-hover:text-[var(--primary-color)] transition-colors">{video.title}</h3>
                                <p className="text-[var(--para-color)] text-sm leading-relaxed">
                                    {video.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-16 bg-[var(--heading-color)] rounded-3xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Personalized Training?</h2>
                    <p className="text-white/70 mb-8 max-w-xl mx-auto">
                        We offer specialized one-on-one and corporate training sessions tailored to your business needs.
                    </p>
                    <a 
                        href="mailto:contact@sarvadnya-infotech.com" 
                        className="inline-block bg-[var(--primary-color)] text-white px-8 py-3 rounded-full font-bold hover:bg-[var(--secondary-color)] transition-colors"
                    >
                        Schedule a Session
                    </a>
                </div>
            </main>

            {/* Video Modal */}
            {selectedVideo && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 animate-in fade-in duration-300"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button 
                        className="absolute top-6 right-6 text-white hover:text-slate-300 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideo(null);
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div 
                        className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1&mute=1`}
                            title="Video Player"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
