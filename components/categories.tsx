"use client"

import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
}

const Categories = ({ categories, selectedCategory }: CategoriesProps) => {
  const router = useRouter();
  const { classId } = useParams();

  const onClick = (categoryId: string | null) => {
    router.push(categoryId ? `/student/classes/${classId}/categories/${categoryId}` : `/student/classes/${classId}/courses`);
  };

  return (
    <div className="flex flex-wrap px-4 gap-5 justify-center mt-2 mb-10">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onClick(null)}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onClick(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;