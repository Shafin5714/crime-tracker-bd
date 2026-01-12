import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">404</h1>
        <h2 className="mb-4 text-xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might
          have been moved, deleted, or never existed.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 size-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 size-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
