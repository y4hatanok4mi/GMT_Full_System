import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { url } from "inspector";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: {lessonId: string} }
) {
    try {
        const user = await auth();

        const { fileUrl } = await req.json();
        
        if(!user?.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lessonOwner = await prisma.lesson.findUnique({
            where:{
                id: params.lessonId,
                instructorId: user.user.id
            }
        });

        if (!lessonOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resources = await prisma.resource.create({
            data: {
                fileUrl,
                name: fileUrl.split("/").pop(),
                lessonId: params.lessonId
            }
        });

        return NextResponse.json(resources);
    } catch (error) {
        console.log("COURSE_ID_ATTACHMENTS", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}