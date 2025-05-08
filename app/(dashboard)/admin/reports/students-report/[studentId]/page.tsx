import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

const getFullSchoolName = (code?: string | null): string => {
  const schools: Record<string, string> = {
    SNHS: "Sayao National High School",
    BNHS: "Balancan National High School",
    MNCHS: "Marinduque National Comprehensive High School",
    BSNHS: "Butansapa National High School",
    PBNHS: "Puting Buhangin National High School",
  };
  return code ? schools[code] || code : "N/A";
};

const formatDate = (isoDate: string | Date): string =>
  new Date(isoDate).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface StudentReportPageProps {
  params: { studentId: string };
}

const StudentReportPage = async ({ params }: StudentReportPageProps) => {
  const studentId = Number(params.studentId);

  const currentStudent = await prisma.user.findUnique({
    where: { id: studentId },
  });

  if (!currentStudent) {
    return <div className="p-4 text-red-500">Student not found.</div>;
  }

  const joinedModules = await prisma.joined.findMany({
    where: { studentId },
    include: {
      module: {
        include: {
          completedBy: { where: { userId: studentId } },
          lesson: {
            include: {
              question: true,
              exerciseResult: { where: { studentId } },
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/reports/students-report">
                  Students Report
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Student Report</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-row gap-2 p-4">
          {/* Profile */}
          <div className="flex flex-col gap-4 p-4 max-w-xs md:w-1/2">
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Profile
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative w-20 h-20">
                <Image
                  src={currentStudent.image || "/user.png"}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <p className="text-sm font-medium">{currentStudent.name}</p>
            </div>
            <div className="text-sm text-slate-800 dark:text-slate-200 mt-4 space-y-1">
              <p>
                <strong>Email:</strong> {currentStudent.email}
              </p>
              <p>
                <strong>School:</strong> {getFullSchoolName(currentStudent.school)}
              </p>
              <p>
                <strong>Student ID:</strong> {currentStudent.id_no}
              </p>
              <p>
                <strong>Birthday:</strong>{" "}
                {currentStudent.birthday
                  ? format(currentStudent.birthday, "MMMM dd, yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Modules */}
          <div className="flex flex-col gap-4 p-2 border w-full rounded-md bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm">
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Module Reports
            </h1>

            {joinedModules.length === 0 ? (
              <div className="p-4 text-center bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-md border border-yellow-300 dark:border-yellow-700">
                <p className="font-medium flex justify-center items-center">This student has not started any module yet.</p>
              </div>
            ) : (
              joinedModules.map(({ module, joinedAt }) => {
                const isCompleted = module.completedBy.length > 0;
                const completedAt = isCompleted
                  ? module.completedBy[0].completedAt
                  : null;

                return (
                  <div
                    key={module.id}
                    className={`p-4 rounded-md text-sm ${
                      isCompleted
                        ? "bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700"
                        : "bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    <h2 className="text-lg font-bold mb-1">{module.name}</h2>
                    <p>
                      Status:{" "}
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs text-white ${
                          isCompleted ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                        {isCompleted ? "Completed" : "In Progress"}
                      </span>
                    </p>
                    <p>Started: {formatDate(joinedAt)}</p>
                    {completedAt && <p>Completion Date: {formatDate(completedAt)}</p>}

                    <div className="mt-2">
                      <p className="font-semibold">Lesson Scores:</p>
                      {module.lesson.length > 0 ? (
                        module.lesson.map((lesson) => {
                          const passedResult = lesson.exerciseResult.find(
                            (res) => res.isPassed
                          );
                          const latestResult = lesson.exerciseResult[0];
                          const hasFailedAttempts =
                            lesson.exerciseResult.length > 0 && !passedResult;

                          return (
                            <div key={lesson.id} className="mt-2">
                              <p className="font-medium">{lesson.title}</p>
                              <div className="ml-4">
                                {latestResult ? (
                                  <>
                                    {latestResult.score} / {lesson.question.length} (
                                    {passedResult
                                      ? `Completed on ${formatDate(passedResult.createdAt)}`
                                      : hasFailedAttempts
                                      ? "Ongoing"
                                      : "Failed"}
                                    )
                                  </>
                                ) : (
                                  "Not started yet."
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="ml-4">No lessons in this module.</p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default StudentReportPage;
