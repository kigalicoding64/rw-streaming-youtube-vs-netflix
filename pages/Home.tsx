
import React, { useState, useEffect } from 'react';
import { Play, Info, ChevronRight, Star, TrendingUp, Music, BookOpen, Tv, Globe, Sparkles, AlertCircle, PlayCircle as PlayCircleIcon } from 'lucide-react';
import { ContentItem, LanguageCode, ContentTranslation } from '../types';
import { api } from '../services/api';
import { translator } from '../services/translation';

const PlayCircle = ({ size, className }: any) => <PlayCircleIcon size={size} className={className} />;

const Home: React.FC<{ setView: any, currentLang: LanguageCode }> = ({ setView, currentLang }) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [currentLang]);

  const loadContent = async () => {
    const all = await api.getAllContent();
    setContent(all.filter(i => i.status === 'approved'));
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-12">
      {/* Featured Banner */}
      <section className="relative h-[65vh] rounded-[40px] overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero"
          className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center p-8 md:p-20 space-y-6">
          <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest text-sm">
            <TrendingUp size={16} /> {translator.getLabel('trending', currentLang)}
          </div>
          <h1 className="text-4xl md:text-8xl font-black max-w-2xl leading-tight uppercase italic tracking-tighter">YIBUZE <span className="text-red-600">AMAYERI</span></h1>
          <p className="text-lg text-gray-300 max-w-xl leading-relaxed">Experience the award-winning Rwandan thriller that everyone is talking about. Exclusively on RebaLive RW.</p>
          <div className="flex items-center gap-4 pt-4">
            <button onClick={() => setView('WATCH')} className="bg-white text-black px-10 py-4 rounded-2xl flex items-center gap-3 font-black hover:bg-gray-200 transition-all transform hover:-translate-y-1 shadow-2xl">
              <Play size={24} fill="currentColor" /> {translator.getLabel('watch_now', currentLang)}
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl flex items-center gap-3 font-black hover:bg-white/20 transition-all border border-white/20">
              <Info size={24} /> Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <CategoryCard icon={PlayCircle} label="Movies" color="bg-red-600" onClick={() => setView('WATCH')} />
        <CategoryCard icon={Music} label="Music" color="bg-blue-600" onClick={() => setView('LISTEN')} />
        <CategoryCard icon={BookOpen} label="Books" color="bg-green-600" onClick={() => setView('READ')} />
        <CategoryCard icon={Tv} label="Live TV" color="bg-orange-600" onClick={() => setView('LIVE')} />
        <CategoryCard icon={Globe} label="News" color="bg-indigo-600" onClick={() => setView('HOME')} />
        <CategoryCard icon={Star} label="Premium" color="bg-yellow-600" onClick={() => setView('HOME')} />
      </div>

      {/* Dynamic Content Rows */}
      <ContentRow title={translator.getLabel('trending', currentLang)} items={content} lang={currentLang} />
      
      {/* Promotion */}
      <div className="bg-gradient-to-br from-red-600/10 via-black to-blue-600/10 p-12 rounded-[50px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-4 max-w-xl">
           <h2 className="text-4xl font-black tracking-tighter uppercase">Support Local Creators</h2>
           <p className="text-gray-400 leading-relaxed">Every time you watch or listen, you're directly contributing to Rwanda's booming creative economy. Join the revolution.</p>
           <button className="bg-red-600 px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-colors">Start Creating</button>
        </div>
        <div className="w-full md:w-96 aspect-video bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
           <img src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

const CategoryCard = ({ icon: Icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-4 p-8 rounded-[40px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2 group shadow-xl">
    <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6`}>
      <Icon size={32} className="text-white" />
    </div>
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

const ContentRow = ({ title, items, lang }: { title: string, items: ContentItem[], lang: LanguageCode }) => (
  <section className="space-y-8">
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-black flex items-center gap-3">
        {title} <ChevronRight className="text-red-600" size={32} />
      </h2>
      <button className="text-sm font-bold text-gray-500 hover:text-white transition-colors">View All</button>
    </div>
    <div className="flex gap-8 overflow-x-auto no-scrollbar pb-10">
      {items.map((item) => (
        <ContentCard key={item.id} item={item} lang={lang} />
      ))}
    </div>
  </section>
);

const ContentCard: React.FC<{ item: ContentItem, lang: LanguageCode }> = ({ item, lang }) => {
  const [translated, setTranslated] = useState<ContentTranslation | null>(null);

  useEffect(() => {
    translator.getTranslatedContent(item, lang).then(setTranslated);
  }, [item, lang]);

  return (
    <div className="flex-none w-[320px] md:w-[400px] group cursor-pointer space-y-5">
      <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl border border-white/5 bg-zinc-900">
        <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2">
            <Play size={20} fill="white" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">{translator.getLabel('watch_now', lang)}</span>
          </div>
        </div>
        
        {/* Indicators Overlay */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {translated?.isAiGenerated && !translated.translationError && (
            <div className="bg-blue-600/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase flex items-center gap-1 shadow-lg">
              <Sparkles size={10} /> {lang} (AI)
            </div>
          )}
          {translated?.translationError && (
            <div className="bg-yellow-600/90 backdrop-blur-md text-black text-[8px] font-black px-2 py-1 rounded-lg uppercase flex items-center gap-1 shadow-lg border border-black/10">
              <AlertCircle size={10} /> {lang} Unavailable (Showing {item.originalLanguage.toUpperCase()})
            </div>
          )}
        </div>

        {item.monetization === 'premium' && (
          <div className="absolute top-6 right-6 bg-yellow-600 text-black text-[10px] font-black px-3 py-1.5 rounded-xl uppercase shadow-lg">Premium</div>
        )}
      </div>
      <div className="flex gap-5 px-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 flex-none border border-white/10 flex items-center justify-center font-bold text-xs">
          {item.creator.charAt(0)}
        </div>
        <div className="space-y-1">
          <h3 className="font-black text-xl line-clamp-1 leading-tight group-hover:text-red-600 transition-colors">
            {translated ? translated.title : <span className="w-40 h-6 bg-white/10 rounded animate-pulse block" />}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <span className="font-bold text-gray-400">{item.creator}</span>
            <span>•</span>
            <span>{(item.views / 1000).toFixed(0)}K views</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
