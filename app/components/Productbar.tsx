'use client';

import { useState, useEffect, type CSSProperties, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { productItems } from "@/lib/product-nav";

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

const Productbar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
      className="w-full border-b border-black/5 relative z-[30] h-[31px] flex items-center overflow-x-clip no-scrollbar transition-all duration-300 shadow-sm"
      style={{ 
        backgroundColor: 'var(--background-color)',
      } as CSSProperties}
    >
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 flex justify-between items-stretch h-full">
        {/* Company Logo & Name */}
        <Link href="/" className="flex items-center gap-1 pr-2 sm:pr-4 transition-opacity hover:opacity-80 shrink-0 border-r border-black/5 mr-1" onClick={handleLinkClick}>
          <Image 
            src="/logo.png" 
            alt="Sarvadnya" 
            width={15} 
            height={15} 
            className="object-contain" 
            style={{ height: 'auto' }}
          />
        </Link>

        {(productItems || []).map((item, index) => (
          <div 
            key={item.label} 
            className="relative flex-1 border-l first:border-l-0 border-black/5 flex items-center justify-center overflow-visible group"
            onMouseEnter={() => setActiveMenu(item.label)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              href={item.href}
              className={`flex flex-row items-center gap-1 sm:gap-2 transition-all duration-300 hover:opacity-100 opacity-60 h-full w-full justify-center px-1 sm:px-2`}
              onClick={(e) => {
                if ((item.subItems?.length ?? 0) > 0 && activeMenu !== item.label) {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveMenu(item.label);
                } else {
                  handleLinkClick();
                }
              }}
            >
              <div className="text-black group-hover:text-[var(--primary-color,#7338a0)] group-hover:scale-110 transition-all duration-300 shrink-0 hidden md:block">
                {iconMap[item.label] || <TallyIcon />}
              </div>
              <span className="text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-bold tracking-tight text-black group-hover:text-[var(--primary-color,#7338a0)] transition-colors whitespace-nowrap uppercase">
                {item.label}
              </span>
            </Link>


            {/* Megamenu-style dropdown - Optimized for Mobile visibility */}
            {(item.subItems?.length ?? 0) > 0 && (
              <div 
                className={`absolute top-full transition-all duration-300 ease-out z-[100]
                ${item.label === 'Company' ? 'w-[450px] md:w-[600px]' : 'w-64 md:w-72'}
                ${activeMenu === item.label ? 'pointer-events-auto visible translate-y-0 opacity-100' : 'pointer-events-none invisible translate-y-2 opacity-0'}
                ${index === 0 ? 'left-0' : index === (productItems?.length || 0) - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                onClick={e => e.stopPropagation()}
              >
                <div className="mt-1 rounded-xl border border-black/5 bg-white/95 backdrop-blur-md p-2 shadow-2xl ring-1 ring-black/5">
                  <div className={`grid gap-1 ${item.label === 'Company' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                    {(item.subItems || []).map((subItem) => (
                      <div key={subItem.id} className="relative group/sub">
                        <Link
                          href={subItem.href}
                          className="flex items-center justify-between rounded-lg px-4 py-2.5 transition-all hover:bg-[var(--background-color,#fcfaff)] group/item"
                          onClick={handleLinkClick}
                        >
                          <div className="flex flex-col">
                            <span className="block text-[11px] md:text-[12px] font-bold text-black group-hover/item:text-[var(--primary-color,#7338a0)] transition-colors">
                              {subItem.label}
                            </span>
                            {subItem.description && (
                              <span className="block text-[9px] text-slate-400 leading-tight mt-0.5 group-hover/item:text-slate-500 transition-colors">
                                {subItem.description}
                              </span>
                            )}
                          </div>
                          {(subItem.subItems?.length ?? 0) > 0 && (
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-black/20 group-hover/item:text-[var(--primary-color,#7338a0)] transition-transform group-hover/sub:rotate-90 md:group-hover/sub:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </Link>

                        {/* Nested Submenu */}
                        {(subItem.subItems?.length ?? 0) > 0 && (
                          <div className={`transition-all duration-300 pointer-events-none invisible absolute top-0 w-56 opacity-0 group-hover/sub:pointer-events-auto group-hover/sub:visible group-hover/sub:opacity-100
                                ${index > (productItems?.length || 0) / 2 ? 'right-full mr-1 translate-x-2 group-hover/sub:translate-x-0' : 'left-full ml-1 -translate-x-2 group-hover/sub:translate-x-0'}`}>
                            <div className="rounded-xl border border-black/5 bg-white/95 backdrop-blur-md p-1.5 shadow-xl ring-1 ring-black/5">
                              {(subItem.subItems || []).map((nestedItem) => (
                                <Link
                                  key={nestedItem.id}
                                  href={nestedItem.href}
                                  className="block rounded-lg px-3 py-2 transition-all hover:bg-[var(--background-color,#fcfaff)] group/news text-[11px] font-bold text-slate-600 hover:text-[var(--primary-color,#7338a0)]"
                                  onClick={handleLinkClick}
                                >
                                  {nestedItem.label}
                                </Link>
                              ))}
                            </div>
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