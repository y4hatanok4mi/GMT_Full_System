"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(2, {
    message: "Module name is required and must be at least 2 characters",
  }),
});

const CreateModuleForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/modules", values);
      console.log("API Response:", response.data);
  
      const moduleId = response.data.data?.id;
  
      if (!moduleId) {
        throw new Error("Module ID not returned by the API");
      }
  
      router.push(`/admin/data-management/modules/${moduleId}`);
      toast.success("New Module Created!");
    } catch (err) {
      console.error("Failed to create new module!", err);
      toast.error("Something went wrong!");
    }
  };
  


  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">
        Provide information for the module.
      </h1>
      <p className="text-sm mt-3">
        It is ok if you cannot think of a good name.
        You can change them later.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-10"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Module Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Polygons"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  

          <Button type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateModuleForm;