import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-background">
      <nav className="mx-auto flex min-h-[3.2rem] w-full max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-1"
        >
          <div className="relative w-[104px] shrink-0 overflow-hidden sm:w-[124px]">
            <Image
              src="/TallyCertificate.png"
              alt="Sarvadnya Infotech logo"
              width={400}
              height={105}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <div className="leading-tight max-[500px]:hidden">
            <span
              className="block text-sm font-semibold tracking-tight sm:text-[15px] max-[500px]:hidden"
              style={{ color: "var(--heading-color)" }}
            >
              Sarvadnya
            </span>
            <span
              className="block text-[10px] font-medium uppercase tracking-wide sm:text-[11px] max-[500px]:hidden"
              style={{ color: "var(--secondary-color)" }}
            >
              Infotech LLP
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="/brochure.pdf"
            className="rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm"
            style={{
              borderColor: "var(--secondary-color)",
              backgroundColor: "var(--secondary-btn-color)",
              color: "var(--secondary-color)",
            }}
          >
            Whatsapp
          </a>
          <a
            href="mailto:contact@sarvadnyainfotech.com"
            className="rounded-md px-2.5 py-1.5 text-xs font-medium text-white transition-colors sm:px-3 sm:text-sm"
            style={{ backgroundColor: "var(--primary-btn-color)" }}
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
