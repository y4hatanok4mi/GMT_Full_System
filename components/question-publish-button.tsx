"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface QuestionPublishButtonProps {
  disabled: boolean;
  lessonId: string;
  moduleId: string;
  questionId: string;
  isPublished: boolean;
  page: string;
}

const QuestionPublishButton = ({
  disabled,
  lessonId,
  moduleId,
  questionId,
  isPublished,
  page,
}: QuestionPublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    let url = `/api/modules/${moduleId}/lessons/${lessonId}`;
    if (page === "Question") {
      url += `/questions/${questionId}`;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        isPublished ? `${url}/unpublish` : `${url}/publish`
      );

      if (response.status !== 200) {
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

export default QuestionPublishButton;
