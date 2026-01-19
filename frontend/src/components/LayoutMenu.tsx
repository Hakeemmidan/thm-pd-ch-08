"use client";

import { useState, useRef, useEffect } from "react";

export type LayoutType = "grid" | "scroll" | "list" | "compact";

interface LayoutMenuProps {
  currentLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
}

export default function LayoutMenu({ currentLayout, onLayoutChange }: LayoutMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (layout: LayoutType) => {
    onLayoutChange(layout);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-[#4c3b7f] rounded-lg shadow-xl z-50 overflow-hidden py-1">
          <div className="absolute -top-1 right-2 w-2 h-2 bg-[#4c3b7f] transform rotate-45" />
          <button
            onClick={() => handleSelect("scroll")}
            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-white/10 transition-colors ${currentLayout === "scroll" ? "text-white font-medium bg-white/5" : "text-gray-200"}`}
          >
            Switch layout to Scroll
          </button>
          <button
            onClick={() => handleSelect("grid")}
            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-white/10 transition-colors ${currentLayout === "grid" ? "text-white font-medium bg-white/5" : "text-gray-200"}`}
          >
            Switch layout to Grid
          </button>
          <button
            onClick={() => handleSelect("list")}
            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-white/10 transition-colors ${currentLayout === "list" ? "text-white font-medium bg-white/5" : "text-gray-200"}`}
          >
            Switch layout to List
          </button>
          <button
            onClick={() => handleSelect("compact")}
            className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-white/10 transition-colors ${currentLayout === "compact" ? "text-white font-medium bg-white/5" : "text-gray-200"}`}
          >
            Switch layout to Compact
          </button>
        </div>
      )}
    </div>
  );
}
