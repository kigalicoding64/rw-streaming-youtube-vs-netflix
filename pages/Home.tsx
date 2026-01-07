
import React from 'react';
import { Play, Info, ChevronRight, Star, TrendingUp, Clock, Globe, Music, BookOpen, Tv } from 'lucide-react';
import { ContentItem } from '../types';

const MOCK_DATA: ContentItem[] = [
  {
    id: '1',
    type: 'movie',
    title: 'The Unseen Hero',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1000',
    creator: 'Rwanda Films Ltd',
    views: 450000,
    rating: 4.8,
    category: 'Trending',
    monetization: 'premium',
    description: 'A powerful story about selflessness in a changing nation.',
    // Fix: added missing mandatory properties
    status: 'approved',
    submittedAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'music',
    title: 'Amateka',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000',
    creator: 'Bruce Melodie',
    views: 1200000,
    rating: 4.9,
    category: 'Latest Hits',
    monetization: 'free',
    description: 'An anthem for the modern age.',
    // Fix: added missing mandatory properties
    status: 'approved',
    submittedAt: new Date().toISOString()
  }
];

const Home: React.FC<{ setView: any }> = ({ setView }) => {
  return (
    <div className="p-4 md:p-8 space-y-12">
      {/* Featured Banner */}
      <section className="relative h-[60vh] rounded-3xl overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero"
          className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center p-8 md:p-16 space-y-6">
          <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-sm">
            <TrendingUp size={16} /> Featured Today
          </div>
          <h1 className="text-4xl md:text-7xl font-black max-w-2xl leading-tight">YIBUZE <span className="text-red-600">AMAYERI</span></h1>
          <p className="text-lg text-gray-300 max-w-xl leading-relaxed">Experience the award-winning Rwandan thriller that everyone is talking about. Exclusively on RebaLive RW.</p>
          <div className="flex items-center gap-4 pt-4">
            <button onClick={() => setView('WATCH')} className="bg-white text-black px-8 py-3.5 rounded-2xl flex items-center gap-3 font-black hover:bg-gray-200 transition-all transform hover:-translate-y-1">
              <Play size={24} fill="currentColor" /> Kureba (Play)
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-black hover:bg-white/20 transition-all border border-white/20">
              <Info size={24} /> Sobanukirwa
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <CategoryCard icon={Play} label="Movies" color="bg-red-600" onClick={() => setView('WATCH')} />
        <CategoryCard icon={Music} label="Music" color="bg-blue-600" onClick={() => setView('LISTEN')} />
        <CategoryCard icon={BookOpen} label="Books" color="bg-green-600" onClick={() => setView('READ')} />
        <CategoryCard icon={Tv} label="Live TV" color="bg-orange-600" onClick={() => setView('LIVE')} />
        <CategoryCard icon={Globe} label="News" color="bg-indigo-600" onClick={() => setView('HOME')} />
        <CategoryCard icon={Star} label="Premium" color="bg-yellow-600" onClick={() => setView('HOME')} />
      </div>

      {/* Content Rows */}
      <ContentRow title="Filime ziri gukundwa cyane (Trending Movies)" items={MOCK_DATA} />
      <ContentRow title="Umumuziki ushyushye (Hot Music)" items={MOCK_DATA.map(i => ({ ...i, type: 'music' }))} />
    </div>
  );
};

const CategoryCard = ({ icon: Icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 group">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12`}>
      <Icon size={28} className="text-white" />
    </div>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const ContentRow = ({ title, items }: { title: string, items: ContentItem[] }) => (
  <section className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black flex items-center gap-3">
        {title} <ChevronRight className="text-red-600" size={24} />
      </h2>
      <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors">View All</button>
    </div>
    <div className="flex gap-6 overflow-x-auto no-scrollbar pb-6">
      {items.concat(items).map((item, i) => (
        <div key={i} className="flex-none w-[280px] md:w-[350px] group cursor-pointer space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
              <div className="flex items-center gap-2">
                <Play size={16} fill="white" />
                <span className="text-xs font-bold uppercase tracking-widest">Kureba Nonaha</span>
              </div>
            </div>
            {item.monetization === 'premium' && (
              <div className="absolute top-4 right-4 bg-yellow-600 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase">Premium</div>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex-none" />
            <div className="space-y-1">
              <h3 className="font-bold text-lg line-clamp-1 leading-tight group-hover:text-red-600 transition-colors">{item.title}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <span className="font-bold text-gray-400">{item.creator}</span>
                <span>•</span>
                <span>{(item.views / 1000).toFixed(0)}K Reba</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Home;
