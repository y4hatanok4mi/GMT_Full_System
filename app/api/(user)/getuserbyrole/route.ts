import prisma from "@/lib/prisma";
import { userRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { URL } from 'url';

export async function GET(req: NextRequest) {
  try {
    // Extract role from the query string
    const url = new URL(req.url);
    const role = url.searchParams.get("role");

    if (!role || typeof role !== "string" || !Object.values(userRole).includes(role.trim() as userRole)) {
      return NextResponse.json({ error: "Invalid role!" }, { status: 400 });
    }

    // Fetch users based on the role
    const users = await prisma.user.findMany({
      where: {
        role: role.trim() as userRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        birthday: true,
        gender: true,
        school: true,
        id_no: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}