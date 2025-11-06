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
import { Menu, X, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@workspace/ui/components/avatar";
import { UserProfilePanel } from "@/components/user-profile-panel";

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
      <div className="flex items-center space-x-4">
        {/* User info - Desktop */}
        {user && (
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <button
              onClick={() => setShowProfilePanel(true)}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
              aria-label="Abrir panel de perfil"
            >
              <Avatar className="h-9 w-9">
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
            </button>
          </div>
        )}

        {/* User avatar - Mobile */}
        {user && (
          <button
            onClick={() => setShowProfilePanel(true)}
            className="md:hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full"
            aria-label="Abrir panel de perfil"
          >
            <Avatar className="h-8 w-8">
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
          </button>
        )}

        {/* Logout button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLogoutModal(true)}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {isLoggingOut ? "Cerrando..." : "Cerrar Sesión"}
          </span>
        </Button>
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
