import { theme } from "@/lib/theme";

const entries = [
  { label: "Primary Color", value: theme.primaryColor, cssVar: "--primary-color" },
  { label: "Secondary Color", value: theme.secondaryColor, cssVar: "--secondary-color" },
  { label: "Primary Button", value: theme.primaryButtonColor, cssVar: "--primary-btn-color" },
  { label: "Secondary Button", value: theme.secondaryButtonColor, cssVar: "--secondary-btn-color" },
  { label: "Heading Color", value: theme.headingColor, cssVar: "--heading-color" },
  { label: "Paragraph Color", value: theme.paragraphColor, cssVar: "--para-color" },
  { label: "Background Color", value: theme.backgroundColor, cssVar: "--background-color" },
] as const;

export default function ThemeSettingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-semibold" style={{ color: "var(--heading-color)" }}>
        Theme Settings
      </h1>
      <p className="mt-3 text-base" style={{ color: "var(--para-color)" }}>
        Edit values in <code>lib/theme.ts</code> to update colors globally.
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <div
            key={entry.cssVar}
            className="flex items-center gap-3 rounded-md border bg-background p-3"
            style={{ borderColor: "var(--secondary-color)" }}
          >
            <span
              className="inline-block h-8 w-8 shrink-0 rounded border"
              style={{ borderColor: "var(--secondary-color)", backgroundColor: entry.value }}
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--heading-color)" }}>
                {entry.label}
              </p>
              <p className="text-xs" style={{ color: "var(--para-color)" }}>
                {entry.value} ({entry.cssVar})
              </p>
            </div>
          </div>
        ))}
      </section>

      <section
        className="mt-8 rounded-md border bg-background p-6"
        style={{ borderColor: "var(--secondary-color)" }}
      >
        <h2 className="text-2xl font-semibold" style={{ color: "var(--heading-color)" }}>
          Heading Preview
        </h2>
        <p className="mt-3 text-base leading-7" style={{ color: "var(--para-color)" }}>
          This paragraph uses the global paragraph color token.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--primary-btn-color)" }}
          >
            Primary Button
          </button>
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--secondary-btn-color)",
              color: "var(--secondary-color)",
            }}
          >
            Secondary Button
          </button>
        </div>
      </section>
    </main>
  );
}
