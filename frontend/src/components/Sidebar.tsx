"use client";

import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#0e0e18] flex flex-col h-screen sticky top-0 border-r border-white/5 z-20">
      {/* Logo - Always the same */}
      <div className="p-5">
        <a href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7b5cff] to-[#ff6b9d] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Podbay</span>
        </a>
      </div>

      {/* Main Nav */}
      <nav className="px-3 space-y-0.5">
        <a 
          href="/" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/') ? "text-[#00d4aa] bg-white/[0.04]" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span className="text-[15px] font-medium">Home</span>
        </a>
        <a 
          href="/discover" 
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/discover') ? "text-[#00d4aa] bg-white/[0.04]" : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
          }`}
        >
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

      {/* Footer */}
      <div className="mt-auto p-5 text-gray-500 text-[11px] leading-relaxed">
        <p>Podbay v2.9.6 by Fancy Soups.</p>
        <div className="flex gap-2 mt-1">
          <a href="#" className="hover:text-gray-300">About</a>
          <a href="#" className="hover:text-gray-300">All Podcasts</a>
        </div>
      </div>
    </aside>
  );
}
