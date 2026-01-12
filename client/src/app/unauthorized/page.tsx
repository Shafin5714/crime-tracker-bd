import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldOff, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldOff className="size-10 text-destructive" />
        </div>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">403</h1>
        <h2 className="mb-4 text-xl font-semibold">Access Denied</h2>
        <p className="mb-8 text-muted-foreground">
          You don&apos;t have permission to access this page. Please log in with an
          account that has the required permissions, or contact an administrator
          if you believe this is an error.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 size-4" />
              Log In
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 size-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
