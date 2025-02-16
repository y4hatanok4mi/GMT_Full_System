"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PublishButtonProps {
  disabled: boolean;
  lessonId: string;
  moduleId: string;
  isPublished: boolean;
  page: string;
}

const PublishButton = ({
  disabled,
  lessonId,
  moduleId,
  isPublished,
  page,
}: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    let url = `/api/modules/${moduleId}`;
    if (page === "Lesson") {
      url += `/lessons/${lessonId}`;
    }

    try {
      setIsLoading(true);
      const response = await fetch(isPublished ? `${url}/unpublish` : `${url}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isPublished ? "unpublish" : "publish"} ${page}`);
      }

      toast.success(`${page} ${isPublished ? "unpublished" : "published"}`);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(
        `Failed to ${isPublished ? "unpublish" : "publish"} ${page}`,
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
};

export default PublishButton;