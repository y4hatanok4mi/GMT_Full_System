'use client';

import { FC, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CircleUserRound, Settings, LogOut } from 'lucide-react';
import { handleSignOut } from '@/app/actions/authActions';
import axios from 'axios';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

const TopBar: FC = () => {
  const [userData, setUserData] = useState<{ name: string; email: string; avatar: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/get-current-user');
        setUserData({
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.image || '/user.png',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!userData) return null;

  const isActive = (link: string) => pathname === link;

  return (
    <header className="p-5 flex justify-between items-center bg-white">
      {/* Logo Section */}
      <div className="text-2xl font-bold">
        <Link href="/student">
          <span className="block sm:hidden">
            <span className="text-green-500">G</span>
            <span className="text-black">T</span>
          </span>
          <span className="hidden sm:block hover:text-green-500">
            Geome<span className="text-green-500 hover:text-black">Triks</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex gap-4">
        <div className={`relative ${isActive('/student') ? 'bg-green-500' : ''} py-2 px-3 rounded-md`}>
          <Link href="/student" className={`${isActive('/student') ? 'text-white' : 'hover:text-green-500'}`}>Home</Link>
        </div>
        <div className={`relative ${isActive('/student/modules') ? 'bg-green-500' : ''} py-2 px-3 rounded-md`}>
          <Link href="/student/modules" className={`${isActive('/student/modules') ? 'text-white' : 'hover:text-green-500'}`}>Modules</Link>
        </div>
        <div className={`relative ${isActive('/student/tools') ? 'bg-green-500' : ''} py-2 px-3 rounded-md`}>
          <Link href="/student/tools" className={`${isActive('/student/tools') ? 'text-white' : 'hover:text-green-500'}`}>Tools</Link>
        </div>
        <div className={`relative ${isActive('/student/leaderboard') ? 'bg-green-500' : ''} py-2 px-3 rounded-md`}>
          <Link href="/student/leaderboard" className={`${isActive('/student/leaderboard') ? 'text-white' : 'hover:text-green-500'}`}>Leaderboard</Link>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <div className="flex md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <Image src={userData.avatar || '/user.png'} alt="Profile" width={50} height={50} className="object-cover" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="absolute top-full right-0 mt-2 w-48 p-4 bg-white shadow-lg rounded-md">
            <div className="text-gray-800 font-bold">Profile</div>
            <div className="my-1 border-t border-gray-200" />
            <ul className="mt-2">
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <CircleUserRound className="text-gray-700" />
                <Link href="/student/profile" className="text-gray-700 text-sm hover:text-gray-500">View Profile</Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer mt-3">
                <Settings className="text-gray-700" />
                <Link href="/student/settings" className="text-gray-700 text-sm hover:text-gray-500">Settings</Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer mt-3">
                <form action={handleSignOut}>
                  <button type="submit" className="flex flex-row gap-2 text-sm text-gray-700">
                    <LogOut /> Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      {/* Profile Image Section for Larger Screens */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300">
              <Image src={userData.avatar || '/user.png'} alt="Profile" width={40} height={40} className="object-cover" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="absolute top-full right-0 mt-2 w-48 p-4 bg-white shadow-lg rounded-md">
            <div className="text-gray-800 font-bold">Profile</div>
            <div className="my-1 border-t border-gray-200" />
            <ul className="mt-2">
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                <CircleUserRound className="text-gray-700" />
                <Link href="/student/profile" className="text-gray-700 text-sm hover:text-gray-500">View Profile</Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer mt-3">
                <Settings className="text-gray-700" />
                <Link href="/student/settings" className="text-gray-700 text-sm hover:text-gray-500">Settings</Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer mt-3">
                <form action={handleSignOut}>
                  <button type="submit" className="flex flex-row gap-2 text-sm text-gray-700">
                    <LogOut /> Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default TopBar;
