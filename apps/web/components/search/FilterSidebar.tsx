"use client";

/**
 * Filter sidebar — the desktop column on the brand search page.
 *
 * State lives in the URL via `useSearchFilters`. This component is a
 * controlled view that only mutates filter state through the setter.
 */
import * as React from "react";
import { Globe, Languages as LanguagesIcon, Filter } from "lucide-react";
import {
  CONTENT_STYLES,
  PLATFORM_KINDS,
  PRICING_MODELS,
  type ContentStyle,
  type PlatformKind,
  type PricingModel,
} from "@creatordeck/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { NicheTree } from "./NicheTree";
import { useSearchFilters } from "@/lib/filters";
import { cn } from "@/lib/utils";

const PLATFORM_ICONS: Record<PlatformKind, string> = {
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

const CONTENT_STYLE_LABELS: Record<ContentStyle, string> = {
  long_form_video: "Long-form video",
  short_form_video: "Short-form video",
  live_stream: "Live stream",
  photo: "Photo",
  carousel: "Carousel",
  written: "Written",
  podcast: "Podcast",
  mixed: "Mixed",
};

const PRICING_LABELS: Record<PricingModel, string> = {
  flat_fee: "Flat fee",
  cpm: "CPM",
  affiliate: "Affiliate",
  hybrid: "Hybrid",
  gifted: "Gifted",
};

const COMMON_COUNTRIES = [
  ["US", "🇺🇸 United States"],
  ["CA", "🇨🇦 Canada"],
  ["GB", "🇬🇧 United Kingdom"],
  ["AU", "🇦🇺 Australia"],
  ["DE", "🇩🇪 Germany"],
  ["FR", "🇫🇷 France"],
  ["BR", "🇧🇷 Brazil"],
  ["IN", "🇮🇳 India"],
  ["JP", "🇯🇵 Japan"],
  ["MX", "🇲🇽 Mexico"],
] as const;

const COMMON_LANGUAGES = [
  ["en", "English"],
  ["es", "Spanish"],
  ["fr", "French"],
  ["de", "German"],
  ["pt", "Portuguese"],
  ["ja", "Japanese"],
  ["zh", "Chinese"],
  ["ar", "Arabic"],
] as const;

interface Props {
  /** Optional facet counts to render alongside controls. */
  nicheCounts?: Record<string, number>;
  className?: string;
}

export function FilterSidebar({ nicheCounts, className }: Props) {
  const [state, setState] = useSearchFilters();
  const [nicheFilter, setNicheFilter] = React.useState("");

  const selectedNiches = React.useMemo(() => new Set(state.niche), [state.niche]);

  const toggleNiche = (slug: string, descendants: string[]) => {
    const next = new Set(selectedNiches);
    const allSelected = descendants.every((s) => next.has(s));
    if (allSelected) {
      for (const s of descendants) next.delete(s);
    } else {
      for (const s of descendants) next.add(s);
    }
    void setState({ niche: Array.from(next), page: 1 });
  };

  const togglePlatform = (p: PlatformKind) => {
    const set = new Set<string>(state.platform);
    if (set.has(p)) set.delete(p);
    else set.add(p);
    void setState({ platform: Array.from(set) as string[], page: 1 });
  };

  const toggleContentStyle = (s: ContentStyle) => {
    const set = new Set<string>(state.content_style);
    if (set.has(s)) set.delete(s);
    else set.add(s);
    void setState({ content_style: Array.from(set) as string[], page: 1 });
  };

  const togglePricingModel = (m: PricingModel) => {
    const set = new Set<string>(state.pricing_model);
    if (set.has(m)) set.delete(m);
    else set.add(m);
    void setState({ pricing_model: Array.from(set) as string[], page: 1 });
  };

  const toggleCountry = (code: string) => {
    const set = new Set<string>(state.country);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    void setState({ country: Array.from(set), page: 1 });
  };

  const toggleLanguage = (code: string) => {
    const set = new Set<string>(state.language);
    if (set.has(code)) set.delete(code);
    else set.add(code);
    void setState({ language: Array.from(set), page: 1 });
  };

  const followerMin = state.follower_min ?? 0;
  const followerMax = state.follower_max ?? 10_000_000;

  const clearAll = () => {
    void setState({
      niche: [],
      tags: [],
      content_style: [],
      platform: [],
      country: [],
      language: [],
      pricing_model: [],
      follower_min: null,
      follower_max: null,
      engagement_rate_min: null,
      price_min_cents: null,
      price_max_cents: null,
      open_to_gifted: null,
      page: 1,
    });
  };

  return (
    <aside
      className={cn(
        "w-full space-y-7 rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur lg:w-80 lg:shrink-0",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h2 className="font-semibold tracking-tight">Filters</h2>
        </div>
        <Button size="sm" variant="ghost" onClick={clearAll}>
          Clear all
        </Button>
      </div>

      {/* ── Niches ── */}
      <section className="space-y-2">
        <Label>Niches</Label>
        <Input
          placeholder="Search niches..."
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
        />
        <div className="max-h-96 overflow-y-auto pr-2">
          <NicheTree
            selected={selectedNiches}
            onToggle={toggleNiche}
            counts={nicheCounts}
            filterText={nicheFilter}
          />
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="space-y-2">
        <Label>Platforms</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_KINDS.map((p) => {
            const active = state.platform.includes(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  active
                    ? "border-primary bg-primary/20 text-foreground shadow-purple-glow-sm"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                <span className="mr-1">{PLATFORM_ICONS[p]}</span>
                {p.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Followers ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Followers (total)</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {followerMin.toLocaleString()} – {followerMax.toLocaleString()}
          </span>
        </div>
        <Slider
          min={0}
          max={10_000_000}
          step={1000}
          value={[followerMin, followerMax]}
          onValueChange={(vals) =>
            void setState({
              follower_min: vals[0] ?? null,
              follower_max: vals[1] ?? null,
              page: 1,
            })
          }
        />
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Nano (1K-10K)", min: 1000, max: 10_000 },
            { label: "Micro (10K-100K)", min: 10_000, max: 100_000 },
            { label: "Mid (100K-1M)", min: 100_000, max: 1_000_000 },
            { label: "Macro (1M+)", min: 1_000_000, max: 10_000_000 },
          ].map((p) => (
            <Button
              key={p.label}
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() =>
                void setState({ follower_min: p.min, follower_max: p.max, page: 1 })
              }
            >
              {p.label}
            </Button>
          ))}
        </div>
      </section>

      {/* ── Engagement ── */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Min engagement rate</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            {state.engagement_rate_min !== null
              ? `≥ ${(state.engagement_rate_min * 100).toFixed(1)}%`
              : "off"}
          </span>
        </div>
        <Slider
          min={0}
          max={0.1}
          step={0.005}
          value={[state.engagement_rate_min ?? 0]}
          onValueChange={(vals) =>
            void setState({ engagement_rate_min: vals[0] === 0 ? null : vals[0], page: 1 })
          }
        />
        <p className="text-xs text-muted-foreground">Industry average: 2.5–3.5%.</p>
      </section>

      {/* ── Country ── */}
      <section className="space-y-2">
        <Label className="flex items-center gap-2">
          <Globe className="h-3 w-3" /> Country
        </Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_COUNTRIES.map(([code, label]) => {
            const active = state.country.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggleCountry(code)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  active
                    ? "border-primary bg-primary/20 text-foreground shadow-purple-glow-sm"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Language ── */}
      <section className="space-y-2">
        <Label className="flex items-center gap-2">
          <LanguagesIcon className="h-3 w-3" /> Language
        </Label>
        <div className="flex flex-wrap gap-2">
          {COMMON_LANGUAGES.map(([code, label]) => {
            const active = state.language.includes(code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggleLanguage(code)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  active
                    ? "border-primary bg-primary/20 text-foreground shadow-purple-glow-sm"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Content style ── */}
      <section className="space-y-2">
        <Label>Content style</Label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_STYLES.map((s) => {
            const active = state.content_style.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleContentStyle(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  active
                    ? "border-primary bg-primary/20 text-foreground shadow-purple-glow-sm"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                {CONTENT_STYLE_LABELS[s]}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Price ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Price per integration</Label>
          <span className="text-xs tabular-nums text-muted-foreground">
            ${((state.price_min_cents ?? 0) / 100).toLocaleString()} – $
            {((state.price_max_cents ?? 5_000_00) / 100).toLocaleString()}
          </span>
        </div>
        <Slider
          min={0}
          max={5_000_00}
          step={5000}
          value={[state.price_min_cents ?? 0, state.price_max_cents ?? 5_000_00]}
          onValueChange={(vals) =>
            void setState({
              price_min_cents: vals[0] ?? null,
              price_max_cents: vals[1] ?? null,
              page: 1,
            })
          }
        />
      </section>

      {/* ── Pricing models ── */}
      <section className="space-y-2">
        <Label>Pricing models</Label>
        <div className="flex flex-wrap gap-2">
          {PRICING_MODELS.map((m) => {
            const active = state.pricing_model.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => togglePricingModel(m)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-all",
                  active
                    ? "border-primary bg-primary/20 text-foreground shadow-purple-glow-sm"
                    : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
                )}
              >
                {PRICING_LABELS[m]}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Toggles ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="afd">Available for deals</Label>
          <Switch
            id="afd"
            checked={state.available_for_deals}
            onCheckedChange={(v) => void setState({ available_for_deals: v, page: 1 })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="otg">Open to gifted</Label>
          <Switch
            id="otg"
            checked={!!state.open_to_gifted}
            onCheckedChange={(v) =>
              void setState({ open_to_gifted: v ? true : null, page: 1 })
            }
          />
        </div>
      </section>
    </aside>
  );
}
