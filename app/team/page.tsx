import Image from "next/image";
import Footer from "../components/Footer";

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-[var(--background-color)]">
      {/* Hero: Team Photo & Common Message */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-sm font-bold uppercase tracking-wider">
              Our Family
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--heading-color)] leading-tight">
              Meet the <span className="text-[var(--primary-color)]">Experts</span> Behind Your Success
            </h1>
            <p className="text-xl text-[var(--para-color)] font-medium leading-relaxed italic border-l-4 border-[var(--primary-color)] pl-6">
              "At Sarvadnya Infotech, our strength lies in our unity and our shared passion for simplifying business technology. We don't just solve problems; we build lasting relationships with our clients."
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="relative aspect-[16/9] rounded-[2rem] overflow-hidden bg-white shadow-2xl border-4 border-white">
              {/* Team Photo Placeholder */}
              <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                <div className="text-center p-8 opacity-20">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm font-black uppercase tracking-widest">Main Team Photo Slot</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employee Culture Description */}
      <section className="py-20 bg-white animate-rise-up" style={{ animationDelay: '200ms' }}>
        <div className="px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--heading-color)]">Our Employee Culture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[var(--background-color)] border border-[var(--primary-color)]/5">
              <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--primary-color)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Constant Innovation</h3>
              <p className="text-sm text-[var(--para-color)] opacity-70">We encourage our team to stay ahead of the curve with regular training and certifications.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[var(--background-color)] border border-[var(--primary-color)]/5">
              <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--primary-color)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Collaborative Spirit</h3>
              <p className="text-sm text-[var(--para-color)] opacity-70">Success is a team effort. We foster an environment where every voice matters.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[var(--background-color)] border border-[var(--primary-color)]/5">
              <div className="w-12 h-12 bg-[var(--primary-color)]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[var(--primary-color)]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Client-First Mindset</h3>
              <p className="text-sm text-[var(--para-color)] opacity-70">Our team's primary goal is to ensure client satisfaction through efficient support.</p>
            </div>
          </div>
          <p className="text-lg text-[var(--para-color)] opacity-90 leading-relaxed max-w-3xl mx-auto pt-6">
            At Sarvadnya, we believe that a happy team leads to happy clients. Our culture is built on transparency, continuous learning, and a deep-rooted commitment to excellence in the Tally ecosystem.
          </p>
        </div>
      </section>

      {/* Team Review Section */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '400ms' }}>
        <div className="bg-[var(--heading-color)] rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary-color)]/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black mb-8">What our team says</h2>
            <blockquote className="text-2xl md:text-3xl font-medium leading-tight opacity-90">
              "Working at Sarvadnya Infotech LLP has been an incredible journey of growth. The leadership truly cares about our professional development and work-life balance."
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-bold">JD</div>
              <div>
                <p className="font-bold">Senior Tally Consultant</p>
                <p className="text-sm opacity-60">Team Member since 2018</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Employee Photo Slots (Max 4) we dont need this for now
      <section className="py-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '600ms' }}>
        <h2 className="text-3xl font-black text-[var(--heading-color)] mb-12 text-center md:text-left">Our Key Pillars</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-default">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-xl mb-6 border border-[var(--primary-color)]/5">
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-[var(--heading-color)]">Expert Name</h3>
                <p className="text-sm text-[var(--primary-color)] font-black uppercase tracking-widest">Designation</p>
              </div>
            </div>
          ))}
        </div>
      </section>*/}

      <Footer />
    </main>
  );
}
