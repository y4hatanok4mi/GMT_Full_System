import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import { format } from "date-fns";
import { EditProfileDialog } from "@/components/(user)/admin/edit-profile";

const AdminProfilePage = async () => {
    const user = await auth();
    const userId = user?.user.id;
    const currentUser = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
    });

    return (
        <div>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-8" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin/settings">Profile</BreadcrumbLink>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col gap-2 p-8 border w-1/2 rounded-md">
                        <h1 className="text-2xl">Profile</h1>
                        <div className="flex flex-col gap-2 text-slate-800 text-sm">
                            <p>Profile Picture</p>
                            <Image
                                width={50}
                                height={50}
                                src={currentUser?.image || "/user.png"}
                                alt="Profile Picture"
                                className="ml-2 rounded-full"
                            />
                            <p>Name: {currentUser?.name}</p>
                            <p>Email: {currentUser?.email}</p>
                            <p>School: {currentUser?.school}</p>
                            <p>ID Number: {currentUser?.id_no}</p>
                            <p>Birthday: {currentUser?.birthday ? format(currentUser.birthday, "MMMM dd, yyyy") : "N/A"}</p>
                            <Separator />
                            <p>Account Settings</p>
                            <p className="text-slate-600">
                                To edit your profile, go to
                                <EditProfileDialog
                                    user={{
                                        image: currentUser?.image || "",
                                        name: currentUser?.name || "",
                                        username: currentUser?.username || "",
                                        school: currentUser?.school || "",
                                        birthday: currentUser?.birthday
                                            ? currentUser.birthday.toISOString().split("T")[0]
                                            : "",
                                    }}
                                />
                            </p>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </div>
    );
};

export default AdminProfilePage;
