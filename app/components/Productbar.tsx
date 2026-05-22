'use client';

import { useState, useEffect, type CSSProperties, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { productItems, type ProductSubItem } from "@/lib/product-nav";
import { fetchWithCache, prefetchData } from "@/lib/client-api";

// Simple Minimalist Icons for Apple-style bar
const TallyIcon = memo(() => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>);
const BoxIcon = memo(() => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>);
const ToolIcon = memo(() => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z"/></svg>);
const GraduationIcon = memo(() => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path d="M5 14v7a3 3 0 003 3h8a3 3 0 003-3v-7"/></svg>);
const InfoIcon = memo(() => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>);

TallyIcon.displayName = 'TallyIcon';
BoxIcon.displayName = 'BoxIcon';
ToolIcon.displayName = 'ToolIcon';
GraduationIcon.displayName = 'GraduationIcon';
InfoIcon.displayName = 'InfoIcon';

const iconMap: Record<string, React.ReactNode> = {
  "Products": <TallyIcon />,
  "Modules": <BoxIcon />,
  "Services": <ToolIcon />,
  "Learning": <GraduationIcon />,
  "Company": <InfoIcon />
};

const Productbar = ({ initialSettings }: { initialSettings?: any }) => {
  const [settings, setSettings] = useState<any>(initialSettings || null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [dynamicModules, setDynamicModules] = useState<ProductSubItem[]>([]);

  useEffect(() => {
    if (!initialSettings) {
      const fetchSettings = async () => {
        try {
          const data = await fetchWithCache('/api/settings');
          if (data && !data.error) setSettings(data);
        } catch (err) {
          console.error('Failed to fetch settings:', err);
        }
      };
      fetchSettings();
    }
  }, [initialSettings]);

  // Fetch dynamic modules with client-side caching
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const data = await fetchWithCache('/api/modules');
        if (Array.isArray(data)) {
          setDynamicModules(data.map(m => ({
            id: m._id,
            label: m.title,
            href: `/modules?id=${m._id}`,
            description: m.shortDescription
          })));
        }
      } catch (err) {
        console.error('Failed to fetch modules for productbar:', err);
      }
    };
    fetchModules();
  }, []);

  // Merge dynamic modules into productItems
  const items = (productItems || []).map(item => {
    if (item.label === 'Modules' && dynamicModules.length > 0) {
      return {
        ...item,
        subItems: dynamicModules
      };
    }
    return item;
  });

  // Background warmer for sub-items on hover
  const handleItemHover = (label: string) => {
    // Only set active menu on hover for desktop
    if (window.innerWidth >= 640) {
      setActiveMenu(label);
      if (label === 'Learning') prefetchData('/api/tutorials');
      if (label === 'Company') {
          prefetchData('/api/content?section=about');
          prefetchData('/api/content?section=team');
      }
    }
  };

  const handleMenuToggle = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenu(prev => prev === label ? null : label);
    
    // Prefetch for specific menus
    if (label === 'Learning') prefetchData('/api/tutorials');
    if (label === 'Company') {
        prefetchData('/api/content?section=about');
        prefetchData('/api/content?section=team');
    }
  };

  // Close menu on click
  const handleLinkClick = useCallback(() => {
    setActiveMenu(null);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  return (
    <div 
      className="w-full border-b border-slate-200 relative z-[30] h-[31px] flex items-center overflow-x-clip no-scrollbar transition-all duration-300 shadow-sm"
      style={{ 
        backgroundColor: 'var(--background-color)',
      } as CSSProperties}
    >
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 flex justify-between items-stretch h-full">
        {/* Company Logo & Name */}
        <Link 
            href="/capabilities" 
            className="flex items-center gap-1 pr-2 sm:pr-4 transition-opacity hover:opacity-80 shrink-0 border-r border-slate-200 mr-1" 
            onClick={handleLinkClick}
        >
          <Image 
            src="/logo.png" 
            alt="Sarvadnya" 
            width={15} 
            height={15} 
            className="object-contain" 
            style={{ width: '15px', height: 'auto' }}
          />
        </Link>

        {items.map((item, index) => (
          <div 
            key={item.label} 
            className="relative flex items-center h-full group"
            onMouseEnter={() => handleItemHover(item.label)}
            onMouseLeave={() => window.innerWidth >= 640 && setActiveMenu(null)}
          >
            <button
              onClick={(e) => handleMenuToggle(e, item.label)}
              className={`flex items-center gap-1.5 px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold transition-all h-full
                ${activeMenu === item.label ? 'text-[#7338a0] bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                {iconMap[item.label]}
              </span>
              <span className="tracking-tight">{item.label}</span>
              <svg 
                className={`w-2.5 h-2.5 transition-transform duration-300 opacity-30 ${activeMenu === item.label ? 'rotate-180 opacity-100' : ''}`} 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Megamenu Content */}
            {activeMenu === item.label && item.subItems && (
              <div 
                className={`absolute top-[31px] w-[85vw] sm:w-screen max-w-[240px] sm:max-w-[400px] animate-in fade-in slide-in-from-top-1 duration-200 pointer-events-auto
                  ${index <= 1 ? '-left-2 sm:left-0' : index >= 3 ? '-right-2 sm:right-0' : 'left-1/2 -translate-x-1/2'}
                `}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white/95 backdrop-blur-xl border border-slate-100 rounded-b-2xl shadow-2xl overflow-hidden">
                  <div className="p-2 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 max-h-[70vh] overflow-y-auto no-scrollbar">
                    {(item.subItems || []).map((subItem: ProductSubItem) => (
                      <div key={subItem.id} className="flex flex-col gap-1">
                        <Link
                          href={subItem.href}
                          className="flex flex-col rounded-lg px-3 py-2 transition-all hover:bg-slate-50 group/item"
                          onClick={handleLinkClick}
                          onMouseEnter={() => {
                            if (subItem.href.includes('section=')) prefetchData(`/api/content?section=${subItem.href.split('section=')[1]}`);
                          }}
                        >
                          <span className="text-[11px] font-bold text-slate-900 group-hover/item:text-[#7338a0] transition-colors flex items-center gap-1.5">
                            {subItem.label}
                            <svg className="w-2.5 h-2.5 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          {subItem.description && (
                            <span className="text-[9px] text-slate-500 leading-tight mt-0.5 group-hover/item:text-slate-700 transition-colors">
                              {subItem.description}
                            </span>
                          )}
                        </Link>
                        
                        {(subItem.subItems?.length ?? 0) > 0 && (
                          <div className="flex flex-col gap-1 ml-3 pl-3 border-l border-slate-100">
                            {(subItem.subItems || []).map((nestedItem: ProductSubItem) => (
                              <Link
                                key={nestedItem.id}
                                href={nestedItem.href}
                                className="block py-1 px-3 rounded-md text-[10px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                onClick={handleLinkClick}
                              >
                                {nestedItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Productbar);
