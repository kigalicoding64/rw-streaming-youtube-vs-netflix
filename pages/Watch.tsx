
import React from 'react';
import { Play, Plus, ThumbsUp, Share2, ChevronRight } from 'lucide-react';

const Watch: React.FC = () => {
  return (
    <div className="bg-black min-h-full">
      {/* Video Player Section */}
      <div className="aspect-video w-full bg-zinc-900 flex items-center justify-center relative group">
        <div className="text-gray-700 font-black text-4xl uppercase tracking-[1em]">RebaLive Player</div>
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <button className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-red-600/40">
                   <Play size={32} fill="currentColor" />
                 </button>
                 <div>
                   <h1 className="text-3xl font-black">IBURANIRWA</h1>
                   <p className="text-sm text-gray-400">2024 • Action, Thriller • 1h 45m</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><Plus size={24} /></button>
                <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><ThumbsUp size={24} /></button>
                <button className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><Share2 size={24} /></button>
              </div>
           </div>
           <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
             <div className="w-1/3 h-full bg-red-600" />
           </div>
        </div>
      </div>

      {/* Metadata & Description */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="space-y-4">
             <h2 className="text-2xl font-black">Description</h2>
             <p className="text-gray-400 leading-relaxed">
               In the heart of modern Kigali, a private investigator uncovers a massive conspiracy that threatens to derail a national project. A story of loyalty, betrayal, and the cost of the truth.
             </p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <DetailItem label="Director" value="Aimable M." />
             <DetailItem label="Studio" value="K-Cinema" />
             <DetailItem label="Rating" value="PG-13" />
             <DetailItem label="Language" value="Kinyarwanda" />
           </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-black flex items-center justify-between">
             Up Next <ChevronRight size={20} className="text-red-600" />
           </h3>
           <div className="space-y-4">
             <SmallCard title="Urukundo Ruvura" author="CineRwanda" />
             <SmallCard title="Ganza" author="Rwanda Arts" />
             <SmallCard title="The Hills" author="East Films" />
           </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</p>
    <p className="font-bold text-sm">{value}</p>
  </div>
);

const SmallCard = ({ title, author }: any) => (
  <div className="flex gap-4 group cursor-pointer">
    <div className="w-32 aspect-video rounded-xl bg-zinc-800 overflow-hidden flex-none">
       <img src={`https://picsum.photos/seed/${title}/300/200`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
    </div>
    <div className="flex flex-col justify-center">
      <h4 className="font-bold text-sm line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">{title}</h4>
      <p className="text-[10px] text-gray-500 uppercase mt-1">{author}</p>
    </div>
  </div>
);

export default Watch;
