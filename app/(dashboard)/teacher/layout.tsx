"use client"

import { TeacherSidebar } from "@/components/(user)/teacher/teacher-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <TeacherSidebar />
        <main className="flex-grow w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
