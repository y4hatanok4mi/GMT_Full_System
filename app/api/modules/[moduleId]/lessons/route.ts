import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { moduleId: string } }
) {
    try {
        const user = await auth();
        const { title, order } = await req.json(); // Get `order` from the request body

        if (!user?.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const moduleOwner = await prisma.module.findUnique({
            where: {
                id: params.moduleId,
                instructorId: user.user.id,
            },
        });

        if (!moduleOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch the last lesson to determine the order of the new lesson
        const lastLesson = await prisma.lesson.findFirst({
            where: { moduleId: params.moduleId },
            orderBy: { order: "desc" }, // Get the lesson with the highest order
        });

        // If no lessons exist, set the first lesson's order to 1
        const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

        const lesson = await prisma.lesson.create({
            data: {
                title,
                instructorId: user.user.id,
                moduleId: params.moduleId,
                order: order ?? nextOrder, // Use the provided order or the next available order
            },
        });

        return NextResponse.json(lesson);
    } catch (error) {
        console.log("[LESSONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
