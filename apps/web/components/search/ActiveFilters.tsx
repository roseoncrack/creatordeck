"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchFilters } from "@/lib/filters";

export function ActiveFilters() {
  const [state, setState] = useSearchFilters();

  const chips: { label: string; clear: () => void }[] = [];

  if (state.q) {
    chips.push({ label: `"${state.q}"`, clear: () => void setState({ q: "", page: 1 }) });
  }
  for (const slug of state.niche) {
    chips.push({
      label: slug.replace(/_/g, " "),
      clear: () =>
        void setState({ niche: state.niche.filter((s) => s !== slug), page: 1 }),
    });
  }
  for (const p of state.platform) {
    chips.push({
      label: p,
      clear: () =>
        void setState({ platform: state.platform.filter((x) => x !== p), page: 1 }),
    });
  }
  for (const c of state.country) {
    chips.push({
      label: c,
      clear: () =>
        void setState({ country: state.country.filter((x) => x !== c), page: 1 }),
    });
  }
  for (const l of state.language) {
    chips.push({
      label: l,
      clear: () =>
        void setState({ language: state.language.filter((x) => x !== l), page: 1 }),
    });
  }
  if (state.follower_min !== null || state.follower_max !== null) {
    chips.push({
      label: `${(state.follower_min ?? 0).toLocaleString()}–${(
        state.follower_max ?? 10_000_000
      ).toLocaleString()} followers`,
      clear: () =>
        void setState({ follower_min: null, follower_max: null, page: 1 }),
    });
  }
  if (state.engagement_rate_min !== null) {
    chips.push({
      label: `ER ≥ ${(state.engagement_rate_min * 100).toFixed(1)}%`,
      clear: () => void setState({ engagement_rate_min: null, page: 1 }),
    });
  }
  if (state.price_min_cents !== null || state.price_max_cents !== null) {
    chips.push({
      label: `$${((state.price_min_cents ?? 0) / 100).toLocaleString()}–$${(
        (state.price_max_cents ?? 500_000) / 100
      ).toLocaleString()}`,
      clear: () =>
        void setState({ price_min_cents: null, price_max_cents: null, page: 1 }),
    });
  }

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip, i) => (
        <Badge
          key={i}
          variant="secondary"
          className="gap-1 px-2 py-1 text-xs hover:bg-secondary/80"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.clear}
            className="ml-1 rounded-full hover:bg-background/40"
            aria-label={`Remove ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      {chips.length >= 2 ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            void setState({
              q: "",
              niche: [],
              platform: [],
              country: [],
              language: [],
              content_style: [],
              tags: [],
              pricing_model: [],
              follower_min: null,
              follower_max: null,
              engagement_rate_min: null,
              price_min_cents: null,
              price_max_cents: null,
              page: 1,
            })
          }
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
