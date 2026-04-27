"use client";

import type { SearchResult } from "@creatordeck/types";
import { CreatorCard, CreatorCardSkeleton } from "./CreatorCard";

interface Props {
  results: SearchResult[];
  loading?: boolean;
  onPitch?: (creator: SearchResult) => void;
}

export function CreatorGrid({ results, loading, onPitch }: Props) {
  if (loading && results.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="rounded-2xl border bg-card p-10 text-center">
        <div className="mb-3 text-3xl">🔭</div>
        <p className="font-medium">No creators match your filters.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try widening your follower range or removing a niche to see more.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {results.map((c) => (
        <CreatorCard key={c.id} creator={c} onPitch={onPitch} />
      ))}
    </div>
  );
}
