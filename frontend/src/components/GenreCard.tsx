"use client";

import Image from "next/image";

interface GenreCardProps {
  name: string;
  images: string[];
  href?: string;
}

export default function GenreCard({ name, images, href = "#" }: GenreCardProps) {
  return (
    <a 
      href={href} 
      className="group flex-shrink-0 w-[200px] cursor-pointer bg-background-card rounded-lg p-4 hover:bg-background-hover transition-colors"
    >
      <div className="text-text-primary font-medium text-sm mb-3">{name}</div>
      <div className="relative h-20 flex items-end justify-center">
        {images.slice(0, 3).map((img, i) => (
          <div
            key={i}
            className={`absolute rounded-md overflow-hidden shadow-lg transition-transform group-hover:scale-105 ${
              i === 0 ? "w-14 h-14 left-2 bottom-0 z-10" :
              i === 1 ? "w-14 h-14 left-1/2 -translate-x-1/2 bottom-2 z-20" :
              "w-16 h-16 right-2 bottom-0 z-30"
            }`}
          >
            <Image
              src={img}
              alt={`${name} podcast`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        ))}
      </div>
    </a>
  );
}
