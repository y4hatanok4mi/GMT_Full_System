"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface LessonDeleteProps {
  item: string;
  lessonId: string;
  moduleId: string;
  chapterId: string;
}

const LessonDelete = ({ item, lessonId, moduleId, chapterId }: LessonDeleteProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);

      const url =
        item === "lesson"
          ? `/api/modules/${moduleId}/lessons/${lessonId}`
          : `/api/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`;

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      const pushedUrl =
        item === "lesson"
          ? `/admin/data-management/modules/${moduleId}/lessons/${lessonId}`
          : `/admin/data-management/modules/${moduleId}/lessons/${lessonId}/chapters/${chapterId}`;

      router.push(pushedUrl);
      router.refresh();
      toast.success(`${item} deleted successfully`);
    } catch (err) {
      toast.error(`Something went wrong!`);
      console.log(`Failed to delete the ${item}`, err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isDeleting}>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your {item}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#FDAB04]"
            onClick={onDelete}
            disabled={isDeleting}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LessonDelete;