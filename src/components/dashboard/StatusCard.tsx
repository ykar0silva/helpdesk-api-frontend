import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  variant: "pending" | "progress" | "completed";
}

const variantStyles = {
  pending: {
    border: "border-accent",
    iconBg: "bg-accent/10",
    iconText: "text-accent",
  },
  progress: {
    border: "border-primary",
    iconBg: "bg-primary/10",
    iconText: "text-primary",
  },
  completed: {
    border: "border-secondary",
    iconBg: "bg-secondary/10",
    iconText: "text-secondary",
  },
};

export function StatusCard({ title, count, icon, variant }: StatusCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-card rounded-xl shadow-soft border-t-4 p-6 hover:shadow-elevated transition-shadow",
        styles.border
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mt-1">{count}</h3>
        </div>
        <div
          className={cn(
            "p-3 rounded-full",
            styles.iconBg,
            styles.iconText
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
