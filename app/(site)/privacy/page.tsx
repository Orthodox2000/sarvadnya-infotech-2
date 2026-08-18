'use client';

// CHANGE: 2026-08-18 — Rewrote privacy policy: added reverse DNS, proxy/VPN/Tor detection,
// UTM campaign tracking, marketing consent on visit, removed GPC opt-out language.

import Footer from "../../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="bg-[#f0f8fa] pt-12 pb-16 px-6 text-center relative overflow-hidden flex flex-col items-center border-b border-white/5">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url(/bgggg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="max-w-4xl mx-auto relative z-10 w-full flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] via-[#006569] to-[#006569] drop-shadow-[0_2px_15px_rgba(0,171,228,0.3)]">Policy</span>
          </h1>
          <p className="text-slate-600/80 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-semibold">
            Last updated: August 18, 2026. Your privacy is important to us. This policy explains exactly what data we collect, why we collect it, how we store it, and the choices you have.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10 text-slate-600 leading-relaxed font-medium">
        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Information We Collect</h2>

          <h3 className="font-black text-slate-900 mb-2 text-sm uppercase tracking-wider">A. Data You Provide Directly</h3>
          <p>When you submit a form on this website (request a quote, product enquiry, request a callback, TSS renewal, report a problem, contact our support team, or apply for a job), we collect and store:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">Contact details</strong> — your name, email address, phone number.</li>
            <li><strong className="text-slate-900">Enquiry details</strong> — the service or product you are interested in, and any additional requirements or description you provide.</li>
            <li><strong className="text-slate-900">Form context</strong> — the page, section, and form type you used to reach us, plus your session identifier.</li>
            <li><strong className="text-slate-900">Job applications</strong> — your resume/CV document and any details you submit when applying for a position.</li>
          </ul>

          <h3 className="font-black text-slate-900 mb-2 mt-6 text-sm uppercase tracking-wider">B. Data Collected Automatically</h3>
          <p>To operate, secure, and improve the site, and to help us respond to you faster, we passively collect and store the following technical information on every visit:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">IP address</strong> — your full IP address is stored and used to determine approximate location, detect proxy/VPN usage, and perform reverse DNS lookups.</li>
            <li><strong className="text-slate-900">Approximate geolocation</strong> — country, region/state, city, ISP, ASN, and time zone derived from your IP address.</li>
            <li><strong className="text-slate-900">Reverse DNS</strong> — we perform a reverse DNS lookup on your IP to resolve the associated hostname, which helps us identify datacenter, cloud, or corporate network connections.</li>
            <li><strong className="text-slate-900">Proxy, VPN & Tor detection</strong> — we detect and flag whether your connection originates from a proxy server, VPN service, Tor exit node, or datacenter/hosting provider.</li>
            <li><strong className="text-slate-900">Device & browser details</strong> — user agent, device type (desktop/mobile/tablet), operating system, browser, screen resolution, and language preference.</li>
            <li><strong className="text-slate-900">Browsing activity</strong> — pages visited, entry path, referring URL, sections viewed, timestamps, and total visit/page-view counts.</li>
            <li><strong className="text-slate-900">Session identifier</strong> — a pseudonymous ID stored in a cookie (<code className="text-teal-700 bg-[#E5F4F4] px-1.5 py-0.5 rounded font-mono text-xs">svd_vid</code>) that lets us group a visit together. It contains no name or email.</li>
            <li><strong className="text-slate-900">UTM parameters & campaign attribution</strong> — if you arrive via a tagged marketing link, we collect the UTM source, medium, campaign, term, and content values to understand which campaigns drive traffic and conversions.</li>
          </ul>

          <h3 className="font-black text-slate-900 mb-2 mt-6 text-sm uppercase tracking-wider">C. Data We Do NOT Collect</h3>
          <p>We do not collect precise real-time GPS coordinates, keystrokes, or content typed outside of the forms you choose to submit. When you submit a form, your contact and enquiry data is collected only because you chose to provide it.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">2. How We Use Your Information</h2>
          <p>We use the data we collect to:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Respond to your enquiries, quote requests, support requests, and job applications.</li>
            <li>Route your submission to the correct team member and page destination.</li>
            <li>Send an internal notification of your submission to our team (including your location and device details so we can serve you better).</li>
            <li>Understand which products, services, and content visitors are interested in, so we can improve the site and our offerings.</li>
            <li>Detect and prevent fraud, abuse, spam, and bot traffic, and to maintain the security and availability of the site.</li>
            <li>Analyze aggregated, non-identifying usage trends.</li>
          </ul>
          <p className="mt-2">We do not use your data for automated profiling that produces legal effects about you, and we do not sell or rent your personal information.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight text-[#006569]">3. Marketing & Campaign Consent</h2>
          <p className="bg-[#E5F4F4] p-6 rounded-2xl border border-[#006569]/10 text-slate-900 font-bold">
            By visiting this website, you consent to Sarvadnya Infotech LLP collecting and using your data — including IP address, geolocation, device details, browsing activity, and campaign attribution parameters — for marketing, remarketing, and campaign analytics purposes. This consent applies from the moment you access any page on this website.
          </p>
          <p className="mt-2">We may use collected data to:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Personalize marketing communications based on your interests and browsing behaviour.</li>
            <li>Measure the effectiveness of advertising and marketing campaigns.</li>
            <li>Build aggregated audience insights for campaign optimization.</li>
            <li>Retarget visitors with relevant advertisements on third-party platforms.</li>
          </ul>
          <p className="mt-2">You may withdraw consent for marketing communications at any time by contacting us at info@sarvadnyainfotech.com.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Cookies & Tracking</h2>
          <p>We use a single first-party cookie (<code className="text-teal-700 bg-[#E5F4F4] px-1.5 py-0.5 rounded font-mono text-xs">svd_vid</code>) that stores a random pseudonymous session identifier valid for one year. It is used to recognize repeat visits and tie browsing behaviour to a single session for analytics and marketing attribution.</p>
          <p className="mt-2">We collect data regardless of browser privacy signals such as Global Privacy Control (GPC). Our data collection is essential for site operation, security, and the marketing consent you provide by visiting the website.</p>
          <p className="mt-2">You can clear the cookie in your browser settings at any time; this will simply create a new session identifier on your next visit.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Where and How Your Data Is Stored</h2>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">Form submissions & visitor records</strong> are stored in MongoDB, hosted by MongoDB Atlas on cloud servers.</li>
            <li><strong className="text-slate-900">Uploaded documents</strong> (e.g., resumes) are stored in Vercel Blob object storage.</li>
            <li><strong className="text-slate-900">Email copies</strong> of submissions are transmitted to our internal team via Resend. Our team&apos;s inboxes are the only recipients of these copies.</li>
            <li><strong className="text-slate-900">IP geolocation & intelligence lookups</strong> are performed through a third-party service (ipwho.is); results include approximate location, ISP, ASN, proxy/VPN/Tor flags, and hosting detection. Reverse DNS is performed via Node.js DNS resolution. Results are cached to avoid repeated lookups.</li>
            <li><strong className="text-slate-900">AI chatbot (Ask Sara)</strong>: if you use the chat assistant, the message you type is sent to Groq&apos;s API to generate a reply.</li>
          </ul>
          <p className="mt-2">All data transmitted between your browser and our servers is encrypted in transit using HTTPS. Access to stored data is restricted to authorized personnel only.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">6. Data Retention</h2>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">Form submissions</strong> are retained for as long as needed to serve you and maintain business records, and are purged periodically.</li>
            <li><strong className="text-slate-900">Visitor session records</strong> are retained to support analytics, marketing attribution, and fraud prevention; dormant records are removed automatically.</li>
            <li><strong className="text-slate-900">Email send records</strong> (our internal ledger) are automatically deleted 30 days after they are completed.</li>
            <li><strong className="text-slate-900">IP geolocation & reverse DNS cache</strong> entries expire automatically (30 days for successful lookups, 1 hour for failures).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">7. Third-Party Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We share data only with service providers necessary to operate the website and fulfill your requests:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-slate-900">MongoDB Atlas</strong> — database hosting for submissions and visitor records.</li>
            <li><strong className="text-slate-900">Vercel</strong> — hosting platform, including Vercel Blob for uploaded files.</li>
            <li><strong className="text-slate-900">Resend</strong> — delivery of internal email copies to our team.</li>
            <li><strong className="text-slate-900">ipwho.is (or configured IP lookup provider)</strong> — IP-to-location enrichment, proxy/VPN/Tor/hosting detection.</li>
            <li><strong className="text-slate-900">Groq</strong> — AI response generation for the Ask Sara chat assistant.</li>
            <li><strong className="text-slate-900">Tally Solutions</strong> — as necessary to fulfill product licenses, renewals, and support requests you make.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">8. Your Rights & Choices</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your personal data, subject to legal retention requirements.</li>
            <li>Withdraw consent for marketing communications at any time by contacting us.</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us using the details below. We will respond within a reasonable time, typically 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">9. Children&apos;s Privacy</h2>
          <p>Our services are directed to businesses and adults. We do not knowingly collect personal information from children under the age of 13. If you believe a child has provided us personal information, please contact us and we will delete it.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">10. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top of this page indicates the most recent revision. Material changes will be reflected here, and continued use of the site after changes take effect constitutes acceptance of the revised policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or the data we hold about you, please reach out to us:</p>
          <p className="mt-2 font-bold text-slate-900">Sarvadnya Infotech LLP<br />Email: info@sarvadnyainfotech.com</p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
