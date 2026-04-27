"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import {
  CONTENT_STYLES,
  PRICING_MODELS,
  type ContentStyle,
  type CreatorPublic,
  type PricingModel,
} from "@creatordeck/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  initial?: CreatorPublic | null;
  onSaved?: () => void;
}

export function ProfileForm({ initial, onSaved }: Props) {
  const { getToken } = useAuth();
  const [displayName, setDisplayName] = React.useState(initial?.display_name ?? "");
  const [handle, setHandle] = React.useState(initial?.handle ?? "");
  const [bio, setBio] = React.useState(initial?.bio ?? "");
  const [country, setCountry] = React.useState(initial?.country_code ?? "");
  const [languages, setLanguages] = React.useState((initial?.languages ?? []).join(","));
  const [primaryStyle, setPrimaryStyle] = React.useState<ContentStyle | "">(
    initial?.primary_content_style ?? "",
  );
  const [styles, setStyles] = React.useState<ContentStyle[]>(initial?.content_style_tags ?? []);
  const [basePrice, setBasePrice] = React.useState<string>(
    initial?.base_price_cents !== null && initial?.base_price_cents !== undefined
      ? String(initial.base_price_cents / 100)
      : "",
  );
  const [pricingModels, setPricingModels] = React.useState<PricingModel[]>(
    initial?.pricing_models ?? [],
  );
  const [available, setAvailable] = React.useState<boolean>(initial?.available_for_deals ?? true);
  const [openToGifted, setOpenToGifted] = React.useState<boolean>(
    initial?.open_to_gifted ?? false,
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  function toggleStyle(s: ContentStyle) {
    setStyles((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));
  }
  function togglePricing(m: PricingModel) {
    setPricingModels((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await getToken();
      const body = {
        display_name: displayName,
        handle,
        bio: bio || undefined,
        country_code: country || undefined,
        languages: languages
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length === 2),
        primary_content_style: primaryStyle || undefined,
        content_style_tags: styles,
        base_price_cents: basePrice ? Math.round(parseFloat(basePrice) * 100) : undefined,
        pricing_models: pricingModels,
        available_for_deals: available,
        open_to_gifted: openToGifted,
        rate_card: initial?.rate_card ?? {},
        niche_ids: [],
        tags: [],
      };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(j.message ?? "Failed to save profile");
      }
      setSuccess(true);
      onSaved?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Creator profile</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="display_name">Display name *</Label>
          <Input
            id="display_name"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="handle">Handle *</Label>
          <Input
            id="handle"
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            pattern="^[a-zA-Z0-9_.\-]+$"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country (ISO 3166-1 alpha-2)</Label>
          <Input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value.toUpperCase())}
            maxLength={2}
            placeholder="US"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="languages">Languages (comma-separated ISO codes)</Label>
          <Input
            id="languages"
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            placeholder="en,es"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Primary content style</Label>
          <Select value={primaryStyle} onValueChange={(v) => setPrimaryStyle(v as ContentStyle)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose..." />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_STYLES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="base_price">Base price (USD, "starting at")</Label>
          <Input
            id="base_price"
            type="number"
            min={0}
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="2500"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Other content styles</Label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_STYLES.map((s) => {
            const active = styles.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleStyle(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent",
                )}
              >
                {s.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Pricing models</Label>
        <div className="flex flex-wrap gap-2">
          {PRICING_MODELS.map((m) => {
            const active = pricingModels.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() => togglePricing(m)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent",
                )}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="available">Available for deals</Label>
          <Switch id="available" checked={available} onCheckedChange={setAvailable} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="gifted">Open to gifted</Label>
          <Switch id="gifted" checked={openToGifted} onCheckedChange={setOpenToGifted} />
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-600">Saved.</p> : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
