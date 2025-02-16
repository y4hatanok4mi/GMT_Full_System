import CourseCard from "@/components/modules/module-card";
import prisma from "@/lib/prisma";

const SearchPage = async ({ searchParams }: { searchParams: { query: string }}) => {
  const queryText = searchParams.query || ''
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: queryText } },
        { category: { name: { contains: queryText } }},
        { subCategory: { name: { contains: queryText } }}
      ]
    },
    include: {
      category: true,
      subCategory: true,
      quarter: true,
      week: true,
      sections: {
        where: {
          isPublished: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="px-4 py-6 md:px-10 xl:px-16">
      <p className="text-lg md:text-2xl font-semibold mb-10">Recommended courses for {queryText}</p>
      <div className="flex gap-4 flex-wrap">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default SearchPage