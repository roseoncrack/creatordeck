import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/60 text-base text-white shadow-purple-glow-sm">
                ▦
              </span>
              <span>CreatorDeck</span>
            </Link>
            <nav className="hidden items-center gap-1 text-sm sm:flex">
              <Link
                href="/search"
                className="rounded-md px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-primary/10"
              >
                Search
              </Link>
              <Link
                href="/pitches"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                Pitches
              </Link>
              <Link
                href="/deals"
                className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
              >
                Deals
              </Link>
            </nav>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 ring-1 ring-primary/40 hover:ring-primary/70 transition-all",
              },
            }}
          />
        </div>
      </header>

      <main className="container flex-1 py-8">{children}</main>
    </div>
  );
}
