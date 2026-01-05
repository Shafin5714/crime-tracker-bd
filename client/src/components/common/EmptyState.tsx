"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon, SearchX } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?:
    | {
        label: string;
        onClick: () => void;
      }
    | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className,
  children,
}: EmptyStateProps) {
  // Check if action is a React element or an object with label/onClick
  const isActionObject =
    action &&
    typeof action === "object" &&
    "label" in action &&
    "onClick" in action;

  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
        <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && isActionObject && (
        <Button
          onClick={(action as { label: string; onClick: () => void }).onClick}
          className="mt-6"
        >
          {(action as { label: string; onClick: () => void }).label}
        </Button>
      )}
      {action && !isActionObject && <div className="mt-6">{action}</div>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export default EmptyState;
