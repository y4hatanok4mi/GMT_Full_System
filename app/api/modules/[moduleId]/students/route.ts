import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fetch students grouped by school for a specific module
export async function GET(req: Request, { params }: { params: { moduleId: string } }) {
  try {
    const moduleId = params.moduleId;

    // Fetch the students who have joined the module, along with their school information
    const students = await prisma.joined.findMany({
      where: { moduleId: moduleId },
      include: {
        student: {
          select: {
            school: true,  // Assuming 'school' is a field in the 'User' model
          },
        },
      },
    });

    // Group students by school
    const groupedBySchool = students.reduce((acc: { [key: string]: number }, joined) => {
      const school = joined.student.school;
      acc[school] = (acc[school] || 0) + 1;
      return acc;
    }, {});

    // Convert the grouped data to an array format
    const result = Object.keys(groupedBySchool).map((school) => ({
      school,
      studentCount: groupedBySchool[school],
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch student data grouped by school" },
      { status: 500 }
    );
  }
}
