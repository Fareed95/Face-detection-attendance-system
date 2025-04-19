"use client"
import { Search, Book, ChevronRight, Users, GraduationCap, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import SearchResults from './SearchResults';

const trendingTopics = [
  "AI & Machine Learning",
  "Web Development",
  "Data Science",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "UX Design",
  "Mobile Development"
];

export default function GalleryPics() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15), transparent 60%)',
      }}
    >
      {/* Hero Section - Always visible */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="hero-content text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            Literacy Hub
          </h1>
          <p className="text-xl mb-12 text-gray-400">
            Unlock the power of Literacy
          </p>

          {/* Search Bar */}
          <div className="glass max-w-2xl mx-auto p-2 rounded-full mb-8 flex items-center">
            <Search className="ml-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What would you like to learn today?"
              className="w-full bg-transparent px-4 py-2 outline-none text-[rgb(var(--foreground))]"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="search-cursor h-5 border-r border-[rgb(var(--primary))] mx-1"></div>
            <button 
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              Search
            </button>
          </div>

          {/* Trending Topics - Always scrolling */}
          <div className="mb-12">
            <h3 className="text-lg mb-4 flex items-center justify-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Trending Topics
            </h3>
            <div className="flex justify-center">
              <div className="trending-topics flex gap-4 py-4 max-w-4xl mx-auto overflow-x-auto scroll-smooth">
                <div className="flex gap-4 animate-scroll">
                  {[...trendingTopics, ...trendingTopics].map((topic, index) => (
                    <Link
                      key={index}
                      href={`/search?q=${encodeURIComponent(topic)}`}
                      className="text-white px-6 py-2 rounded-full whitespace-nowrap hover:bg-white/10 transition-colors bg-gradient-to-r from-indigo-600 to-purple-600"
                    >
                      {topic}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Only show when not searching */}
          {!isSearching && (
            <Link
              href="/search"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto w-fit"
            >
              Start Learning Now
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Search Results - Appears below hero section */}
      {isSearching && <SearchResults query={searchQuery} />}
    </div>
  );
}