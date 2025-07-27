// src/components/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout() {
  const { pathname } = useLocation();
  const hideOn = ["/login", "/register"];
  const showSidebar = !hideOn.includes(pathname);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background text-foreground">
        {showSidebar && <AppSidebar />}

        <div className="flex-1 flex flex-col  ">
          <header className="flex items-center p-4 border-b border-muted w-full">
            {showSidebar && <SidebarTrigger className="mr-4" />}
            <h1 className="text-xl font-semibold">Meu App</h1>
          </header>

          <main className=" flex-1 flex flex-col w-full bg">
            {/* aqui o React-Router vai injetar Home ou DashBoard */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
