"use client"

import * as React from "react"
import {
  BookOpen,
  ChartLine,
  Command,
  FolderKanban,
  Settings2,
  Shapes,
} from "lucide-react"

import { NavMain } from "@/components/(user)/admin/admin-nav"
import { NavUser } from "@/components/(user)/sidebar-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getSession, useSession } from "next-auth/react"


export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [currentSession, setCurrentSession] = React.useState(session);

  React.useEffect(() => {
    const fetchSession = async () => {
      const updatedSession = await getSession();
      setCurrentSession(updatedSession);
    };

    fetchSession();
  }, []);

    const data = {
      user: {
        name: currentSession?.user?.name as string,
        email: currentSession?.user?.email as string,
        avatar: currentSession?.user?.image as string,
      },
        navMain: [
          {
            title: "Dashboard",
            url: "/admin",
            icon: ChartLine,
          },
          {
            title: "Data Management",
            url: "/admin/data-management/modules",
            icon: FolderKanban,
            isActive: true,
            items: [
              {
                title: "Modules",
                url: "/admin/data-management/modules",
              },
              {
                title: "Users",
                url: "/admin/data-management/users-management",
              }
            ],
          },
          {
            title: "Reports",
            url: "/admin/reports/modules-report",
            icon: BookOpen,
            isActive: true,
            items: [
              {
                title: "Modules Report",
                url: "/admin/reports/modules-report",
              },
              {
                title: "Students Report",
                url: "/admin/reports/students-report",
              },
            ],
          },
        ],
      }
    
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shapes className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">GeomeTriks</span>
                  <span className="truncate text-xs">E-Learning Platform</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
