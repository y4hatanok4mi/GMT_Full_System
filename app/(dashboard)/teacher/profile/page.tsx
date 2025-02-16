import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const TeacherAccountPage = async () => {
  const session = await auth();

  const user = session?.user;
  const role = user?.role;

  if (role !== "teacher") {
    return redirect("/auth/signin");
  }

  const formattedBirthday = user?.birthday ? formatDate(user.birthday) : "N/A";

  const profileImage =
    user?.image || "/user.png";

  const capitalizeSentenceCase = (str: string | undefined) => {
    if (!str) return "N/A";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div>
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Account Page</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Display user information */}
        <main className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              <div className="flex flex-row items-center gap-3">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                  <Image
                    src={profileImage}
                    alt={`${user?.name}'s profile picture`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Name: {user?.name}</h1>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Email:</span> {user?.email || "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">School:</span> {user?.school || "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">ID Number:</span> {user?.id_no || "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Role:</span> {capitalizeSentenceCase(user?.role)}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Birthday:</span> {formattedBirthday || "N/A"}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Gender:</span> {user?.gender || "N/A"}
              </p>
            </div>
            <div className="mt-6">
            <Button /* onClick={handleEditProfile} */ className="bg-green-600 text-white hover:bg-green-700">
              Edit Profile
            </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
};

export default TeacherAccountPage;
