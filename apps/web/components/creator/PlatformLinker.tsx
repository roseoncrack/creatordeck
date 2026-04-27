"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { PLATFORM_KINDS, type PlatformKind } from "@creatordeck/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  onLinked?: () => void;
}

export function PlatformLinker({ onLinked }: Props) {
  const { getToken } = useAuth();
  const [platform, setPlatform] = React.useState<PlatformKind>("youtube");
  const [handle, setHandle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [followers, setFollowers] = React.useState<number>(0);
  const [avgViews, setAvgViews] = React.useState<number>(0);
  const [er, setEr] = React.useState<number>(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/creators/me/platforms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token ?? ""}`,
          },
          body: JSON.stringify({
            platform,
            handle,
            url,
            followers,
            avg_views_30d: avgViews,
            engagement_rate: er,
          }),
        },
      );
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(j.message ?? "Failed to link platform");
      }
      setSuccess(true);
      setHandle("");
      setUrl("");
      setFollowers(0);
      setAvgViews(0);
      setEr(0);
      onLinked?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-card p-4">
      <h3 className="font-semibold">Link a platform</h3>
      <p className="text-xs text-muted-foreground">
        Phase 1: stats are self-reported and reviewed by an admin before going live.
        OAuth verification ships in Phase 2.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Platform</Label>
          <Select value={platform} onValueChange={(v) => setPlatform(v as PlatformKind)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLATFORM_KINDS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="handle">Handle</Label>
          <Input
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@yourhandle"
            required
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="url">Profile URL</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com/@yourhandle"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="followers">Followers</Label>
          <Input
            id="followers"
            type="number"
            min={0}
            value={followers}
            onChange={(e) => setFollowers(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="avg_views">Avg views (30d)</Label>
          <Input
            id="avg_views"
            type="number"
            min={0}
            value={avgViews}
            onChange={(e) => setAvgViews(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="er">Engagement rate (0–1, e.g. 0.045 for 4.5%)</Label>
          <Input
            id="er"
            type="number"
            step="0.001"
            min={0}
            max={1}
            value={er}
            onChange={(e) => setEr(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? (
        <p className="text-sm text-emerald-600">Linked. It will appear on your profile.</p>
      ) : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Linking..." : "Link platform"}
      </Button>
    </form>
  );
}
