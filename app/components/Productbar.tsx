import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { productItems } from "@/lib/product-nav";

// Simple Minimalist Icons for Apple-style bar
const TallyIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>;
const BoxIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>;
const ToolIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.77 3.77z"/></svg>;
const GraduationIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path d="M5 14v7a3 3 0 003 3h8a3 3 0 003-3v-7"/></svg>;
const InfoIcon = () => <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;

const iconMap: Record<string, React.ReactNode> = {
  "Products": <TallyIcon />,
  "Modules": <BoxIcon />,
  "Services": <ToolIcon />,
  "Learning": <GraduationIcon />,
  "Company": <InfoIcon />
};

export default function Productbar() {
  return (
    <div className="bg-[#fbf5ec] border-b border-black/5 sticky top-[56px] z-[90] h-11 flex items-center overflow-visible no-scrollbar">
      <div className="mx-auto w-full max-w-6xl px-1 sm:px-4 flex justify-between sm:justify-evenly items-stretch h-full">
        {/* Company Logo & Name */}
        <Link href="/" className="flex items-center gap-1 pr-1 sm:pr-4 transition-opacity hover:opacity-80 shrink-0 border-r border-black/5 mr-0.5 sm:mr-2">
          <Image src="/logo.png" alt="Sarvadnya" width={15} height={15} className="object-contain" />
        </Link>

        {productItems.map((item, index) => (
          <div key={item.label} className="group relative flex-1 border-l first:border-l-0 border-black/5 flex items-center justify-center overflow-visible">
            <Link
              href={item.href}
              className="flex flex-row items-center gap-0.5 sm:gap-1.5 transition-all duration-300 hover:opacity-100 opacity-60 h-full w-full justify-center px-0.5 sm:px-2"
            >
              <div className="text-black group-hover:text-[#7338a0] group-hover:scale-110 transition-all duration-300 shrink-0 hidden min-[480px]:block">
                {iconMap[item.label] || <TallyIcon />}
              </div>
              <span className="text-[7px] min-[360px]:text-[8px] sm:text-[10px] font-bold tracking-tight text-black group-hover:text-[#7338a0] transition-colors whitespace-nowrap uppercase">
                {item.label}
              </span>
            </Link>


            {/* Megamenu-style dropdown - Optimized for Mobile visibility */}
            {item.subItems.length > 0 && (
              <div className={`pointer-events-none invisible absolute top-full w-64 md:w-72 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-[100]
                ${index === 0 ? 'left-0' : index === productItems.length - 1 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}>
                <div className="mt-1 overflow-hidden rounded-xl border border-black/5 bg-white/95 backdrop-blur-md p-2 shadow-2xl ring-1 ring-black/5">
                  <div className="flex flex-col gap-0.5">
                    {item.subItems.map((subItem) => (
                      <div key={subItem.id} className="relative group/sub">
                        <Link
                          href={subItem.href}
                          className="flex items-center justify-between rounded-lg px-4 py-2.5 transition-all hover:bg-[#fbf5ec] group/item"
                        >
                          <div className="flex flex-col">
                            <span className="block text-[12px] font-bold text-black group-hover/item:text-[#7338a0] transition-colors">
                              {subItem.label}
                            </span>
                            {subItem.description && (
                              <span className="block text-[9px] text-slate-400 leading-tight mt-0.5 group-hover/item:text-slate-500 transition-colors">
                                {subItem.description}
                              </span>
                            )}
                          </div>
                          {subItem.subItems && subItem.subItems.length > 0 && (
                            <svg className="w-3 h-3 text-black/20 group-hover/item:text-[#7338a0] transition-transform group-hover/sub:rotate-90 md:group-hover/sub:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </Link>

                        {/* Nested Submenu */}
                        {subItem.subItems && subItem.subItems.length > 0 && (
                          <div className="pointer-events-none invisible absolute left-full top-0 w-56 ml-1 -translate-x-2 opacity-0 transition-all duration-300 group-hover/sub:pointer-events-auto group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100">
                            <div className="rounded-xl border border-black/5 bg-white/95 backdrop-blur-md p-1.5 shadow-xl ring-1 ring-black/5">
                              {subItem.subItems.map((nestedItem) => (
                                <Link
                                  key={nestedItem.id}
                                  href={nestedItem.href}
                                  className="block rounded-lg px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-[#fbf5ec] hover:text-[#7338a0] transition-all"
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
}

