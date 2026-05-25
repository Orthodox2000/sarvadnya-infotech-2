'use client';

import { useState, useEffect, useMemo } from 'react';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function TutorialsPage() {
    const [tutorials, setTutorials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFolder, setActiveFolder] = useState('All');

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const response = await fetch('/api/tutorials');
                const data = await response.json();
                if (data && !data.error) {
                    setTutorials(data);
                }
            } catch (err) {
                console.error('Error fetching tutorials:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTutorials();
    }, []);

    const folders = useMemo(() => {
        const sets = new Set(tutorials.map(t => t.folder || 'General'));
        return ['All', ...Array.from(sets)];
    }, [tutorials]);

    const filteredTutorials = useMemo(() => {
        return tutorials.filter(t => {
            const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (t.tags && t.tags.some((tag: string = '') => tag.toLowerCase().includes(searchQuery.toLowerCase())));
            const matchesFolder = activeFolder === 'All' || (t.folder || 'General') === activeFolder;
            return matchesSearch && matchesFolder;
        });
    }, [tutorials, searchQuery, activeFolder]);

    const getYoutubeId = (url: string) => {
        if (!url) return '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return url.split('v=')[1]?.split('&')[0] || url.split('/').pop() || '';
        }
        return url;
    };

    const getYoutubeThumbnail = (url: string) => {
        const id = getYoutubeId(url);
        return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-[#0371a3] bg-[#f0f9ff]/30">Loading Learning Center...</div>;

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#E9F1FA]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0371a3]">Expert Resources</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Learning & <span className="text-[#00ABE4]">Support Hub</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Professional guides, webinars, and technical documentation to master TallyPrime and scale your business.
                    </p>
                </div>

                {/* Search and Tabs */}
                <div className="mb-12 space-y-8">
                    <div className="max-w-2xl mx-auto relative group">
                        <input 
                            type="text" 
                            placeholder="Search by topic, feature or tags (e.g. GST, Cloud...)"
                            className="w-full pl-14 pr-6 py-4 bg-[#f0f9ff]/50 border border-[#E9F1FA] rounded-[2rem] shadow-sm focus:ring-4 focus:ring-[#00ABE4]/5 focus:border-[#00ABE4] outline-none transition-all text-slate-900 font-bold placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-[#00ABE4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {folders.map(folder => (
                            <button
                                key={folder}
                                onClick={() => setActiveFolder(folder)}
                                className={`px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                                    activeFolder === folder 
                                    ? 'bg-[#0371a3] text-white shadow-xl shadow-[#0371a3]/20 scale-105' 
                                    : 'bg-white border border-[#E9F1FA] text-slate-500 hover:border-[#00ABE4] hover:text-[#00ABE4]'
                                }`}
                            >
                                {folder}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
                    {filteredTutorials.map((video) => (
                        <div 
                            key={video._id} 
                            className="group bg-white rounded-[2.5rem] overflow-hidden border border-[#E9F1FA] hover:shadow-2xl hover:border-[#00ABE4]/20 transition-all duration-500 cursor-pointer flex flex-col"
                            onClick={() => video.type === 'video' ? setSelectedVideo(getYoutubeId(video.url)) : window.open(video.url, '_blank')}
                        >
                            <div className="aspect-video relative overflow-hidden bg-[#f0f9ff]">
                                {video.type === 'video' ? (
                                    <Image 
                                        src={getYoutubeThumbnail(video.url)} 
                                        alt={video.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    video.thumbnailOption === 'custom' && video.thumbnail ? (
                                        <Image 
                                            src={video.thumbnail} 
                                            alt={video.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white transition-transform duration-700 group-hover:scale-110">
                                            <img src="/logo.png" alt="Logo" className="w-16 h-auto opacity-30" />
                                        </div>
                                    )
                                )}
                                <div className="absolute inset-0 bg-[#0371a3]/5 group-hover:bg-[#0371a3]/20 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-all duration-500">
                                        {video.type === 'video' ? (
                                            <svg className="w-6 h-6 text-[#00ABE4] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-2.5 py-1 bg-white/40 backdrop-blur-md border border-white/40 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-sm">
                                        {video.folder || 'General'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 rounded-full bg-[#f0f9ff] text-[#0371a3] text-[9px] font-black uppercase tracking-widest border border-[#E9F1FA]">
                                        {video.type === 'video' ? 'Webinar' : 'Article'}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-bold">{video.date}</span>
                                </div>
                                <h3 className="text-[15px] font-black text-slate-900 mb-3 group-hover:text-[#00ABE4] transition-colors leading-tight line-clamp-2 tracking-tight">{video.title}</h3>
                                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 font-bold opacity-80">
                                    {video.description}
                                </p>
                                <div className="mt-auto pt-5 flex flex-wrap gap-1.5">
                                    {video.tags?.map((tag: string) => (
                                        <span key={tag} className="text-[9px] font-black uppercase tracking-tighter text-[#00ABE4]/60">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredTutorials.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-[#f0f9ff]/30 rounded-[3rem] border-2 border-dashed border-[#E9F1FA]">
                            <p className="text-slate-400 font-black text-xl tracking-tight">No resources found matching your criteria.</p>
                            <button onClick={() => {setSearchQuery(''); setActiveFolder('All');}} className="mt-4 text-[#00ABE4] font-black uppercase tracking-widest text-xs underline decoration-2 underline-offset-4">Clear all filters</button>
                        </div>
                    )}
                </div>
                
                <div className="mt-24 bg-[#0371a3] rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden group shadow-[0_30px_100px_rgba(3,113,163,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter">Need Specialized Training?</h2>
                        <p className="text-white/70 mb-12 max-w-2xl mx-auto text-sm md:text-xl font-bold leading-relaxed">
                            Our certified Tally experts provide personalized one-on-one sessions tailored to your specific industry workflow and requirements.
                        </p>
                        <a 
                            href="mailto:contact@sarvadnya-infotech.com" 
                            className="inline-flex items-center justify-center bg-white text-[#0371a3] px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#E9F1FA] hover:scale-105 transition-all transform active:scale-95 shadow-2xl"
                        >
                            Schedule Expert Training
                        </a>
                    </div>
                    {/* Atmospheric background shapes */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000" />
                </div>
            </main>

            {/* Video Modal */}
            {selectedVideo && (
                <div 
                    className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button 
                        className="absolute top-8 right-8 text-white hover:text-[#00ABE4] transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVideo(null);
                        }}
                    >
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div 
                        className="w-full max-w-5xl aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,171,228,0.2)] relative border border-white/5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?autoplay=1`}
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
