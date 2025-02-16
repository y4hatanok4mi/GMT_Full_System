import { notFound, redirect } from "next/navigation";
import {
    SidebarInset,
    SidebarTrigger
} from '@/components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from '@radix-ui/react-separator';


import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { BookOpen, ListChecks, StickyNote, Tag } from "lucide-react";
import { LessonTitleForm } from "@/components/lessons/title-form";
import { AttachmentForm } from "@/components/lessons/attachment-form";
import { ChaptersForm } from "@/components/lessons/chapters-form";
import { QuestionsForm } from "@/components/lessons/questions-form";
import PublishButton from "@/components/publish-button";
import Delete from "@/components/delete";
import { LessonCategoryForm } from "@/components/lessons/category-form";

const LessonsPage = async ({
    params
}: {
    params: { moduleId: string; lessonId: string; exerciseId: string }
}) => {

    const { moduleId, lessonId, exerciseId } = params;

    if (!moduleId) {
        notFound();
    }

    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
        return redirect("/auth/signin");
    }

    const moduleData = await prisma.module.findUnique({
        where: {
            id: moduleId
        }
    })

    if (!moduleData) {
        notFound();
    }

    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
        include: {
            resources: {
                orderBy: {
                    createdAt: "desc"
                }
            },
            chapter: true,
            question: true
        },
    });

    if (!lesson) {
        notFound();
    }

    const categories = await prisma.category.findMany();

    const requiredFields = [
        lesson?.title,
    ];

    const requiredFieldsCount = requiredFields.length;
    const missingFields = requiredFields.filter((field) => !Boolean(field));
    const missingFieldsCount = missingFields.length;
    const isCompleted = requiredFields.every(Boolean);

    console.log("Required Fields:", requiredFields);
    console.log("Missing Fields:", missingFields);
    console.log("Missing Fields Count:", missingFieldsCount);
    console.log("Required Fields Count:", requiredFieldsCount);

    return (
        <div>
            <div>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href={`/admin/data-management/modules/${moduleId}`}>{moduleData.name}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Lessons Management</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="px-6 pb-6">
                        <div className="flex justify-between">

                            <h1 className="text-2xl font-bold">Lesson Setup</h1>
                            <div className="flex gap-5 items-start justify-end">
                                <PublishButton
                                    disabled={!isCompleted}
                                    lessonId={lesson.id}
                                    moduleId={moduleId}
                                    isPublished={lesson.isPublished}
                                    page="Lesson"
                                />
                                <Delete
                                    item="lesson"
                                    lessonId={lesson.id}
                                    moduleId={moduleId}
                                />
                            </div>
                        </div>
                        <div className="gap-6 mt-4">
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <BookOpen className="size-8" />
                                    <h2>Customize lesson</h2>
                                </div>
                                <LessonTitleForm
                                    initialData={lesson}
                                    lessonId={lesson.id}
                                    moduleId={moduleId}
                                />

                                <LessonCategoryForm
                                    initialData={lesson}
                                    lessonId={lesson.id}
                                    moduleId={moduleId}
                                    options={categories.map((category) => ({
                                        label: category.name,
                                        value: category.id,
                                    }))}
                                />
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-x-2">
                                        <ListChecks className="size-8" />
                                        <h2>Chapters & Exercise</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ChaptersForm
                                            initialData={lesson}
                                            lessonId={lesson.id}
                                            moduleId={moduleId}
                                        />
                                        <QuestionsForm
                                            initialData={lesson}
                                            lessonId={lesson.id}
                                            moduleId={moduleId}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-x-2">
                                    <StickyNote className="size-8" />
                                    <h2>Resources & Attachments (optional)</h2>
                                </div>
                                <AttachmentForm
                                    initialData={lesson}
                                    lessonId={lesson.id}
                                    moduleId={moduleId}
                                />
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </div>
    );
};

export default LessonsPage;