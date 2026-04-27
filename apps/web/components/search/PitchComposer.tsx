"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import type { SearchResult } from "@creatordeck/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendPitch, ApiClientError } from "@/lib/api-client";

interface Props {
  creator: SearchResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Deliverable {
  platform: string;
  type: string;
  quantity: number;
}

export function PitchComposer({ creator, open, onOpenChange }: Props) {
  const { getToken } = useAuth();
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [budget, setBudget] = React.useState<string>("");
  const [deliverables, setDeliverables] = React.useState<Deliverable[]>([
    { platform: "youtube", type: "integration_60s", quantity: 1 },
  ]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    if (open && creator) {
      setSubject(`Sponsorship — ${creator.display_name}`);
      setMessage("");
      setBudget("");
      setDeliverables([{ platform: "youtube", type: "integration_60s", quantity: 1 }]);
      setError(null);
      setSuccess(false);
    }
  }, [open, creator]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!creator) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await sendPitch(
        {
          creator_id: creator.id,
          subject,
          message,
          proposed_budget_cents: budget ? Math.round(parseFloat(budget) * 100) : undefined,
          proposed_deliverables: deliverables.filter((d) => d.platform && d.type),
        },
        { token: token ?? undefined },
      );
      setSuccess(true);
      setTimeout(() => onOpenChange(false), 1200);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.body.message);
      } else {
        setError("Failed to send pitch. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function updateDeliverable(i: number, patch: Partial<Deliverable>) {
    setDeliverables((arr) => arr.map((d, j) => (i === j ? { ...d, ...patch } : d)));
  }
  function addDeliverable() {
    setDeliverables((arr) => [...arr, { platform: "instagram", type: "reel", quantity: 1 }]);
  }
  function removeDeliverable(i: number) {
    setDeliverables((arr) => arr.filter((_, j) => j !== i));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent side="right" className="w-full max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send pitch — {creator?.display_name}</DialogTitle>
          <DialogDescription>
            Reach out about a sponsored collaboration. They'll get an email + in-app notification.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            ✓ Pitch sent. We'll let you know when they respond.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Sponsorship — your favorite product"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder={`Hi ${creator?.display_name?.split(" ")[0] ?? "there"},\n\nWe loved your recent content...`}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Proposed deliverables</Label>
              {deliverables.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={d.platform}
                    onChange={(e) => updateDeliverable(i, { platform: e.target.value })}
                    placeholder="platform"
                    className="flex-1"
                  />
                  <Input
                    value={d.type}
                    onChange={(e) => updateDeliverable(i, { type: e.target.value })}
                    placeholder="type"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    min={1}
                    value={d.quantity}
                    onChange={(e) =>
                      updateDeliverable(i, { quantity: parseInt(e.target.value) || 1 })
                    }
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDeliverable(i)}
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addDeliverable}>
                + Add deliverable
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="budget">Proposed budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                inputMode="decimal"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="2500"
              />
            </div>

            {error ? (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send pitch →"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
