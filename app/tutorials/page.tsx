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
                                 (t.tags && t.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
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

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-[#7338a0]">Loading Learning Center...</div>;

    return (
        <div className="min-h-screen bg-[var(--background-color)]">
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-[var(--heading-color)] mb-4 tracking-tight">Learning & Support Hub</h1>
                    <p className="text-lg text-[var(--para-color)] max-w-2xl mx-auto font-medium opacity-80">
                        Expert guides, webinars, and tutorials to master TallyPrime and scale your business.
                    </p>
                </div>

                {/* Search and Tabs */}
                <div className="mb-12 space-y-8">
                    <div className="max-w-2xl mx-auto relative group">
                        <input 
                            type="text" 
                            placeholder="Search by topic, feature or tags (e.g. GST, Cloud...)"
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-3xl shadow-sm focus:ring-4 focus:ring-[#7338a0]/10 focus:border-[#7338a0] outline-none transition-all text-slate-800 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-[#7338a0] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {folders.map(folder => (
                            <button
                                key={folder}
                                onClick={() => setActiveFolder(folder)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                                    activeFolder === folder 
                                    ? 'bg-[#7338a0] text-white shadow-lg shadow-[#7338a0]/20 scale-105' 
                                    : 'bg-white border border-slate-200 text-slate-500 hover:border-[#7338a0] hover:text-[#7338a0]'
                                }`}
                            >
                                {folder}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                    {filteredTutorials.map((video) => (
                        <div 
                            key={video._id} 
                            className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col"
                            onClick={() => video.type === 'video' ? setSelectedVideo(getYoutubeId(video.url)) : window.open(video.url, '_blank')}
                        >
                            <div className="aspect-video relative overflow-hidden bg-slate-50">
                                <Image 
                                    src={video.type === 'video' ? getYoutubeThumbnail(video.url) : '/BG1.png'} 
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-all duration-500">
                                        {video.type === 'video' ? (
                                            <svg className="w-8 h-8 text-[#7338a0] ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                                        {video.folder || 'General'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-7 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                        {video.type === 'video' ? 'Webinar' : 'Article'}
                                    </span>
                                    <span className="text-slate-400 text-[11px] font-medium">{video.date}</span>
                                </div>
                                <h3 className="text-xl font-black text-[var(--heading-color)] mb-3 group-hover:text-[#7338a0] transition-colors leading-tight">{video.title}</h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 font-medium opacity-80">
                                    {video.description}
                                </p>
                                <div className="mt-auto pt-6 flex flex-wrap gap-2">
                                    {video.tags?.map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-bold text-[#7338a0]/60">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredTutorials.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-bold text-lg">No resources found matching your criteria.</p>
                            <button onClick={() => {setSearchQuery(''); setActiveFolder('All');}} className="mt-4 text-[#7338a0] font-bold underline">Clear filters</button>
                        </div>
                    )}
                </div>
                
                <div className="mt-20 bg-[#0f0529] rounded-[40px] p-10 md:p-16 text-center text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#7338a0]/20 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Need Specialized Training?</h2>
                        <p className="text-white/60 mb-10 max-w-xl mx-auto text-sm md:text-lg font-medium">
                            Our certified experts provide custom one-on-one sessions tailored to your specific industry requirements.
                        </p>
                        <a 
                            href="mailto:contact@sarvadnya-infotech.com" 
                            className="inline-flex items-center justify-center bg-white text-[#0f0529] px-10 py-4 rounded-full font-black text-sm uppercase tracking-wider hover:bg-[#7338a0] hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl"
                        >
                            Schedule Expert Training
                        </a>
                    </div>
                </div>
            </main>

            {/* Video Modal */}
            {selectedVideo && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedVideo(null)}
                >
                    <button 
                        className="absolute top-8 right-8 text-white hover:text-[#7338a0] transition-colors"
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
                        className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(115,56,160,0.3)] relative"
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
