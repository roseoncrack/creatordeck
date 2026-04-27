"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import type { CreatorPublic } from "@creatordeck/types";
import { ProfileForm } from "@/components/creator/ProfileForm";
import { PlatformLinker } from "@/components/creator/PlatformLinker";

export default function CreatorProfilePage() {
  const { getToken, isSignedIn } = useAuth();
  const [profile, setProfile] = React.useState<CreatorPublic | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [version, setVersion] = React.useState(0);

  React.useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/creators/me`, {
          headers: { Authorization: `Bearer ${token ?? ""}` },
        });
        const json = (await res.json()) as { data: CreatorPublic | null };
        if (!cancelled) setProfile(json.data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn, version]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your creator profile</h1>
        <p className="text-sm text-muted-foreground">
          Status: <span className="font-medium">{profile?.status ?? "draft"}</span>. Profiles
          are reviewed by an admin before going live.
        </p>
      </div>

      <ProfileForm initial={profile} onSaved={() => setVersion((v) => v + 1)} />

      {profile?.id ? <PlatformLinker onLinked={() => setVersion((v) => v + 1)} /> : null}

      {profile?.platforms?.length ? (
        <div className="rounded-2xl border bg-card p-4">
          <h3 className="mb-2 font-semibold">Linked platforms</h3>
          <ul className="space-y-2 text-sm">
            {profile.platforms.map((p) => (
              <li key={p.platform} className="flex justify-between">
                <span>
                  <span className="font-medium">{p.platform}</span> · {p.handle}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {p.followers.toLocaleString()} followers
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
