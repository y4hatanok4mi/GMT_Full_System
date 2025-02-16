import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { lessonId: string, attachmentId: string } }
) {
    try {
        const user = await auth();

        if(!user?.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lessonOwner = await prisma.lesson.findUnique({
            where: {
                id: params.lessonId,
                instructorId: user.user.id
            }
        });
        
        if(!lessonOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const resource = await prisma.resource.delete({
            where: {
                id: params.attachmentId,
                lessonId: params.lessonId,
            }
        })

        return NextResponse.json(resource);
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}