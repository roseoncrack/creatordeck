"use client";

import Link from "next/link";
import { BadgeCheck, Send } from "lucide-react";
import type { SearchResult } from "@creatordeck/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  cn,
  countryFlag,
  engagementClass,
  formatEngagement,
  formatFollowers,
  formatPrice,
} from "@/lib/utils";

const PLATFORM_ICON: Record<string, string> = {
  youtube: "▶",
  tiktok: "♪",
  instagram: "📷",
  twitter: "𝕏",
  twitch: "🎮",
  youtube_shorts: "⤵",
  reddit: "👽",
  pinterest: "📍",
  linkedin: "💼",
};

interface Props {
  creator: SearchResult;
  onPitch?: (creator: SearchResult) => void;
}

export function CreatorCard({ creator, onPitch }: Props) {
  const niches = creator.niches?.slice(0, 3) ?? [];
  const moreNiches = (creator.niches?.length ?? 0) - niches.length;

  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/50 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80 hover:shadow-purple-glow-sm">
      {/* top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div
        className={cn(
          "relative h-24 w-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary",
          creator.banner_url && "bg-cover bg-center",
        )}
        style={creator.banner_url ? { backgroundImage: `url(${creator.banner_url})` } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="-mt-10 flex items-end gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-card bg-secondary ring-1 ring-primary/30">
            {creator.avatar_url ? (
              <img
                src={creator.avatar_url}
                alt={creator.display_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10 text-base font-semibold text-foreground">
                {creator.display_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>

          <div className="min-w-0 pb-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/creators/${creator.handle}`}
                className="truncate text-base font-semibold text-foreground transition-colors hover:text-primary"
              >
                {creator.display_name}
              </Link>
              {creator.country_code ? (
                <span aria-label={creator.country_code}>{countryFlag(creator.country_code)}</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>@{creator.handle}</span>
              {creator.identity_verified ? (
                <span className="inline-flex items-center gap-0.5 text-emerald-400">
                  · <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {creator.bio ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{creator.bio}</p>
        ) : null}

        {niches.length ? (
          <div className="flex flex-wrap gap-1">
            {niches.map((n) => (
              <Badge key={n.id} variant="secondary" className="text-xs">
                {n.label}
              </Badge>
            ))}
            {moreNiches > 0 ? (
              <Badge variant="outline" className="text-xs">
                +{moreNiches}
              </Badge>
            ) : null}
          </div>
        ) : null}

        {creator.platforms?.length ? (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {creator.platforms.slice(0, 3).map((p) => (
              <div
                key={p.platform}
                className={cn(
                  "flex items-center gap-1 tabular-nums",
                  p.verified ? "text-foreground/90" : "text-muted-foreground",
                )}
                title={`${p.platform} ${p.verified ? "verified" : "unverified"}`}
              >
                <span className="text-foreground/80">{PLATFORM_ICON[p.platform] ?? "•"}</span>
                <span className="font-mono text-xs">{formatFollowers(p.followers)}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-secondary/40 p-2.5 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Engagement
            </div>
            <div
              className={cn(
                "mt-0.5 font-mono text-sm font-semibold",
                engagementClass(creator.avg_engagement_rate),
              )}
            >
              {formatEngagement(creator.avg_engagement_rate)}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Followers
            </div>
            <div className="mt-0.5 font-mono text-sm font-semibold text-foreground">
              {formatFollowers(creator.total_followers)}
            </div>
          </div>
        </div>

        {creator.base_price_cents !== null ? (
          <div className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold text-foreground">
              {formatPrice(creator.base_price_cents)}
            </span>
          </div>
        ) : null}

        <div className="flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/creators/${creator.handle}`}>View profile</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onPitch?.(creator)}
          >
            <Send className="mr-1.5 h-3 w-3" /> Send pitch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CreatorCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/50 backdrop-blur">
      <div className="h-24 w-full animate-pulse bg-secondary" />
      <CardContent className="space-y-3 p-4">
        <div className="-mt-10 flex items-end gap-3">
          <div className="h-14 w-14 animate-pulse rounded-full border-2 border-card bg-secondary" />
          <div className="space-y-1.5 pb-1">
            <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
            <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
          </div>
        </div>
        <div className="h-3 w-full animate-pulse rounded bg-secondary" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
        <div className="h-12 animate-pulse rounded bg-secondary" />
        <div className="flex gap-2">
          <div className="h-9 flex-1 animate-pulse rounded bg-secondary" />
          <div className="h-9 flex-1 animate-pulse rounded bg-secondary" />
        </div>
      </CardContent>
    </Card>
  );
}
