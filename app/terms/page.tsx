'use client';

import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="bg-[#f0f8fa] pt-12 pb-16 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">Conditions</span>
          </h1>
          <p className="text-slate-600/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 text-slate-600 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Service Agreement</h2>
          <p>By accessing this website or engaging our services, you agree to comply with these terms. Sarvadnya Infotech LLP provides Tally customization, implementation, and support services as a Certified Tally Partner.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight text-[#0371a3]">2. Product Availability</h2>
          <p className="bg-[#f0f9ff] p-6 rounded-2xl border border-[#0371a3]/10 text-slate-900 font-bold">
            Please note that product features, specifications, and availability may differ depending on stock, regional restrictions, and Tally Solutions' current release cycle. We reserve the right to modify service offerings based on current availability.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Use of Services</h2>
          <p>Users are responsible for maintaining the confidentiality of their Tally license information and for any activities that occur under their account or during remote support sessions.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Intellectual Property</h2>
          <p>All custom modules (TDL), content, and branding on this site are the intellectual property of Sarvadnya Infotech LLP unless otherwise stated. Unauthorized reproduction is prohibited.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Limitation of Liability</h2>
          <p>Sarvadnya Infotech LLP shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our Tally services or third-party cloud hosting.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
