"use client";

/**
 * SearchPage — top-level client orchestrator.
 *
 * - Owns filter state via `useSearchFilters` (URL-synced through nuqs).
 * - Owns the result fetch with debounced refetch on filter changes.
 * - Renders FilterSidebar + active filters strip + grid + pagination.
 *
 * Initial data comes from the server component for fast first paint.
 */
import * as React from "react";
import { Search } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import type { SearchResponse, SearchResult } from "@creatordeck/types";
import { useSearchFilters, stateToFilters } from "@/lib/filters";
import { searchCreators } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./FilterSidebar";
import { ActiveFilters } from "./ActiveFilters";
import { CreatorGrid } from "./CreatorGrid";
import { SortSelect } from "./SortSelect";
import { PitchComposer } from "./PitchComposer";

interface Props {
  initialData?: SearchResponse | null;
}

export function SearchPage({ initialData }: Props) {
  const { getToken } = useAuth();
  const [state, setState] = useSearchFilters();
  const [data, setData] = React.useState<SearchResponse | null>(initialData ?? null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pitchTarget, setPitchTarget] = React.useState<SearchResult | null>(null);
  const [pitchOpen, setPitchOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(state.q);

  // Refetch when filters change (skipping the very first render if we have initialData).
  const initialRef = React.useRef(initialData != null);
  React.useEffect(() => {
    if (initialRef.current) {
      initialRef.current = false;
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const token = await getToken();
        const filters = stateToFilters(state);
        const res = await searchCreators(filters, {
          token: token ?? undefined,
          signal: controller.signal,
        });
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled && (err as Error)?.name !== "AbortError") {
          setError("Search failed. Try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [state, getToken]);

  // Debounced free-text search.
  React.useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== state.q) {
        void setState({ q: searchInput, page: 1 });
      }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Niche facet counts → keyed by slug, for sidebar tree counts.
  const nicheCounts = React.useMemo<Record<string, number>>(() => {
    const out: Record<string, number> = {};
    for (const f of data?.facets.niches ?? []) out[f.slug] = f.count;
    return out;
  }, [data?.facets.niches]);

  const onPitch = (creator: SearchResult) => {
    setPitchTarget(creator);
    setPitchOpen(true);
  };

  const totalResults = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.total_pages ?? 1;

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <FilterSidebar nicheCounts={nicheCounts} />

      <main className="flex-1 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search creators by handle, name, or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
          <SortSelect />
        </div>

        <ActiveFilters />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading
              ? "Searching..."
              : `${totalResults.toLocaleString()} creator${totalResults === 1 ? "" : "s"}${
                  state.sort !== "relevance" ? ` · sorted by ${state.sort.replace(/_/g, " ")}` : ""
                }`}
          </p>
        </div>

        {error ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
            <Button
              size="sm"
              variant="outline"
              className="ml-3"
              onClick={() => void setState({ ...state })}
            >
              Retry
            </Button>
          </div>
        ) : null}

        <CreatorGrid results={data?.data ?? []} loading={loading} onPitch={onPitch} />

        {totalPages > 1 ? (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={state.page <= 1}
              onClick={() => void setState({ page: Math.max(1, state.page - 1) })}
            >
              ← Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {state.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={state.page >= totalPages}
              onClick={() => void setState({ page: state.page + 1 })}
            >
              Next →
            </Button>
          </div>
        ) : null}
      </main>

      <PitchComposer
        creator={pitchTarget}
        open={pitchOpen}
        onOpenChange={setPitchOpen}
      />
    </div>
  );
}
