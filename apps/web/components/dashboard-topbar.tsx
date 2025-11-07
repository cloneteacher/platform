"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Menu,
  X,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Settings,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { UserProfilePanel } from "@/components/user-profile-panel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface DashboardTopbarProps {
  onMenuClick: () => void;
  onCollapseClick: () => void;
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
}

export function DashboardTopbar({
  onMenuClick,
  onCollapseClick,
  isSidebarOpen,
  isSidebarCollapsed,
}: DashboardTopbarProps) {
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setIsLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Desktop collapse button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCollapseClick}
          className="hidden lg:flex"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 rounded-full border border-border/60 bg-background px-3 py-1 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Abrir menú de cuenta"
              >
                <div className="hidden md:flex flex-col items-end leading-tight">
                  <span className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9">
                    {clerkUser?.imageUrl && (
                      <AvatarImage
                        src={clerkUser.imageUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onSelect={() => setShowProfilePanel(true)}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Ajustes
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setShowLogoutModal(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Logout confirmation modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cerrar sesión?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cerrar sesión? Tendrás que iniciar
              sesión nuevamente para acceder a tu dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              disabled={isLoggingOut}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User profile panel */}
      <UserProfilePanel
        open={showProfilePanel}
        onOpenChange={setShowProfilePanel}
      />
    </header>
  );
}
