export default function Home() {
  return (
    <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "var(--secondary-color)" }}>
          Sarvadnya Infotech
        </p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ color: "var(--heading-color)" }}>
          Fresh Next.js, Tailwind, and MongoDB starter
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: "var(--para-color)" }}>
          The stock template has been cleared so product screens, APIs, and
          database-backed features can be built from a clean base.
        </p>
      </section>
    </main>
  );
}
