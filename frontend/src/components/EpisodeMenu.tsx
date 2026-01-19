"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function EpisodeMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both button and menu
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Close on scroll to avoid detached menu
      window.addEventListener("scroll", () => setIsOpen(false), true);
      window.addEventListener("resize", () => setIsOpen(false));
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", () => setIsOpen(false), true);
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // w-52 is 13rem = 208px approx.
      // We want to align the right side of the menu with the right side of the button
      // But if it goes off screen to the left, we might want to adjust. 
      // For now, simpler right alignment is usually what's expected for this UI.
      
      const menuWidth = 208; // w-52
      let left = rect.right - menuWidth;
      
      // Basic check to keep it on screen (left edge)
      if (left < 10) left = 10;

      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
    console.log("Action clicked");
  };

  const menu = (
    <div
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
      className="absolute w-52 bg-[#4c3b7f] rounded-lg shadow-xl z-[9999] overflow-hidden py-1"
    >
      <div className="absolute -top-1 right-2 w-2 h-2 bg-[#4c3b7f] transform rotate-45" />
      
      <button
        onClick={handleAction}
        className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-white/10 transition-colors"
      >
        Play episode
      </button>
      
      <button
        onClick={handleAction}
        className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-white/10 transition-colors border-b border-white/10"
      >
        Add to My Queue
      </button>
      
      <button
        onClick={handleAction}
        className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-white/10 transition-colors"
      >
        Go to episode
      </button>
      
      <button
        onClick={handleAction}
        className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-white/10 transition-colors border-b border-white/10"
      >
        Go to podcast
      </button>
      
      <button
        onClick={handleAction}
        className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-white/10 transition-colors border-b border-white/10"
      >
        Download file
      </button>

      <button
        onClick={handleAction}
        className="w-full text-left px-4 py-2.5 text-[14px] text-white hover:bg-white/10 transition-colors"
      >
        Hide Podcast
      </button>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`p-1 rounded transition-all relative ${
          isOpen ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/10 hover:text-white"
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="6" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="18" r="2" />
        </svg>
      </button>
      {isOpen && mounted && createPortal(menu, document.body)}
    </>
  );
}
