import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-bg">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border shadow-soft">
            <div className="h-full px-6 flex items-center justify-between">
              {/* Left side - Sidebar trigger and search */}
              <div className="flex items-center gap-4">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-secondary">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SidebarTrigger>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search processes, documents, users..."
                    className="pl-10 w-96 bg-background/50 border-border/50 focus:bg-background focus:border-primary transition-all duration-200"
                  />
                </div>
              </div>

              {/* Right side - Notifications and user info */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative hover:bg-secondary">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-border">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role.replace('_', ' ').toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}