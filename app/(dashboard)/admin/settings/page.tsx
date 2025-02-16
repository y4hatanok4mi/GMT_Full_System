import {
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

const AdminSettingsPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  })

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
                  <BreadcrumbLink href="/admin/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-col items-center gap-2'>
          <div className='flex flex-col gap-2 p-8 border w-1/2 rounded-md'>
            <h1 className='text-2xl'>Profile</h1>
            <div className='flex flex-col gap-2 text-slate-800 text-sm'>
              <p>Profile Picture</p>
              <Image
                width={50}
                height={50}
                src={currentUser?.image || "/user.png"}
                alt='Profile Picture'
                className='ml-2 rounded-full'
              />
              <p>Account Settings</p>
              <p className='text-slate-600'>
                To edit your profile, go to 
                <Link href="/admin/profile" className="text-blue-500 underline ml-1">
                  Edit Profile
                </Link>
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-2 p-8 border w-1/2 rounded-md'>
            <h1 className='text-2xl'>System Settings</h1>
            <div className='flex flex-col gap-2 text-slate-800 text-sm'>
              <p>System Theme</p>
              <ModeToggle/>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  )
}

export default AdminSettingsPage;
