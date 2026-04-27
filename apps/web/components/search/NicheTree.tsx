"use client";

/**
 * Recursive niche tree with checkbox + indeterminate states.
 *
 * Props pass selected slug IDs (slugs, since the client-side tree from
 * `@creatordeck/taxonomy` uses slugs; the server resolves them via lookup
 * — for now we keep it slug-keyed for static rendering, and the parent
 * page maps slug → niche_id at fetch time using a server lookup).
 *
 * For the in-page taxonomy filter we operate in slug space; SearchPage
 * resolves to UUIDs via the API's facet response.
 */
import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NICHE_TREE } from "@creatordeck/taxonomy";
import type { NicheNode } from "@creatordeck/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface NicheTreeProps {
  selected: Set<string>;
  onToggle: (slug: string, allChildSlugs: string[]) => void;
  /** Optional facet counts keyed by slug. */
  counts?: Record<string, number>;
  /** Filter by free-text against label/slug/aliases. */
  filterText?: string;
}

function collectSlugs(node: NicheNode, out: string[] = []): string[] {
  out.push(node.slug);
  for (const c of node.children ?? []) collectSlugs(c, out);
  return out;
}

function nodeMatches(node: NicheNode, filter: string): boolean {
  const f = filter.trim().toLowerCase();
  if (!f) return true;
  if (node.slug.toLowerCase().includes(f)) return true;
  if (node.label.toLowerCase().includes(f)) return true;
  if (node.aliases?.some((a) => a.toLowerCase().includes(f))) return true;
  return (node.children ?? []).some((c) => nodeMatches(c, filter));
}

interface RowProps {
  node: NicheNode;
  level: number;
  selected: Set<string>;
  onToggle: (slug: string, allChildSlugs: string[]) => void;
  counts?: Record<string, number>;
  filterText?: string;
}

function NicheRow({ node, level, selected, onToggle, counts, filterText }: RowProps) {
  const childSlugs = React.useMemo(() => collectSlugs(node), [node]);
  const visible = filterText ? nodeMatches(node, filterText) : true;
  const [open, setOpen] = React.useState<boolean>(level === 1 ? !!filterText : false);

  React.useEffect(() => {
    if (filterText) setOpen(true);
  }, [filterText]);

  const totalSelected = childSlugs.filter((s) => selected.has(s)).length;
  const state: boolean | "indeterminate" =
    totalSelected === 0 ? false : totalSelected === childSlugs.length ? true : "indeterminate";

  if (!visible) return null;

  const count = counts?.[node.slug];

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-primary/10",
          level === 1 && "font-medium",
        )}
        style={{ paddingLeft: `${level * 12}px` }}
      >
        {node.children?.length ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-4 w-4 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        ) : (
          <span className="inline-block h-4 w-4" />
        )}

        <Checkbox
          id={`niche-${node.slug}`}
          checked={state}
          onCheckedChange={() => onToggle(node.slug, childSlugs)}
        />

        <label
          htmlFor={`niche-${node.slug}`}
          className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
        >
          {node.icon ? <span className="text-base">{node.icon}</span> : null}
          <span className="truncate">{node.label}</span>
        </label>

        {count !== undefined ? (
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">{count}</span>
        ) : null}
      </div>

      {open && node.children?.length ? (
        <div>
          {node.children.map((child) => (
            <NicheRow
              key={child.slug}
              node={child}
              level={level + 1}
              selected={selected}
              onToggle={onToggle}
              counts={counts}
              filterText={filterText}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function NicheTree({ selected, onToggle, counts, filterText }: NicheTreeProps) {
  return (
    <div className="space-y-0.5">
      {NICHE_TREE.map((root) => (
        <NicheRow
          key={root.slug}
          node={root}
          level={1}
          selected={selected}
          onToggle={onToggle}
          counts={counts}
          filterText={filterText}
        />
      ))}
    </div>
  );
}
