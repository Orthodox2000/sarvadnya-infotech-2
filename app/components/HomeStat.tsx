'use client';

import { useState, useEffect, useRef } from 'react';

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

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutExpo for the "slowing down" effect
      // This makes the count rapid at first and very slow towards the end
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      const currentCount = Math.floor(easeOutExpo * end);
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end); // Ensure we land exactly on the target
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, value]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center transition-all duration-700">
      <div className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-2 flex items-baseline">
        <span>{count}</span>
        <span className="text-blue-600 ml-1">{suffix}</span>
      </div>
      <div className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-500">
        {label}
      </div>
    </div>
  );
}

export default function HomeStat() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, keep it that way to avoid jumping
          if (sectionRef.current) observer.unobserve(sectionRef.current);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const stats = [
    { label: 'Years of Experience', value: 15, suffix: '+' },
    { label: 'Active Clients', value: 1500, suffix: '+' },
    { label: 'Daily Queries Solved', value: 300, suffix: '+' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="w-full py-16 bg-white border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {stats.map((stat, index) => (
            <StatItem 
              key={index}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
