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
        {showSidebar && (
          <div className="hidden md:flex">
            <AppSidebar />
          </div>
        )}

        <div className="flex-1 flex flex-col w-full">
          <header className="flex flex-wrap items-center p-4 border-b border-muted w-full">
            {showSidebar && (
              <div className="md:hidden block mr-2">
                {/* Trigger visível apenas em telas pequenas */}
                <SidebarTrigger className="mr-2" />
              </div>
            )}
            <h1 className="text-lg sm:text-xl font-semibold">Meu App</h1>
          </header>

          <main className="flex-1 flex flex-col w-full overflow-auto p-2 sm:p-4">
            {/* O React-Router injeta Home ou DashBoard aqui */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
