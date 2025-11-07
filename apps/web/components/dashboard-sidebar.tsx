"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  UserCog,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface DashboardSidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  isOpen,
  isCollapsed,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, isLoading } = useCurrentUser();

  // Navigation based on role
  const getNavigation = () => {
    if (!user) return [];

    const baseNav = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ];

    if (user.role === "admin") {
      return [
        ...baseNav,
        {
          name: "Profesores",
          href: "/dashboard/admin/teachers",
          icon: UserCog,
        },
      ];
    }

    if (user.role === "teacher") {
      return [
        ...baseNav,
        {
          name: "Asignaturas",
          href: "/dashboard/teacher/subjects",
          icon: BookOpen,
        },
        {
          name: "Alumnos",
          href: "/dashboard/teacher/students",
          icon: Users,
        },
      ];
    }

    if (user.role === "student") {
      return [
        ...baseNav,
        {
          name: "Mis Asignaturas",
          href: "/dashboard/student/subjects",
          icon: GraduationCap,
        },
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          "w-64" // Always full width on mobile
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b border-sidebar-border px-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="CloneTeacher Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-sidebar-foreground truncate">
                    CloneTeacher
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      !isCollapsed && "mr-3"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="border-t border-sidebar-border p-4">
              <div className="text-xs text-muted-foreground">
                <p>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
