import prisma from "@/lib/prisma"
import { Course } from "@prisma/client"

const getCoursesByCategory = async (categoryId: string | null): Promise<Course[]> => {
  const whereClause: any = {
    ...(categoryId ? { categoryId, isPublished: true } : { isPublished: true }),
  }
  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      category: true,
      subCategory: true,
      quarter: true,
      week: true,
      sections: {
        where: {
          isPublished: true,
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return courses
}

export default getCoursesByCategory