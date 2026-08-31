import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getNews, getNewsBySlug } from '@/lib/mongodb-utils';
import { SITE_NAME, SITE_URL, articleJsonLd, breadcrumbJsonLd, seoMetadata } from '@/lib/seo';
import { NewsItem } from '@/lib/news';
import { excerptFrom } from '@/lib/news-utils';

// CHANGE: 2026-08-31 — First DYNAMIC route in the project. Individual SEO landing pages for each
// news item → /news/[slug]. Force-dynamic so admin-published posts appear without a rebuild.
export const dynamic = 'force-dynamic';

// Optional pre-render list (harmless under force-dynamic; enables ISR if dynamic is ever dropped).
export async function generateStaticParams() {
  try {
    const news: NewsItem[] = await getNews();
    return news.map((item) => ({ slug: item.slug })).filter((p) => p.slug);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return seoMetadata({ title: 'Not Found', description: 'Article not found.', path: `/news/${slug}` });
  const title = item.seoTitle || item.title || 'News';
  const description = item.seoDescription || item.excerpt || excerptFrom(item.description || item.content || '', 160);
  return seoMetadata({ title, description, path: `/news/${slug}`, keywords: item.tags });
}

/** Split article body into paragraphs + simple "- " bullet groups (server-side safe). */
function renderBody(content: string) {
  const blocks = (content || '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, bi) => {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    const bullets = lines.filter((l) => l.startsWith('- '));
    const paragraphLines = lines.filter((l) => !l.startsWith('- '));

    return (
      <div key={bi} className="space-y-3">
        {paragraphLines.map((line, li) => (
          <p key={li} className="text-slate-600 leading-relaxed text-[15px] md:text-base">
            {line}
          </p>
        ))}
        {bullets.length > 0 && (
          <ul className="space-y-2 pl-1">
            {bullets.map((b, bi2) => (
              <li key={bi2} className="flex gap-3 text-slate-600 leading-relaxed text-[15px] md:text-base">
                <span className="text-[#006569] font-black shrink-0 mt-0.5">•</span>
                <span>{b.replace(/^-\s*/, '')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const related: NewsItem[] = (await getNews().catch(() => []))
    .filter((n) => n.slug !== item.slug)
    .slice(0, 3);

  const headline = item.seoTitle || item.title;
  const datePublished = (item as any).dateIso || item.date;

  const articleLd = articleJsonLd({
    headline: item.title,
    description: item.excerpt || item.description,
    slug: item.slug!,
    datePublished,
    dateModified: (item as any).dateIso || undefined,
    author: item.author,
    image: item.coverImage,
  });

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([articleLd, breadcrumbJsonLd([{ name: 'News & Updates', path: '/news' }, { name: item.title, path: `/news/${item.slug}` }])]) }} />

      {/* Article header */}
      <section className="bg-[linear-gradient(90deg,_rgba(254,254,252,1)_0%,_rgba(251,250,246,1)_53%,_rgba(248,247,240,1)_100%)] border-b border-[#006569]/10 pt-10 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 bg-[#E5F4F4] text-[#006569] text-[10px] font-black uppercase tracking-widest rounded-full">
              {item.category}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.date}</span>
            {typeof item.readingTime === 'number' && (
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">· {item.readingTime} min read</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 mb-4">{headline}</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">{item.description}</p>
          <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="flex h-4 w-4 rounded-full bg-[#006569] text-white items-center justify-center text-[8px] font-black">S</span>
            By {item.author || SITE_NAME}
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 py-10">
        <div className="space-y-6">{renderBody(item.content)}</div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {item.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
        )}

        {/* CTA block */}
        <div className="mt-10 rounded-3xl bg-[linear-gradient(135deg,_#006569,_#045A57)] p-8 text-white">
          <h2 className="text-xl md:text-2xl font-black mb-2">Need expert help with your Tally setup?</h2>
          <p className="text-white/80 text-sm md:text-base mb-6">Talk to our {item.category.toLowerCase()} specialists at {SITE_NAME} for a no-obligation consultation.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#006569] font-bold text-xs uppercase tracking-wide hover:bg-teal-50 transition-all">
              Enquire Now
            </Link>
            {item.link && (
              <Link href={item.link} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-white font-bold text-xs uppercase tracking-wide hover:bg-white/10 transition-all">
                Explore {item.category}
              </Link>
            )}
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-black text-slate-900 mb-6">Related Reads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.slug} href={`/news/${r.slug}`} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
                <span className="px-2.5 py-0.5 bg-[#E5F4F4] text-[#006569] text-[9px] font-black uppercase tracking-widest rounded-full">{r.category}</span>
                <h3 className="text-sm font-bold text-slate-900 mt-3 group-hover:text-[#006569] transition-colors leading-snug">{r.title}</h3>
                <p className="text-xs text-slate-400 mt-2 font-semibold">{r.date} · {r.readingTime} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}