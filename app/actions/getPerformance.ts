import prisma from "@/lib/prisma";
import { Course, Enrollment } from "@prisma/client";

type EnrolledWithCourse = Enrollment & { course: Course };

const groupByCourse = (enrollments: EnrolledWithCourse[]) => {
  const grouped: { [courseTitle: string]: { count: number } } =
    {};

  enrollments.forEach((enrollment) => {
    const courseTitle = enrollment.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = {  count: 0 };
    }
    grouped[courseTitle].count += 1;
  });

  return grouped;
};

export const getPerformance = async (id: string) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { course: { instructorId: id } },
      include: { course: true },
    });

    const groupedEnrolled = groupByCourse(enrollments); 
    
    const data = Object.entries(groupedEnrolled).map(
      ([courseTitle, { count }]) => ({
        name: courseTitle,
        count,
      })
    );

    const totalEnrolled = enrollments.length

    return {
      data,
      totalEnrolled,
    };
  } catch (err) {
    console.log("[getPerformance]", err);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};