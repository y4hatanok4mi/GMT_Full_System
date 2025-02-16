"use client"

import * as React from "react"
import {
  ChartLine,
  Command,
  Home,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/(user)/teacher/teacher-nav";
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
import { NavUser } from "./teacher-user";


export function TeacherSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [currentSession, setCurrentSession] = React.useState(session);

  // Fetch the updated session on mount
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
            title: "Home",
            url: "/teacher",
            icon: Home,
          },
          {
            title: "Reports",
            url: "/teacher/reports",
            icon: ChartLine,
          },
          {
            title: "Settings",
            url: "/teacher/settings",
            icon: Settings2,
          },
        ],
      }
    
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/teacher">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
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