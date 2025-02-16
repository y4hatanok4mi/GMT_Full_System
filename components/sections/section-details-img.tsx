"use client";

import {
  Course,
  Progress,
  Enrollment,
  Resource,
  Section,
} from "@prisma/client";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { File, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProgressButton from "./progress-button";
import ReadText from "@/components/read-text";
import SectionMenu from "@/components/layout/section-menu";
import Image from "next/image";


interface SectionsDetailsProps {
  course: Course & { sections: Section[] };
  section: Section;
  enroll: Enrollment | null;
  imageUrl: string | null;
  imageDescription: string | null;
  resources: Resource[] | [];
  progress: Progress | null;
}

const SectionDetailsImg = ({
  course,
  section,
  enroll,
  imageUrl,
  imageDescription,
  resources,
  progress,
}: SectionsDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLocked = !enroll && !section.isEnrolled;

  const enrollCourse = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${course.id}/checkout`);
      window.location.assign(response.data.url);
    } catch (err) {
      console.log("Failed to enroll course", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="px-6 py-4 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-2xl font-bold max-md:mb-4">{section.title}</h1>

        <div className="flex gap-4">
          <SectionMenu course={course} />
          {!enroll ? (
            <Button onClick={enrollCourse}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>Enroll</p>
              )}
            </Button>
          ) : (
            <ProgressButton
              courseId={course.id}
              sectionId={section.id}
              isCompleted={!!progress?.isCompleted}
            />
          )}
        </div>
      </div>

      <ReadText value={section.description!} />

      {/* Image Section */}
      {imageUrl && (
        <div className="my-6">
          <Image
            src={imageUrl}
            alt={imageDescription || "Image for the section"}
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      )}
          {imageDescription && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {imageDescription}
            </p>
          )}

      {/* Resources Section */}
      <div>
        <h2 className="text-xl font-bold mb-5">Resources</h2>
        {resources.map((resource) => (
          <Link
            key={resource.id}
            href={resource.fileUrl}
            target="_blank"
            className="flex items-center bg-[#FFF8EB] rounded-lg text-sm font-medium p-3"
          >
            <File className="h-4 w-4 mr-4" />
            {resource.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionDetailsImg;