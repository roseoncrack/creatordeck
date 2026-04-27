import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format follower counts: 1234 → "1.2K", 1_500_000 → "1.5M".
 */
export function formatFollowers(n: number): string {
  if (!n || n < 1000) return String(n ?? 0);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0).replace(/\.0$/, "")}K`;
  if (n < 1_000_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  return `${(n / 1_000_000_000).toFixed(1)}B`;
}

/**
 * Format engagement rate: 0.072 → "7.2%".
 */
export function formatEngagement(rate: number): string {
  if (!rate) return "0%";
  return `${(rate * 100).toFixed(1)}%`;
}

/**
 * Format USD cents → "$2,500" or "$0".
 */
export function formatPrice(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "—";
  const dollars = cents / 100;
  if (dollars >= 1_000_000) {
    return `$${(dollars / 1_000_000).toFixed(1)}M`;
  }
  return `$${dollars.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

/**
 * Country code to flag emoji.
 */
export function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "";
  const A = 0x1f1e6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(
    A + (code.toUpperCase().charCodeAt(0) - a),
    A + (code.toUpperCase().charCodeAt(1) - a),
  );
}

/**
 * Engagement rate color class — green if strong, orange if weak.
 */
export function engagementClass(rate: number): string {
  if (rate >= 0.05) return "text-emerald-600 dark:text-emerald-400";
  if (rate >= 0.02) return "text-foreground";
  return "text-orange-600 dark:text-orange-400";
}
