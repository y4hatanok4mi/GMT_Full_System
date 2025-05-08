"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PublishButtonProps {
  disabled: boolean;
  lessonId: string;
  moduleId: string;
  chapterId: string;
  isPublished: boolean;
  page: string;
}

const PublishButton = ({
  disabled,
  lessonId,
  moduleId,
  chapterId,
  isPublished,
  page,
}: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [published, setPublished] = useState(isPublished); // Local state

  const onClick = async () => {
    let url = `/api/modules/${moduleId}/lessons/${lessonId}`;
    if (page === "Chapter") {
      url += `/chapters/${chapterId}`;
    }

    try {
      setIsLoading(true);
      const response = await fetch(published ? `${url}/unpublish` : `${url}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${published ? "unpublish" : "publish"} ${page}`);
      }

      toast.success(`${page} ${published ? "unpublished" : "published"}`);
      setPublished(!published); // Update local state immediately
      router.refresh(); // Optional if you want to sync globally
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(`Failed to ${published ? "unpublish" : "publish"} ${page}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={disabled || isLoading}
      onClick={onClick}
      className="bg-green-500 dark:bgb-green-700 hover:bg-green-600 dark:hover:bg-green-800 text-white"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : published ? "Unpublish" : "Publish"}
    </Button>
  );
};

export default PublishButton;
