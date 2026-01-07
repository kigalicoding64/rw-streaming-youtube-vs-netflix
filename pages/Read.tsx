
import React from 'react';
import { BookOpen, Search, Download, Bookmark, Star, ChevronRight } from 'lucide-react';

const Read: React.FC = () => {
  return (
    <div className="p-8 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black">Library (Isomero)</h1>
          <p className="text-gray-500 font-medium">Digital books, journals, and local stories.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3">
             <Search size={18} className="text-gray-500" />
             <input type="text" placeholder="Search books..." className="bg-transparent border-none outline-none text-sm" />
           </div>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-4 group cursor-pointer">
            <div className="aspect-[2/3] bg-zinc-800 rounded-2xl overflow-hidden relative shadow-xl transform group-hover:scale-105 transition-transform">
               <img src={`https://picsum.photos/seed/book${i}/400/600`} alt="Book" className="w-full h-full object-cover" />
               <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white"><Bookmark size={16} /></button>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                  <button className="w-full py-2 bg-green-600 text-white rounded-xl font-black text-xs">SOMA (READ)</button>
               </div>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm line-clamp-1">Inzira y'Urukundo</h4>
              <p className="text-[10px] text-gray-500 font-black uppercase">Gasana M.</p>
              <div className="flex items-center gap-2">
                 <div className="flex text-yellow-500"><Star size={10} fill="currentColor" /> <Star size={10} fill="currentColor" /> <Star size={10} fill="currentColor" /></div>
                 <span className="text-[10px] text-gray-500">4.5k reads</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="bg-zinc-900 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 border border-white/5">
         <div className="w-64 h-80 bg-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex-none rotate-2">
            <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
         </div>
         <div className="space-y-6">
            <span className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">Book of the Month</span>
            <h2 className="text-4xl md:text-6xl font-black">IBISINGIZO BY'AMASHYAMBA</h2>
            <p className="text-lg text-gray-400 max-w-2xl">A collection of traditional poems and oral histories that define the soul of the Thousand Hills. Rediscover your roots through this exclusive digital edition.</p>
            <div className="flex items-center gap-4 pt-4">
              <button className="bg-green-600 px-8 py-3.5 rounded-2xl font-black text-sm hover:scale-105 transition-transform flex items-center gap-2">
                <BookOpen size={20} /> Tangira Gusoma
              </button>
              <button className="p-3.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"><Download size={24} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Read;
