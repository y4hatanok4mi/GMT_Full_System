import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {

    const user = await auth();
    const userId = user?.user.id;
    
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const userDetails = await prisma.user.findUnique({
      where: { 
        id: Number(userId) 
      }
    });

    if (!userDetails) {
      return NextResponse.json({ error: "User not found in the database" }, { status: 404 });
    }

    return NextResponse.json(userDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "An error occurred while fetching user data" }, { status: 500 });
  }
}
