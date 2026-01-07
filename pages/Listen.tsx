
import React from 'react';
import { Play, SkipBack, SkipForward, Repeat, Shuffle, Volume2, ListMusic, Mic2, Book } from 'lucide-react';

const Listen: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900/20 to-black p-8 space-y-12 overflow-y-auto no-scrollbar">
      {/* Featured Artist Section */}
      <section className="flex flex-col md:flex-row gap-12 items-center md:items-end">
        <div className="w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
           <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000" alt="Artist" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 text-center md:text-left">
           <div className="flex items-center justify-center md:justify-start gap-2 text-blue-500 font-black uppercase tracking-widest text-xs">
             <Mic2 size={16} /> Artist Spotlight
           </div>
           <h1 className="text-5xl md:text-8xl font-black">MEDDY</h1>
           <p className="text-xl text-gray-400 font-medium max-w-xl">Experience the latest hits and exclusive live sessions from Rwanda's king of pop.</p>
           <div className="flex items-center gap-4 pt-4 justify-center md:justify-start">
             <button className="bg-blue-600 px-8 py-3.5 rounded-2xl font-black hover:scale-105 transition-transform flex items-center gap-2">
               <Play size={20} fill="currentColor" /> Play Discography
             </button>
             <button className="bg-white/10 px-8 py-3.5 rounded-2xl font-black hover:bg-white/20 transition-all border border-white/10">Follow</button>
        </div>
        </div>
      </section>

      {/* Mini Player Sticky (Simulation) */}
      <div className="fixed bottom-20 left-4 right-4 lg:left-72 lg:right-8 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex items-center justify-between shadow-2xl z-[90]">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">M</div>
           <div className="hidden sm:block">
             <p className="font-black text-sm">Carolina</p>
             <p className="text-[10px] text-gray-500 uppercase font-black">Meddy</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <button className="text-gray-400 hover:text-white transition-colors"><Shuffle size={18} /></button>
           <button className="text-gray-400 hover:text-white transition-colors"><SkipBack size={24} fill="currentColor" /></button>
           <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Play size={24} fill="currentColor" /></button>
           <button className="text-gray-400 hover:text-white transition-colors"><SkipForward size={24} fill="currentColor" /></button>
           <button className="text-gray-400 hover:text-white transition-colors"><Repeat size={18} /></button>
        </div>
        <div className="hidden md:flex items-center gap-4">
           <Volume2 size={20} className="text-gray-400" />
           <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-blue-600" />
           </div>
           <ListMusic size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AudioSection title="Top Playlists" items={['Ibisingizo', 'Gakondo Mix', 'Night in Kigali', 'Morning Boost']} />
        <AudioSection title="Audiobooks (Ibitabo byumvwa)" items={['Inzira y’ubuzima', 'Amateka y’u Rwanda', 'Urukundo Ruvura', 'Imyaka 100']} type="book" />
      </div>
    </div>
  );
};

const AudioSection = ({ title, items, type }: any) => (
  <div className="space-y-6">
    <h3 className="text-2xl font-black">{title}</h3>
    <div className="grid grid-cols-2 gap-4">
      {items.map((item: any) => (
        <div key={item} className="p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-4 group cursor-pointer">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-none ${type === 'book' ? 'bg-green-600' : 'bg-blue-600'}`}>
             {type === 'book' ? <Book size={24} /> : <Play size={24} fill="white" />}
           </div>
           <div className="min-w-0">
             <p className="font-bold text-sm truncate">{item}</p>
             <p className="text-[10px] text-gray-500 uppercase font-black">{type === 'book' ? 'Narrated' : 'Curated'}</p>
           </div>
        </div>
      ))}
    </div>
  </div>
);

export default Listen;
