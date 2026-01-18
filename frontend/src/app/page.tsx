"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Podcast } from "@/types/podcast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingPodcasts, setTrendingPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch trending podcasts on load
    fetchTrendingPodcasts();
  }, []);

  const fetchTrendingPodcasts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/search?term=podcast`);
      if (response.ok) {
        const data = await response.json();
        setTrendingPodcasts(data.results || []);
      }
    } catch (error) {
      console.error("Failed to fetch trending podcasts:", error);
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
        {/* Trending Podcasts Section */}
        <section className="py-6">
          <div className="px-5 mb-4">
            <h2 className="text-white font-semibold text-base">Trending podcasts in all genres</h2>
            <p className="text-text-muted text-sm">The most popular podcasts overall now.</p>
          </div>

          <div className="relative">
            {/* Scroll Container */}
            <div 
              className="flex gap-5 overflow-x-auto px-5 pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[180px]">
                    <div className="aspect-square bg-background-card rounded-lg animate-pulse mb-3" />
                    <div className="h-4 bg-background-card rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-3 bg-background-card rounded animate-pulse w-1/2" />
                  </div>
                ))
              ) : (
                trendingPodcasts.map((podcast, index) => (
                  <a 
                    key={podcast.trackId} 
                    href={`/search?q=${encodeURIComponent(podcast.collectionName)}`}
                    className="flex-shrink-0 w-[180px] group cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-background-card">
                      <Image
                        src={podcast.artworkUrl600 || podcast.artworkUrl100}
                        alt={podcast.collectionName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="180px"
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
                  </a>
                ))
              )}
            </div>

            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-4 w-5 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Browse by Genre Section */}
        <section className="py-6">
          <div className="px-5 mb-4">
            <h2 className="text-white font-semibold text-base">Browse by genre</h2>
            <p className="text-text-muted text-sm">The most popular podcasts and episodes categorized by genre.</p>
          </div>

          <div className="relative">
            <div 
              className="flex gap-4 overflow-x-auto px-5 pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                "All genres",
                "Arts",
                "Comedy", 
                "Education",
                "Kids & Family",
                "TV & Film",
                "Music",
                "Technology",
                "Business",
                "Health & Fitness",
                "News",
                "Sports",
              ].map((genre) => (
                <a
                  key={genre}
                  href={`/search?q=${encodeURIComponent(genre)}`}
                  className="flex-shrink-0 w-[180px] bg-background-card hover:bg-background-hover rounded-lg p-4 transition-colors cursor-pointer"
                >
                  <div className="text-white text-sm font-medium mb-3">{genre}</div>
                  <div className="relative h-16 flex items-end justify-center">
                    {/* Stacked images placeholder */}
                    {trendingPodcasts.slice(0, 3).map((podcast, i) => (
                      <div
                        key={i}
                        className={`absolute rounded-md overflow-hidden shadow-lg ${
                          i === 0 ? "w-10 h-10 left-2 bottom-0 z-10" :
                          i === 1 ? "w-12 h-12 left-1/2 -translate-x-1/2 bottom-1 z-20" :
                          "w-14 h-14 right-2 bottom-0 z-30"
                        }`}
                      >
                        <Image
                          src={podcast.artworkUrl100}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    ))}
                  </div>
                </a>
              ))}
            </div>

            <div className="absolute left-0 top-0 bottom-4 w-5 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Trending Episodes Section */}
        <section className="py-6 px-5">
          <div className="mb-4">
            <h2 className="text-white font-semibold text-base">Trending episodes in all genres</h2>
            <p className="text-text-muted text-sm">The most popular podcast episodes overall now.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg">
                  <div className="w-20 h-20 bg-background-card rounded-md animate-pulse flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-background-card rounded animate-pulse mb-2 w-1/3" />
                    <div className="h-4 bg-background-card rounded animate-pulse mb-2" />
                    <div className="h-3 bg-background-card rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))
            ) : (
              trendingPodcasts.slice(0, 20).map((podcast, index) => (
                <a
                  key={podcast.trackId}
                  href={`/search?q=${encodeURIComponent(podcast.collectionName)}`}
                  className="group flex gap-3 p-3 rounded-lg hover:bg-background-card transition-colors cursor-pointer"
                >
                  {/* Artwork */}
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-background-card flex-shrink-0">
                    <Image
                      src={podcast.artworkUrl100}
                      alt={podcast.collectionName}
                      fill
                      className="object-cover"
                      sizes="80px"
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
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
