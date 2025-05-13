// app/(dashboard)/student/profile/page.tsx

import { auth } from '@/auth';
import StudentProfileClient from '@/components/(user)/student/student-profile';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function StudentProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const profile = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    select: {
      id: true,
      name: true,
      email: true,
      school: true,
      id_no: true,
      birthday: true,
      image: true,
    },
  });

  if (!profile) {
    redirect('/auth/signin');
  }

  return <StudentProfileClient profile={profile} />;
}
