
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Upload, BarChart3, MessageSquare, DollarSign, Settings, Plus, Video, Music, Book, ArrowUpRight, X } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api';
import { ContentItem, ContentType } from '../types';

const CreatorStudio: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [recentUploads, setRecentUploads] = useState<ContentItem[]>([]);
  const [user, setUser] = useState(api.getCurrentUser());

  // Upload Form State
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    type: 'movie' as ContentType,
    category: 'Entertainment',
    monetization: 'free' as any,
    thumbnail: 'https://picsum.photos/seed/newcontent/800/600'
  });

  useEffect(() => {
    refreshContent();
  }, []);

  const refreshContent = async () => {
    const all = await api.getAllContent();
    // Filter for current creator only
    setRecentUploads(all.filter(i => i.creator === user?.name).reverse());
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    await api.uploadContent({
      ...newContent,
      creator: user.name,
      views: 0,
      rating: 0
    });
    
    setShowUpload(false);
    refreshContent();
    setNewContent({
      title: '',
      description: '',
      type: 'movie',
      category: 'Entertainment',
      monetization: 'free',
      thumbnail: 'https://picsum.photos/seed/newcontent/800/600'
    });
  };

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-full pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black">Creator Studio <span className="text-red-600">RW</span></h1>
          <p className="text-gray-500 text-sm mt-1">Hello, {user?.name}. Manage your channel and analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <BarChart3 size={18} /> Analytics
          </button>
          <button onClick={() => setShowUpload(true)} className="bg-red-600 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
            <Plus size={18} /> Upload Content
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Subscribers" value="45,203" change="+12%" />
        <StatCard label="Total Views" value="1.2M" change="+5.4%" />
        <StatCard label="Earnings" value={`${user?.credits.toLocaleString()} RWF`} change="+18.2%" />
        <StatCard label="Watch Time" value="12m 45s" change="-2.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">Performance Trend</h3>
            <select className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', views: 4000 },
                { name: 'Tue', views: 3000 },
                { name: 'Wed', views: 5000 },
                { name: 'Thu', views: 4500 },
                { name: 'Fri', views: 6000 },
                { name: 'Sat', views: 5500 },
                { name: 'Sun', views: 7000 },
              ]}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#000', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}} />
                <Area type="monotone" dataKey="views" stroke="#ef4444" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-black mb-6">Your Content</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
              {recentUploads.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm italic">You haven't uploaded anything yet.</div>
              ) : (
                recentUploads.map(item => (
                  <RecentItem 
                    key={item.id}
                    icon={item.type === 'movie' ? Video : item.type === 'music' ? Music : Book} 
                    title={item.title} 
                    status={item.status} 
                    date={new Date(item.submittedAt).toLocaleDateString()} 
                  />
                ))
              )}
            </div>
            <button onClick={refreshContent} className="w-full mt-6 py-3 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/5 transition-all">Refresh List</button>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-6">
            <div className="relative z-10 space-y-4">
              <h4 className="font-black text-xl">Monetization Ready</h4>
              <p className="text-sm text-gray-400">Your content is currently reaching {recentUploads.reduce((acc, i) => acc + i.views, 0)} viewers.</p>
              <button className="px-6 py-2.5 bg-white text-black rounded-xl font-black text-xs hover:scale-105 transition-transform">Payout Settings</button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-xl rounded-[40px] border border-white/10 p-8 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Upload Content</h2>
              <button onClick={() => setShowUpload(false)} className="p-2 hover:bg-white/5 rounded-full"><X/></button>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Title</label>
                <input 
                  required
                  value={newContent.title}
                  onChange={e => setNewContent({...newContent, title: e.target.value})}
                  type="text" 
                  placeholder="Enter a catchy title..." 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-500">Content Type</label>
                  <select 
                    value={newContent.type}
                    onChange={e => setNewContent({...newContent, type: e.target.value as ContentType})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none"
                  >
                    <option value="movie">Movie / Video</option>
                    <option value="music">Song / Audio</option>
                    <option value="book">E-Book / PDF</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-500">Monetization</label>
                  <select 
                    value={newContent.monetization}
                    onChange={e => setNewContent({...newContent, monetization: e.target.value as any})}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 outline-none"
                  >
                    <option value="free">Free for All</option>
                    <option value="premium">Subscription Only</option>
                    <option value="ppv">Pay Per View</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-500">Description</label>
                <textarea 
                  value={newContent.description}
                  onChange={e => setNewContent({...newContent, description: e.target.value})}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 outline-none focus:border-red-600"
                  placeholder="What is this about?"
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-red-600 py-4 rounded-3xl font-black text-sm shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all">SUBMIT FOR REVIEW</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, change }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-red-600/50 transition-colors">
    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-2xl font-black">{value}</h4>
      <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-lg">
        <ArrowUpRight size={14} /> {change}
      </div>
    </div>
  </div>
);

const RecentItem = ({ icon: Icon, title, status, date }: any) => (
  <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all">
    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5">
      <Icon size={20} className="text-red-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm truncate">{title}</p>
      <p className="text-[10px] text-gray-500">{date}</p>
    </div>
    <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase ${
      status === 'approved' ? 'bg-green-500/10 text-green-500' : 
      status === 'rejected' ? 'bg-red-500/10 text-red-500' :
      'bg-yellow-500/10 text-yellow-500 animate-pulse'
    }`}>{status}</span>
  </div>
);

export default CreatorStudio;
