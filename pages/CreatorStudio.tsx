
import React, { useState } from 'react';
import { LayoutDashboard, Upload, BarChart3, MessageSquare, DollarSign, Settings, Plus, Video, Music, Book, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jan', earnings: 4000 },
  { name: 'Feb', earnings: 3000 },
  { name: 'Mar', earnings: 5000 },
  { name: 'Apr', earnings: 4500 },
  { name: 'May', earnings: 6000 },
  { name: 'Jun', earnings: 5500 },
];

const CreatorStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  return (
    <div className="p-8 space-y-8 bg-zinc-950 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black">Creator Studio <span className="text-red-600">RW</span></h1>
          <p className="text-gray-500 text-sm mt-1">Manage your channel, uploads, and earnings.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
            <BarChart3 size={18} /> Analytics
          </button>
          <button className="bg-red-600 px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
            <Plus size={18} /> Upload Content
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Subscribers" value="45,203" change="+12%" />
        <StatCard label="Total Views" value="1.2M" change="+5.4%" />
        <StatCard label="Estimated Revenue" value="2,450,000 RWF" change="+18.2%" isMoney />
        <StatCard label="Avg. Watch Time" value="12m 45s" change="-2.1%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black">Inyungu mu mafranga (Earnings Trend)</h3>
            <select className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
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
                <Area type="monotone" dataKey="earnings" stroke="#ef4444" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-black mb-6">Recent Uploads</h3>
            <div className="space-y-4">
              <RecentItem icon={Video} title="Life in Kigali" status="Published" date="2h ago" />
              <RecentItem icon={Music} title="Gakondo Rhythms" status="Processing" date="5h ago" />
              <RecentItem icon={Book} title="Mountain Spirits" status="Draft" date="Yesterday" />
            </div>
            <button className="w-full mt-6 py-3 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/5 transition-all">See All Content</button>
          </div>

          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-6 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <h4 className="font-black text-xl">Upgrade to Premium Creator</h4>
              <p className="text-sm text-gray-400">Get advanced analytics, custom branding, and lower platform fees.</p>
              <button className="px-6 py-2.5 bg-white text-black rounded-xl font-black text-xs hover:scale-105 transition-transform">Learn More</button>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
              <DollarSign size={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, change, isMoney }: any) => (
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
  <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer">
    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5">
      <Icon size={20} className="text-red-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm truncate">{title}</p>
      <p className="text-[10px] text-gray-500">{date}</p>
    </div>
    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${status === 'Published' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{status}</span>
  </div>
);

export default CreatorStudio;
