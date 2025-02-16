import { auth } from '@/auth';
import { LessonsForm } from '@/components/modules/student-lesson-form';
import { Separator } from '@/components/ui/separator';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import React from 'react'

const ModuleOverviewPage = async ({ params }: { params: { moduleId: string } }) => {

    const user = await auth();
    const userId = user?.user.id;

    if (!userId) {
        return redirect("/auth/signin");
    }

    const moduleId = params.moduleId;

    const moduleData = await prisma.module.findUnique({
        where: {
            id: moduleId,
        },
        include: {
            lesson: true,
        }
    })

    if (!moduleData) {
        notFound();
    }

    return (
        <div className='flex justify-center p-4'>
            <div className='w-1/3'>
                <Separator />
                <LessonsForm
                initialData={moduleData}
                moduleId={moduleId}
                />
            </div>
        </div>
    )
}

export default ModuleOverviewPage;