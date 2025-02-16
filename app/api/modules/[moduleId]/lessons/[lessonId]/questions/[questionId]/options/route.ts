import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params: {  questionId: string } } 
) {
    try {
        const user = await auth();
        const userId = user?.user.id;
        const { text } = await req.json();

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const optionData = await prisma.option.create({
            data: {
                text,
                questionId: params.questionId,
            }
        });

        return NextResponse.json(optionData)
    } catch (error) {
        console.log("[OPTIONS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

