"use client"

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
import ReadText from "@/components/read-text"; // Assuming ReadText is a component to render rich text or markdown
import SectionMenu from "@/components/layout/section-menu";
import Image from "next/image";

const getYouTubeVideoId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

interface SectionsDetailsProps {
  course: Course & { sections: Section[] };
  section: Section;
  enroll: Enrollment | null;
  videoUrl: string | null;
  imageUrl: string | null;
  imageDescription: string | null;
  resources: Resource[] | [];
  progress: Progress | null;
}

const SectionsDetails = ({
  course,
  section,
  enroll,
  videoUrl,
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

      {imageUrl && (
        <div className="my-6">
          <Image
            src={imageUrl}
            alt={imageDescription || "Image for the section"}
            layout="responsive"
            width={16}
            height={9}
            className="w-full h-auto rounded-md shadow-md"
          />
        </div>
      )}

      {isLocked ? (
        <div className="px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
          <Lock className="h-8 w-8" />
          <p className="text-sm font-bold">
            Video for this section is locked! Please enroll to access
          </p>
        </div>
      ) : videoUrl ? (
        <div className="relative pb-[40%]">
          {/* Use a video element if the video is a custom uploaded video */}
          <video
            controls
            className="absolute top-0 left-0 w-full h-full"
            src={videoUrl}
            title="Section Video"
          />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">No video available!</p>
      )}

      {imageDescription && (
        <div className="mt-2">
          <ReadText value={imageDescription} />
        </div>
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

export default SectionsDetails;
