"use client";

import { useState, useEffect, useRef, Suspense, forwardRef, useImperativeHandle } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Podcast, Episode, SearchResponse } from "@/types/podcast";
import EpisodeMenu from "@/components/EpisodeMenu";
import LayoutMenu, { LayoutType } from "@/components/LayoutMenu";
import HeaderMenu from "@/components/HeaderMenu";

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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 600;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/scroll">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {/* Navigation arrows (visible on hover) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 opacity-0 group-hover/scroll:opacity-100 transition-opacity">
        <button
          onClick={() => scroll("left")}
          className="pointer-events-auto p-2 rounded-full bg-black/80 text-white hover:bg-black transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          className="pointer-events-auto p-2 rounded-full bg-black/80 text-white hover:bg-black transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
});
HorizontalScroll.displayName = "HorizontalScroll";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [episodeLayout, setEpisodeLayout] = useState<LayoutType>("grid");

  const podcastsScrollRef = useRef<ScrollHandle>(null);
  const episodesScrollRef = useRef<ScrollHandle>(null);

  useEffect(() => {
    setSearchTerm(query);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
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
      {/* Left Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-[#0e0e18] flex flex-col h-screen sticky top-0 border-r border-white/5 z-20">
        {/* Logo */}
        <div className="p-5">
          <a href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7b5cff] to-[#ff6b9d] flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">Podbay</span>
          </a>
        </div>

        {/* Main Nav */}
        <nav className="px-3 space-y-0.5">
          <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-[#00d4aa] bg-white/[0.04]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-[15px] font-medium">Home</span>
          </a>
          <a href="/discover" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[15px] font-medium">Discover</span>
          </a>
        </nav>

        {/* Your Stuff Section */}
        <div className="mt-8 px-5 mb-2">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">YOUR STUFF</h3>
        </div>
        <nav className="px-3 space-y-0.5">
          <a href="/queue" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="text-[15px] font-medium">My Queue</span>
          </a>
          <a href="/podcasts" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <span className="text-[15px] font-medium">My Podcasts</span>
          </a>
          <a href="/recents" className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[15px] font-medium">Recents</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#12121f]/95 backdrop-blur-sm px-6 h-16 flex items-center border-b border-white/5">
          <div className="flex items-center gap-4 flex-1">
            {/* Nav Arrows */}
            <div className="flex gap-1 text-gray-400">
              <button className="p-2 hover:text-white transition-colors" onClick={() => router.back()}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 hover:text-white transition-colors" onClick={() => router.forward()}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search through over 70 million podcasts and episodes..."
                  className="w-full h-10 px-4 pl-10 bg-[#1c1c2e] text-gray-200 text-[15px] placeholder-gray-500 rounded-[4px] border border-transparent focus:border-[#7b5cff]/50 focus:bg-[#25253a] focus:outline-none transition-all"
                  autoFocus
                />
                <svg 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#7b5cff] transition-colors"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-[#1c1c2e] hover:bg-[#25253a] rounded-[4px] border border-white/5 transition-colors">
                Log in
              </button>
              <button className="px-4 py-1.5 text-sm font-medium text-white bg-[#32324a] hover:bg-[#3d3d5c] rounded-[4px] border border-white/5 transition-colors">
                Sign up
              </button>
              <div className="ml-1">
                <HeaderMenu />
              </div>
            </div>
          </div>
        </header>

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
                  <div className="w-full h-[1px] bg-white/10 mb-4 relative">
                    <div className="absolute left-0 top-0 h-[1px] w-12 bg-[#7b5cff]" />
                  </div>

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
                  <div className="w-full h-[1px] bg-white/10 mb-4 relative">
                    <div className="absolute left-0 top-0 h-[1px] w-12 bg-[#00d4aa]" />
                  </div>

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
