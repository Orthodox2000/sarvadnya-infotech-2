'use client';

import { useState, useEffect, useMemo } from 'react';
import Footer from '../components/Footer';
import Image from 'next/image';

export default function TutorialsPage() {
    const [tutorials, setTutorials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTutorial, setSelectedTutorial] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
    };

    const openDetails = (tutorial: any) => {
        setSelectedTutorial(tutorial);
        setIsModalOpen(true);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-[#0371a3] bg-[#f0f9ff]/30">Loading Learning Center...</div>;

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#E9F1FA]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0371a3]">Expert Resources</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Learning & <span className="text-[#00ABE4]">Support Hub</span>
                    </h1>
                    <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
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
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 min-h-[400px]">
                    {filteredTutorials.map((tutorial) => (
                        <div 
                            key={tutorial._id} 
                            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-[#0371a3]/20 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full shadow-sm"
                        >
                            <div className="aspect-video relative overflow-hidden bg-slate-100 shrink-0">
                                {tutorial.type === 'video' ? (
                                    <Image 
                                        src={getYoutubeThumbnail(tutorial.url)} 
                                        alt={tutorial.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    tutorial.thumbnailOption === 'custom' && tutorial.thumbnail ? (
                                        <Image 
                                            src={tutorial.thumbnail} 
                                            alt={tutorial.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white transition-transform duration-700 group-hover:scale-110">
                                            <img src="/logo.svg" alt="Logo" className="w-12 h-auto opacity-30" style={{ filter: 'invert(31%) sepia(94%) saturate(1131%) hue-rotate(167deg) brightness(91%) contrast(98%)' }} />
                                        </div>
                                    )
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-500">
                                        <svg className="w-6 h-6 text-[#0371a3] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[#0371a3] text-[9px] font-bold uppercase tracking-widest rounded-lg shadow-sm border border-white/50">
                                        {tutorial.folder || 'General'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${tutorial.type === 'video' ? 'bg-rose-500' : 'bg-sky-500'}`} />
                                        <span className="text-slate-400 text-[9px] font-medium uppercase tracking-wider">{tutorial.date}</span>
                                    </div>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 mb-3 group-hover:text-[#0371a3] transition-colors leading-snug line-clamp-2 tracking-tight flex-1 min-h-[2.5rem]">
                                    {tutorial.title}
                                </h3>
                                
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {tutorial.tags?.slice(0, 2).map((tag: string) => (
                                        <span key={tag} className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[8px] font-semibold rounded-md border border-slate-100 uppercase tracking-tighter">#{tag}</span>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => openDetails(tutorial)}
                                    className="w-full py-2 bg-[#0371a3]/5 text-[#0371a3] text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#0371a3] hover:text-white transition-all border border-[#0371a3]/10"
                                >
                                    Explore
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredTutorials.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#f0f9ff]/30 rounded-[3rem] border-2 border-dashed border-[#E9F1FA]">
                            <p className="text-slate-400 font-black text-lg tracking-tight">No resources found.</p>
                            <button onClick={() => {setSearchQuery(''); setActiveFolder('All');}} className="mt-3 text-[#00ABE4] font-black uppercase tracking-widest text-[10px] underline decoration-2 underline-offset-4">Clear filters</button>
                        </div>
                    )}
                </div>
                
                <div className="mt-20 bg-[#0371a3] rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter">Need Specialized Training?</h2>
                        <p className="text-white/70 mb-8 max-w-xl mx-auto text-xs md:text-base font-bold leading-relaxed">
                            Our certified Tally experts provide personalized one-on-one sessions tailored to your industry workflow.
                        </p>
                        <a 
                            href="mailto:contact@sarvadnya-infotech.com" 
                            className="inline-flex items-center justify-center bg-white text-[#0371a3] px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#E9F1FA] hover:scale-105 transition-all transform active:scale-95 shadow-xl"
                        >
                            Schedule Training
                        </a>
                    </div>
                    <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                </div>
            </main>

            {/* Detailed View Modal */}
            {isModalOpen && selectedTutorial && (
                <div 
                    className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative w-full max-w-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="overflow-y-auto no-scrollbar">
                            {selectedTutorial.type === 'video' ? (
                                <div className="aspect-video w-full bg-black">
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(selectedTutorial.url)}?autoplay=0`}
                                        title="Video Player"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="aspect-video w-full relative bg-[#f0f9ff] flex items-center justify-center">
                                     <Image 
                                        src={selectedTutorial.thumbnail || '/logo.svg'} 
                                        alt={selectedTutorial.title}
                                        fill
                                        className="object-cover opacity-20"
                                        style={{ filter: selectedTutorial.thumbnail ? 'none' : 'invert(31%) sepia(94%) saturate(1131%) hue-rotate(167deg) brightness(91%) contrast(98%)' }}
                                    />
                                    <div className="relative z-10 flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                            <svg className="w-8 h-8 text-[#0371a3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                        <span className="text-xs font-black text-[#0371a3] uppercase tracking-widest">Article Resource</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-sky-50 text-[#0371a3] text-[10px] font-black uppercase tracking-widest rounded-full border border-sky-100">
                                        {selectedTutorial.folder || 'General'}
                                    </span>
                                    <span className="text-slate-400 text-[10px] font-bold tracking-widest">{selectedTutorial.date}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{selectedTutorial.title}</h2>
                                <p className="text-slate-600 leading-relaxed text-sm md:text-base mb-8 font-medium">
                                    {selectedTutorial.description}
                                </p>
                                
                                <div className="flex flex-wrap gap-2 mb-10">
                                    {selectedTutorial.tags?.map((tag: string) => (
                                        <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">#{tag}</span>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {selectedTutorial.type === 'video' ? (
                                        <a 
                                            href={selectedTutorial.url}
                                            target="_blank"
                                            className="flex-1 py-4 bg-[#0371a3] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all flex items-center justify-center gap-3"
                                        >
                                            Watch on YouTube
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                        </a>
                                    ) : (
                                        <a 
                                            href={selectedTutorial.url}
                                            target="_blank"
                                            className="flex-1 py-4 bg-[#0371a3] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#00ABE4] transition-all flex items-center justify-center gap-3"
                                        >
                                            Open Full Article
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                        </a>
                                    )}
                                    <button 
                                        className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Close Hub
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

