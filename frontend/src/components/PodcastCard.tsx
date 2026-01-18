"use client";

import Image from "next/image";
import { Podcast } from "@/types/podcast";

interface PodcastCardProps {
  podcast: Podcast;
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <div className="group flex-shrink-0 w-[200px] cursor-pointer">
      <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-background-card">
        <Image
          src={podcast.artworkUrl600 || podcast.artworkUrl100}
          alt={podcast.collectionName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="space-y-1">
        <h3 className="text-text-primary font-medium text-sm line-clamp-1 group-hover:text-accent-purple transition-colors">
          {podcast.collectionName}
        </h3>
        <p className="text-text-secondary text-xs line-clamp-1">
          {podcast.artistName}
        </p>
      </div>
    </div>
  );
}
