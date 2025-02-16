
import { auth } from "@/auth";
import SectionsDetails from "@/components/sections/section-details";
import prisma from "@/lib/prisma";
import { Resource } from "@prisma/client";
import { redirect } from "next/navigation";

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { courseId, sectionId } = params;
  const user = await auth();
  const userId = user?.user.id;

  if (!userId) {
    return redirect("/auth/signin");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
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
    return redirect("/");
  }

  const section = await prisma.section.findUnique({
    where: {
      id: sectionId,
      courseId,
      isPublished: true,
    },
  });

  if (!section) {
    return redirect(`/courses/${courseId}/overview`);
  }

  const enroll = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: userId,
        courseId,
      },
    },
  });

  let resources: Resource[] = [];

  if (enroll) {
    resources = await prisma.resource.findMany({
      where: {
        sectionId,
      },
    });
  }

  const progress = await prisma.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: userId,
        sectionId,
      },
    },
  });

  return (
    <SectionsDetails
      course={course}
      section={section}
      enroll={enroll}
      imageUrl={section.imageUrl}
      videoUrl={section.videoUrl}
      imageDescription={section.imageDescription}
      resources={resources}
      progress={progress}
    />
  );
};

export default SectionDetailsPage;