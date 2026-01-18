"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Podcast, SearchResponse } from "@/types/podcast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function PodcastImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  if (hasError || !imgSrc) {
    return (
      <div className={`${className} bg-background-hover flex items-center justify-center`}>
        <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  
  const [searchTerm, setSearchTerm] = useState(query);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearchTerm(query);
    if (query) {
      fetchPodcasts(query);
    }
  }, [query]);

  const fetchPodcasts = async (term: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/search?term=${encodeURIComponent(term)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch podcasts: ${response.status}`);
      }
      const data: SearchResponse = await response.json();
      setPodcasts(data.results);
    } catch {
      setError("Failed to search. Please try again.");
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-white/5">
        <div className="max-w-[1800px] mx-auto px-5 h-14 flex items-center gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-accent-purple rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-white hidden sm:block">Podbay</span>
          </a>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for podcasts..."
                className="w-full h-9 pl-10 pr-4 bg-background-card text-white text-sm placeholder-text-muted rounded-md border border-white/10 focus:border-accent-purple/50 focus:outline-none transition-colors"
              />
            </div>
          </form>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-4">
            <a href="/charts" className="text-text-secondary hover:text-white text-sm transition-colors">Charts</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14">
        {/* Loading State */}
        {isLoading && (
          <div className="py-6 px-5">
            <div className="mb-4">
              <div className="h-5 bg-background-card rounded animate-pulse w-48 mb-2" />
              <div className="h-4 bg-background-card rounded animate-pulse w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg">
                  <div className="w-20 h-20 bg-background-card rounded-md animate-pulse flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-background-card rounded animate-pulse mb-2 w-1/3" />
                    <div className="h-4 bg-background-card rounded animate-pulse mb-2" />
                    <div className="h-3 bg-background-card rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-accent-pink text-lg mb-4">{error}</p>
              <button
                onClick={() => query && fetchPodcasts(query)}
                className="px-6 py-2 bg-accent-purple hover:bg-accent-purple/80 rounded-full transition-colors text-white text-sm"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && podcasts.length === 0 && query && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-text-secondary text-lg">
                No results found for &quot;{query}&quot;
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && podcasts.length > 0 && (
          <>
            {/* Podcasts Carousel */}
            <section className="py-6">
              <div className="px-5 mb-4">
                <h2 className="text-white font-semibold text-base">Top podcasts for &quot;{query}&quot;</h2>
                <p className="text-text-muted text-sm">{podcasts.length} results found</p>
              </div>

              <div className="relative">
                <div 
                  className="flex gap-5 overflow-x-auto px-5 pb-4"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {podcasts.slice(0, 10).map((podcast, index) => (
                    <div 
                      key={podcast.trackId} 
                      className="flex-shrink-0 w-[180px] group cursor-pointer"
                    >
                      <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden mb-3 bg-background-card">
                        <PodcastImage
                          src={podcast.artworkUrl600 || podcast.artworkUrl100}
                          alt={podcast.collectionName}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-text-muted text-sm font-medium">#{index + 1}</span>
                        <div className="min-w-0">
                          <h3 className="text-white text-sm font-medium truncate group-hover:text-accent-purple transition-colors">
                            {podcast.collectionName}
                          </h3>
                          <p className="text-text-secondary text-xs truncate">
                            {podcast.artistName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="absolute left-0 top-0 bottom-4 w-5 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              </div>
            </section>

            {/* All Results Grid */}
            <section className="py-6 px-5">
              <div className="mb-4">
                <h2 className="text-white font-semibold text-base">All results for &quot;{query}&quot;</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
                {podcasts.map((podcast, index) => (
                  <div
                    key={podcast.trackId}
                    className="group flex gap-3 p-3 rounded-lg hover:bg-background-card transition-colors cursor-pointer"
                  >
                    {/* Artwork */}
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background-card flex-shrink-0">
                      <PodcastImage
                        src={podcast.artworkUrl100}
                        alt={podcast.collectionName}
                        className="w-full h-full object-cover"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-3 h-3 text-background ml-0.5" fill="currentColor" viewBox="0 0 448 512">
                            <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="text-text-secondary text-xs truncate">{podcast.artistName}</p>
                        <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-accent-purple transition-colors">
                          {podcast.collectionName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-text-muted text-xs">
                        <span className="font-medium">#{index + 1}</span>
                        {podcast.primaryGenre && <span>{podcast.primaryGenre}</span>}
                        {podcast.trackCount && <span>{podcast.trackCount} episodes</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 animate-spin text-accent-purple" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
