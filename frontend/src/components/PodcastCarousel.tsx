"use client";

import { useRef } from "react";
import { Podcast } from "@/types/podcast";
import PodcastCard from "./PodcastCard";

interface PodcastCarouselProps {
  title: string;
  podcasts: Podcast[];
}

export default function PodcastCarousel({ title, podcasts }: PodcastCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 440;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (podcasts.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-5">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-background-card hover:bg-background-hover transition-colors text-text-secondary hover:text-text-primary"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-background-card hover:bg-background-hover transition-colors text-text-secondary hover:text-text-primary"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-5 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.trackId} podcast={podcast} />
          ))}
        </div>
      </div>
    </section>
  );
}
