import prisma from "@/lib/prisma";
import { Module }from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const TeacherClassCard = async ({ moduleData }: { moduleData: Module }) => {
  const instructor = await prisma.user.findUnique({
    where: { id: Number(moduleData.instructorId) },
  });

  return (
    <Link
      href={`/teacher/classes/${moduleData.id}/courses`}
      className="border rounded-lg cursor-pointer"
    >
      <Image
        src={moduleData.imageUrl ? moduleData.imageUrl : "/image_placeholder.webp"}
        alt={moduleData.name}
        width={500}
        height={300}
        className="rounded-t-xl w-[320px] h-[180px] object-cover"
      />
      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:text-[#FDAB04]">{moduleData.name}</h2>
        <div className="flex flex-col gap-2 justify-between text-sm font-medium">
          {instructor && (
            <div className="flex gap-2 items-center">
              <Image
                src={instructor.image ? instructor.image : "/user.png"}
                alt={instructor.name ? instructor.name : "Instructor photo"}
                width={30}
                height={30}
                className="rounded-full"
              />
              <p>{instructor.name}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TeacherClassCard;