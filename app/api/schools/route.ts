import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const schools = await prisma.school.findMany({
            select: { name: true }, // Fetch only the school names
        });

        return NextResponse.json(schools.map((s) => s.name));
    } catch (error) {
        console.error("Error fetching schools:", error);
        return NextResponse.json({ error: "Failed to fetch schools" }, { status: 500 });
    }
}