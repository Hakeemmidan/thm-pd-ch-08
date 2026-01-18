"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (term: string) => {
    setIsLoading(true);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          بحث البودكاست
        </h1>
        <p className="text-text-secondary text-lg">
          ابحث عن البودكاست المفضل لديك
        </p>
      </div>
      
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      <div className="mt-8 text-text-muted text-sm">
        <p>جرّب البحث عن: فنجان، سوالف بزنس، أبجورة</p>
      </div>
    </main>
  );
}
