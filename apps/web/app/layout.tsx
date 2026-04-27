import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CreatorDeck — Creator Sponsorship Marketplace",
    template: "%s · CreatorDeck",
  },
  description:
    "The niche-precise creator marketplace. Brands find verified creators across 1,500+ niches and pitch with one click.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "CreatorDeck",
    description: "The niche-precise creator marketplace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} dark`}
        style={{ colorScheme: "dark" }}
      >
        <body className="min-h-screen bg-background font-sans text-foreground antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
