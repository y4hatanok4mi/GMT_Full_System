import Image from "next/image";
import Link from "next/link";

const AreaClassCard = async () => {
  return (
    <div className="flex justify-center p-4">
      <Link
        href={`/student/tools/area_start`}
        className="border rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <Image
          src="/2.png"
          alt="angle"
          width={500}
          height={300}
          className="rounded-t-xl w-[320px] h-[180px] object-cover"
        />
        <div className="px-4 py-3 flex flex-col gap-2">
          <h2 className="text-lg font-bold hover:text-[#31803a]">Area</h2>
        </div>
      </Link>
    </div>
  );
};

export default AreaClassCard;