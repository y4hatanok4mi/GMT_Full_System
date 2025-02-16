import { auth } from "@/auth";
import { columns } from "@/components/lessons/lessons-columns";
import { DataTable } from "@/components/data-table";
import { ModeToggle } from "@/components/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { BadgeInfo, PlusCircle } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface ClassData {
  id: string;
  name: string;
  description: string | null;
  section: string | null;
  code: string | null;
  imageUrl: string | null;
  isCreated: boolean;
  createdAt: string;
  updatedAt: string;
}

export default async function ClassPage({ params }: { params: { classId: string } }) {
  
  const { classId } = params;
  console.log(params);
  console.log("Class ID from params:", classId);

  if (!classId) {
    notFound();
  }

  const classData = await prisma.class.findUnique({
    where: { id: classId },
  });

  if (!classData) {
    notFound();
  }
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return redirect("/auth/signin");
    }
  
    const courses = await prisma.course.findMany({
      where: {
        instructorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div>
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center justify-between gap-2 px-4 h-full w-full">
            <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbPage>{classData.name}</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </div>
                <div className="flex items-center gap-2 px-4">
                    <ModeToggle />
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button size="sm" className="rounded-full p-2 bg-transparent">
                            <BadgeInfo className="text-black"/>
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-4 w-30 z-10 mr-4">
                        <div>
                            <h2 className="font-semibold text-lg">{classData.name}</h2>
                            <p className="text-sm text-muted-foreground mt-2">
                            <strong>Code:</strong> {classData.code || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                            <strong>Section:</strong> {classData.section || "N/A"}
                            </p>
                        </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </header>
          <div className="flex justify-end px-4">
            <Link href={`/teacher/classes/${classData.id}/courses`}>
              <Button className="rounded-lg p-4 gap-1">
                <PlusCircle /> Create Lesson
              </Button>
            </Link>
          </div>
      </SidebarInset>
    </div>
  );
}
