"use client";

import Image from "next/image";
import { Podcast } from "@/types/podcast";

const ACCENT_COLORS = [
  "text-accent-pink",
  "text-accent-gold",
  "text-accent-purple",
  "text-accent-violet",
  "text-accent-coral",
  "text-accent-cyan",
  "text-accent-magenta",
];

interface EpisodeItemProps {
  podcast: Podcast;
  index: number;
}

export default function EpisodeItem({ podcast, index }: EpisodeItemProps) {
  const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-card transition-colors cursor-pointer group">
      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-background-card">
        <Image
          src={podcast.artworkUrl100}
          alt={podcast.collectionName}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-text-primary text-sm font-medium line-clamp-1 group-hover:text-accent-purple transition-colors">
          {podcast.collectionName}
        </h4>
        <p className={`text-xs line-clamp-1 ${accentColor}`}>
          {podcast.artistName}
        </p>
      </div>
      <button className="p-1 text-text-muted hover:text-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
    </div>
  );
}
