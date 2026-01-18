"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-[1800px] mx-auto px-5 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg 
              viewBox="0 0 24 24" 
              className="w-8 h-8 text-accent-purple"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xl font-bold text-text-primary">Podbay</span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for podcasts..."
              className="w-full h-10 pl-12 pr-4 bg-background-card text-text-primary placeholder-text-muted rounded-lg border border-white/10 focus:border-accent-purple/50 focus:outline-none transition-colors text-sm"
            />
          </div>
        </form>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/charts" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Charts
          </Link>
          <Link href="/discover" className="text-text-secondary hover:text-text-primary text-sm transition-colors">
            Discover
          </Link>
        </nav>
      </div>
    </header>
  );
}
