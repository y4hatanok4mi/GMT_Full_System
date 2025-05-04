"use client";

import { FC, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CircleUserRound, Settings, LogOut, Menu, X } from "lucide-react";
import { handleSignOut } from "@/app/actions/authActions";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AnimatePresence, motion } from "framer-motion";

const TopBar: FC = () => {
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/api/get-current-user");
        setUserData({
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.image || "/user.png",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!userData) return null;

  const isActive = (link: string) => pathname === link;

  const mobileNavVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 p-4 flex justify-between items-center shadow-md z-50 relative text-gray-800 dark:text-white">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link href="/student">
          <span className="block sm:hidden">
            <span className="text-green-500">G</span>
            <span className="text-black dark:text-white">T</span>
          </span>
          <span className="hidden sm:block hover:text-green-500">
            Geome<span className="text-green-500 hover:text-white">Triks</span>
          </span>
        </Link>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center">
        <div className="mr-4">
          {[
            { path: "/student", label: "Home" },
            { path: "/student/modules", label: "Modules" },
            { path: "/student/tools", label: "Tools" },
            { path: "/student/leaderboard", label: "Leaderboard" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              href={path}
              className={`pb-6 pt-4 px-3 rounded-t-lg transition-all duration-200 transform ${
                isActive(path)
                  ? "bg-slate-200 dark:bg-slate-800 text-green-500"
                  : "text-gray-700 dark:text-gray-300 hover:text-green-500 hover:scale-105"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Profile Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              <Image
                src={userData.avatar || "/user.png"}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="absolute top-full right-0 mt-2 w-48 p-4 bg-white dark:bg-gray-800 shadow-lg dark:shadow-black/40 rounded-md z-50">
            <div className="text-gray-800 dark:text-white font-bold">
              Profile
            </div>
            <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
            <ul className="mt-2">
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <CircleUserRound className="text-gray-700 dark:text-gray-300" />
                <Link
                  href="/student/profile"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-green-500"
                >
                  View Profile
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer mt-3">
                <Settings className="text-gray-700 dark:text-gray-300" />
                <Link
                  href="/student/settings"
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-green-500"
                >
                  Settings
                </Link>
              </li>
              <li className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer mt-3">
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="flex flex-row gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500"
                  >
                    <LogOut /> Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="text-gray-700 dark:text-gray-300"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
            />

            {/* Sliding Panel */}
            <motion.div
              variants={mobileNavVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col p-5 text-gray-800 dark:text-white"
            >
              <div className="flex justify-end mb-6">
                <button
                  onClick={() => setIsMobileNavOpen(false)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {[
                  { path: "/student", label: "Home" },
                  { path: "/student/modules", label: "Modules" },
                  { path: "/student/tools", label: "Tools" },
                  { path: "/student/leaderboard", label: "Leaderboard" },
                  { path: "/student/profile", label: "Profile" },
                  { path: "/student/settings", label: "Settings" },
                ].map(({ path, label }) => (
                  <Link
                    key={path}
                    href={path}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`py-2 px-3 rounded-md transition-all duration-200 transform ${
                      isActive(path)
                        ? "bg-green-500 text-white"
                        : "text-gray-700 dark:text-gray-300 hover:text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <form action={handleSignOut} className="mt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-500"
                  >
                    <LogOut /> Sign Out
                  </button>
                </form>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopBar;
