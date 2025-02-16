import { auth } from "@/auth";
import CourseSideBar from "@/components/layout/course-sidebar";
import Topbar from "@/components/layout/topbar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const CourseDetailsLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string, classId: string };
}) => {
  const user = await auth();
  const userId = user?.user.id;


  if (!userId) {
    return redirect("/auth/signin");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect(`/student/classes/${params.classId}/courses`);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Topbar */}
      <div className="flex flex-row items-center gap-2 p-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className="flex-1">{children}</div>
        
        {/* Sidebar on the Right */}
        <CourseSideBar course={course} studentId={userId} />
      </div>
    </div>
  );
};

export default CourseDetailsLayout;
