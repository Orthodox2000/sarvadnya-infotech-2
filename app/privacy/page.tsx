'use client';

import Footer from "../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="bg-[#f0f8fa] pt-12 pb-16 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0371a3] via-[#4b91ca] to-[#0371a3] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">Policy</span>
          </h1>
          <p className="text-slate-600/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
            Your privacy is important to us. This policy outlines how we handle and protect your data at Sarvadnya Infotech LLP.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 text-slate-600 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Information Collection</h2>
          <p>We collect information you provide directly to us, such as when you request a quote, apply for a job, or contact our support team. This may include your name, email address, phone number, and business details.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. Use of Information</h2>
          <p>We use the collected information to provide, maintain, and improve our services, including responding to your inquiries and providing technical support for Tally products.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Data Protection</h2>
          <p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely and accessed only by authorized personnel.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Third-Party Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share data with trusted partners (like Tally Solutions) only as necessary to fulfill your service requests.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Contact Us</h2>
          <p>If you have any questions regarding this Privacy Policy, please reach out to us at info@sarvadnyainfotech.com.</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
