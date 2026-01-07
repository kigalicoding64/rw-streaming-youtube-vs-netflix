
import React from 'react';
import { 
  LayoutDashboard, PlaySquare, BarChart3, MessageSquare, 
  Settings, HelpCircle, ArrowUpRight, ArrowDownRight,
  Upload, Video, Users, Clock, DollarSign
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StudioMetric } from '../../types';

const chartData = [
  { name: 'Mon', views: 4000, subs: 240 },
  { name: 'Tue', views: 3000, subs: 198 },
  { name: 'Wed', views: 2000, subs: 980 },
  { name: 'Thu', views: 2780, subs: 390 },
  { name: 'Fri', views: 1890, subs: 480 },
  { name: 'Sat', views: 2390, subs: 380 },
  { name: 'Sun', views: 3490, subs: 430 },
];

const metrics: StudioMetric[] = [
  { label: 'Current subscribers', value: '142,503', change: '842', trend: 'up' },
  { label: 'Views (last 28 days)', value: '1.2M', change: '12%', trend: 'up' },
  { label: 'Watch time (hours)', value: '45.8K', change: '4%', trend: 'down' },
  { label: 'Estimated revenue', value: '$2,482.00', change: '18%', trend: 'up' },
];

const StudioClone: React.FC = () => {
  return (
    <div className="bg-[#f9f9f9] text-zinc-900 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Studio</span>
          </div>
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search across your channel" 
              className="bg-zinc-100 border border-transparent focus:border-blue-500 focus:bg-white outline-none rounded-md px-4 py-1.5 w-96 transition-all text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
            <Upload size={18} /> Create
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
            <Users size={18} className="text-zinc-500" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col p-2 space-y-1">
          <div className="flex flex-col items-center py-6 gap-2">
            <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden mb-2">
              <img src="https://picsum.photos/seed/avatar/200" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <p className="font-medium text-sm">Tech Insider</p>
            <p className="text-xs text-zinc-500">Your channel</p>
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
            <SidebarItem icon={PlaySquare} label="Content" />
            <SidebarItem icon={BarChart3} label="Analytics" />
            <SidebarItem icon={MessageSquare} label="Comments" />
            <SidebarItem icon={DollarSign} label="Earn" />
            <hr className="my-4 border-zinc-100" />
            <SidebarItem icon={Settings} label="Settings" />
            <SidebarItem icon={HelpCircle} label="Send feedback" />
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Channel dashboard</h2>
            <div className="flex gap-2">
              <button className="bg-white border border-zinc-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-zinc-50">Upload videos</button>
              <button className="bg-white border border-zinc-300 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-zinc-50">Go live</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm text-zinc-500 mb-2">{metric.label}</p>
                <div className="flex items-end gap-3">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <div className={`flex items-center gap-0.5 text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {metric.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Channel analytics</h3>
                <p className="text-sm text-zinc-500">Last 28 days</p>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#71717a'}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#2563eb" fillOpacity={1} fill="url(#colorViews)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                <h3 className="font-bold mb-4">Latest video performance</h3>
                <div className="aspect-video bg-zinc-100 rounded-lg mb-4 overflow-hidden">
                   <img src="https://picsum.photos/seed/latest/400/225" alt="Latest" className="w-full h-full object-cover" />
                </div>
                <p className="font-medium text-sm line-clamp-1 mb-2">Building a Netflix Clone in 10 minutes</p>
                <div className="space-y-2 mt-4">
                   <div className="flex justify-between text-sm">
                     <span className="text-zinc-500">Ranking by views</span>
                     <span>1 of 10</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-zinc-500">Views</span>
                     <span>12,402</span>
                   </div>
                </div>
                <button className="w-full mt-6 py-2 border border-zinc-200 rounded-md text-sm font-medium text-blue-600 hover:bg-zinc-50">Go to video analytics</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={`flex items-center gap-4 px-4 py-2.5 rounded-md cursor-pointer transition-colors ${active ? 'bg-zinc-100 text-blue-600 font-medium' : 'hover:bg-zinc-50 text-zinc-600'}`}>
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </div>
);

export default StudioClone;
