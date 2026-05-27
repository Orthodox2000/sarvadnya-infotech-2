'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchWithCache } from '@/lib/client-api';

interface StatItemProps {
  label: string;
  value: number;
  suffix: string;
  isVisible: boolean;
}

function StatItem({ label, value, suffix, isVisible }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let start = 0;
    const end = value;
    const duration = 2000; // 2.0 seconds total duration
    let startTimestamp: number | null = null;

    let animationFrameId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easeOutExpo * end);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, value]);

  return (
    <div className={`flex flex-col items-center justify-center p-3 sm:p-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="text-2xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-1 sm:mb-2 flex items-baseline">
        <span>{count}</span>
        <span className="text-[#00ABE4] ml-0.5 sm:ml-1">{suffix}</span>
      </div>
      <div className="text-[10px] sm:text-base font-bold uppercase tracking-[0.05em] sm:tracking-widest text-slate-400">
        {label}
      </div>
    </div>
  );
}

const DEFAULT_STATS = [
  { label: 'Happy Clients', value: 5000, suffix: '+' },
  { label: 'Cities Covered', value: 50, suffix: '+' },
  { label: 'Years Experience', value: 15, suffix: '+' }
];

export default function HomeStat({ initialData }: { initialData?: any[] }) {
  const [stats, setStats] = useState<any[]>(initialData || DEFAULT_STATS);
  const [loading, setLoading] = useState(!initialData);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialData) return;
    const fetchStats = async () => {
      try {
        const data = await fetchWithCache('/api/content?section=home_stats');
        if (Array.isArray(data) && data.length > 0) {
          // Ensure values are numbers
          const sanitized = data.map(s => ({
            ...s,
            value: Number(s.value) || 0
          }));
          setStats(sanitized);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [initialData]);

  useEffect(() => {
    const currentRef = sectionRef.current;
    
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    // Safety fallback: if not visible in 3 seconds, just show it
    const safetyTimer = setTimeout(() => {
        setIsVisible(true);
    }, 3000);

    return () => {
      clearTimeout(safetyTimer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="w-full py-4 sm:py-4 border-y border-[#E9F1FA] transition-colors duration-300 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-1 divide-x divide-[#E9F1FA]">
          {stats.map((stat, index) => (
            <StatItem 
              key={index}
              label={stat.label}
              value={Number(stat.value) || 0}
              suffix={stat.suffix}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
