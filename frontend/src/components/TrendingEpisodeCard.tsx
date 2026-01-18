"use client";

import Image from "next/image";

interface TrendingEpisodeCardProps {
  rank: number;
  episodeTitle: string;
  podcastTitle: string;
  imageUrl: string;
  date: string;
  duration: string;
  hasVideo?: boolean;
  href?: string;
}

export default function TrendingEpisodeCard({
  rank,
  episodeTitle,
  podcastTitle,
  imageUrl,
  date,
  duration,
  hasVideo = false,
  href = "#",
}: TrendingEpisodeCardProps) {
  return (
    <div className="group flex gap-4 p-3 rounded-lg hover:bg-background-card transition-colors cursor-pointer">
      {/* Artwork */}
      <div className="relative flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-background-card">
        <Image
          src={imageUrl}
          alt={episodeTitle}
          fill
          className="object-cover"
          sizes="96px"
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-4 h-4 text-background ml-0.5" fill="currentColor" viewBox="0 0 448 512">
              <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <a href={href} className="text-text-secondary text-xs hover:text-accent-purple transition-colors">
            {podcastTitle}
          </a>
          <h3 className="text-text-primary font-medium text-sm line-clamp-2 mt-1 group-hover:text-accent-purple transition-colors">
            {episodeTitle}
          </h3>
        </div>
        
        <div className="flex items-center gap-3 text-text-muted text-xs">
          <span className="font-medium">#{rank}</span>
          <span>{date}</span>
          <span>{duration}</span>
          {hasVideo && (
            <span className="px-2 py-0.5 bg-accent-purple/20 text-accent-purple rounded text-[10px] font-medium">
              Video
            </span>
          )}
        </div>
      </div>

      {/* More Menu */}
      <button className="flex-shrink-0 self-center p-1.5 rounded-full hover:bg-background-hover opacity-0 group-hover:opacity-100 transition-all">
        <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>
    </div>
  );
}
