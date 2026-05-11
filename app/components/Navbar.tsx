import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-[#0a041a] shadow-lg">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-[1.02]"
        >
          <div className="relative w-20 h-6 shrink-0 brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity">
            <Image
              src="/TallyCertificate.png"
              alt="Sarvadnya Infotech logo"
              fill
              sizes="(max-width: 768px) 80px, 100px"
              className="object-contain"
              priority
            />
          </div>
          <div className="hidden sm:flex flex-col border-l border-white/20 pl-3 leading-none">
            <span className="text-[13px] font-bold tracking-tight text-white">
              Sarvadnya
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
              Infotech LLP
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-6 mr-6">
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+919876543210"
              className="hidden lg:flex items-center gap-2 text-white/60 hover:text-white transition-colors mr-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Call us: +91 98765 43210</span>
            </a>
            
            <Link
              href="/careers"
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 transition-all hover:bg-white/20 active:scale-95"
            >
              Careers
            </Link>

            <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center rounded-full bg-[#7338a0] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
            >
              Support
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
