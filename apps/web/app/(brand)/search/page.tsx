import { auth } from "@clerk/nextjs/server";
import { searchCreators, ApiClientError } from "@/lib/api-client";
import { SearchPage } from "@/components/search/SearchPage";
import type { SearchResponse } from "@creatordeck/types";

export const metadata = {
  title: "Search creators",
};

export const dynamic = "force-dynamic";

export default async function BrandSearchPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const { getToken } = auth();
  const token = (await getToken()) ?? undefined;

  // Pass through the URL query params as-is so SSR mirrors the client filter state.
  const filters: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(searchParams)) {
    if (v === undefined) continue;
    filters[k] = v;
  }

  let initialData: SearchResponse | null = null;
  try {
    initialData = await searchCreators(filters, { token, revalidate: 0 });
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 401) {
      // Not signed in / not a brand — render empty; client will retry once Clerk hydrates.
      initialData = null;
    } else {
      console.error("[search/page] initial fetch failed", err);
    }
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 backdrop-blur sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 h-48 w-96 rounded-full bg-primary/15 blur-[80px]"
        />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find <span className="text-gradient-purple">creators</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Search 1,500+ niches across YouTube, TikTok, Instagram and more.
          </p>
        </div>
      </div>

      <SearchPage initialData={initialData} />
    </div>
  );
}
