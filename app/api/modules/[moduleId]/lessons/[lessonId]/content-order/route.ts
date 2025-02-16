import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = {
    params: { lessonId: string };
};

export async function GET(req: NextRequest, { params }: Params) {
    const { lessonId } = params;

    const contentOrder = await prisma.lessonContentOrder.findMany({
        where: { lessonId },
        orderBy: { order: "asc" },
    });

    return NextResponse.json(contentOrder);
}

export async function POST(req: NextRequest, { params }: Params) {
    const { lessonId } = params;
    const { contentId, contentType, order } = await req.json();

    const newContentOrder = await prisma.lessonContentOrder.create({
        data: {
            lessonId,
            contentId,
            contentType,
            order,
        },
    });

    return NextResponse.json(newContentOrder);
}
