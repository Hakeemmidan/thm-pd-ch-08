"use client";

import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#12121f]/95 backdrop-blur-md border-t border-white/5 z-50 flex items-center justify-around px-2 pb-safe">
      <a 
        href="/" 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive('/') ? "text-[#00d4aa]" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <svg className="w-6 h-6" fill={isActive('/') ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/') ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          {isActive('/') && <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />}
        </svg>
        <span className="text-[10px] font-medium">Home</span>
      </a>

      <a 
        href="/discover" 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive('/discover') ? "text-[#00d4aa]" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-[10px] font-medium">Discover</span>
      </a>

      <a 
        href="/queue" 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive('/queue') ? "text-[#00d4aa]" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span className="text-[10px] font-medium">My Queue</span>
      </a>

      <a 
        href="/podcasts" 
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
          isActive('/podcasts') ? "text-[#00d4aa]" : "text-gray-500 hover:text-gray-300"
        }`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <span className="text-[10px] font-medium">Library</span>
      </a>
    </nav>
  );
}
