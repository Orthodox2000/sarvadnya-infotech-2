'use client';

import { useState, useMemo, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';

type GradientDirection = 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
type GradientType = 'linear' | 'radial';

const DIRECTION_LABELS: Record<GradientDirection, string> = {
  'to-r': '→ Right',
  'to-l': '← Left',
  'to-t': '↑ Top',
  'to-b': '↓ Bottom',
  'to-tr': '↗ Top-Right',
  'to-tl': '↖ Top-Left',
  'to-br': '↘ Bottom-Right',
  'to-bl': '↙ Bottom-Left',
};

const FONT_SIZES = [
  { label: '4xl', value: 'text-4xl' },
  { label: '2xl', value: 'text-2xl' },
  { label: 'lg', value: 'text-lg' },
  { label: 'base', value: 'text-base' },
  { label: 'sm', value: 'text-sm' },
  { label: 'xs', value: 'text-xs' },
] as const;

const FONT_WEIGHTS = [
  { label: 'Black 900', value: 'font-black' },
  { label: 'Bold 700', value: 'font-bold' },
  { label: 'Semibold 600', value: 'font-semibold' },
  { label: 'Medium 500', value: 'font-medium' },
  { label: 'Normal 400', value: 'font-normal' },
  { label: 'Light 300', value: 'font-light' },
] as const;

function toHex(c: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  if (/^#[0-9a-fA-F]{3}$/.test(c)) return '#' + c[1]+c[1] + c[2]+c[2] + c[3]+c[3];
  if (typeof document === 'undefined') return '#000000';
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return '#000000';
  ctx.fillStyle = c;
  return ctx.fillStyle;
}

function hexToRgb(hex: string) {
  const h = toHex(hex);
  return {
    r: parseInt(h.slice(1,3), 16),
    g: parseInt(h.slice(3,5), 16),
    b: parseInt(h.slice(5,7), 16),
  };
}

function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const [R, G, B] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function isLight(hex: string) {
  return luminance(hex) > 0.5;
}

function getContrastText(bg: string): string {
  return isLight(bg) ? '#000000' : '#ffffff';
}

function complementary(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const comp = (c: number) => (255 - c).toString(16).padStart(2, '0');
  return `#${comp(r)}${comp(g)}${comp(b)}`;
}

function triadic(hex: string): [string, string] {
  const { r, g, b } = hexToRgb(hex);
  const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * (180 / Math.PI);
  const h = hue < 0 ? hue + 360 : hue;
  const t1 = (h + 120) % 360;
  const t2 = (h + 240) % 360;
  return [
    `hsl(${Math.round(t1)}, 60%, 50%)`,
    `hsl(${Math.round(t2)}, 60%, 50%)`,
  ];
}

function analogous(hex: string): string[] {
  const { r, g, b } = hexToRgb(hex);
  const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * (180 / Math.PI);
  const h = hue < 0 ? hue + 360 : hue;
  return [-30, -15, 15, 30].map(offset => {
    const nh = (h + offset + 360) % 360;
    return `hsl(${Math.round(nh)}, 60%, 50%)`;
  });
}

export default function ColourDemoPage() {
  const [primary, setPrimary] = useState('#00ABE4');
  const [secondary, setSecondary] = useState('#232F3E');
  const [containerBg, setContainerBg] = useState('#f8fafc');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1a1a2e');
  const [gradientDir, setGradientDir] = useState<GradientDirection>('to-r');
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [activePicker, setActivePicker] = useState<string | null>(null);
  const [textSample, setTextSample] = useState('The quick brown fox jumps over the lazy dog. 0123456789');

  const contrastText = useMemo(() => getContrastText(bgColor), [bgColor]);
  const compColor = useMemo(() => complementary(primary), [primary]);
  const triColors = useMemo(() => triadic(primary), [primary]);
  const analColors = useMemo(() => analogous(primary), [primary]);

  const pickerFields = [
    { key: 'primary', label: 'Primary', value: primary, setter: setPrimary },
    { key: 'secondary', label: 'Secondary', value: secondary, setter: setSecondary },
    { key: 'container', label: 'Container', value: containerBg, setter: setContainerBg },
    { key: 'bg', label: 'Background', value: bgColor, setter: setBgColor },
    { key: 'text', label: 'Text', value: textColor, setter: setTextColor },
  ];

  const togglePicker = useCallback((key: string) => {
    setActivePicker(prev => prev === key ? null : key);
  }, []);

  return (
    <div
      className="min-h-screen transition-[background-color] duration-500"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          backgroundColor: `${secondary}cc`,
          borderColor: `${primary}40`,
          color: getContrastText(secondary),
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black shadow-lg"
              style={{ backgroundColor: primary, color: getContrastText(primary) }}
            >
              C
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight">Colour Palette</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">Hidden Demo · Client Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest"
              style={{ backgroundColor: `${primary}30`, color: getContrastText(secondary) }}
            >
              Hidden Route
            </span>
            <span className="text-[10px] font-mono opacity-50">/colour</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Quick Stats */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Primary', value: primary },
            { label: 'Secondary', value: secondary },
            { label: 'Container', value: containerBg },
            { label: 'Text', value: textColor },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border p-4 transition-all"
              style={{
                backgroundColor: `${primary}08`,
                borderColor: `${primary}20`,
              }}
            >
              <div
                className="mb-2 h-10 w-full rounded-xl shadow-inner"
                style={{ backgroundColor: c.value }}
              />
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">{c.label}</p>
              <p className="font-mono text-xs font-bold">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Main grid: Controls + Preview */}
        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Panel */}
          <div className="space-y-6 lg:col-span-4">
            <div
              className="rounded-2xl border p-6 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-5 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                Color Controls
              </h2>
              <div className="space-y-3">
                {pickerFields.map((field) => (
                  <div key={field.key}>
                    <button
                      type="button"
                      onClick={() => togglePicker(field.key)}
                      className="flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs font-bold transition-all hover:opacity-80"
                      style={{
                        backgroundColor: `${field.value}15`,
                        borderColor: activePicker === field.key ? field.value : `${field.value}30`,
                        color: textColor,
                      }}
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-lg border shadow-inner"
                        style={{ backgroundColor: field.value, borderColor: `${field.value}50` }}
                      />
                      <span className="flex-1 font-black tracking-wide">{field.label}</span>
                      <span className="font-mono text-[10px] opacity-60">{field.value}</span>
                      <svg className="h-3 w-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activePicker === field.key && (
                      <div className="mt-2 rounded-xl border p-3 shadow-lg" style={{ borderColor: `${primary}20`, backgroundColor: bgColor }}>
                        <HexColorPicker
                          color={field.value}
                          onChange={field.setter}
                          style={{ width: '100%', height: 180 }}
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-wider opacity-50">Hex</span>
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) field.setter(v);
                            }}
                            className="flex-1 rounded-lg border bg-transparent px-2 py-1 font-mono text-xs outline-none transition-all focus:ring-2"
                            style={{
                              borderColor: `${primary}30`,
                              color: textColor,
                              '--tw-ring-color': primary,
                            } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Controls */}
            <div
              className="rounded-2xl border p-6 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-4 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                Gradient Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest opacity-50">Type</p>
                  <div className="flex gap-2">
                    {(['linear', 'radial'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setGradientType(t)}
                        className="flex-1 rounded-xl border py-2 text-[9px] font-black uppercase tracking-widest transition-all"
                        style={{
                          backgroundColor: gradientType === t ? primary : 'transparent',
                          borderColor: gradientType === t ? 'transparent' : `${primary}30`,
                          color: gradientType === t ? getContrastText(primary) : textColor,
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {gradientType === 'linear' && (
                  <div>
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest opacity-50">Direction</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(Object.entries(DIRECTION_LABELS) as [GradientDirection, string][]).map(([dir, label]) => (
                        <button
                          key={dir}
                          type="button"
                          onClick={() => setGradientDir(dir)}
                          className="rounded-lg border py-2 text-[8px] font-bold uppercase tracking-wider transition-all"
                          style={{
                            backgroundColor: gradientDir === dir ? `${primary}20` : 'transparent',
                            borderColor: gradientDir === dir ? primary : `${primary}20`,
                            color: textColor,
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Color Harmonies */}
            <div
              className="rounded-2xl border p-6 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-4 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                Color Harmonies
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest opacity-50">Complementary</p>
                  <div className="flex h-10 gap-1 overflow-hidden rounded-xl">
                    <div className="flex-1" style={{ backgroundColor: primary }} />
                    <div className="flex-1" style={{ backgroundColor: compColor }} />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[9px] opacity-60">
                    <span>{primary}</span>
                    <span>{compColor}</span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest opacity-50">Analogous</p>
                  <div className="flex h-8 gap-1 overflow-hidden rounded-xl">
                    {analColors.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-widest opacity-50">Triadic</p>
                  <div className="flex h-8 gap-1 overflow-hidden rounded-xl">
                    <div className="flex-1" style={{ backgroundColor: primary }} />
                    {triColors.map((c, i) => (
                      <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="space-y-8 lg:col-span-8">
            {/* Color Application: Text */}
            <section
              className="rounded-2xl border p-6 sm:p-8 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-6 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                Text Color Applications
              </h2>

              {/* Sample text input */}
              <div className="mb-6">
                <input
                  type="text"
                  value={textSample}
                  onChange={(e) => setTextSample(e.target.value)}
                  className="w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: `${primary}25`,
                    color: textColor,
                    '--tw-ring-color': primary,
                  } as React.CSSProperties}
                  placeholder="Type your sample text..."
                />
              </div>

              <div className="space-y-6">
                {/* Size ladder */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Size Ladder</p>
                  <div className="space-y-3">
                    {FONT_SIZES.map((fs) => (
                      <p
                        key={fs.label}
                        className={`${fs.value} font-bold tracking-tight`}
                        style={{ color: textColor }}
                      >
                        {fs.label}: {textSample}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full" style={{ backgroundColor: `${primary}15` }} />

                {/* Weight ladder */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Weight Ladder</p>
                  <div className="space-y-2">
                    {FONT_WEIGHTS.map((fw) => (
                      <p
                        key={fw.label}
                        className={`text-lg ${fw.value}`}
                        style={{ color: textColor }}
                      >
                        {fw.label}: {textSample}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full" style={{ backgroundColor: `${primary}15` }} />

                {/* Colored text spans within paragraph */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Colored Text Spans</p>
                  <p className="text-base leading-relaxed" style={{ color: textColor }}>
                    This is a paragraph with{' '}
                    <span className="font-bold" style={{ color: primary }}>primary colored text</span>
                    ,{' '}
                    <span className="font-bold" style={{ color: secondary }}>secondary colored text</span>
                    , and{' '}
                    <span className="font-bold" style={{ color: getContrastText(containerBg), backgroundColor: containerBg, padding: '0 6px', borderRadius: 4 }}>text on container bg</span>
                    {' '}mixed with default text color.
                  </p>
                </div>

                <div className="h-px w-full" style={{ backgroundColor: `${primary}15` }} />

                {/* Text on color backgrounds */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Text on Colored Backgrounds</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      { bg: primary, label: 'On Primary' },
                      { bg: secondary, label: 'On Secondary' },
                      { bg: containerBg, label: 'On Container' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: item.bg }}
                      >
                        <p
                          className="text-xs font-black uppercase tracking-wider"
                          style={{ color: getContrastText(item.bg) }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="mt-2 text-sm font-bold"
                          style={{ color: getContrastText(item.bg) }}
                        >
                          {textSample}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full" style={{ backgroundColor: `${primary}15` }} />

                {/* Gradient text */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Gradient Text</p>
                  <h3
                    className="bg-clip-text text-3xl font-black tracking-tight text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${primary}, ${containerBg})`,
                    }}
                  >
                    {textSample}
                  </h3>
                  <h3
                    className="mt-3 bg-clip-text text-2xl font-black tracking-tight text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${secondary}, ${primary}, ${containerBg})`,
                    }}
                  >
                    Multi-stop Gradient Text
                  </h3>
                </div>
              </div>
            </section>

            {/* Color Application: Backgrounds */}
            <section
              className="rounded-2xl border p-6 sm:p-8 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-6 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                Background Color Applications
              </h2>
              <div className="space-y-6">
                {/* Solid backgrounds */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Solid Backgrounds</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { bg: primary, label: 'Primary' },
                      { bg: secondary, label: 'Secondary' },
                      { bg: containerBg, label: 'Container' },
                      { bg: compColor, label: 'Complementary' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl p-5 text-center shadow-sm"
                        style={{ backgroundColor: item.bg }}
                      >
                        <p
                          className="text-[9px] font-black uppercase tracking-wider"
                          style={{ color: getContrastText(item.bg) }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="mt-1 font-mono text-[9px]"
                          style={{ color: getContrastText(item.bg), opacity: 0.7 }}
                        >
                          {item.bg}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Background with text contrast */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Background-Text Contrast</p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      { bg: '#000000', label: 'On Black' },
                      { bg: '#ffffff', label: 'On White', darkText: true },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl p-6"
                        style={{ backgroundColor: item.bg }}
                      >
                        <p
                          className="text-xs font-black uppercase tracking-wider"
                          style={{ color: item.darkText ? '#000' : '#fff' }}
                        >
                          {item.label}
                        </p>
                        <p
                          className="mt-1 text-sm font-bold"
                          style={{ color: item.darkText ? '#000' : '#fff' }}
                        >
                          Default text on this background
                        </p>
                        <p
                          className="mt-1 text-sm font-bold"
                          style={{ color: primary }}
                        >
                          Primary text on this background
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Opacity layers */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Opacity Scales</p>
                  <div className="space-y-1">
                    {[5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((op) => (
                      <div
                        key={op}
                        className="flex items-center gap-3 rounded-lg px-3 py-1.5"
                        style={{
                          backgroundColor: `${primary}${op.toString(16).padStart(2, '0')}`,
                        }}
                      >
                        <span
                          className="w-12 font-mono text-[9px] font-bold"
                          style={{ color: textColor, opacity: 0.5 }}
                        >
                          {op}%
                        </span>
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: getContrastText(bgColor) }}
                        >
                          {textSample}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Color Application: Gradients */}
            <section
              className="rounded-2xl border p-6 sm:p-8 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                <span>Gradient Demonstrations</span>
                <span
                  className="inline-block h-4 w-4 rounded"
                  style={{
                    background: `linear-gradient(to right, ${primary}, ${containerBg})`,
                  }}
                />
              </h2>
              <div className="space-y-6">
                {/* Linear gradients */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">
                    Linear Gradients — Active Direction: {DIRECTION_LABELS[gradientDir]}
                  </p>
                  <div
                    className="h-24 rounded-2xl shadow-inner transition-all"
                    style={{
                      backgroundImage: `linear-gradient(${gradientDir}, ${primary}, ${containerBg})`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest drop-shadow-lg"
                        style={{ color: getContrastText(primary) }}
                      >
                        {primary} → {containerBg}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radial gradient */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Radial Gradient</p>
                  <div
                    className="h-24 rounded-2xl shadow-inner transition-all"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, ${primary}, ${secondary})`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest drop-shadow-lg"
                        style={{ color: getContrastText(primary) }}
                      >
                        Radial Center
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-stop gradient */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Multi-Stop Gradient</p>
                  <div
                    className="h-24 rounded-2xl shadow-inner transition-all"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${primary}, ${containerBg} 50%, ${compColor})`,
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span
                        className="text-[10px] font-black uppercase tracking-widest drop-shadow-lg"
                        style={{ color: getContrastText(primary) }}
                      >
                        3-Stop: Primary → Container → Complementary
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gradient grid showcase */}
                <div>
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest opacity-40">Direction Comparison</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['to-r', 'to-t', 'to-tr', 'to-br'] as GradientDirection[]).map((dir) => (
                      <div
                        key={dir}
                        className="h-16 rounded-xl shadow-inner transition-all"
                        style={{
                          backgroundImage: `linear-gradient(${dir}, ${primary}, ${containerBg})`,
                        }}
                      >
                        <div className="flex h-full items-center justify-center">
                          <span className="text-[7px] font-bold uppercase tracking-wider drop-shadow-lg" style={{ color: getContrastText(primary) }}>
                            {DIRECTION_LABELS[dir]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive UI Preview */}
            <section
              className="rounded-2xl border p-6 sm:p-8 transition-all"
              style={{
                backgroundColor: containerBg,
                borderColor: `${primary}15`,
              }}
            >
              <h2
                className="mb-6 text-[10px] font-black uppercase tracking-[0.25em]"
                style={{ color: primary }}
              >
                Component Preview
              </h2>
              <div
                className="overflow-hidden rounded-2xl border shadow-xl transition-all"
                style={{
                  backgroundColor: bgColor,
                  borderColor: `${primary}20`,
                  color: textColor,
                }}
              >
                {/* Mock card header */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{
                    backgroundColor: `${primary}10`,
                    borderBottom: `1px solid ${primary}20`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black shadow-lg"
                      style={{ backgroundColor: primary, color: getContrastText(primary) }}
                    >
                      S
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: textColor }}>Brand Preview</p>
                      <p className="text-[9px] font-bold uppercase tracking-wider opacity-40">Interactive Mockup</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: primary }}
                    />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: containerBg }}
                    />
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: secondary }}
                    />
                  </div>
                </div>

                {/* Mock card body */}
                <div className="space-y-5 p-6">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: primary }}>
                      Featured
                    </p>
                    <h3
                      className="mt-1 text-2xl font-black tracking-tight"
                      style={{ color: textColor }}
                    >
                      {textSample}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed opacity-70" style={{ color: textColor }}>
                      This is a live preview of how your chosen colors work together in a real component.
                      The primary color drives the brand elements, secondary adds depth, and the container background frames the content.
                    </p>
                  </div>

                  {/* Gradient card */}
                  <div
                    className="rounded-2xl p-5 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${primary}, ${secondary})`,
                    }}
                  >
                    <p
                      className="text-[9px] font-black uppercase tracking-widest"
                      style={{ color: getContrastText(primary), opacity: 0.7 }}
                    >
                      Gradient Card
                    </p>
                    <p
                      className="mt-1 text-lg font-bold"
                      style={{ color: getContrastText(primary) }}
                    >
                      {textSample}
                    </p>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: '99%', label: 'Uptime', color: primary },
                      { value: '24/7', label: 'Support', color: containerBg },
                      { value: '5K+', label: 'Clients', color: secondary },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-4 text-center transition-all"
                        style={{ backgroundColor: `${stat.color}12` }}
                      >
                        <p
                          className="text-xl font-black"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </p>
                        <p
                          className="mt-0.5 text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: textColor, opacity: 0.5 }}
                        >
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: primary,
                        color: getContrastText(primary),
                      }}
                    >
                      Primary Action
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border px-6 py-3 text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02]"
                      style={{
                        borderColor: primary,
                        color: primary,
                        backgroundColor: 'transparent',
                      }}
                    >
                      Secondary Action
                    </button>
                    <button
                      type="button"
                      className="rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: containerBg,
                        color: getContrastText(containerBg),
                      }}
                    >
                      Container CTA
                    </button>
                  </div>

                  {/* Tag chips */}
                  <div className="flex flex-wrap gap-2">
                    {['Design', 'Color', 'Palette', 'UI', 'Demo'].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${primary}15`,
                          color: primary,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span style={{ color: textColor }}>Progress</span>
                      <span style={{ color: primary }}>75%</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full"
                      style={{ backgroundColor: `${primary}15` }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: '75%',
                          background: `linear-gradient(to right, ${primary}, ${containerBg})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t px-6 py-8 text-center text-[10px] font-bold uppercase tracking-widest"
        style={{
          borderColor: `${primary}20`,
          color: textColor,
          opacity: 0.4,
        }}
      >
        Colour Palette Demo · Hidden Route · All changes scoped to this page only
      </footer>
    </div>
  );
}
