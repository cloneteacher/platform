"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useAuthNavigation } from "@/hooks/use-auth-navigation";
import { useEffect } from "react";
import { LoadingScreen } from "@/components/loading";

export default function Page() {
  const { authStatus, redirectToCorrectPage } = useAuthNavigation();

  useEffect(() => {
    // Only redirect if user is authenticated
    // Don't redirect unauthenticated users - let them see the landing page
    if (authStatus === "authenticated") {
      redirectToCorrectPage();
    }
  }, [authStatus, redirectToCorrectPage]);

  // If user is authenticated, show loading while redirecting
  if (authStatus === "authenticated") {
    return <LoadingScreen message="Redirigiendo..." />;
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-svh bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Bienvenido
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Template de monorepo con Next.js, Convex, Clerk y OpenRouter AI
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-in">
            <Button size="lg">Iniciar Sesión</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">
              Registrarse
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
