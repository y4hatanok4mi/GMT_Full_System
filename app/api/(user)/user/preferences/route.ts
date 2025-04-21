import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

// Fetch user preferences
export async function GET(req: NextRequest) {
  const user = await auth();
  const userId = user?.user.id
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const userPreferences = await prisma.userPreferences.findUnique({
    where: { userId: Number(userId) },
  });

  return NextResponse.json(userPreferences || {});
}

// Update user preferences
export async function PUT(req: NextRequest) {
  const user = await auth();
  const userId = user?.user.id
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { primaryStyle, secondaryStyle, tertiaryStyle } = await req.json();

  const updatedPreferences = await prisma.userPreferences.upsert({
    where: { userId: Number(userId) },
    update: { primaryStyle, secondaryStyle, tertiaryStyle },
    create: { userId: Number(userId), primaryStyle, secondaryStyle, tertiaryStyle },
  });

  return NextResponse.json(updatedPreferences);
}
