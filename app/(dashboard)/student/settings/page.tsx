import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

const StudentSettingsPage = async () => {
  const user = await auth();
  const userId = user?.user.id;
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(userId)
    }
  });

  return (
    <div className='min-h-screen flex flex-col items-center gap-4 pt-6 pb-16 bg-slate-200 px-4 sm:px-6'>
      <div className='flex flex-col gap-4 p-6 sm:p-8 bg-slate-100 border w-full sm:w-4/5 md:w-2/3 lg:w-1/2 rounded-md'>
        <h1 className='text-xl sm:text-2xl font-semibold'>Profile</h1>
        <div className='flex flex-col gap-2 text-slate-800 text-sm'>
          <p className="font-medium">Profile Picture</p>
          <Image
            width={50}
            height={50}
            src={currentUser?.image || "/user.png"}
            alt='Profile Picture'
            className='rounded-full'
          />
          <p className="font-medium">Account Settings</p>
          <p className='text-slate-600'>
            To edit your profile, go to
            <Link href="/student/profile" className="text-blue-500 underline ml-1">
              Edit Profile
            </Link>
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-4 p-6 sm:p-8 bg-slate-100 border w-full sm:w-4/5 md:w-2/3 lg:w-1/2 rounded-md'>
        <h1 className='text-xl sm:text-2xl font-semibold'>System Settings</h1>
        <div className='flex flex-col gap-2 text-slate-800 text-sm'>
          <p className="font-medium">System Theme</p>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
