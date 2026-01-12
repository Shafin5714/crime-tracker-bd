"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCcw } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error | null;
  reset?: () => void;
  title?: string;
  description?: string;
  className?: string;
  showDetails?: boolean;
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  className,
  showDetails = process.env.NODE_ENV === "development",
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center",
        className
      )}
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertOctagon
          className="size-8 text-destructive"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-destructive">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {showDetails && error && (
        <details className="mt-4 w-full max-w-lg">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
            Error details
          </summary>
          <pre className="mt-2 overflow-auto rounded-md bg-muted p-4 text-left text-xs">
            <code>{error.message}</code>
            {error.stack && (
              <>
                {"\n\n"}
                <code className="text-muted-foreground">{error.stack}</code>
              </>
            )}
          </pre>
        </details>
      )}
      {reset && (
        <Button onClick={reset} className="mt-6" variant="outline">
          <RefreshCcw className="mr-2 size-4" />
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorFallback;
