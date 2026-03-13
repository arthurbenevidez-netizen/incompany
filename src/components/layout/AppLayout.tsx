import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { User } from "@/types";

interface AppLayoutProps {
  children: React.ReactNode;
  currentUser: User;
}

export function AppLayout({ children, currentUser }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar currentUser={currentUser} />
        
        <div className="flex-1 flex flex-col">
          <AppHeader currentUser={currentUser} />
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}