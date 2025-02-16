import { Course, Section } from "@prisma/client";
import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

interface SectionMenuProps {
  course: Course & { sections: Section[] };
}

const SectionMenu = ({ course }: SectionMenuProps) => {
  console.log("Course data passed to SectionMenu:", course);

  return (
    <div className="z-60 md:hidden">
      <Sheet>
        <SheetTitle></SheetTitle>
        <SheetTrigger className="text-md text-white bg-green-500 py-2 px-4 rounded-lg">
          Sections
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <Link
            href={`/student/courses/${course.classId}/${course.id}/overview`}
            className={`p-3 rounded-lg hover:bg-[#FFF8EB] mt-4`}
          >
            Overview
          </Link>
          {course.sections.map((section) => {
            console.log("Rendering section:", section);
            return (
              <Link
                key={section.id}
                href={`/student/courses/${course.classId}/${course.id}/sections/${section.id}`}
                className="p-3 rounded-lg hover:bg-[#194a26] mt-4"
              >
                {section.title}
              </Link>
            );
          })}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SectionMenu;