
import React, { useState } from 'react';
import { 
  Menu, Search, Mic, Video, Bell, User, 
  Home, Compass, PlaySquare, Clock, ThumbsUp, 
  Library, History, Flame, Music2, Gamepad2, Trophy 
} from 'lucide-react';
import { ContentItem } from '../../types';

// Fix: Updated mock data to include missing ContentItem properties (status, submittedAt) and use creator instead of channelName
const YOUTUBE_DATA: ContentItem[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `vid-${i}`,
  title: `The Future of AI is Here: Gemini 3 Breakdown ${i + 1}`,
  thumbnail: `https://picsum.photos/seed/yt${i}/640/360`,
  duration: "12:45",
  views: 1200000,
  timestamp: "2 days ago",
  creator: "Tech Insider",
  channelAvatar: `https://picsum.photos/seed/ch${i}/100/100`,
  category: i % 5 === 0 ? "Music" : i % 5 === 1 ? "Gaming" : "Live",
  type: 'movie',
  rating: 4.8,
  monetization: 'free',
  description: "A deep dive into the latest capabilities of the Gemini 3 multimodal AI models.",
  // Moderation fields required by ContentItem
  status: 'approved',
  submittedAt: new Date().toISOString()
}));

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-6 px-4 py-3 rounded-xl cursor-pointer hover:bg-white/10 ${active ? 'bg-white/10 font-medium' : ''}`}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
    <span className="text-sm">{label}</span>
  </div>
);

const YouTubeClone: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Music', 'Gaming', 'Live', 'Comedy', 'Technology', 'Science', 'Cars', 'News', 'Cooking'];

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-[#0f0f0f]/95 backdrop-blur-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Menu className="cursor-pointer hover:bg-white/10 p-2 rounded-full box-content" size={24} />
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-8 h-6 bg-red-600 rounded-md flex items-center justify-center">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-1"></div>
            </div>
            <span className="text-xl font-bold tracking-tighter">YouTube</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-[720px] items-center gap-4 px-4">
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 items-center bg-zinc-900 border border-zinc-800 rounded-l-full px-4 py-2 focus-within:border-blue-500 transition-colors">
              <Search size={18} className="text-zinc-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-transparent w-full outline-none text-base font-light"
              />
            </div>
            <button className="bg-zinc-800 border-y border-r border-zinc-800 rounded-r-full px-5 py-2 hover:bg-zinc-700 transition-colors">
              <Search size={18} />
            </button>
          </div>
          <button className="bg-zinc-900 p-2.5 rounded-full hover:bg-zinc-800 transition-colors">
            <Mic size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Video className="cursor-pointer p-2 hover:bg-white/10 rounded-full box-content" size={22} />
          <Bell className="cursor-pointer p-2 hover:bg-white/10 rounded-full box-content" size={22} />
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold cursor-pointer">J</div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col gap-1 p-2 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar fixed left-0">
          <SidebarItem icon={Home} label="Home" active />
          <SidebarItem icon={Compass} label="Shorts" />
          <SidebarItem icon={PlaySquare} label="Subscriptions" />
          <hr className="my-3 border-zinc-800" />
          <SidebarItem icon={Library} label="You" />
          <SidebarItem icon={History} label="History" />
          <SidebarItem icon={Clock} label="Watch Later" />
          <SidebarItem icon={ThumbsUp} label="Liked videos" />
          <hr className="my-3 border-zinc-800" />
          <div className="px-4 py-2 text-base font-bold">Explore</div>
          <SidebarItem icon={Flame} label="Trending" />
          <SidebarItem icon={Music2} label="Music" />
          <SidebarItem icon={Gamepad2} label="Gaming" />
          <SidebarItem icon={Trophy} label="Sports" />
        </aside>

        {/* Feed */}
        <div className="flex-1 lg:ml-64 px-4 py-4">
          <div className="sticky top-16 bg-[#0f0f0f] z-40 py-3 flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {YOUTUBE_DATA.map(video => (
              <div key={video.id} className="group cursor-pointer flex flex-col gap-3">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-xs font-medium">{video.duration}</span>
                </div>
                <div className="flex gap-3">
                  {/* Fix: used video.channelAvatar and video.creator instead of missing properties */}
                  <img src={video.channelAvatar} className="w-9 h-9 rounded-full object-cover" alt="Channel" />
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold line-clamp-2 leading-tight mb-1">{video.title}</h3>
                    <p className="text-xs text-zinc-400 hover:text-white transition-colors">{video.creator}</p>
                    <p className="text-xs text-zinc-400">{(video.views / 1000000).toFixed(1)}M views • {video.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeClone;
