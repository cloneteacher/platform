"use client";

import { SignIn, SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@workspace/backend/_generated/api";

interface StudentAuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function StudentAuthForm({ mode }: StudentAuthFormProps) {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (mode === "sign-up" && isLoaded && user) {
      // Set role to student in Clerk metadata
      fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "student" }),
      }).catch(console.error);

      // Sync user to Convex immediately
      syncUser()
        .then(() => {
          // Redirect after sync completes
          router.push("/dashboard");
        })
        .catch((error) => {
          console.error("Error syncing user to Convex:", error);
        });
    }
  }, [user, isLoaded, mode, syncUser, router]);

  const appearance = {
    elements: {
      rootBox: "w-full",
      card: "shadow-none border-0 w-full",
      headerTitle: "text-2xl font-semibold text-foreground",
      headerSubtitle: "text-muted-foreground",
      socialButtonsBlockButton: "border-border hover:bg-accent",
      socialButtonsBlockButtonText: "text-foreground",
      dividerLine: "bg-border",
      dividerText: "text-muted-foreground",
      formFieldLabel: "text-foreground font-medium",
      formFieldInput: "border-border bg-background text-foreground",
      formButtonPrimary:
        "bg-primary text-primary-foreground hover:bg-primary/90",
      footerActionLink: "text-primary hover:text-primary/80",
      identityPreviewText: "text-foreground",
      identityPreviewEditButton: "text-primary",
    },
  };

  return (
    <div className="w-full">
      {mode === "sign-in" ? (
        <SignIn
          appearance={appearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/dashboard"
        />
      ) : (
        <SignUp
          appearance={appearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      )}
    </div>
  );
}
