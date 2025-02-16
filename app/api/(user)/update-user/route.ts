import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = user.user.id;

    const data = await req.json();
    const { gender, bday, school, id_no } = data;

    if (!gender || !school || !id_no) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        gender,
        birthday: bday ? new Date(bday) : undefined,
        school,
        id_no,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
