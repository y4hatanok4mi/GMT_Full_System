import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: {  lessonId: string } } 
) {
    try {
        const user = await auth();
        const { title } = await req.json();

        if(!user?.user.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const lessonOwner = await prisma.lesson.findUnique({
            where: {
                id: params.lessonId,
                instructorId: user.user.id,
            }
        });

        if(!lessonOwner) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const chapter = await prisma.chapter.create({
            data: {
                title,
                lessonId: params.lessonId,
            }
        });

        return NextResponse.json(chapter)
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}