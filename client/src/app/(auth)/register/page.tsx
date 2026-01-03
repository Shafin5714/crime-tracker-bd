import { RegisterForm } from "@/components/forms/RegisterForm";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <div>
        <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Shield className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight">Crime Tracker BD</span>
            </div>
            <Button variant="ghost" asChild className="text-primary hover:text-primary hover:bg-primary/10">
                 <Link href="/">Back to Home</Link>
            </Button>
        </div>
        
        <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-sm text-muted-foreground mt-2">
                Join the community to report incidents and stay safe.
            </p>
        </div>

        <RegisterForm />

        <p className="px-8 text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/80 hover:underline"
            >
            Log in
            </Link>
        </p>
        
        <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
                <Lock className="h-3 w-3" />
                Secure & Anonymous
            </div>
        </div>
    </div>
  );
}
