"use client";

import { useState, useEffect, useRef, Suspense, forwardRef, useImperativeHandle } from "react";
import { useSearchParams } from "next/navigation";
import { Podcast, Episode, SearchResponse } from "@/types/podcast";
import EpisodeMenu from "@/components/EpisodeMenu";
import LayoutMenu, { LayoutType } from "@/components/LayoutMenu";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper to format date like "Jan 16"
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Helper to format duration ms to "Xmin"
const formatDuration = (ms?: number) => {
  if (!ms) return "";
  const minutes = Math.floor(ms / 60000);
  return `${minutes}min`;
};

function PodcastImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`${className} bg-[#1c1c2e] flex items-center justify-center`}>
        <svg className="w-8 h-8 text-[#2f2f4a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

interface ScrollHandle {
  scrollLeft: () => void;
  scrollRight: () => void;
}

const HorizontalScroll = forwardRef<ScrollHandle, { children: React.ReactNode }>(({ children }, ref) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollLeft: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -600, behavior: "smooth" });
      }
    },
    scrollRight: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 600, behavior: "smooth" });
      }
    }
  }));

  return (
    <div className="relative group/scroll">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth custom-scrollbar"
      >
        {children}
      </div>
    </div>
  );
});
HorizontalScroll.displayName = "HorizontalScroll";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [episodeLayout, setEpisodeLayout] = useState<LayoutType>("grid");

  const podcastsScrollRef = useRef<ScrollHandle>(null);
  const episodesScrollRef = useRef<ScrollHandle>(null);

  useEffect(() => {
    if (query) {
      fetchData(query);
    }
  }, [query]);

  const fetchData = async (term: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/search?term=${encodeURIComponent(term)}`);
      
      if (response.ok) {
        const data: SearchResponse = await response.json();
        setPodcasts(data.podcasts || []);
        setEpisodes(data.episodes || []);
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const artistColors = ["text-[#00d4aa]", "text-[#ff6b9d]", "text-[#f5a623]", "text-[#7b5cff]"];

  const renderEpisodeCard = (episode: Episode, index: number, layout: LayoutType) => {
    const isList = layout === "list";
    const isCompact = layout === "compact";
    const isScroll = layout === "scroll";

    if (isList) {
      return (
        <div key={episode.trackId} className="flex gap-4 p-4 hover:bg-[#1c1c2e] rounded-md transition-colors group/card border-b border-white/5 last:border-0">
          {/* Artwork */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-[#1c1c2e] rounded-md overflow-hidden shadow-lg group-hover/card:shadow-xl transition-shadow">
              <PodcastImage
                src={episode.artworkUrl600 || episode.artworkUrl160 || ""}
                alt={episode.trackName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-white text-[16px] font-bold leading-tight mb-1 group-hover/card:underline decoration-1">
              {episode.trackName}
            </h3>
            <div className={`text-[13px] font-medium mb-2 ${artistColors[index % artistColors.length]}`}>
              {episode.collectionName}
            </div>
            
            <p className="text-gray-400 text-sm line-clamp-2 mb-auto leading-relaxed">
              {episode.description || episode.shortDescription || "No description available."}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-2">
              <span>{formatDate(episode.releaseDate)}</span>
              <span>{formatDuration(episode.trackTimeMillis)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <div className="mt-auto">
              <EpisodeMenu />
            </div>
          </div>
        </div>
      );
    }

    // Grid, Scroll, Compact
    return (
      <a
        key={episode.trackId}
        href={episode.episodeUrl || "#"}
        className={`bg-[#1c1c2e] hover:bg-[#25253a] rounded-md transition-colors group/card flex gap-3 relative
          ${isCompact ? "p-2 items-center" : "p-3"}
          ${isScroll ? "min-w-[300px] w-[300px]" : ""}
        `}
      >
         <div className={`relative flex-shrink-0 ${isCompact ? "w-10 h-10" : "w-16 h-16"}`}>
            <div className="absolute inset-0 bg-[#1c1c2e] rounded-md overflow-hidden shadow-lg">
              <PodcastImage
                src={episode.artworkUrl160 || episode.artworkUrl600 || ""}
                alt={episode.trackName}
                className="w-full h-full object-cover"
              />
            </div>
         </div>
         <div className="flex-1 min-w-0 flex flex-col justify-center">
            {!isCompact && (
              <div className={`text-[11px] font-bold mb-0.5 uppercase tracking-wide ${artistColors[index % artistColors.length]}`}>
                {episode.collectionName?.slice(0, 30)}
              </div>
            )}
            <h3 className={`text-white font-bold leading-tight group-hover/card:underline decoration-1 line-clamp-1
              ${isCompact ? "text-[12px] mb-0" : "text-[13px] mb-1"}
            `}>
              {episode.trackName}
            </h3>
             <div className={`flex items-center gap-2 text-[10px] font-medium text-gray-500 uppercase tracking-wide
               ${isCompact ? "mt-0" : ""}
             `}>
                <span>{formatDate(episode.releaseDate || "")}</span>
                <span>{formatDuration(episode.trackTimeMillis)}</span>
             </div>
         </div>
         <div className="self-center">
            <EpisodeMenu />
         </div>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-[#12121f] text-white font-sans flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Suspense fallback={<div className="h-16 bg-[#12121f]" />}>
          <Header />
        </Suspense>

        {/* Page Content */}
        <main className="p-6">
          {isLoading ? (
            <div className="space-y-8">
              <div>
                <div className="h-6 w-48 bg-[#1c1c2e] rounded animate-pulse mb-4" />
                <div className="flex gap-4 overflow-hidden">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-[200px]">
                      <div className="aspect-square bg-[#1c1c2e] rounded-lg animate-pulse mb-3" />
                      <div className="h-4 bg-[#1c1c2e] rounded animate-pulse w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (podcasts.length > 0 || episodes.length > 0) ? (
            <div className="space-y-10">
              {/* Top Podcasts */}
              {podcasts.length > 0 && (
                <section>
                  <div className="flex items-end justify-between mb-4">
                    <h2 className="text-white font-bold text-lg leading-tight">Top podcasts for &quot;{query}&quot;</h2>
                    {/* Header Arrows */}
                    <div className="flex gap-2">
                       <button 
                         onClick={() => podcastsScrollRef.current?.scrollLeft()}
                         className="p-1 text-gray-400 hover:text-white transition-colors"
                       >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                         </svg>
                       </button>
                       <button 
                         onClick={() => podcastsScrollRef.current?.scrollRight()}
                         className="p-1 text-gray-400 hover:text-white transition-colors"
                       >
                         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                         </svg>
                       </button>
                    </div>
                  </div>

                  {/* Updated Separator */}
                  <div className="w-full h-[1px] bg-white/10 mb-4" />

                  <HorizontalScroll ref={podcastsScrollRef}>
                    {podcasts.slice(0, 10).map((podcast, index) => (
                      <a
                        key={podcast.trackId}
                        href={`/search?q=${encodeURIComponent(podcast.collectionName)}`}
                        className="flex-shrink-0 w-[200px] group/card cursor-pointer"
                      >
                        <div className="relative aspect-square mb-3">
                          <div className="absolute inset-0 bg-[#1c1c2e] rounded-lg overflow-hidden shadow-lg shadow-black/20">
                            <PodcastImage
                              src={podcast.artworkUrl600 || podcast.artworkUrl100}
                              alt={podcast.collectionName}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl transform scale-75 group-hover/card:scale-100 transition-transform">
                              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-500 font-medium text-sm mt-0.5">#{index + 1}</span>
                          <div className="min-w-0">
                            <h3 className="text-white text-[15px] font-bold leading-tight mb-1 line-clamp-2 group-hover/card:underline decoration-2">
                              {podcast.collectionName}
                            </h3>
                            <p className={`text-[13px] font-medium truncate ${artistColors[index % artistColors.length]}`}>
                              {podcast.artistName}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </HorizontalScroll>
                </section>
              )}

              {/* Top Episodes */}
              {episodes.length > 0 && (
                <section>
                   <div className="flex items-end justify-between mb-4">
                    <h2 className="text-white font-bold text-lg leading-tight">Top episodes for &quot;{query}&quot;</h2>
                    <div className="flex items-center gap-4">
                      {/* Header Arrows (only show if scroll layout) */}
                      {episodeLayout === "scroll" && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => episodesScrollRef.current?.scrollLeft()}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => episodesScrollRef.current?.scrollRight()}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <LayoutMenu currentLayout={episodeLayout} onLayoutChange={setEpisodeLayout} />
                    </div>
                  </div>

                  {/* Updated Separator */}
                  <div className="w-full h-[1px] bg-white/10 mb-4" />

                  {episodeLayout === "scroll" ? (
                    <HorizontalScroll ref={episodesScrollRef}>
                      {episodes.slice(0, 18).map((episode, index) => renderEpisodeCard(episode, index, "scroll"))}
                    </HorizontalScroll>
                  ) : (
                    <div className={`grid gap-3
                      ${episodeLayout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : ""}
                      ${episodeLayout === "list" ? "grid-cols-1" : ""}
                      ${episodeLayout === "compact" ? "grid-cols-1" : ""}
                    `}>
                      {episodes.slice(0, 18).map((episode, index) => renderEpisodeCard(episode, index, episodeLayout))}
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : query && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No results found for &quot;{query}&quot;</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#12121f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7b5cff] to-[#ff6b9d] animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
