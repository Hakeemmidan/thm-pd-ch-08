"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderMenu from "./HeaderMenu";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Sync initial query from URL, but don't overwrite user typing
  useEffect(() => {
    if (initialQuery !== searchTerm) {
      setSearchTerm(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => { // debounced search
    const timer = setTimeout(() => {
      // don't search if it's the same as the current query
      if (searchTerm === initialQuery) return;

      if (searchTerm.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      } else if (searchTerm === "" && initialQuery !== "") {
        router.push("/");
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [searchTerm, router, initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediate search on Enter
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
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
  );
}
