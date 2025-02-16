import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the user's points
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Return the user's points
    console.log(existingUser.points)
    return NextResponse.json({ points: existingUser.points });
  } catch (error) {
    console.log("[GET_POINTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { points } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the user's current points
    const existingUser = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Increment the user's points
    const updatedUser = await prisma.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        points: {
          increment: points || 0,
        },
      },
    });

    // Return the updated points
    console.log(updatedUser.points);
    return NextResponse.json({ updatedPoints: updatedUser.points });
  } catch (error) {
    console.log("[POINTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}