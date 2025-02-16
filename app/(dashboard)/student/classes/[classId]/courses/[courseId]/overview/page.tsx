import SectionMenu from "@/components/layout/section-menu";
import ReadText from "@/components/read-text";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Gem } from "lucide-react";

const CourseOverview = async ({ params }: { params: { courseId: string, classId: string } }) => {
  if (!params.courseId) {
    return redirect(`/student/classes/${params.classId}/courses`);
  }

  const session = await auth();

  if (!session) {
    return redirect("/auth/signin");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect(`/student/classes/${params.classId}/courses`);
  }

  const instructor = await prisma.user.findUnique({
    where: {
      id: Number(course.instructorId),
    },
  });

  
  let quarter;

  if (course.quarterId) {
    quarter = await prisma.quarter.findUnique({
      where: {
        id: course.quarterId,
      },
    });
  }

  let week;

  if (course.weekId) {
    week = await prisma.week.findUnique({
      where: {
        id: course.weekId,
      },
    });
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <SectionMenu course={course} />
      </div>

      <p className="font-medium">{course.subtitle}</p>

      <div className="flex gap-2 items-center">
        <Image
          src={instructor?.image || "/user.png"}
          alt={instructor?.name || "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>{instructor?.name || "Unknown Instructor"}</p>
      </div>

          {quarter && (
            <div className="flex gap-2">
              <Gem size={20} />
              <p>{quarter.name}</p>
            </div>
          )}
          
        {week && (
            <div className="flex gap-2">
              <Gem size={20} />
              <p>{week.name}</p>
            </div>
          )}

      <div className="flex flex-col gap-2">
        <p className="font-bold">Description:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
