"use client";

import { useSearchFilters } from "@/lib/filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_LABELS = {
  relevance: "Relevance",
  engagement: "Engagement",
  followers: "Followers",
  price_asc: "Price (low → high)",
  price_desc: "Price (high → low)",
  recently_active: "Recently active",
  newest: "Newest",
} as const;

export function SortSelect() {
  const [state, setState] = useSearchFilters();
  return (
    <Select
      value={state.sort}
      onValueChange={(v) => void setState({ sort: v as keyof typeof SORT_LABELS, page: 1 })}
    >
      <SelectTrigger className="h-9 w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(SORT_LABELS) as (keyof typeof SORT_LABELS)[]).map((k) => (
          <SelectItem key={k} value={k}>
            {SORT_LABELS[k]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
