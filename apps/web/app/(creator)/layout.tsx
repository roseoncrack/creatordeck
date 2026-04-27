import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="text-xl">▦</span>
              <span>CreatorDeck</span>
            </Link>
            <nav className="hidden items-center gap-4 text-sm sm:flex">
              <Link href="/profile" className="font-medium hover:text-primary">
                Profile
              </Link>
              <Link href="/inbox" className="text-muted-foreground hover:text-primary">
                Inbox
              </Link>
              <Link href="/deals" className="text-muted-foreground hover:text-primary">
                Deals
              </Link>
            </nav>
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="container flex-1 py-6">{children}</main>
    </div>
  );
}
