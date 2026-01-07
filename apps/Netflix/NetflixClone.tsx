
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Play, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { ContentItem } from '../../types';

// Fix: Added missing required properties (status, submittedAt) to match ContentItem interface
const NETFLIX_DATA: ContentItem[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `movie-${i}`,
  title: i === 0 ? "Stranger Things" : `Original Title ${i}`,
  thumbnail: `https://picsum.photos/seed/movie${i}/400/225`,
  description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
  category: i % 4 === 0 ? "Trending Now" : i % 4 === 1 ? "Popular on Netflix" : i % 4 === 2 ? "Sci-Fi Thrillers" : "Award Winning",
  type: 'movie',
  creator: 'Netflix Originals',
  views: 1250000,
  rating: 4.9,
  monetization: 'premium',
  // Moderation fields required by ContentItem
  status: 'approved',
  submittedAt: new Date().toISOString()
}));

const NetflixClone: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ["Trending Now", "Popular on Netflix", "Sci-Fi Thrillers", "Award Winning"];

  return (
    <div className="bg-neutral-950 min-h-screen text-white pb-20">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-colors duration-500 px-4 md:px-12 py-4 flex items-center justify-between ${scrolled ? 'bg-black' : 'bg-gradient-to-b from-black/70 to-transparent'}`}>
        <div className="flex items-center gap-8">
          <h1 className="text-3xl font-bold text-red-600 netflix-font tracking-tighter">NETFLIX</h1>
          <div className="hidden lg:flex items-center gap-4 text-sm font-light">
            <a href="#" className="hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Movies</a>
            <a href="#" className="hover:text-gray-300 transition-colors">New & Popular</a>
            <a href="#" className="hover:text-gray-300 transition-colors">My List</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Search size={20} className="cursor-pointer" />
          <Bell size={20} className="cursor-pointer" />
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center cursor-pointer">
            <User size={20} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[85vh] w-full">
        <img 
          src="https://picsum.photos/seed/netflixhero/1920/1080" 
          alt="Hero"
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent flex flex-col justify-center px-4 md:px-12 gap-6">
          <h2 className="text-5xl md:text-7xl font-bold max-w-2xl leading-tight">THE WITCHER</h2>
          <p className="max-w-xl text-lg text-gray-200">Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.</p>
          <div className="flex items-center gap-4">
            <button className="bg-white text-black px-8 py-3 rounded flex items-center gap-2 font-bold hover:bg-white/80 transition-colors">
              <Play size={24} fill="currentColor" /> Play
            </button>
            <button className="bg-gray-500/50 text-white px-8 py-3 rounded flex items-center gap-2 font-bold hover:bg-gray-500/30 transition-colors">
              <Info size={24} /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="-mt-32 relative z-10 px-4 md:px-12 space-y-12 pb-24">
        {categories.map((cat) => (
          <div key={cat} className="space-y-4">
            <h3 className="text-xl font-semibold hover:text-red-500 transition-colors cursor-pointer inline-flex items-center gap-2 group">
              {cat} <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
            </h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
              {NETFLIX_DATA.filter(item => item.category === cat).map((item) => (
                <div 
                  key={item.id} 
                  className="flex-none w-[280px] group relative cursor-pointer transform transition-transform duration-300 hover:scale-105"
                >
                  <img src={item.thumbnail} className="rounded-md w-full aspect-video object-cover" alt={item.title} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col justify-end p-4">
                    <p className="font-bold text-sm">{item.title}</p>
                    <div className="flex gap-2 mt-2">
                       <Play size={12} className="fill-white" />
                       <Info size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetflixClone;
