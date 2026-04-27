import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/15 text-primary-foreground/95 backdrop-blur",
        secondary:
          "border-primary/20 bg-primary/10 text-foreground/90 backdrop-blur",
        outline:
          "border-primary/30 bg-transparent text-foreground/80",
        success:
          "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
