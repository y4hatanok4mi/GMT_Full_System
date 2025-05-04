"use client";

import Footer from "@/components/layout/footer";
import TopBar from "@/components/layout/topbar";
import { usePathname } from "next/navigation";

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isLessonPage = pathname?.includes(`/student/modules/${pathname.split('/')[3]}/lessons/${pathname.split('/')[5]}`);

  return (
    <div className="flex flex-col min-h-screen">
      {/* TopBar only on non-lesson pages */}
      {!isLessonPage && <TopBar />}

      <main className="w-full">
        {children}
      </main>

      {/* Footer only on non-lesson pages */}
      {!isLessonPage && <Footer />}
    </div>
  );
}
