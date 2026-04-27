import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { ApiClientError, getCreator } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cn,
  countryFlag,
  engagementClass,
  formatEngagement,
  formatFollowers,
  formatPrice,
} from "@/lib/utils";

interface Props {
  params: { handle: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  try {
    const { data } = await getCreator(params.handle);
    return {
      title: `${data.display_name} (@${data.handle})`,
      description: data.bio ?? `${data.display_name} on CreatorDeck`,
    };
  } catch {
    return { title: "Creator" };
  }
}

export default async function CreatorProfilePage({ params }: Props) {
  let data;
  try {
    const res = await getCreator(params.handle);
    data = res.data;
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="container max-w-4xl space-y-6 py-8">
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div
          className="h-40 w-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary"
          style={data.banner_url ? { backgroundImage: `url(${data.banner_url})`, backgroundSize: "cover" } : undefined}
        />
        <div className="-mt-12 space-y-3 px-6 pb-6">
          <div className="flex items-end gap-4">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted">
              {data.avatar_url ? (
                <img src={data.avatar_url} alt={data.display_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                  {data.display_name?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>
            <div className="pb-2">
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                {data.display_name}
                {data.country_code ? <span>{countryFlag(data.country_code)}</span> : null}
                {data.identity_verified ? (
                  <Badge variant="success" className="gap-0.5">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                ) : null}
              </h1>
              <p className="text-sm text-muted-foreground">@{data.handle}</p>
            </div>
          </div>

          {data.bio ? <p className="text-sm leading-relaxed">{data.bio}</p> : null}

          {data.niches?.length ? (
            <div className="flex flex-wrap gap-1">
              {data.niches.map((n) => (
                <Badge key={n.id} variant="secondary">
                  {n.is_primary ? "★ " : ""}
                  {n.label}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Followers" value={formatFollowers(data.total_followers)} />
        <Stat
          label="Engagement"
          value={formatEngagement(data.avg_engagement_rate)}
          valueClass={engagementClass(data.avg_engagement_rate)}
        />
        <Stat label="Starting at" value={formatPrice(data.base_price_cents)} />
      </div>

      {data.platforms?.length ? (
        <div className="rounded-2xl border bg-card p-4">
          <h2 className="mb-3 font-semibold">Platforms</h2>
          <ul className="space-y-2 text-sm">
            {data.platforms.map((p) => (
              <li key={p.platform} className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {p.platform} · {p.handle}
                  </a>
                  {p.verified ? <span className="ml-2 text-emerald-600">✓ Verified</span> : null}
                </div>
                <div className="flex gap-4 tabular-nums text-muted-foreground">
                  <span>{formatFollowers(p.followers)} followers</span>
                  <span>{formatFollowers(p.avg_views_30d)} avg views</span>
                  <span className={cn(engagementClass(p.engagement_rate))}>
                    {formatEngagement(p.engagement_rate)} ER
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {Object.keys(data.rate_card ?? {}).length ? (
        <div className="rounded-2xl border bg-card p-4">
          <h2 className="mb-3 font-semibold">Rate card</h2>
          <ul className="space-y-1 text-sm">
            {Object.entries(data.rate_card).map(([k, v]) => (
              <li key={k} className="flex justify-between">
                <span className="text-muted-foreground">{k.replace(/_/g, " ")}</span>
                <span className="font-mono">{formatPrice(v)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button asChild>
          <Link href={`/search`}>← Back to search</Link>
        </Button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-2xl font-bold", valueClass)}>{value}</div>
    </div>
  );
}
