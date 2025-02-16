"use client"

import { useState, useEffect } from "react";
import { Lesson, Module } from "@prisma/client";
import axios from "axios";
import { StudentLessonsList } from "./student-lessons-list";
import { useRouter } from "next/navigation";

interface StudentLessonFormProps {
    initialData: Module & { lesson: Lesson[] };
    moduleId: string;
};

export const LessonsForm = ({
    initialData,
    moduleId
}: StudentLessonFormProps) => {
    const [lessons, setLessons] = useState<Lesson[]>(initialData.lesson || []);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchLessons = async () => {
            if (!initialData.lesson.length) {
                try {
                    setIsLoading(true);
                    const { data } = await axios.get(`/api/modules/${moduleId}/getlessons`);
                    setLessons(data);
                    router.refresh();
                } catch (error) {
                    console.error("Failed to fetch lessons", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, [moduleId, initialData.lesson.length, router]);

    return (
        <div className="mt-6 rounded-md">
            <div className="font-medium">Module Lessons</div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div className="text-sm mt-2">
                    {!lessons.length ? "No lessons available" : null}
                    <StudentLessonsList items={lessons} moduleId={moduleId}/>
                </div>
            )}
        </div>
    );
};
