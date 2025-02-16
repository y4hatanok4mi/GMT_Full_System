"use client"

import * as React from "react"
import {
  BookOpen,
  Command,
  Frame,
  Map,
  PieChart,
  Settings2,
  Shapes,
  SquareChartGantt,
} from "lucide-react"

import { NavMain } from "@/components/(user)/student/student-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getSession, useSession } from "next-auth/react";
import { NavUser } from "./student-user";


export function StudentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
            title: "Home",
            url: "/student",
            icon: Shapes,
          },
          {
            title: "Interactive Lessons",
            url: "/student/lessons",
            icon: BookOpen,
          },
          {
            title: "Settings",
            url: "/student/settings",
            icon: Settings2,
          },
        ]
      }
    
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/student">
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