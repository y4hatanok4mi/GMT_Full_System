import React from 'react';
import { Button } from '../ui/button';

interface FooterProps {
    nextChapter: () => void;
    prevChapter: () => void;
    currentChapterIndex: number;
    chaptersLength: number;
}

const Footer = ({
    nextChapter,
    prevChapter,
    currentChapterIndex,
    chaptersLength,
}: FooterProps) => {
    return (
        <div className="footer p-4">
            <div className="flex justify-center w-full">
                <Button
                    onClick={nextChapter}
                    color='green'
                    disabled={currentChapterIndex === chaptersLength - 1}
                    className="px-4 py-2 w-80 text-white rounded disabled:bg-gray-400"
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default Footer;
