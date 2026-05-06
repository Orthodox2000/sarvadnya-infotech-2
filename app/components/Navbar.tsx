import Image from "next/image";

export default function Navbar() {
  return (
    <header className="border-b bg-background" style={{ borderColor: "var(--secondary-color)" }}>
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-2 min-[500px]:h-16 min-[500px]:py-0">
        <a
          href="/"
          className="flex items-center gap-3 max-[500px]:flex-col max-[500px]:items-start max-[500px]:gap-1"
        >
          <div className="relative w-[120px] shrink-0 overflow-hidden sm:w-[150px]">
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
              className="block text-base font-semibold tracking-tight max-[500px]:hidden"
              style={{ color: "var(--heading-color)" }}
            >
              Sarvadnya
            </span>
            <span
              className="block text-xs font-medium uppercase tracking-wide max-[500px]:hidden"
              style={{ color: "var(--secondary-color)" }}
            >
              Infotech LLP
            </span>
          </div>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/brochure.pdf"
            className="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--secondary-color)",
              backgroundColor: "var(--secondary-btn-color)",
              color: "var(--secondary-color)",
            }}
          >
            Download
          </a>
          <a
            href="mailto:contact@sarvadnyainfotech.com"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--primary-btn-color)" }}
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
