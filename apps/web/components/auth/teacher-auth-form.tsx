"use client";

import { SignIn } from "@clerk/nextjs";

export function TeacherAuthForm() {
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
      formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
      footerActionLink: "text-primary hover:text-primary/80",
      identityPreviewText: "text-foreground",
      identityPreviewEditButton: "text-primary",
    },
  };

  return (
    <div className="w-full flex justify-center">
      <SignIn
        appearance={appearance}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}

