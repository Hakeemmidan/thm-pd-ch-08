"use client";

import { Podcast } from "@/types/podcast";
import EpisodeItem from "./EpisodeItem";

interface EpisodeGridProps {
  title: string;
  podcasts: Podcast[];
}

export default function EpisodeGrid({ title, podcasts }: EpisodeGridProps) {
  if (podcasts.length === 0) return null;

  const columns = 3;
  const itemsPerColumn = Math.ceil(podcasts.length / columns);
  
  const columnData: Podcast[][] = [];
  for (let i = 0; i < columns; i++) {
    columnData.push(podcasts.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
  }

  return (
    <section className="py-6 px-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <button className="p-2 rounded-full bg-background-card hover:bg-background-hover transition-colors text-text-secondary hover:text-text-primary">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columnData.map((column, colIndex) => (
          <div key={colIndex} className="space-y-1">
            {column.map((podcast, itemIndex) => (
              <EpisodeItem
                key={podcast.trackId}
                podcast={podcast}
                index={colIndex * itemsPerColumn + itemIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
