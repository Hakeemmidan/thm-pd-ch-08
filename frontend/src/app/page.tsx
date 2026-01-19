"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Podcast } from "@/types/podcast";
import EpisodeMenu from "@/components/EpisodeMenu";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper to format date like "Jan 16"
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
}

const genreGradients = [
  "linear-gradient(135deg, #FF6B6B 0%, #556270 100%)",
  "linear-gradient(135deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%)",
  "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
  "linear-gradient(135deg, #00B4DB 0%, #0083B0 100%)",
  "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
];

export default function Home() {
  const [trendingPodcasts, setTrendingPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingPodcasts();
  }, []);

  const fetchTrendingPodcasts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/search?term=podcast`);
      if (response.ok) {
        const data = await response.json();
        setTrendingPodcasts(data.podcasts || []);
      }
    } catch {
      // Silent fail
    } finally {
      setIsLoading(false);
    }
  };

  const artistColors = ["text-[#00d4aa]", "text-[#ff6b9d]", "text-[#f5a623]", "text-[#7b5cff]"];

  return (
    <div className="min-h-screen bg-[#12121f] text-white font-sans flex">
      <Sidebar />
      <MobileNav />

      {/* Main Content */}
      <div className="flex-1 min-w-0 pb-16 md:pb-0">
        <Suspense fallback={<div className="h-16 bg-[#12121f]" />}>
          <Header />
        </Suspense>

        {/* Page Content */}
        <main className="p-6 space-y-10">
          {/* Trending Podcasts Section */}
          <section>
            <div className="flex items-end justify-between mb-4 px-2">
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Trending podcasts in all genres</h2>
                <p className="text-gray-500 text-xs mt-1">The most popular podcasts overall now. Last updated 4 hours ago.</p>
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-white ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-white/10 mb-4" />

            <HorizontalScroll>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[200px]">
                    <div className="aspect-square bg-[#1c1c2e] rounded-lg animate-pulse mb-3" />
                    <div className="h-4 bg-[#1c1c2e] rounded animate-pulse mb-2 w-3/4" />
                    <div className="h-3 bg-[#1c1c2e] rounded animate-pulse w-1/2" />
                  </div>
                ))
              ) : (
                trendingPodcasts.slice(0, 10).map((podcast, index) => (
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
                ))
              )}
            </HorizontalScroll>
          </section>

          {/* Browse by Genre Section */}
          <section>
            <div className="flex items-end justify-between mb-4 px-2">
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Browse by genre</h2>
                <p className="text-gray-500 text-xs mt-1">The most popular podcasts and episodes now categorized by genre.</p>
              </div>
              <div className="flex gap-1">
                 <button className="p-1 text-gray-400 hover:text-white ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-4" />

            <HorizontalScroll>
              {[
                "All genres", "Arts", "Comedy", "Education", "Kids & Family",
                "TV & Film", "Music", "Technology", "Business", "Health & Fitness",
                "News", "Sports"
              ].map((genre, i) => (
                <a
                  key={genre}
                  href={`/search?q=${encodeURIComponent(genre)}`}
                  className="flex-shrink-0 w-[220px] h-[120px] rounded-lg overflow-hidden relative group transition-transform hover:-translate-y-1"
                  style={{ background: genreGradients[i % genreGradients.length] }}
                >
                  <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                    <span className="text-white text-lg font-bold shadow-black/20 drop-shadow-md">{genre}</span>
                  </div>
                  {/* Decorative podcast thumbnails */}
                  <div className="absolute right-0 bottom-0 flex transform translate-y-2 translate-x-2">
                    {trendingPodcasts.slice(i, i + 3).map((p, j) => (
                      <div key={p?.trackId || j} className={`w-12 h-12 rounded-lg overflow-hidden shadow-lg transform -translate-x-${j * 4} -rotate-${j * 6} border border-white/10 bg-black/20`}>
                        {p && (
                          <PodcastImage
                            src={p.artworkUrl100}
                            alt=""
                            className="w-full h-full object-cover opacity-90"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </a>
              ))}
            </HorizontalScroll>
          </section>

          {/* Promoted Podcasts */}
          <section className="py-4">
             <div className="flex items-center justify-between mb-4 px-2">
              <div>
                <h2 className="text-white font-bold text-lg">Promoted Podcasts</h2>
                <p className="text-gray-500 text-xs mt-1">
                  These podcasts are promoted by podcasters, listeners, and the Podbay team.{" "}
                  <a href="#" className="text-[#00d4aa] hover:underline">Promote yours here.</a>
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center p-4 text-center hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <span className="text-gray-600 text-[10px] font-medium uppercase tracking-wider group-hover:text-gray-400">Your Podcast Here</span>
                  </div>
                ))}
            </div>
          </section>

          {/* Trending Episodes List */}
          <section>
            <div className="flex items-end justify-between mb-4 px-2">
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Trending episodes in all genres</h2>
                <p className="text-gray-500 text-xs mt-1">The most popular podcast episodes overall now.</p>
              </div>
               <button className="p-1 text-gray-400 hover:text-white ml-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-24 bg-[#1c1c2e] rounded-md animate-pulse" />
                ))
              ) : (
                trendingPodcasts.slice(0, 20).map((podcast, index) => (
                  <a
                    key={podcast.trackId}
                    href={`/search?q=${encodeURIComponent(podcast.collectionName)}`}
                    className="bg-[#1c1c2e] hover:bg-[#25253a] p-4 rounded-md transition-colors group/card flex flex-col h-full min-h-[110px]"
                  >
                    {/* Top Row: Meta */}
                    <div className="flex items-center gap-3 text-[11px] font-medium text-gray-500 mb-2 uppercase tracking-wide">
                      <span className="text-white">#{index + 1}</span>
                      <span>{formatDate(podcast.releaseDate || "") || "JAN 16"}</span>
                      <span>{Math.floor(Math.random() * 60) + 20}MIN</span>
                      {index % 3 === 0 && (
                        <span className="text-[9px] bg-[#32324a] px-1.5 py-0.5 rounded text-gray-300">VIDEO</span>
                      )}
                    </div>

                    {/* Podcast Name (Colored) */}
                    <div className={`text-[11px] font-bold mb-1 uppercase tracking-wide ${artistColors[index % artistColors.length]}`}>
                      {podcast.artistName?.slice(0, 25) || "PODCAST NAME"}
                    </div>

                    {/* Episode Title (White) */}
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-white text-[13px] font-bold leading-snug group-hover/card:underline decoration-1 line-clamp-2">
                            {podcast.collectionName}
                        </h3>
                        <div className="self-start">
                          <EpisodeMenu />
                        </div>
                    </div>
                  </a>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
