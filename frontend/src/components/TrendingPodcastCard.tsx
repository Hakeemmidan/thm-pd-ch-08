"use client";

import Image from "next/image";

interface TrendingPodcastCardProps {
  rank: number;
  title: string;
  author: string;
  imageUrl: string;
  href?: string;
}

export default function TrendingPodcastCard({ 
  rank, 
  title, 
  author, 
  imageUrl,
  href = "#" 
}: TrendingPodcastCardProps) {
  return (
    <a href={href} className="group flex-shrink-0 w-[200px] cursor-pointer">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-background-card shadow-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex items-start gap-3">
        <span className="text-text-muted font-medium text-sm mt-0.5">#{rank}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-text-primary font-medium text-sm line-clamp-1 group-hover:text-accent-purple transition-colors">
            {title}
          </h3>
          <p className="text-text-secondary text-xs line-clamp-1 mt-0.5">
            {author}
          </p>
        </div>
      </div>
    </a>
  );
}
