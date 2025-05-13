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

export default function StudentProfileClient({ profile } : { profile: UserProfile }) {
  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>School: {profile.school}</p>
      <p>ID Number: {profile.id_no}</p>
      <p>Birthday: {profile.birthday.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })}</p>
      <Image src={profile.image ?? "/user.png" } alt="Profile" width={100} height={100} />
    </div>
  );
}
