'use client';

import Footer from "../../components/Footer";

export default function EulaPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="bg-[#f0f8fa] pt-12 pb-16 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            End-User License <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] via-[#006569] to-[#006569] drop-shadow-[0_2px_15px_rgba(0,101,105,0.3)]">Agreement</span>
          </h1>
          <p className="text-slate-600/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
            Last updated: August 14, 2026. This agreement governs your use of the software, custom modules, and related services provided by Sarvadnya Infotech LLP.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 text-slate-600 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Acceptance of Terms</h2>
          <p>By downloading, installing, activating, or using any software, custom TDL module, mobile application, or cloud service provided by Sarvadnya Infotech LLP ("the Software"), you agree to be bound by this End-User License Agreement (EULA). If you do not agree to these terms, do not use the Software.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. License Grant</h2>
          <p>Subject to your compliance with this EULA and payment of applicable fees, Sarvadnya Infotech LLP grants you a limited, non-exclusive, non-transferable, revocable license to use the Software for your internal business purposes, on the number of devices or users covered by your subscription or purchase. Your license to Tally software itself remains subject to Tally Solutions' own license terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Restrictions</h2>
          <p>You may not, except as expressly permitted by law:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Copy, modify, decompile, disassemble, or reverse-engineer the Software, in whole or in part.</li>
            <li>Rent, lease, lend, sublicense, resell, or redistribute the Software or your license to any third party.</li>
            <li>Use the Software for any unlawful purpose or in a manner that violates Tally Solutions' licensing requirements.</li>
            <li>Attempt to circumvent license protection, activation, or usage limits.</li>
            <li>Remove or alter any proprietary notices, logos, or copyright markings.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Data Collected and Stored by the Software</h2>
          <p>To operate, maintain, and improve the Software, and to provide you with support, the Software may collect and store the following data:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">Licensing and activation data</strong> — your license key, activation status, product version, and device identifier used to validate your license.</li>
            <li><strong className="text-slate-900">Usage and diagnostic data</strong> — feature usage, error logs, performance metrics, and crash reports used to fix defects and improve the Software.</li>
            <li><strong className="text-slate-900">Connection data</strong> — your IP address (stored masked where possible) and the date/time of activation, updates, and support sessions.</li>
            <li><strong className="text-slate-900">Contact information</strong> — the name, email, and phone number you provide when purchasing a license, requesting support, or renewing a subscription.</li>
            <li><strong className="text-slate-900">Support session data</strong> — with your permission, we may access your system during a remote support session to resolve issues. Remote sessions are limited to what is necessary for the support request.</li>
          </ul>
          <p className="mt-2"><strong className="text-slate-900">What we do NOT collect:</strong> We do not read your business transactions, ledger data, financial reports, or any data you enter inside Tally itself. The Software does not transmit your business accounting data to our servers. Your business data remains on your own systems or the cloud hosting you choose.</p>
          <p className="mt-2">This data is stored securely in our database, used solely for licensing validation, support, improvement of the Software, and our legitimate business records. We do not sell your data. For full details, see our <a href="/privacy" className="text-[#006569] font-bold underline underline-offset-4">Privacy Policy</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Intellectual Property</h2>
          <p>The Software, including all custom TDL code, algorithms, documentation, and associated materials, is owned by Sarvadnya Infotech LLP and is protected by applicable intellectual property laws. This EULA grants you only the limited license described above and does not transfer ownership of any intellectual property to you.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Support and Updates</h2>
          <p>Support, maintenance, and updates are provided in accordance with your subscription or service agreement. Sarvadnya Infotech LLP may, from time to time, provide updates to the Software that may be required to maintain compatibility with Tally releases or to fix defects.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Warranty and Disclaimer</h2>
          <p>The Software is provided "as is" and "as available," without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. While we take reasonable measures to protect your data, no method of electronic transmission or storage is completely secure, and Sarvadnya Infotech LLP makes no guarantee against unauthorized access.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, Sarvadnya Infotech LLP shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or business opportunity, arising out of or relating to the use or inability to use the Software, even if advised of the possibility of such damages. Our total liability shall not exceed the amount you paid for the Software during the twelve (12) months preceding the claim.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">9. Termination</h2>
          <p>This EULA is effective until terminated. It terminates automatically if you breach any of its terms. Upon termination, you must cease all use of the Software and delete or destroy all copies in your possession. Sections 4, 5, 7, 8, and 10 shall survive termination.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">10. Governing Law and Dispute Resolution</h2>
          <p>This EULA shall be governed by the laws of the Republic of India. Any disputes arising under this EULA shall be subject to the exclusive jurisdiction of the courts of Maharashtra, India.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">11. Contact Us</h2>
          <p>If you have any questions about this EULA or the data collected by the Software, please contact us:</p>
          <p className="mt-2 font-bold text-slate-900">Sarvadnya Infotech LLP<br />Email: info@sarvadnyainfotech.com</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
