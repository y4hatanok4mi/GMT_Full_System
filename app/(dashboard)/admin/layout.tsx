import { AdminSidebar } from "@/components/(user)/admin/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
        <AdminSidebar />
          <main className="w-full min-h-screen">{children}</main>
    </SidebarProvider>
  );
}
