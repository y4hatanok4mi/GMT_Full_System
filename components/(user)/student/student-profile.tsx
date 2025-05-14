'use client';

import Image from 'next/image';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  school: string;
  id_no: string;
  birthday: Date;
  image: string | null;
}

export default function StudentProfileClient({ profile }: { profile: UserProfile }) {
  return (
    <div className="max-w-md mx-auto p-4 mt-24 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-md space-y-4 sm:flex sm:space-x-6 sm:space-y-0">
      <div className="flex-shrink-0 flex justify-center sm:justify-start">
        <Image
          src={profile.image ?? "/user.png"}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full object-cover w-24 h-24"
        />
      </div>
      <div className="space-y-2 text-center sm:text-left text-gray-800 dark:text-gray-100">
        <h1 className="text-xl font-bold">Profile</h1>
        <p><span className="font-semibold">Name:</span> {profile.name}</p>
        <p><span className="font-semibold">Email:</span> {profile.email}</p>
        <p><span className="font-semibold">School:</span> {profile.school}</p>
        <p><span className="font-semibold">ID Number:</span> {profile.id_no}</p>
        <p>
          <span className="font-semibold">Birthday:</span>{' '}
          {profile.birthday.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
