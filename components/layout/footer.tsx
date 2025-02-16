"use client"
import Link from 'next/link';

const Footer= () => {
    return (
        <footer className="mt-auto text-black text-center p-4 bg-white">
            <p className="text-sm">© 2024 <Link href="/student" className="hover:text-gray-400">
                Geome<span className='text-green-500'>Triks</span>
            </Link>. All Rights Reserved.</p>
        </footer>
    );
};

export default Footer;
