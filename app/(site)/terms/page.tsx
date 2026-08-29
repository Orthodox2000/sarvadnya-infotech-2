'use client';

import Footer from "../../components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="bg-[#f0f8fa] pt-12 pb-16 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] via-[#006569] to-[#006569] drop-shadow-[0_2px_15px_rgba(0,101,105,0.3)]">Conditions</span>
          </h1>
          <p className="text-slate-600/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
            Please read these terms and conditions carefully before using our services.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 text-slate-600 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Service Agreement</h2>
          <p>By accessing this website or engaging our services, you agree to comply with these terms. Sarvadnya Infotech LLP provides Tally customization, implementation, and support services as a Tally Certified Partner.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight text-[#006569]">2. Product Availability</h2>
          <p className="bg-[#F5F4ED] p-6 rounded-2xl border border-[#006569]/10 text-slate-900 font-bold">
            Please note that product features, specifications, and availability may differ depending on stock, regional restrictions, and Tally Solutions' current release cycle. We reserve the right to modify service offerings based on current availability.
          </p>
        </section>

        <section>
          {/* CHANGE: 2026-08-18 — Updated Section 3: added reverse DNS, proxy/VPN, UTM, marketing consent. */}
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Data Collection, Storage & Privacy</h2>
          <p>By using this website and submitting any form, you acknowledge and consent to the collection, storage, and processing of the following data:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">Information you provide</strong> — name, email, phone number, business details, service/product of interest, enquiry description, and any resume/CV you upload for a job application.</li>
            <li><strong className="text-slate-900">Technical information collected automatically</strong> — your full IP address, approximate geolocation (country, region, city, ISP, ASN), reverse DNS hostname, proxy/VPN/Tor/datacenter detection flags, browser and device details, screen resolution, language, pages visited, entry path, referring URL, timestamps, UTM campaign parameters, and a pseudonymous session identifier stored in a first-party cookie (<code className="text-teal-700 bg-[#E5F4F4] px-1.5 py-0.5 rounded font-mono text-xs">svd_vid</code>).</li>
          </ul>
          <p className="mt-2">This data is stored in our secure database, used to respond to you, route submissions to the correct team, improve our services, detect fraud and abuse, and for marketing and campaign analytics. A copy of each submission, including your location and device details, is sent to our internal team. We do not sell your data.</p>
          <p className="mt-2 bg-[#E5F4F4] p-4 rounded-xl border border-[#006569]/10 text-slate-900 font-bold text-sm">
            By visiting this website, you consent to Sarvadnya Infotech collecting and using your data for marketing, remarketing, and campaign analytics purposes.
          </p>
          <p className="mt-2">Full details, including our data retention periods and your rights, are described in our <a href="/privacy" className="text-[#006569] font-bold underline underline-offset-4">Privacy Policy</a>. Software and custom modules we provide are governed by our <a href="/eula" className="text-[#006569] font-bold underline underline-offset-4">End-User License Agreement (EULA)</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Use of Services</h2>
          <p>Users are responsible for maintaining the confidentiality of their Tally license information and for any activities that occur under their account or during remote support sessions.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Intellectual Property</h2>
          <p>All custom modules (TDL), content, and branding on this site are the intellectual property of Sarvadnya Infotech LLP unless otherwise stated. Unauthorized reproduction is prohibited. Use of our software is subject to the End-User License Agreement.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Limitation of Liability</h2>
          <p>Sarvadnya Infotech LLP shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our Tally services or third-party cloud hosting.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Contact Us</h2>
          <p>Questions about these terms can be directed to info@sarvadnyainfotech.com.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
