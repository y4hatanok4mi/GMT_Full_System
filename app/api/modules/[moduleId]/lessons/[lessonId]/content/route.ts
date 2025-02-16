import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { moduleId: string; lessonId: string } }) {
    try {
        const { contentId, contentType } = await req.json();
        if (!contentId || !contentType) {
            return NextResponse.json({ error: "contentId and contentType are required" }, { status: 400 });
        }

        const lastContent = await prisma.lessonContentOrder.findFirst({
            where: { lessonId: params.lessonId },
            orderBy: { order: "desc" }
        });

        const newContentOrder = await prisma.lessonContentOrder.create({
            data: {
                lessonId: params.lessonId,
                contentId,
                contentType,
                order: lastContent ? lastContent.order + 1 : 1
            }
        });

        return NextResponse.json(newContentOrder);
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { moduleId: string; lessonId: string; contentId: string } }) {
    try {
        const { newOrder } = await req.json();
        if (newOrder === undefined) return NextResponse.json({ error: "New order is required" }, { status: 400 });

        const existingContent = await prisma.lessonContentOrder.findFirst({
            where: { lessonId: params.lessonId, contentId: params.contentId }
        });

        if (!existingContent) {
            return NextResponse.json({ error: "Content not found" }, { status: 404 });
        }

        await prisma.$transaction([
            prisma.lessonContentOrder.update({
                where: { id: existingContent.id },
                data: { order: newOrder }
            })
        ]);

        return NextResponse.json({ message: "Order updated successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Error updating order" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { moduleId: string; lessonId: string; contentId: string } }) {
    try {
        await prisma.lessonContentOrder.deleteMany({
            where: { lessonId: params.lessonId, contentId: params.contentId }
        });

        return NextResponse.json({ message: "Content removed from order" });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting content" }, { status: 500 });
    }
}
