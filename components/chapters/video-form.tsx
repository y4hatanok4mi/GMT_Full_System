"use client";

import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter } from "@prisma/client";
import FileUpload from "../file-upload";
import { Input } from "@/components/ui/input";

interface ChapterVideoFormProps {
  initialData: Chapter;
  chapterId: string;
  lessonId: string;
  moduleId: string;
}

const formSchema = z.object({
  videoUrl: z.string().url().min(1, "A valid video URL is required"),
});

export const ChapterVideoForm = ({
  initialData,
  chapterId,
  lessonId,
  moduleId,
}: ChapterVideoFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [videoType, setVideoType] = useState<"upload" | "youtube">(
    initialData.videoUrl?.includes("youtube.com") || initialData.videoUrl?.includes("youtu.be") ? "youtube" : "upload"
  );
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated!");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handleYouTubeSubmit = () => {
    if (!youtubeUrl.trim()) {
      toast.error("Please enter a valid YouTube URL.");
      return;
    }
    onSubmit({ videoUrl: youtubeUrl });
  };

  return (
    <div className="border bg-slate-100 dark:bg-slate-800 dark:border-slate-700 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-slate-800 dark:text-white">
        Chapter Video (optional)
        <div className="flex gap-2">
          <Button onClick={toggleEdit} variant="ghost" className="text-slate-700 dark:text-white">
            {isEditing ? (
              <>Cancel</>
            ) : !initialData.videoUrl ? (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a video
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </>
            )}
          </Button>
          {initialData.videoUrl && !isEditing && (
            <Button
              onClick={async () => {
                try {
                  await axios.patch(`/api/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`, {
                    videoUrl: null,
                  });
                  toast.success("Video deleted!");
                  router.refresh();
                } catch {
                  toast.error("Failed to delete the video!");
                }
              }}
              variant="ghost"
              className="text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Display video */}
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 dark:bg-slate-700 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500 dark:text-slate-400" />
          </div>
        ) : initialData.videoUrl.includes("youtube.com") || initialData.videoUrl.includes("youtu.be") ? (
          <div className="relative aspect-video mt-2">
            <iframe
              className="w-full h-full rounded-md"
              src={`https://www.youtube.com/embed/${
                initialData.videoUrl.split("v=")[1]?.split("&")[0] ||
                initialData.videoUrl.split("/").pop()
              }`}
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <video
              controls
              className="object-cover rounded-md w-full h-full"
              src={initialData.videoUrl + "?raw=true"}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}

      {/* Edit Mode */}
      {isEditing && (
        <div>
          <div className="flex gap-4 mb-4">
            <Button
              variant={videoType === "upload" ? "default" : "outline"}
              onClick={() => setVideoType("upload")}
            >
              Upload Video
            </Button>
            <Button
              variant={videoType === "youtube" ? "default" : "outline"}
              onClick={() => setVideoType("youtube")}
            >
              YouTube URL
            </Button>
          </div>

          {videoType === "upload" ? (
            <FileUpload
              endpoint="chapterVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videoUrl: url });
                }
              }}
            />
          ) : (
            <div>
              <Input
                type="text"
                placeholder="Enter YouTube URL"
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button onClick={handleYouTubeSubmit} className="mt-2">
                Save YouTube Video
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-4 dark:text-slate-400">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
