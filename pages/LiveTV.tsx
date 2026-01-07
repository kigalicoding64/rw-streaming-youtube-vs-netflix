
import React from 'react';
import { Radio, Users, Eye, Play, Share2, MessageCircle } from 'lucide-react';

const CHANNELS = [
  { name: 'RTV News', slug: 'rtv-news', viewers: '142K', color: 'from-blue-600 to-blue-900' },
  { name: 'KC2 Entertainment', slug: 'kc2', viewers: '85K', color: 'from-red-600 to-red-900' },
  { name: 'Flash TV', slug: 'flash', viewers: '42K', color: 'from-orange-600 to-orange-900' },
  { name: 'TV10 Rwanda', slug: 'tv10', viewers: '31K', color: 'from-green-600 to-green-900' },
];

const LiveTV: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Video Section */}
      <div className="flex-1 bg-black flex flex-col">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 overflow-hidden">
             <div className="animate-pulse w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center">
               <Radio size={48} className="text-red-600 animate-bounce" />
             </div>
             <p className="absolute bottom-8 text-gray-500 font-bold tracking-widest uppercase text-xs">Connecting to Secure Feed...</p>
          </div>
          
          <div className="absolute top-6 left-6 flex items-center gap-3">
             <div className="bg-red-600 text-white px-3 py-1 rounded-md font-black text-xs animate-pulse">LIVE</div>
             <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-white text-xs font-bold flex items-center gap-2">
               <Eye size={14} /> 142,503 viewers
             </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                   <Play size={24} fill="currentColor" />
                 </button>
                 <div>
                   <h2 className="text-xl font-black">RTV Amakuru mu Kinyarwanda</h2>
                   <p className="text-xs text-gray-400">Rwanda Broadcasting Agency • News & Current Affairs</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><Share2 size={20} /></button>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><MessageCircle size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Channel List */}
      <aside className="w-full lg:w-80 border-l border-white/10 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-black uppercase tracking-tighter">Imirongo (Channels)</h3>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          {CHANNELS.map((ch, i) => (
            <div key={i} className="group cursor-pointer space-y-3">
              <div className={`aspect-video rounded-2xl bg-gradient-to-br ${ch.color} flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-all border border-white/5`}>
                <span className="text-2xl font-black text-white/50">{ch.name.split(' ')[0]}</span>
              </div>
              <div className="flex items-center justify-between px-1">
                 <p className="font-bold text-sm">{ch.name}</p>
                 <span className="text-[10px] text-red-500 font-black">{ch.viewers} Live</span>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default LiveTV;
