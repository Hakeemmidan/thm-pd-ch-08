"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import PodcastCarousel from "@/components/PodcastCarousel";
import EpisodeGrid from "@/components/EpisodeGrid";
import { Podcast, SearchResponse } from "@/types/podcast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        throw new Error("Failed to fetch podcasts");
      }
      
      const data: SearchResponse = await response.json();
      setPodcasts(data.results);
    } catch (err) {
      setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto py-4 px-5">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} initialValue={query} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg className="w-10 h-10 animate-spin text-accent-purple" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-text-secondary">جاري البحث...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-accent-pink text-lg mb-4">{error}</p>
              <button
                onClick={() => query && fetchPodcasts(query)}
                className="px-6 py-2 bg-accent-purple hover:bg-accent-purple/80 rounded-full transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && podcasts.length === 0 && query && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-text-secondary text-lg">
                لم يتم العثور على نتائج لـ &quot;{query}&quot;
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && podcasts.length > 0 && (
          <>
            <PodcastCarousel
              title={`أفضل البودكاست لـ ${query}`}
              podcasts={podcasts.slice(0, 10)}
            />
            
            <EpisodeGrid
              title={`أفضل الحلقات لـ ${query}`}
              podcasts={podcasts}
            />
          </>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 animate-spin text-accent-purple" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-text-secondary">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
