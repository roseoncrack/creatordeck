import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  CheckCircle2,
  Search,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Ambient background — sits behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] animate-gradient-pulse" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[800px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-base text-white shadow-purple-glow-sm">
              ▦
            </span>
            <span className="text-base">CreatorDeck</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/sign-up">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative">
          {/* Hero radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[700px]"
          >
            <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]" />
          </div>

          <div className="container py-24 lg:py-36">
            <div className="mx-auto max-w-4xl text-center">
              {/* Pre-headline pill */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                The niche-precise creator marketplace
              </div>

              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Find creators that{" "}
                <span className="text-gradient-purple">actually fit</span>{" "}
                your brand.
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
                Search by sub-niche — Skydiving, Kettlebell, Fortnite, Sourdough.
                Filter on real engagement. Send pitches without the friction of cold DMs.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-7">
                  <Link href="/search">
                    Browse creators <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-7">
                  <Link href="/sign-up?role=creator">I'm a creator</Link>
                </Button>
              </div>

              {/* Floating stat pills */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                {[
                  { label: "627+ niches", icon: <Target className="h-3 w-3" /> },
                  { label: "Verified stats", icon: <CheckCircle2 className="h-3 w-3" /> },
                  { label: "One-click pitches", icon: <Zap className="h-3 w-3" /> },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-card/60 px-3.5 py-1.5 text-xs text-foreground/80 backdrop-blur"
                  >
                    <span className="text-primary">{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="relative border-t border-border/40">
          <div className="container py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for{" "}
                <span className="text-gradient-purple">precision matching</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                No more spray-and-pray. No more cold DMs. Just clean, verified discovery.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Target className="h-5 w-5" />}
                title="Niche-precise search"
                copy="1,500+ niches across 16 categories. Find kettlebell minimalists, not just 'fitness.'"
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5" />}
                title="Verified stats"
                copy="OAuth-verified followers, engagement, and avg views. No vanity metrics."
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="One-click pitches"
                copy="Send personalized pitches with deliverables, budget, and timeline in 30 seconds."
              />
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="relative border-t border-border/40">
          <div className="container py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Three steps. <span className="text-gradient-purple">Zero noise.</span>
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <StepCard
                step="01"
                icon={<Search className="h-5 w-5" />}
                title="Search"
                copy="Filter by niche, platform, follower band, engagement, country, and price."
              />
              <StepCard
                step="02"
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Verify"
                copy="Every creator stat is OAuth-verified. What you see is what you get."
              />
              <StepCard
                step="03"
                icon={<Send className="h-5 w-5" />}
                title="Pitch"
                copy="One-click pitch templates. Deliverables, timeline, budget — done in 30 seconds."
              />
            </div>
          </div>
        </section>

        {/* ── Stats band ── */}
        <section className="relative border-y border-border/40 bg-secondary/30">
          <div className="absolute inset-0 -z-10 bg-purple-fade opacity-40" aria-hidden />
          <div className="container py-20">
            <div className="grid gap-10 md:grid-cols-3">
              <Stat number="627+" label="Niches" />
              <Stat number="2" label="Sides — brand & creator" />
              <Stat number="0" label="Cold DMs needed" />
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative">
          <div className="container py-24">
            <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-secondary via-card to-background p-12 text-center shadow-purple-glow">
              <div
                aria-hidden
                className="absolute -top-24 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/30 blur-[80px]"
              />
              <h3 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to find creators that{" "}
                <span className="text-gradient-purple">actually fit?</span>
              </h3>
              <p className="relative mt-4 text-muted-foreground">
                Get started in under a minute.
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/search">
                    Browse creators <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                  <Link href="/sign-up">Create an account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-primary to-primary/60 text-xs text-white">
              ▦
            </span>
            <span className="font-medium text-foreground/80">CreatorDeck</span>
            <span className="text-muted-foreground/60">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex gap-6">
            <Link href="/search" className="hover:text-foreground transition-colors">
              Search
            </Link>
            <Link href="/sign-up" className="hover:text-foreground transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  copy,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-purple-glow-sm">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  copy,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="relative rounded-2xl border border-border bg-card/40 p-6 backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-card/70">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/30">
          {icon}
        </div>
        <span className="font-mono text-3xl font-bold text-primary/30">{step}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-5xl font-bold tracking-tight text-gradient-purple sm:text-6xl">
        {number}
      </div>
      <div className="mt-2 text-sm uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
