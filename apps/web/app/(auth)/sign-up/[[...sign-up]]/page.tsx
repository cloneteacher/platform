"use client";

import { StudentAuthForm } from "@/components/auth/student-auth-form";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Regístrate como estudiante para comenzar
          </p>
        </div>

        <StudentAuthForm mode="sign-up" />

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <a href="/sign-in" className="text-primary hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
}

