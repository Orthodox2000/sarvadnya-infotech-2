import Footer from "../../components/Footer";
import { CareersClient } from "./careers-client";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Centered Tighter Hero Section */}
      <section className="bg-white pt-12 pb-16 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-[#006569]/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-white/10 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teal-200/20 blur-[110px] -ml-24 -mb-24" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-sm">
            <span className="flex h-0.5 w-0.5 rounded-full bg-slate-400"></span>
            Join Our Mission
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Build the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] via-[#006569] to-[#006569] drop-shadow-[0_2px_15px_rgba(0,101,105,0.3)]">
              Business Intelligence
            </span>
          </h1>
          <p className="text-slate-600/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
            We're on a journey to empower SMEs with cutting-edge Tally and Cloud solutions. 
            If you're passionate about technology and problem-solving, we'd love to have you on board.
          </p>
        </div>
      </section>

      <CareersClient />

      <Footer />
    </div>
  );
}
