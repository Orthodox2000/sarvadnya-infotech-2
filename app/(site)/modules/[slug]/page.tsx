import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  Percent,
  PlayCircle,
  Printer,
  Receipt,
  Shirt,
  Truck,
  Users,
} from "lucide-react";
import Footer from "../../../components/Footer";
import AgentSimulator from "../../../components/modules/AgentSimulator";
import CfaSimulator from "../../../components/modules/CfaSimulator";
import ContainerSimulator from "../../../components/modules/ContainerSimulator";
import GarmentSimulator from "../../../components/modules/GarmentSimulator";
import ModuleCta from "../../../components/modules/ModuleCta";
import ModuleVideo from "../../../components/modules/ModuleVideo";
import SocietySimulator from "../../../components/modules/SocietySimulator";
import TransportSimulator from "../../../components/modules/TransportSimulator";
import { getModules } from "@/lib/mongodb-utils";
import { detailFromModule, getModuleDetail, type ModuleDetail } from "@/lib/module-details";
import { hasEmbeddableVideo, moduleHref, type Module } from "@/lib/modules";
import { breadcrumbJsonLd, faqPageJsonLd, seoMetadata } from "@/lib/seo";

/**
 * CHANGE: 2026-11-02 — every module now has its own page at /modules/<id>.
 *
 * WHY: the module card's "More Details" opened a modal, and nav/footer/Sara links all
 * pointed at /modules#<id>. That gave one indexable URL for every module and a dead end for
 * anyone who wanted the brochure detail. This route renders the full brochure content,
 * video and an interactive TallyPrime walkthrough. Modules without a curated entry fall
 * back to their DB record, so nothing is hardcoded to a single module.
 *
 * CHANGE: 2026-11-03 — all six modules use the same template. Section headings, the
 * problem/flow band, the gallery and the simulator now come from lib/module-details.ts, so
 * no section carries container-specific copy. Backgrounds follow one fixed rhythm
 * (dark hero → light → white → light → …) with no gradients or animation.
 */
export const dynamic = "force-dynamic";

const getModulesSafe = cache(async (): Promise<Module[]> => {
  try {
    return (await getModules()) as Module[];
  } catch (error) {
    console.error("Module page: failed to load modules", error);
    return [];
  }
});

async function loadDetail(slug: string): Promise<{ detail: ModuleDetail | null; modules: Module[] }> {
  const modules = await getModulesSafe();
  const curated = getModuleDetail(slug);
  const fromDb = modules.find((module) => (module.id || module._id) === slug);

  // CHANGE: 2026-11-03 — a curated entry must never HIDE a video the admin panel already has.
  // WHY: the curated copy hardcodes an empty videoUrl, but the owner adds product videos through
  // the admin panel. The live DB now carries real videos for cf-agencies, housing-societies and
  // logistics-transport; without this merge those pages rendered no video at all while the DB
  // held one. The curated URL still wins when it has one, and the placeholder check still runs,
  // so a `dQw4w9WgXcQ` row can never reach the page.
  const dbVideo = fromDb && hasEmbeddableVideo(fromDb.videoUrl) ? fromDb.videoUrl : "";
  const detail = curated
    ? { ...curated, videoUrl: hasEmbeddableVideo(curated.videoUrl) ? curated.videoUrl : dbVideo }
    : fromDb
      ? detailFromModule(fromDb)
      : null;

  return {
    detail,
    modules,
  };
}

export async function generateStaticParams() {
  const modules = await getModulesSafe();
  return modules
    .map((module) => module.id || module._id)
    .filter((id): id is string => Boolean(id))
    .map((id) => ({ slug: id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { detail } = await loadDetail(slug);

  if (!detail) {
    return seoMetadata({
      title: "Module Not Found",
      description:
        "This TallyPrime module page is no longer available. Browse the full catalogue of industry modules from Sarvadnya Infotech LLP instead.",
      path: `/modules/${slug}`,
      noindex: true,
      contactSuffix: false,
    });
  }

  return seoMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription || detail.heroLead,
    path: `/modules/${detail.id}`,
    keywords: detail.keywords,
    image: detail.image,
  });
}

const PILLAR_ICON = {
  truck: Truck,
  receipt: Receipt,
  printer: Printer,
  briefcase: Briefcase,
  users: Users,
  percent: Percent,
  shirt: Shirt,
  building: Building2,
};

function Simulator({ id }: { id: NonNullable<ModuleDetail["simulator"]> }) {
  if (id === "cfa") return <CfaSimulator />;
  if (id === "society") return <SocietySimulator />;
  if (id === "agent") return <AgentSimulator />;
  if (id === "transport") return <TransportSimulator />;
  if (id === "garment") return <GarmentSimulator />;
  return <ContainerSimulator />;
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { detail, modules } = await loadDetail(slug);
  if (!detail) notFound();

  const related = modules
    .filter((module) => (module.id || module._id) !== detail.id)
    .slice(0, 3);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Modules", path: "/modules" },
    { name: detail.title, path: `/modules/${detail.id}` },
  ]);
  const faqLd = detail.faqs?.length ? faqPageJsonLd(detail.faqs) : null;

  const hasVideo = hasEmbeddableVideo(detail.videoUrl);
  const videoCopy = detail.videoCopy ?? {
    eyebrow: "See it in TallyPrime",
    title: `The ${detail.title.replace(/ (Module )?(for|in) TallyPrime$/, "")} in action`,
    body: "Watch the module in action, then click through the same screens below.",
  };
  const simulatorCopy = detail.simulatorCopy ?? {
    eyebrow: "Click through the module",
    title: "See it in TallyPrime",
    body: "Walk through the module screen by screen — the same screens the brochure shows.",
  };
  const whatYouGetCopy = detail.whatYouGetCopy ?? { eyebrow: "What you get", title: "Everything the module covers" };
  const howItWorksCopy = detail.howItWorksCopy ?? { eyebrow: "How it works", title: "Three steps. That's the whole process." };
  const benefitsCopy = detail.benefitsCopy ?? { eyebrow: "Business benefits", title: "What changes for your team" };
  const galleryCopy = detail.galleryCopy ?? { eyebrow: "On the ground", title: "Built around the real workflow" };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumb, ...(faqLd ? [faqLd] : [])]) }}
      />

      {/* Hero — the module's own image is the background */}
      <section className="relative overflow-hidden border-b-2 border-[#033B38] bg-[#033B38] px-5 py-10 sm:px-6 sm:py-16">
        <Image
          src={detail.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[#033B38]/80" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#C5E3E3] sm:mb-6"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/modules" className="hover:text-white">
              Modules
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{detail.title}</span>
          </nav>

          <p className="inline-flex items-center gap-2 rounded-sm border border-[#C5E3E3]/40 bg-[#045A57] px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#E5F4F4]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4EAEA]" aria-hidden="true" />
            {detail.eyebrow}
          </p>

          <h1 className="mt-4 max-w-4xl text-2xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            {detail.title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm font-medium leading-relaxed text-[#E5F4F4] sm:text-lg">
            {detail.heroLead}
          </p>

          {detail.suitedFor.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C5E3E3]">
                Suited for:
              </span>
              {detail.suitedFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#C5E3E3]/40 bg-white/10 px-3 py-1 text-[11px] font-bold text-white"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <a
              href="#demo"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#D4EAEA] bg-[#D4EAEA] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#033B38] shadow-[0_2px_0_0_#033B38] transition-colors hover:bg-white sm:w-auto"
            >
              <CalendarIcon />
              Book a free demo
            </a>
            {hasVideo && (
              <a
                href="#video"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C5E3E3]/50 bg-[#045A57] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#006569] sm:w-auto"
              >
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
                Watch the video
              </a>
            )}
            <a
              href={detail.brochureUrl}
              download
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#C5E3E3]/50 bg-transparent px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#E5F4F4] transition-colors hover:border-white hover:text-white sm:w-auto"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Brochure (PDF)
            </a>
          </div>

          <p className="mt-5 text-[11px] font-semibold text-[#C5E3E3] sm:mt-6">
            Tally Certified Partner since 2008 · CBD Belapur, Navi Mumbai
          </p>
        </div>
      </section>

      {/* Video — only when the module has a real, embeddable video */}
      {hasVideo && (
        <section id="video" className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-5 py-12 scroll-mt-32 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                {videoCopy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                {videoCopy.title}
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{videoCopy.body}</p>
            </div>

            {/* CHANGE: 2026-11-03 - the four feature cards now share a row with the video and
                stretch to its height. WHY: the cards were a short column centred beside the
                video, so their bottom edge floated above the video's bottom edge on every page
                and looked misaligned. `items-stretch` + `lg:auto-rows-fr` makes the four cards
                divide exactly the video's height; below lg they stack at natural height.
                Copy moved above the pair so both columns start on the same line. */}
            <div className="mt-6 grid items-stretch gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <ModuleVideo videoUrl={detail.videoUrl} title={detail.title} />
              </div>

              <ul className="grid gap-3 lg:col-span-5 lg:auto-rows-fr">
                {detail.features.slice(0, 4).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-[#C5E3E3] bg-white p-4 text-sm font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#006569]" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* The everyday headache — brochure page 1 flow */}
      {detail.problem && detail.flow && (
        <section className="border-b-2 border-[#033B38] bg-white px-5 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                {detail.problem.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                {detail.problem.title}
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                {detail.problem.body}
              </p>
            </div>

            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 items-stretch gap-3 lg:grid-cols-11 lg:gap-4">
              <div className="rounded-2xl border-2 border-[#033B38] bg-[#E5F4F4] p-5 shadow-[0_4px_0_0_#033B38] lg:col-span-4">
                <p className="inline-block rounded-sm bg-[#033B38] px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-[#D4EAEA]">
                  {detail.flow.inputTitle}
                </p>
                <h3 className="mt-3 text-lg font-black text-[#033B38]">What you enter</h3>
                <ul className="mt-3 space-y-2 text-xs font-semibold text-slate-700">
                  {detail.flow.inputs.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-lg border border-[#C5E3E3] bg-white p-2.5"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border border-[#033B38] bg-[#D4EAEA] text-[11px] font-extrabold text-[#033B38]">
                        +
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center lg:col-span-1">
                <span
                  className="flex h-9 w-9 rotate-90 items-center justify-center rounded-full border-2 border-[#033B38] bg-[#D4EAEA] font-black text-[#033B38] lg:rotate-0"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#033B38] bg-[#033B38] p-5 text-center shadow-[0_4px_0_0_#045A57] lg:col-span-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white bg-[#D4EAEA] text-lg font-black text-[#033B38]">
                  TP
                </span>
                <p className="mt-2 text-base font-black text-[#D4EAEA]">TallyPrime</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#E5F4F4]">{detail.flow.engine}</p>
              </div>

              <div className="flex items-center justify-center lg:col-span-1">
                <span
                  className="flex h-9 w-9 rotate-90 items-center justify-center rounded-full border-2 border-[#033B38] bg-[#D4EAEA] font-black text-[#033B38] lg:rotate-0"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>

              <div className="rounded-2xl border-2 border-[#033B38] bg-[#D4EAEA] p-5 shadow-[0_4px_0_0_#033B38] lg:col-span-3">
                <p className="inline-block rounded-sm bg-[#033B38] px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-white">
                  {detail.flow.outputTitle}
                </p>
                <h3 className="mt-3 text-lg font-black text-[#033B38]">What you get</h3>
                <ul className="mt-3 space-y-1 rounded-lg border-2 border-[#033B38] bg-white p-3 font-mono text-[11px] font-bold text-[#033B38]">
                  {detail.flow.outputs.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive simulator */}
      {detail.simulator && (
        <section id="simulator" className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-5 py-12 scroll-mt-32 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                {simulatorCopy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                {simulatorCopy.title}
              </h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{simulatorCopy.body}</p>
            </div>
            {/* CHANGE: 2026-11-03 - the simulator is a fixed-width TallyPrime window (tables,
                key strip, row actions) and cannot be made usable at phone widths without
                redesigning every screen. It now renders from md up and the phone gets a short
                note instead of a broken mock. The #simulator anchor still resolves on phones. */}
            <div className="mt-8 hidden md:block">
              <Simulator id={detail.simulator} />
            </div>
            <p className="mx-auto mt-6 max-w-xl rounded-xl border border-[#C5E3E3] bg-white p-4 text-center text-xs font-semibold leading-relaxed text-slate-600 md:hidden">
              The interactive walkthrough needs a wider screen. Open this page on a tablet or desktop to click through the module.
            </p>
          </div>
        </section>
      )}

      {/* What you get */}
      <section className="border-b-2 border-[#033B38] bg-white px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
              {whatYouGetCopy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
              {whatYouGetCopy.title}
            </h2>
          </div>

          {detail.pillars ? (
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {detail.pillars.map((pillar) => {
                const Icon = PILLAR_ICON[pillar.icon];
                return (
                  <article
                    key={pillar.title}
                    className="flex flex-col justify-between rounded-2xl border-2 border-[#033B38] bg-[#E5F4F4] p-6 shadow-[0_4px_0_0_#033B38]"
                  >
                    <div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#033B38] text-[#D4EAEA]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-[#033B38]">
                        {pillar.title}
                      </h3>
                      <ul className="mt-3 space-y-2.5 text-sm font-medium text-slate-700">
                        {pillar.points.map((point) => (
                          <li key={point} className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#006569]" aria-hidden="true" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="#simulator"
                      className="mt-5 flex items-center justify-between border-t border-[#C5E3E3] pt-3 text-[11px] font-bold text-[#006569] hover:text-[#033B38]"
                    >
                      {pillar.footerLabel}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </article>
                );
              })}
            </div>
          ) : (
            <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
              {detail.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-[#C5E3E3] bg-[#E5F4F4] p-4 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#006569]" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* How it works */}
      {detail.steps && (
        <section className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-5 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                {howItWorksCopy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                {howItWorksCopy.title}
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {detail.steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border-2 border-[#033B38] bg-white p-6 shadow-[0_4px_0_0_#033B38]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded bg-[#033B38] font-mono text-lg font-black text-[#D4EAEA]">
                      {index + 1}
                    </span>
                    <span className="rounded border border-[#C5E3E3] bg-[#E5F4F4] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#006569]">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[#033B38]">{step.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery — real product photography, no animation */}
      {detail.gallery && detail.gallery.length > 0 && (
        <section className="border-b-2 border-[#033B38] bg-white px-5 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                {galleryCopy.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                {galleryCopy.title}
              </h2>
            </div>

            <div
              className={`mt-8 grid grid-cols-1 gap-5 ${
                detail.gallery.length === 1
                  ? "mx-auto max-w-2xl"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {detail.gallery.map((item) => (
                <figure
                  key={item.src + item.caption}
                  className="overflow-hidden rounded-2xl border border-[#C5E3E3] bg-[#E5F4F4]"
                >
                  <div className="relative aspect-[4/3] w-full bg-[#D4EAEA]">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="border-t border-[#C5E3E3] p-4 text-xs font-semibold leading-relaxed text-slate-600">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Business benefits */}
      <section className="border-b-2 border-[#033B38] bg-[#E5F4F4] px-5 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
              {benefitsCopy.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
              {benefitsCopy.title}
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {detail.benefits.map((benefit, index) => {
              const Icon = [BarChart3, FileCheck2, Receipt, CheckCircle2][index % 4];
              return (
                <article key={benefit} className="rounded-2xl border border-[#C5E3E3] bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded border-2 border-[#033B38] bg-[#D4EAEA] text-[#033B38]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <h3 className="mt-3 text-sm font-black leading-snug text-[#033B38]">{benefit}</h3>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      {detail.faqs && detail.faqs.length > 0 && (
        <section className="border-b-2 border-[#033B38] bg-white px-5 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                Common questions
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                Before you book the demo
              </h2>
            </div>

            <div className="mt-8 space-y-3">
              {detail.faqs.map((faq, index) => (
                <details
                  key={faq.q}
                  open={index === 0}
                  className="group rounded-xl border-2 border-[#033B38] bg-white p-4 open:bg-[#E5F4F4]"
                >
                  <summary className="cursor-pointer list-none text-sm font-black text-[#033B38] [&::-webkit-details-marker]:hidden">
                    <span className="flex items-start justify-between gap-3">
                      {faq.q}
                      {/* CHANGE: 2026-11-03 — no transition; the + rotates instantly, nothing animates. */}
                      <span className="text-[#006569] group-open:rotate-45" aria-hidden="true">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <ModuleCta title={detail.title} pricing={detail.pricing} brochureUrl={detail.brochureUrl} />

      {/* Other modules */}
      {related.length > 0 && (
        <section className="border-b-2 border-[#033B38] bg-white px-5 py-12 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-[#006569]">
                  More modules
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#033B38] sm:text-3xl">
                  Explore other industry modules
                </h2>
              </div>
              <Link
                href="/modules"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006569] underline hover:text-[#033B38]"
              >
                View all modules
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {related.map((module) => {
                const id = module.id || module._id || "";
                return (
                  <Link
                    key={id}
                    href={moduleHref(id)}
                    className="group overflow-hidden rounded-2xl border border-[#C5E3E3] bg-[#E5F4F4] transition-colors hover:border-[#033B38]"
                  >
                    <div className="relative h-32 w-full bg-[#D4EAEA]">
                      {module.image && (
                        <Image
                          src={module.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-black text-[#033B38] group-hover:text-[#006569]">
                        {module.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-slate-600">
                        {module.shortDescription}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}
