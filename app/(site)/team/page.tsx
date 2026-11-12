'use client';

import { useState, useEffect, useRef } from "react";
import Footer from "../../components/Footer";
import {
  TEAM_HERO_VIDEO_PATH,
  TEAM_HERO_POSTER_PATH,
  TEAM_HERO_VIDEO_UPLOADED_ISO,
  TEAM_HERO_VIDEO_UPLOADED_LABEL,
  TEAM_HERO_VIDEO_TITLE,
  TEAM_HERO_VIDEO_ALT,
} from "@/lib/team-media";

// CHANGE: 2026-11-12 — the hero's right slot is now a MEDIA slot, not an image slot.
// It plays the team's Diwali 2026 celebration video (muted, autoplaying, seamless loop) and
// degrades to a still frame when the visitor prefers reduced motion or the file cannot play.
// Paths + upload date live in lib/team-media.ts so this page and the metadata layout cannot
// drift apart. The re-encode notes (64 MB -> 4.0 MB) are documented there.
// Only a URL with a video extension is treated as a video, so the existing admin `hero_image`
// field can hold either a photo or a video without a schema change.
const VIDEO_SRC = /\.(mp4|webm|ogv|mov)(\?|#|$)/i;

const DEFAULTS = {
  hero_title: 'Meet the Experts Behind Your Success',
  hero_quote: '"At Sarvadnya Infotech, our strength lies in our unity and our shared passion for simplifying business technology. We don\'t just solve problems; we build lasting relationships with our clients."',
  hero_image: '',
  hero_video: '',
  culture_title: 'Our Employee Culture',
  culture_items: [
    { title: 'Constant Innovation', desc: 'We encourage our team to stay ahead of the curve with regular training and certifications.' },
    { title: 'Collaborative Spirit', desc: 'Success is a team effort. We foster an environment where every voice matters.' },
    { title: 'Client-First Mindset', desc: 'Our team\'s primary goal is to ensure client satisfaction through efficient support.' }
  ],

};

/**
 * Resolve the hero media from CMS content.
 * Precedence: explicit `hero_video` -> a video URL stored in `hero_image` -> the bundled
 * celebration video. `hero_image` (when it really is a photo) is kept as the error fallback,
 * so an already-configured team photo is never lost.
 */
function resolveHeroMedia(content: any) {
  const configuredVideo = String(content?.hero_video || content?.hero_video_url || '').trim();
  const legacy = String(content?.hero_image || '').trim();
  const legacyIsVideo = VIDEO_SRC.test(legacy);
  return {
    video: configuredVideo || (legacyIsVideo ? legacy : TEAM_HERO_VIDEO_PATH),
    still: (!legacyIsVideo && legacy) || TEAM_HERO_POSTER_PATH,
  };
}

export default function TeamPage() {
  const [content, setContent] = useState<any>(DEFAULTS);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const hero = resolveHeroMedia(content);

  useEffect(() => {
    fetchContent();
    fetchTeam();
  }, []);

  // CHANGE: 2026-11-12 — honour `prefers-reduced-motion`: those visitors get the poster still
  // instead of a moving hero. The preference is only readable on the client, so it is resolved
  // in an effect — the element is swapped for the <img> as soon as it is known.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener?.('change', sync);
    return () => mq.removeEventListener?.('change', sync);
  }, []);

  // CHANGE: 2026-11-12 — autoplay is best-effort: some mobile browsers reject play() even when
  // the element is muted, and an unhandled rejection shows up as a console error. Swallow it,
  // and stop looping while the tab is hidden so a background tab does not decode video.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || videoFailed || reduceMotion) return;

    const play = () => {
      const attempt = el.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    };

    play();
    const onVisibility = () => (document.hidden ? el.pause() : play());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [hero.video, reduceMotion, videoFailed]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content?section=team');
      const data = await response.json();
      if (data && !data.error) {
        setContent({ ...DEFAULTS, ...data });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/partners?type=team');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTeamMembers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero: Team Photo & Common Message (Themed Hero) */}
      <section className="bg-white py-20 px-6 sm:px-12 lg:px-24 relative overflow-hidden flex flex-col items-center border-b border-[#006569]/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[70%] h-[70%] bg-white/10 blur-[130px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-teal-200/20 blur-[110px] -ml-24 -mb-24" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10 w-full flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-900/5 border border-slate-900/10 text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-2 backdrop-blur-sm">
              <span className="flex h-0.5 w-0.5 rounded-full bg-slate-400"></span>
              Our Family
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006569] to-[#006569] drop-shadow-[0_2px_15px_rgba(0,101,105,0.3)]">Experts</span><br/>
              Behind Your Success
            </h1>
            <p className="text-lg md:text-xl text-slate-600/80 font-medium leading-relaxed italic border-l-4 border-[#006569] pl-6 max-w-2xl mx-auto lg:mx-0">
              {content.hero_quote}
            </p>
          </div>
          <div className="flex-1 w-full max-w-2xl">
            <figure className="m-0">
              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm shadow-2xl border border-slate-200 flex items-center justify-center p-2">
                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-900">
                  {reduceMotion || videoFailed ? (
                    <img
                      src={videoFailed ? hero.still : TEAM_HERO_POSTER_PATH}
                      className="w-full h-full object-cover"
                      width={1280}
                      height={720}
                      alt={TEAM_HERO_VIDEO_ALT}
                    />
                  ) : (
                    <video
                      ref={videoRef}
                      key={hero.video}
                      src={hero.video}
                      poster={TEAM_HERO_POSTER_PATH}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      disablePictureInPicture
                      controls={false}
                      // CHANGE: 2026-11-12 — accessible name + tooltip for the autoplaying hero.
                      aria-label={TEAM_HERO_VIDEO_TITLE}
                      title={TEAM_HERO_VIDEO_TITLE}
                      className="w-full h-full object-cover"
                      onError={() => setVideoFailed(true)}
                    />
                  )}
                </div>
              </div>
              <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <span>Diwali 2026 celebration</span>
                <time dateTime={TEAM_HERO_VIDEO_UPLOADED_ISO}>{TEAM_HERO_VIDEO_UPLOADED_LABEL}</time>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Dynamic Team Grid */}
      {teamMembers.length > 0 && (
        <section className="py-24 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto animate-rise-up" style={{ animationDelay: '200ms' }}>
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">The A-Team</h2>
             <p className="text-slate-500 font-bold text-sm">Expert consultants and support staff dedicated to your success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12">
            {teamMembers.map((member, idx) => (
              <div key={member._id} className="group flex flex-col items-center text-center">
                 <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden bg-white shadow-lg border border-slate-100 mb-8 group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <img src={member.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#006569]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <h4 className="font-black text-slate-900 text-xl mb-1 leading-tight group-hover:text-[#006569] transition-colors">{member.name}</h4>
                 <p className="text-[10px] sm:text-xs font-black text-[#006569] uppercase tracking-[0.2em] opacity-80">{member.description || 'Expert Consultant'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Employee Culture Description */}
      <section className="py-24 bg-slate-50/50 border-y border-slate-100 animate-rise-up" style={{ animationDelay: '300ms' }}>
        <div className="px-6 sm:px-12 lg:px-24 max-w-5xl mx-auto text-center space-y-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{content.culture_title || 'Our Employee Culture'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(content.culture_items || []).map((item: any, idx: number) => (
              <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-[#E5F4F4] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#006569] transition-colors">
                  {idx === 0 ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : idx === 1 ? (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-slate-500 font-bold leading-relaxed opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto pt-8">
            {content.culture_description || 'At Sarvadnya, we believe that a happy team leads to happy clients. Our culture is built on transparency, continuous learning, and a deep-rooted commitment to excellence in the Tally ecosystem.'}
          </p>
        </div>
      </section>



      <Footer />
    </main>
  );
}
