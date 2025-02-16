import { auth } from '@/auth';
import CertificateForm from '@/components/modules/certificate-form';
import { ModuleLessons } from '@/components/modules/module-overview';
import { Progress } from '@/components/ui/progress';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const ModuleOverviewPage = async ({ params }: { params: { moduleId: string } }) => {
    const user = await auth();
    const userId = user?.user.id;
    const userName = user?.user.name;

    if (!userName) {
        return notFound()
    }

    if (!userId) {
        return redirect("/auth/signin");
    }

    const moduleId = params.moduleId;

    const moduleData = await prisma.module.findUnique({
        where: {
            id: moduleId,
        },
        include: {
            lesson: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!moduleData) {
        return redirect("/student/modules");
    }

    const publishedLessons = moduleData.lesson;
    const publishedLessonIds = publishedLessons.map((lesson) => lesson.id);

    const completedLessons = await prisma.lessonProgress.count({
        where: {
            userId: Number(userId),
            lessonId: {
                in: publishedLessonIds,
            },
            isLocked: false,
            isCompleted: true,
        },
    });

    // Calculate progress as a percentage
    const progressPercentage = publishedLessonIds.length
        ? (completedLessons / publishedLessonIds.length) * 100
        : 0;

    return (
        <div className='flex flex-col items-center justify-center p-4 bg-slate-50'>
            <div className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2'>
                <div className="mt-2 w-full">
                    <Progress value={progressPercentage} className="h-2 w-full" />
                    <p className="text-xs mt-1">
                        {Math.round(progressPercentage)}% completed
                    </p>
                </div>
                <div className='w-full mt-4'>
                    <ModuleLessons
                        currentUserId={userId}
                        module={moduleData}
                    />
                </div>
                <div>
                    <CertificateForm userName={userName} moduleName={moduleData.name} moduleId={moduleId}/>
                </div>
            </div>
        </div>
    );
}

export default ModuleOverviewPage;
