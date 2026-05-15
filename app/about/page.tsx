import Image from "next/image";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--background-color)]">
      {/* Segment 1: Company Information */}
      <section className="pt-6 pb-12 px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto animate-rise-up">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--heading-color)] leading-tight">
              SARVADNYA INFOTECH LLP <br/>
              <span className="text-[var(--primary-color)] text-xl md:text-2xl">Your Trusted Solution Partner</span>
            </h1>
            <p className="text-base text-[var(--para-color)] opacity-90 leading-relaxed">
              Since 2008, Sarvadnya Infotech LLP, a Certified Tally Partner, has served over 1,500 satisfied clients with top-quality Tally Software solutions and services. We are renowned for transparent consultancy and tailored solutions that drive business growth, delivered swiftly by our expert team who understand client needs and pain points. 
            </p>
            <p className="text-base text-[var(--para-color)] opacity-90 leading-relaxed">
              Our focus is on achieving maximum satisfaction through reliable and effective services. We bridge the gap between complex technology and seamless business operations.
            </p>
          </div>
          <div className="flex-1 w-full max-w-sm">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-xl border border-[var(--primary-color)]/20 flex items-center justify-center">
              {/* Photo Slot */}
              <div className="text-[var(--primary-color)] opacity-20 text-center p-6">
                <svg className="w-20 h-20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-xs font-medium uppercase tracking-widest">Company Office / Team Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segment 2: Partner Statement 1 - Suman Sawant */}
      <section className="py-16 bg-white animate-rise-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider">
                Leadership
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading-color)]">
                Suman Sawant, <span className="text-[var(--primary-color)]">Partner</span>
              </h2>
              <p className="text-lg font-medium text-[var(--heading-light-color)]">
                Co-founder with an MBA in HR and Finance
              </p>
              <blockquote className="text-base text-[var(--para-color)] border-l-4 border-[var(--primary-color)] pl-5 py-1.5 leading-relaxed">
                "Suman brings extensive industry experience. Passionate about finance and technology, she helps businesses adopt the right systems for efficient financial management and automates manual processes. She also lectures on Tally technology for ICAI audits."
              </blockquote>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--background-color)] shadow-lg border border-[var(--primary-color)]/10 flex items-center justify-center group">
                {/* Photo Slot */}
                <div className="text-[var(--primary-color)] opacity-30 text-center transition-transform group-hover:scale-110">
                  <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Suman Sawant Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segment 3: Partner Statement 2 - Mr. Madhukar Sawant */}
      <section className="py-16 animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="px-6 sm:px-10 lg:px-20 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-5">
              <div className="inline-block px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs font-bold uppercase tracking-wider">
                Strategic Vision
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--heading-color)]">
                Mr. Madhukar Sawant, <span className="text-[var(--primary-color)]">Partner</span>
              </h2>
              <p className="text-lg font-medium text-[var(--heading-light-color)]">
                15+ Years in Computer Hardware and Networking
              </p>
              <blockquote className="text-base text-[var(--para-color)] border-l-4 border-[var(--primary-color)] pl-5 py-1.5 leading-relaxed">
                "Madhukar specializes in guiding businesses through seamless technology adoption. His personalized approach ensures solutions aligned with client goals, enhancing efficiency and productivity."
              </blockquote>
            </div>
            <div className="flex-1 w-full max-w-xs">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg border border-[var(--primary-color)]/10 flex items-center justify-center group">
                {/* Photo Slot */}
                <div className="text-[var(--primary-color)] opacity-30 text-center transition-transform group-hover:scale-110">
                  <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Madhukar Sawant Photo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
