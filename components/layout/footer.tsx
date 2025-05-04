'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mt-auto text-black dark:text-white text-center p-4 bg-white dark:bg-gray-900">
      <p className="text-sm">
        © 2024{' '}
        <Link href="/student" className="hover:text-gray-400 dark:hover:text-gray-300">
          Geome<span className="text-green-500">Triks</span>
        </Link>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
