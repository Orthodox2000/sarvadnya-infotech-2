export default function TallyServerPage() {
  return (
    <div className="min-h-screen bg-[#ecf5fa] py-20 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-10 md:p-16 shadow-sm border border-slate-100">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">TallyPrime Server</h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
            Enterprise-class product that provides high data concurrency and security for organizations with large user bases.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-slate-50 p-8 rounded-3xl">
                <h2 className="text-xl font-black text-slate-900 mb-6">Key Benefits</h2>
                <ul className="space-y-4 text-slate-700 font-medium text-sm">
                    <li>✓ Zero waiting time for data access</li>
                    <li>✓ High-speed performance even with 50+ users</li>
                    <li>✓ Enhanced data security and audit controls</li>
                    <li>✓ Real-time monitoring of user activities</li>
                </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl">
                <h2 className="text-xl font-black text-slate-900 mb-6">Use Cases</h2>
                <ul className="space-y-4 text-slate-700 font-medium text-sm">
                    <li>• Large Enterprises</li>
                    <li>• High Transaction Volume Businesses</li>
                    <li>• Organizations requiring high data security</li>
                    <li>• Multi-branch operations</li>
                </ul>
            </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-slate-100">
            <button className="flex-1 py-4 bg-[#0371a3] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">Get Price</button>
            <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0371a3] transition-all shadow-lg">Get Expert Advice</button>
        </div>
      </div>
    </div>
  );
}
