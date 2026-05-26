'use client';

import { useState } from 'react';
import Link from 'next/link';
import { palettes, Palette } from '@/lib/palettes';
import Footer from '@/app/components/Footer';
import NotificationToast, { showToast } from '@/app/components/NotificationToast';

export default function PalettePage() {
  const [selectedPalette, setSelectedPalette] = useState<Palette>(palettes[0]);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  const activeBg = selectedPalette.backgrounds[activeBgIndex];

  const handleFinalize = async () => {
    showToast("Palette Selection is currently locked for Brand Consistency.", 'error');
    return;
    // setIsApplying(true);
    // try {
    //   const response = await fetch('/api/admin/theme', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       paletteId: selectedPalette.id,
    //       bgIndex: activeBgIndex
    //     })
    //   });
    //   
    //   const data = await response.json();
    //   if (data && data.success) {
    //     showToast(`Palette "${selectedPalette.name}" with "${activeBg.name}" background has been applied!`, 'success');
    //   } else {
    //     throw new Error((data && data.error) || 'Failed to apply theme');
    //   }
    // } catch (err: any) {
    //   showToast(err.message, 'error');
    // } finally {
    //   setIsApplying(false);
    // }
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: activeBg.value }}
    >
      <NotificationToast />

      {/* Locked Message */}
      <div className="bg-red-500 text-white py-2 px-6 text-center text-[10px] font-black uppercase tracking-[0.3em] sticky top-0 z-[100]">
        Palette Selection is currently locked for Brand Consistency.
      </div>

      {/* Hero Section - Dynamically Colored */}
      <section 
        className="relative pt-8 pb-12 md:pt-12 md:pb-20 px-6 transition-colors duration-500"
        style={{ backgroundColor: selectedPalette.secondary }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div 
            className="absolute top-0 right-0 w-[40%] h-[40%] blur-[120px] rounded-full"
            style={{ backgroundColor: selectedPalette.accent }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-2xl">
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 transition-all"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                borderColor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)'
              }}
            >
              <span 
                className="flex h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: selectedPalette.primary }}
              ></span>
              Interactive Design System (Locked)
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Brand Identity <br />
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r"
                style={{ 
                  backgroundImage: `linear-gradient(to right, ${selectedPalette.primary}, ${selectedPalette.accent})` 
                }}
              >
                Palette Selector
              </span>
            </h1>
            <p className="text-white/60 text-sm md:text-base max-w-lg leading-relaxed font-medium">
              Experience our curated color architectures. Palette Selection is currently locked for Brand Consistency.
            </p>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4">
             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center backdrop-blur-sm">
                <div className="text-3xl font-black text-white">{palettes.length}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Schemes</div>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl text-center backdrop-blur-sm">
                <div className="text-3xl font-black text-white">∞</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Combinations</div>
             </div>
          </div>
        </div>
      </section>

      {/* Palette Selection Bar */}
      <nav className="sticky top-[127px] z-[45] bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm overflow-x-auto no-scrollbar pointer-events-none opacity-50">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-8 min-w-max">
            {palettes.map((palette) => (
              <li key={palette.id}>
                <button
                  disabled
                  className={`py-5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-3
                    ${selectedPalette.id === palette.id 
                      ? 'border-[var(--active-color)] text-slate-900 opacity-100' 
                      : 'border-transparent text-slate-400 opacity-60'}`}
                  style={{ '--active-color': palette.primary } as any}
                >
                  <span 
                    className="w-3 h-3 rounded-full shadow-inner"
                    style={{ backgroundColor: palette.primary }}
                  />
                  {palette.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Selector Interface */}
      <div className="pointer-events-none opacity-75">
        <main className="py-12 md:py-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Sidebar: Shade & Combination Controls */}
            <div className="lg:col-span-4 space-y-10">
              <div>
                <h3 
                  className="text-xs font-black uppercase tracking-[0.2em] mb-6 transition-colors duration-500"
                  style={{ color: activeBg.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                >
                  Background Shades
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedPalette.backgrounds.map((bg, idx) => (
                    <button
                      key={idx}
                      disabled
                      className={`group relative p-4 rounded-2xl border-2 transition-all text-left overflow-hidden
                        ${activeBgIndex === idx ? 'scale-105 shadow-xl' : 'opacity-80'}`}
                      style={{ 
                        backgroundColor: bg.value, 
                        borderColor: activeBgIndex === idx ? selectedPalette.primary : 'rgba(0,0,0,0.05)' 
                      }}
                    >
                      <div 
                        className="text-[10px] font-bold uppercase tracking-wider transition-colors duration-500"
                        style={{ color: bg.isDark ? 'white' : 'black' }}
                      >
                        {bg.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 
                  className="text-xs font-black uppercase tracking-[0.2em] mb-6 transition-colors duration-500"
                  style={{ color: activeBg.isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
                >
                  Color Combinations
                </h3>
                <div className="space-y-4">
                  {selectedPalette.combinations.map((combo, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-3xl border transition-all"
                      style={{ 
                        backgroundColor: activeBg.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                        borderColor: activeBg.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                      }}
                    >
                      <div 
                        className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60"
                        style={{ color: activeBg.isDark ? 'white' : 'black' }}
                      >
                        {combo.name}
                      </div>
                      <div className="flex -space-x-3">
                        {combo.colors.map((color, cIdx) => (
                          <div 
                            key={cIdx}
                            className="w-10 h-10 rounded-2xl border-4 shadow-sm"
                            style={{ 
                              backgroundColor: color,
                              borderColor: activeBg.isDark ? '#1a1a1a' : 'white'
                            }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled
                className="w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-white shadow-2xl opacity-50 cursor-not-allowed flex items-center justify-center gap-3"
                style={{ 
                  backgroundColor: selectedPalette.primary,
                  boxShadow: `0 20px 40px -10px ${selectedPalette.primary}40`
                }}
              >
                Selection Locked
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            </div>

            {/* Right Area: Large Preview */}
            <div className="lg:col-span-8 space-y-8">
              <div 
                className="p-10 md:p-16 rounded-[3rem] border transition-all duration-500 overflow-hidden relative"
                style={{ 
                  backgroundColor: activeBg.isDark ? 'rgba(255,255,255,0.02)' : 'white',
                  borderColor: `${selectedPalette.primary}20`
                }}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg"
                      style={{ backgroundColor: selectedPalette.primary }}
                    >
                      {selectedPalette.name.charAt(0)}
                    </div>
                    <div>
                      <h2 
                        className="text-2xl md:text-4xl font-black leading-tight transition-colors duration-500"
                        style={{ color: selectedPalette.heading }}
                      >
                        {selectedPalette.name}
                      </h2>
                      <p 
                        className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mt-1 transition-colors duration-500"
                        style={{ color: selectedPalette.paragraph }}
                      >
                        Architecture Preview
                      </p>
                    </div>
                  </div>

                  <p 
                    className="text-lg md:text-xl font-medium leading-relaxed italic mb-12 transition-colors duration-500"
                    style={{ color: selectedPalette.paragraph }}
                  >
                    "{selectedPalette.description}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      className="p-8 rounded-[2rem] border transition-all"
                      style={{ 
                        backgroundColor: `${selectedPalette.primary}08`,
                        borderColor: `${selectedPalette.primary}15`
                      }}
                    >
                      <h4 
                        className="font-black text-lg mb-3"
                        style={{ color: selectedPalette.primary }}
                      >
                        Primary Accents
                      </h4>
                      <p 
                        className="text-sm leading-relaxed font-medium"
                        style={{ color: selectedPalette.paragraph }}
                      >
                        This color is used for call-to-actions, primary icons, and brand-defining borders.
                      </p>
                      <div 
                        className="mt-6 h-1 w-20 rounded-full"
                        style={{ backgroundColor: selectedPalette.primary }}
                      />
                    </div>

                    <div 
                      className="p-8 rounded-[2rem] border transition-all"
                      style={{ 
                        backgroundColor: `${selectedPalette.accent}08`,
                        borderColor: `${selectedPalette.accent}15`
                      }}
                    >
                      <h4 
                        className="font-black text-lg mb-3"
                        style={{ color: selectedPalette.accent }}
                      >
                        Secondary Depth
                      </h4>
                      <p 
                        className="text-sm leading-relaxed font-medium"
                        style={{ color: selectedPalette.paragraph }}
                      >
                        Used for gradients, hover states, and supporting visual elements to create depth.
                      </p>
                      <div 
                        className="mt-6 h-1 w-20 rounded-full"
                        style={{ backgroundColor: selectedPalette.accent }}
                      />
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div 
                  className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-10 rounded-full -mr-32 -mt-32"
                  style={{ backgroundColor: selectedPalette.primary }}
                />
              </div>

              {/* Token Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {[
                   { label: 'Primary', val: selectedPalette.primary },
                   { label: 'Secondary', val: selectedPalette.secondary },
                   { label: 'Accent', val: selectedPalette.accent },
                   { label: 'Heading', val: selectedPalette.heading },
                 ].map((token, i) => (
                   <div 
                    key={i} 
                    className="p-4 rounded-2xl border bg-white/40 backdrop-blur-sm"
                    style={{ borderColor: activeBg.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                   >
                      <div className="w-full aspect-square rounded-xl mb-3 shadow-sm" style={{ backgroundColor: token.val }} />
                      <div 
                        className="text-[9px] font-black uppercase tracking-widest opacity-50"
                        style={{ color: activeBg.isDark ? 'white' : 'black' }}
                      >
                        {token.label}
                      </div>
                      <div 
                        className="text-xs font-bold font-mono"
                        style={{ color: activeBg.isDark ? 'white' : 'black' }}
                      >
                        {token.val}
                      </div>
                   </div>
                 ))}
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Modern Compact Footer-like CTA */}
      <section className="py-20 px-6 opacity-50 pointer-events-none">
         <div 
          className="max-w-5xl mx-auto rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl transition-colors duration-500"
          style={{ backgroundColor: selectedPalette.secondary }}
         >
            <div 
              className="absolute top-0 right-0 w-96 h-96 blur-[120px] opacity-20 -mr-48 -mt-48 rounded-full"
              style={{ backgroundColor: selectedPalette.accent }}
            />
            <div 
              className="absolute bottom-0 left-0 w-96 h-96 blur-[120px] opacity-10 -ml-48 -mb-48 rounded-full"
              style={{ backgroundColor: selectedPalette.primary }}
            />
            
            <div className="relative z-10">
               <h2 className="text-3xl md:text-5xl font-black mb-6 text-white leading-tight">Ready to transform <br />your experience?</h2>
               <p className="text-white/60 text-sm md:text-lg mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                  Once finalized, these brand tokens will be integrated into the core design system across all modules.
               </p>
               <div className="flex flex-wrap justify-center gap-6">
                  <button 
                    disabled
                    className="px-12 py-4 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest opacity-50 cursor-not-allowed"
                  >
                    Confirm Locked
                  </button>
                  <Link 
                    href="/contact"
                    className="px-12 py-4 bg-white/10 border border-white/20 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    Custom Request
                  </Link>
               </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}

