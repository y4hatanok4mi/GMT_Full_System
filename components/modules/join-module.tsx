"use client";

import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { JoinClassSchema } from "@/lib/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function JoinClassDialog() {
  const [classCode, setClassCode] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof JoinClassSchema>>({
    resolver: zodResolver(JoinClassSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleJoinClass = async () => {
    try {
      const response = await fetch("/api/classes/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: classCode }),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        console.log("Successfully joined the class:", result);
        setClassCode("");
        router.push(`/student/classes/${result.classId}/courses`);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-green-500 p-2 rounded-lg text-sm hover:bg-green-700">
        Join Class
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            Enter the class code to join:
          </DialogDescription>
        </DialogHeader>

        <div>

          <Input
            {...form.register("code")}
            placeholder="Class code"
            className="mb-4"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
          />

          <DialogFooter>
            <Button
              disabled={form.formState.isSubmitting || !classCode}
              onClick={handleJoinClass}
              className="w-full"
            >
              Join Class
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}