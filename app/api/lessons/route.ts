import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const user = await auth();
    const instructorId = user?.user.id;

    if (!instructorId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title, categoryId, subCategoryId, quarterId, classId } = await req.json();
    console.log(title);
    console.log(categoryId);
    console.log(subCategoryId);
    console.log(quarterId);
    console.log(classId);

    // Validate required fields
    if (!title || !categoryId || !subCategoryId || !quarterId) {
      return new NextResponse("Missing required fields!", { status: 400 });
    }

    // Validate category
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return new NextResponse("Category does not exist", { status: 400 });
    }

    // Validate subcategory
    const subCategory = await prisma.subCategory.findUnique({
      where: { id: subCategoryId },
    });
    if (!subCategory) {
      return new NextResponse("Subcategory does not exist", { status: 400 });
    }

    // Validate quarter
    const quarter = await prisma.quarter.findUnique({
      where: { id: quarterId },
    });
    if (!quarter) {
      return new NextResponse("Quarter does not exist!", { status: 400 });
    }

    // Validate class
    let associatedClassId = classId;

    if (!classId) {
      // Optionally fetch the most recently created class for this instructor
      const latestClass = await prisma.class.findFirst({
        where: { instructorId: Number(instructorId) },
        orderBy: { createdAt: "desc" },
      });

      if (!latestClass) {
        return new NextResponse("No class found for the instructor. Please provide a classId.", { status: 400 });
      }

      associatedClassId = latestClass.id;
    }

    // Create the course
    const newCourse = await prisma.course.create({
      data: {
        title,
        categoryId,
        subCategoryId,
        quarterId,
        classId: associatedClassId,
        instructorId,
      },
    });

    return NextResponse.json(
      { message: "Course created successfully!", course: newCourse },
      { status: 201 }
    );
  } catch (err) {
    console.log("[courses_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};