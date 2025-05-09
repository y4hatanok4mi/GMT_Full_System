"use client";

import React from "react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt?: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ src, alt = "Image", onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90%] max-h-[90%] rounded-md overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black font-bold rounded-full p-2 shadow-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ImageModal;