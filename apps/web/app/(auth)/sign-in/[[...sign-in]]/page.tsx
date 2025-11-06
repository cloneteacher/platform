"use client";

import { useState } from "react";
import { RoleSelector } from "@/components/auth/role-selector";
import { StudentAuthForm } from "@/components/auth/student-auth-form";
import { TeacherAuthForm } from "@/components/auth/teacher-auth-form";

export default function SignInPage() {
  const [role, setRole] = useState<"student" | "teacher">("student");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accede a tu cuenta para continuar
          </p>
        </div>

        <RoleSelector selectedRole={role} onRoleChange={setRole} />

        <div className="mt-6">
          {role === "student" ? (
            <StudentAuthForm mode="sign-in" />
          ) : (
            <TeacherAuthForm />
          )}
        </div>

        {role === "student" && (
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <a href="/sign-up" className="text-primary hover:underline">
              Regístrate aquí
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

