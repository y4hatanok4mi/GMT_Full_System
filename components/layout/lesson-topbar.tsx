"use client";

import { X } from 'lucide-react';
import Link from 'next/link';

interface LessonTopbarProps {
  params: {
    moduleId: string;
    lessonId: string;
  };
  lessonName: string;
}

export const LessonTopBar = ({ params, lessonName }: LessonTopbarProps) => {
  const { moduleId } = params;

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-200 p-5 flex items-center z-50">
      <div className="flex flex-row justify-between w-full">
        <div className='w-44'></div>
        <div className='flex flex-row gap-2'>
        </div>
        <Link href={`/student/modules/${moduleId}/overview`} className='flex flex-row items-center text-sm'>
          {lessonName}<X className='h-6 w-6' />
        </Link>
      </div>
    </header>
  );
};
