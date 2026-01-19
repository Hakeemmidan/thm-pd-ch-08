"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function HeaderMenu() {
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
      const menuWidth = 220;
      // Align right edge of menu with right edge of button
      const left = rect.right - menuWidth;

      setPosition({
        top: rect.bottom + window.scrollY + 8,
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
      className="absolute w-[220px] bg-[#5b4a9a] rounded-lg shadow-xl z-[9999] overflow-hidden py-1 text-white border border-white/5"
    >
      <div className="absolute -top-1 right-3 w-2 h-2 bg-[#5b4a9a] transform rotate-45 border-l border-t border-white/5" />
      
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Settings
      </button>

      <div className="border-b border-white/10 my-1" />
      
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        About Podbay
      </button>
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        What&apos;s New
      </button>
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Podcaster FAQ
      </button>
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Privacy
      </button>
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Terms
      </button>
      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Privacy Settings
      </button>

      <div className="border-b border-white/10 my-1" />

      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Contact & Feedback
      </button>

      <div className="border-b border-white/10 my-1" />

      <button onClick={handleAction} className="w-full text-left px-4 py-2.5 text-[14px] hover:bg-white/10 transition-colors">
        Clear Data...
      </button>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={`p-1.5 rounded-full transition-all relative ${
          isOpen ? "bg-[#32324a] text-white" : "text-gray-400 hover:bg-[#32324a] hover:text-white"
        }`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>
      {isOpen && mounted && createPortal(menu, document.body)}
    </>
  );
}
