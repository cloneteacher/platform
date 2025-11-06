"use client";

import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

interface RoleSelectorProps {
  selectedRole: "student" | "teacher";
  onRoleChange: (role: "student" | "teacher") => void;
}

export function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <Tabs value={selectedRole} onValueChange={(value) => onRoleChange(value as "student" | "teacher")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="student">Estudiante</TabsTrigger>
        <TabsTrigger value="teacher">Profesor / Admin</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

