import { useState } from "react";
import { 
  Home, Users, Shield, Building2, GitBranch, FileText, 
  Upload, Activity, Settings, LogOut, ChevronDown, User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth, Permission } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: Home, 
    permissions: [] as Permission[]
  },
  { 
    title: "User Management", 
    icon: Users,
    permissions: ['users.view'] as Permission[],
    children: [
      { title: "Users", url: "/users", permissions: ['users.view'] as Permission[] },
      { title: "Roles & Permissions", url: "/roles", permissions: ['roles.view'] as Permission[] }
    ]
  },
  { 
    title: "Organization", 
    icon: Building2,
    permissions: ['departments.view'] as Permission[],
    children: [
      { title: "Divisions", url: "/divisions", permissions: ['departments.view'] as Permission[] },
      { title: "Departments", url: "/departments", permissions: ['departments.view'] as Permission[] }
    ]
  },
  { 
    title: "Process Management", 
    icon: GitBranch,
    permissions: ['processes.view'] as Permission[],
    children: [
      { title: "Processes", url: "/processes", permissions: ['processes.view'] as Permission[] },
      { title: "Reference Data", url: "/reference-data", permissions: ['processes.view'] as Permission[] }
    ]
  },
  { 
    title: "File Management", 
    url: "/files", 
    icon: FileText, 
    permissions: ['files.view'] as Permission[]
  },
  { 
    title: "Workflow", 
    url: "/workflow", 
    icon: Activity, 
    permissions: ['workflows.view'] as Permission[]
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: Settings, 
    permissions: ['admin.settings'] as Permission[]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>(['User Management', 'Organization', 'Process Management']);

  const isCollapsed = state === "collapsed";
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (group: any) => {
    if (group.url) return isActive(group.url);
    return group.children?.some((child: any) => isActive(child.url));
  };

  const getNavClasses = (isActive: boolean) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-soft" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const toggleGroup = (groupTitle: string) => {
    setOpenGroups(prev => 
      prev.includes(groupTitle) 
        ? prev.filter(g => g !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const filteredItems = navigationItems.filter(item => 
    item.permissions.length === 0 || item.permissions.some(permission => hasPermission(permission))
  );

  if (!user) return null;

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-72"}>
      <SidebarContent className="animate-fade-in">
        {/* User Profile Section */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user.department}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold">
            {!isCollapsed && "NAVIGATION"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.children ? (
                    <Collapsible 
                      open={openGroups.includes(item.title)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          className={`w-full justify-between ${getNavClasses(isGroupActive(item))} transition-all duration-200`}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>
                          {!isCollapsed && (
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                              openGroups.includes(item.title) ? 'rotate-180' : ''
                            }`} />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      
                      {!isCollapsed && (
                        <CollapsibleContent className="animate-accordion-down">
                          <div className="ml-6 mt-2 space-y-1">
                            {item.children
                              .filter(child => child.permissions.length === 0 || child.permissions.some(permission => hasPermission(permission)))
                              .map((child) => (
                                <SidebarMenuButton key={child.title} asChild>
                                  <NavLink 
                                    to={child.url} 
                                    className={`${getNavClasses(isActive(child.url))} pl-3 text-sm transition-all duration-200`}
                                  >
                                    <span>{child.title}</span>
                                  </NavLink>
                                </SidebarMenuButton>
                              ))}
                          </div>
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url!} 
                        className={`${getNavClasses(isActive(item.url!))} transition-all duration-200`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}