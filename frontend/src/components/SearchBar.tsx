"use client";

import { useState, FormEvent } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

export default function SearchBar({ onSearch, isLoading = false, initialValue = "" }: SearchBarProps) {
  const [term, setTerm] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="ابحث عن بودكاست..."
          className="w-full px-6 py-4 pr-14 text-lg bg-background-card text-text-primary placeholder-text-muted rounded-full border border-transparent focus:border-accent-purple focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !term.trim()}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-accent-purple hover:bg-accent-purple/80 disabled:bg-text-muted disabled:cursor-not-allowed rounded-full transition-colors"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
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
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
