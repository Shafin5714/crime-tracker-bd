import { LoginForm } from "@/components/forms/LoginForm";
import { Shield } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div>
        <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">Crime Tracker BD</span>
        </div>
        
        <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-2">
                Enter your credentials to access the secure dashboard.
            </p>
        </div>

        <LoginForm />

        <p className="px-8 text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80 hover:underline"
            >
            Register here
            </Link>
        </p>
    </div>
  );
}
