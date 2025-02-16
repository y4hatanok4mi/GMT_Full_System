import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";

// Define the schema for validating the request body using Zod
const createTestSchema = z.object({
  title: z.string().min(2, { message: "Title is required and must be at least 2 characters long" }),
  description: z.string().optional(),
});

export async function POST(request: NextRequest, { params }: { params: { courseId: string } }): Promise<NextResponse> {

  // Parse and validate the body
  const body = await request.json();
  const parsedData = createTestSchema.safeParse(body);

  if (!parsedData.success) {
    return NextResponse.json({ error: parsedData.error.errors }, { status: 400 });
  }

  const { title, description } = parsedData.data;

  try {
    // Authenticate the user
    const user = await auth();
    if (!user || !user.user.id) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const creatorId = Number(user.user.id);
    if (isNaN(creatorId)) {
      return NextResponse.json({ error: "Invalid creator ID" }, { status: 400 });
    }

    // Find the last test in the course to determine the new position
    const lastTest = await prisma.test.findFirst({
      where: { courseId: params.courseId },
      orderBy: { position: "desc" },
    });

    const newPosition = lastTest ? lastTest.position + 1 : 0;

    // Create the new test in the database
    const newTest = await prisma.test.create({
      data: {
        title,  // title comes from Zod validation
        description,  // description comes from Zod validation (optional)
        courseId: params.courseId,
        creatorId: creatorId,
        position: newPosition,
      },
    });

    // Return the newly created test
    return NextResponse.json(newTest, { status: 201 });

  } catch (error) {
    console.error("Failed to create test:", error);
    return NextResponse.json({ error: "Something went wrong while creating the test" }, { status: 500 });
  }
}
