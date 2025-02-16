import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
    req: Request,
    { params } : { params: { chapterId: string }}
) {
    try {
        const user = await auth();
        const { chapterId } = params;
        const values = await req.json();

        if(!user?.user.id) {
            return new NextResponse("Unautorized", { status: 401 });
        }

        const chapter = await prisma.chapter.update({
            where: {
                id: chapterId,
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(chapter); 
    } catch (error) {
        console.log("CHAPTER_ID", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

/* export const PUT = async (req: NextRequest, { params }: { params: { moduleId: string; lessonId: string; chapterId: string } }) => {
  try {
    const { moduleId, lessonId, chapterId } = params;
    const { isCompleted } = await req.json();

    const updatedChapter = await prisma.chapter.update({
      where: { id: chapterId },
      data: { isCompleted }
    });

    return NextResponse.json({ message: "Chapter updated successfully", updatedChapter }, { status: 200 });
  } catch (err) {
    console.error("[CHAPTERS_PUT]", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}; */

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { chapterId: string } }
) => {
  try {
    const user = await auth();
    const userId = user?.user.id;
    const { chapterId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapterData = await prisma.chapter.findUnique({
      where: { id: chapterId, },
    });

    if (!chapterData) {
      return new NextResponse("Chapter not found!", { status: 404 });
    }

    await prisma.chapter.delete({
      where: { id: chapterId, },
    });

    return new NextResponse("Chapter Deleted!", { status: 200 });
  } catch (err) {
    console.error(["chapterId_DELETE", err]);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
