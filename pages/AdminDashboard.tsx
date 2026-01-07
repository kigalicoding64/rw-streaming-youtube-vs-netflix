
import React, { useState } from 'react';
import { 
  Shield, Users, FileText, CheckCircle, XCircle, AlertCircle, 
  BarChart, Settings, UserPlus, FileWarning, Search, Filter, 
  Eye, MoreVertical, Flag, MessageSquare, History, ArrowRight,
  Video, Music, Book as BookIcon, Check, X, Info
} from 'lucide-react';
import { ContentItem, ModerationStatus } from '../types';

// Mock Pending Content
const INITIAL_PENDING_CONTENT: ContentItem[] = [
  {
    id: 'c1',
    type: 'movie',
    title: 'Kigali Night Shift',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=600',
    creator: 'Aimable M.',
    views: 0,
    rating: 0,
    category: 'Action',
    monetization: 'premium',
    description: 'A gritty look at the nighttime economy of Kigali and the heroes who work while the city sleeps.',
    status: 'pending',
    submittedAt: '2024-05-12T10:30:00Z'
  },
  {
    id: 'c2',
    type: 'music',
    title: 'Carolina (Remix)',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
    creator: 'Bruce M.',
    views: 0,
    rating: 0,
    category: 'Pop',
    monetization: 'free',
    description: 'Official remix featuring local guest artists.',
    status: 'pending',
    submittedAt: '2024-05-12T14:15:00Z'
  },
  {
    id: 'c3',
    type: 'book',
    title: 'The Old Hill Legends',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
    creator: 'Gasana J.',
    views: 0,
    rating: 0,
    category: 'History',
    monetization: 'free',
    description: 'A collection of folklore from the Northern Province.',
    status: 'pending',
    submittedAt: '2024-05-11T09:00:00Z'
  }
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users'>('overview');
  const [pendingItems, setPendingItems] = useState<ContentItem[]>(INITIAL_PENDING_CONTENT);
  const [reviewingItem, setReviewingItem] = useState<ContentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showWarningInput, setShowWarningInput] = useState(false);
  const [warningText, setWarningText] = useState('');

  const handleAction = (id: string, action: ModerationStatus, notes?: string, warning?: string) => {
    setPendingItems(prev => prev.filter(item => item.id !== id));
    setReviewingItem(null);
    setRejectionReason('');
    setWarningText('');
    setShowWarningInput(false);
    // In a real app, this would hit an API
    console.log(`Action: ${action} on item ${id}. Notes: ${notes}, Warning: ${warning}`);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20">
            <Shield className="text-red-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Panel <span className="text-red-600">RW</span></h1>
            <p className="text-gray-500 text-sm font-medium">Platform Governance & Content Safety</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={BarChart} />
          <TabButton active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} label="Moderation" icon={FileWarning} />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Users" icon={Users} />
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AdminCard icon={Users} label="Total Users" value="1,245,032" trend="+124 today" />
            <AdminCard icon={FileText} label="Pending Review" value={pendingItems.length.toString()} trend="Critical Priority" warning={pendingItems.length > 5} />
            <AdminCard icon={CheckCircle} label="Active Subs" value="142,503" trend="1.2B RWF Monthly" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                Quick Moderation Queue
              </h3>
              <button onClick={() => setActiveTab('moderation')} className="text-sm font-bold text-red-600 flex items-center gap-1 hover:underline">
                View Full Workspace <ArrowRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/40 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase">Content</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase">Creator</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase">Submitted</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingItems.slice(0, 5).map(item => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item.thumbnail} className="w-12 h-8 object-cover rounded-md" />
                          <span className="font-bold text-sm truncate max-w-[150px]">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.creator}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{new Date(item.submittedAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {setReviewingItem(item); setActiveTab('moderation');}}
                          className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-xs font-black uppercase transition-all shadow-lg shadow-red-600/20"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Moderation Sidebar/Filter */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-500">Filter Items</h4>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search content..." className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2">
                <FilterOption icon={Video} label="Video" count={pendingItems.filter(i => i.type === 'movie').length} active />
                <FilterOption icon={Music} label="Music" count={pendingItems.filter(i => i.type === 'music').length} />
                <FilterOption icon={BookIcon} label="Books" count={pendingItems.filter(i => i.type === 'book').length} />
              </div>
            </div>
            
            <div className="bg-red-600/5 border border-red-600/20 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} className="text-red-600" />
                <h4 className="font-black text-xs uppercase tracking-widest text-red-600">SLA Alert</h4>
              </div>
              <p className="text-xs text-gray-400">Items from 48h ago are highlighted. Please prioritize older submissions to maintain creator satisfaction.</p>
            </div>
          </div>

          {/* Moderation List */}
          <div className="lg:col-span-9 space-y-4">
            {pendingItems.length === 0 ? (
              <div className="h-64 bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center space-y-4">
                <CheckCircle size={48} className="text-green-500 opacity-20" />
                <p className="text-gray-500 font-bold">Queue is clear. Good job!</p>
              </div>
            ) : (
              pendingItems.map(item => (
                <div key={item.id} className={`bg-white/5 border rounded-3xl p-4 flex flex-col md:flex-row gap-6 transition-all hover:bg-white/10 ${reviewingItem?.id === item.id ? 'border-red-600 ring-2 ring-red-600/20 shadow-xl' : 'border-white/10'}`}>
                  <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-black flex-none">
                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-red-600/10 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-red-600/20">Pending Approval</span>
                          <span className="text-[10px] text-gray-500 uppercase font-black">{item.type}</span>
                        </div>
                        <h3 className="text-xl font-black">{item.title}</h3>
                        <p className="text-xs text-gray-400">By <span className="text-white font-bold">{item.creator}</span> • {new Date(item.submittedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                         <button 
                          onClick={() => setReviewingItem(item)}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                         >
                           <Eye size={20} className="text-gray-400" />
                         </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                       <button 
                        onClick={() => handleAction(item.id, 'approved')}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-lg shadow-green-600/20"
                       >
                         <Check size={16} /> Approve
                       </button>
                       <button 
                        onClick={() => setReviewingItem(item)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-black transition-all border border-white/10"
                       >
                         <MessageSquare size={16} /> Full Review
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Full Review Overlay Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase">Review: {reviewingItem.title}</h2>
                  <p className="text-xs text-gray-500">ID: {reviewingItem.id} • Creator: {reviewingItem.creator}</p>
                </div>
              </div>
              <button onClick={() => {setReviewingItem(null); setRejectionReason(''); setShowWarningInput(false);}} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5">
                    <img src={reviewingItem.thumbnail} className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <h4 className="text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Metadata Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <MetaField label="Category" value={reviewingItem.category} />
                      <MetaField label="License" value={reviewingItem.monetization.toUpperCase()} />
                      <MetaField label="Duration" value={reviewingItem.duration || 'N/A'} />
                      <MetaField label="Type" value={reviewingItem.type.toUpperCase()} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Description</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">{reviewingItem.description}</p>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Moderation Action</h4>
                    
                    {!showWarningInput ? (
                      <div className="space-y-4">
                        <textarea 
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Rejection reason or internal notes (mandatory for rejection/flagging)..."
                          className="w-full h-24 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-red-600"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <ActionButton 
                            variant="green" 
                            icon={Check} 
                            label="Approve" 
                            onClick={() => handleAction(reviewingItem.id, 'approved', rejectionReason)} 
                          />
                          <ActionButton 
                            variant="red" 
                            icon={X} 
                            label="Reject" 
                            disabled={!rejectionReason.trim()}
                            onClick={() => handleAction(reviewingItem.id, 'rejected', rejectionReason)} 
                          />
                          <ActionButton 
                            variant="orange" 
                            icon={Flag} 
                            label="Flag for Admin" 
                            disabled={!rejectionReason.trim()}
                            onClick={() => handleAction(reviewingItem.id, 'flagged', rejectionReason)} 
                          />
                          <ActionButton 
                            variant="yellow" 
                            icon={AlertCircle} 
                            label="Add Warning" 
                            onClick={() => setShowWarningInput(true)} 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in slide-in-from-right-4">
                        <p className="text-xs font-bold text-yellow-500">Content will be Approved with a visible warning badge.</p>
                        <input 
                          type="text"
                          value={warningText}
                          onChange={(e) => setWarningText(e.target.value)}
                          placeholder="E.g. Contains Sensitive Content, Strong Language..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-yellow-600"
                        />
                        <div className="flex gap-2">
                           <button 
                            onClick={() => handleAction(reviewingItem.id, 'approved', 'Warning added', warningText)}
                            disabled={!warningText.trim()}
                            className="flex-1 bg-yellow-600 text-black py-2.5 rounded-xl font-black text-xs disabled:opacity-50"
                           >
                             Confirm Approval with Warning
                           </button>
                           <button onClick={() => setShowWarningInput(false)} className="px-4 bg-white/10 rounded-xl text-xs font-black">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500 px-8">
              <span className="flex items-center gap-1"><History size={12} /> Last action: No prior history for this content</span>
              <span className="font-bold">MODERATOR: {process.env.ADMIN_USER || 'ROOT'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-white'}`}
  >
    <Icon size={14} /> {label}
  </button>
);

const FilterOption = ({ icon: Icon, label, count, active }: any) => (
  <button className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
    <div className="flex items-center gap-3">
      <Icon size={16} />
      <span className="text-sm font-bold">{label}</span>
    </div>
    <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded-lg">{count}</span>
  </button>
);

const AdminCard = ({ icon: Icon, label, value, trend, warning }: any) => (
  <div className={`p-8 rounded-[40px] border transition-all ${warning ? 'bg-red-600/5 border-red-600/20 shadow-lg shadow-red-600/5' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
     <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl ${warning ? 'bg-red-600 text-white' : 'bg-white text-black shadow-lg'}`}>
          <Icon size={24} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${warning ? 'text-red-600 animate-pulse' : 'text-green-500'}`}>{trend}</span>
     </div>
     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
     <h4 className="text-3xl font-black tracking-tight">{value}</h4>
  </div>
);

const MetaField = ({ label, value }: any) => (
  <div>
    <p className="text-[10px] text-gray-500 font-black uppercase mb-0.5">{label}</p>
    <p className="text-xs font-bold text-gray-200">{value}</p>
  </div>
);

const ActionButton = ({ variant, icon: Icon, label, onClick, disabled }: any) => {
  const styles = {
    green: "bg-green-600/10 text-green-500 border-green-600/20 hover:bg-green-600 hover:text-white shadow-green-600/20",
    red: "bg-red-600/10 text-red-600 border-red-600/20 hover:bg-red-600 hover:text-white shadow-red-600/20",
    orange: "bg-orange-600/10 text-orange-600 border-orange-600/20 hover:bg-orange-600 hover:text-white shadow-orange-600/20",
    yellow: "bg-yellow-600/10 text-yellow-500 border-yellow-600/20 hover:bg-yellow-600 hover:text-black shadow-yellow-600/20",
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 border px-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex-1 justify-center disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit ${styles[variant as keyof typeof styles]}`}
    >
      <Icon size={14} /> {label}
    </button>
  );
};

export default AdminDashboard;
