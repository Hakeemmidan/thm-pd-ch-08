"use client";

import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";

function NotFoundContent() {
  return (
    <div className="flex h-screen bg-[#12121f] overflow-hidden">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
          <div className="mb-12 transform rotate-[15deg] hover:rotate-0 transition-transform duration-700 ease-out">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src="https://podbay.fm/static/images/pods/3.png" 
               alt="404 Graphic"
               className="w-[300px] md:w-[400px] opacity-90 drop-shadow-2xl filter brightness-110 contrast-110"
             />
          </div>
          
          <div className="bg-black/60 px-6 py-2 rounded-sm border border-white/5 backdrop-blur-sm">
             <span className="text-[#ff6b9d] font-mono text-[13px] tracking-[0.2em] font-bold shadow-black/50 drop-shadow-sm">404 NOT FOUND</span>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#12121f]" />}>
      <NotFoundContent />
    </Suspense>
  );
}
