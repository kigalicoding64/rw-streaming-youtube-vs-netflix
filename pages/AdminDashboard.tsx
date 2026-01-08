
import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, FileText, CheckCircle, CheckCircle2, XCircle, AlertCircle, 
  BarChart, Settings, UserPlus, FileWarning, Search, Filter, 
  Eye, MoreVertical, Flag, MessageSquare, History, ArrowRight,
  Video, Music, Book as BookIcon, Check, X, Info, UserX, UserCheck, Clock, DollarSign
} from 'lucide-react';
import { ContentItem, ModerationStatus, User, ModerationLog } from '../types';
import { api } from '../services/api';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'users' | 'logs'>('overview');
  const [pendingItems, setPendingItems] = useState<ContentItem[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [reviewingItem, setReviewingItem] = useState<ContentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showWarningInput, setShowWarningInput] = useState(false);
  const [warningText, setWarningText] = useState('');
  
  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [contentFilter, setContentFilter] = useState<'all' | 'movie' | 'music' | 'book'>('all');

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const allContent = await api.getAllContent();
    setPendingItems(allContent.filter(i => i.status === 'pending'));
    setAllUsers(await api.getAllUsers());
    setLogs(await api.getModerationLogs());
  };

  const handleAction = async (id: string, action: ModerationStatus, notes?: string, warning?: string) => {
    await api.moderateContent(id, action, notes, warning);
    setReviewingItem(null);
    setRejectionReason('');
    setWarningText('');
    setShowWarningInput(false);
    refreshData();
  };

  const handleToggleSuspension = async (userId: string) => {
    await api.toggleUserSuspension(userId);
    refreshData();
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredModeration = pendingItems.filter(i => 
    contentFilter === 'all' || i.type === contentFilter
  );

  return (
    <div className="p-4 md:p-8 space-y-8 bg-zinc-950 min-h-screen pb-24">
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
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" icon={BarChart} />
          <TabButton active={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} label="Moderation" icon={FileWarning} />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Users" icon={Users} />
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} label="Audit Log" icon={History} />
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminCard icon={Users} label="Total Users" value={allUsers.length.toLocaleString()} trend={`${allUsers.filter(u => !u.isSuspended).length} Active`} />
            <AdminCard icon={FileText} label="Pending Review" value={pendingItems.length.toString()} trend="Action Required" warning={pendingItems.length > 0} />
            <AdminCard icon={CheckCircle} label="Active Subs" value={allUsers.filter(u => u.subscription !== 'none').length.toString()} trend="Paying Customers" />
            <AdminCard icon={DollarSign} label="Recent Revenue" value="1.2M RWF" trend="Last 30 days" />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                Moderation Queue Summary
              </h3>
              <button onClick={() => setActiveTab('moderation')} className="text-sm font-bold text-red-600 flex items-center gap-1 hover:underline">
                View Full Queue <ArrowRight size={16} />
              </button>
            </div>
            {pendingItems.length === 0 ? (
              <div className="py-10 text-center text-gray-500">All caught up! No content pending review.</div>
            ) : (
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
            )}
          </div>
        </>
      )}

      {activeTab === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-gray-500">Filter Items</h4>
              <div className="space-y-2">
                <FilterOption icon={CheckCircle} label="All Types" count={pendingItems.length} active={contentFilter === 'all'} onClick={() => setContentFilter('all')} />
                <FilterOption icon={Video} label="Video" count={pendingItems.filter(i => i.type === 'movie').length} active={contentFilter === 'movie'} onClick={() => setContentFilter('movie')} />
                <FilterOption icon={Music} label="Music" count={pendingItems.filter(i => i.type === 'music').length} active={contentFilter === 'music'} onClick={() => setContentFilter('music')} />
                <FilterOption icon={BookIcon} label="Books" count={pendingItems.filter(i => i.type === 'book').length} active={contentFilter === 'book'} onClick={() => setContentFilter('book')} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-4">
            {filteredModeration.length === 0 ? (
              <div className="h-64 bg-white/5 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center space-y-4">
                <CheckCircle size={48} className="text-green-500 opacity-20" />
                <p className="text-gray-500 font-bold">Queue is clear.</p>
              </div>
            ) : (
              filteredModeration.map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col md:flex-row gap-6 transition-all hover:bg-white/10">
                  <div className="w-full md:w-48 aspect-video rounded-2xl overflow-hidden bg-black flex-none">
                    <img src={item.thumbnail} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-red-600/10 text-red-600 px-2 py-0.5 rounded text-[10px] font-black uppercase border border-red-600/20">Pending Approval</span>
                          <span className="text-[10px] text-gray-500 uppercase font-black">{item.type}</span>
                        </div>
                        <h3 className="text-xl font-black">{item.title}</h3>
                        <p className="text-xs text-gray-400">By <span className="text-white font-bold">{item.creator}</span> • {new Date(item.submittedAt).toLocaleString()}</p>
                      </div>
                      <button onClick={() => setReviewingItem(item)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                        <Eye size={20} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                       <button onClick={() => handleAction(item.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-black transition-all">Approve</button>
                       <button onClick={() => setReviewingItem(item)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-black transition-all border border-white/10">Review Details</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name or email..." 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-red-600 transition-all"
                />
             </div>
             <div className="flex gap-2">
               <button className="bg-red-600 px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 shadow-lg shadow-red-600/20">
                 <UserPlus size={16} /> Add New Admin
               </button>
             </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">User Details</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Credits</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Subscription</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(user => (
                  <tr key={user.id} className={`hover:bg-white/5 transition-colors ${user.isSuspended ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center font-bold text-xs border border-white/10">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm flex items-center gap-2">
                            {user.name}
                            {user.isSuspended && <span className="bg-red-600/20 text-red-600 px-2 py-0.5 rounded text-[8px] uppercase tracking-tighter">Suspended</span>}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${user.role === 'admin' ? 'bg-red-600/10 border-red-600/20 text-red-600' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-sm text-yellow-500">{user.credits.toLocaleString()} RWF</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                        {/* Fix: use CheckCircle2 which is now imported */}
                        <CheckCircle2 size={14} className={user.subscription !== 'none' ? 'text-green-500' : 'text-gray-600'} />
                        {user.subscription.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400"><Settings size={18}/></button>
                        <button 
                          onClick={() => handleToggleSuspension(user.id)}
                          className={`p-2 rounded-lg transition-colors ${user.isSuspended ? 'bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white' : 'bg-red-600/20 text-red-600 hover:bg-red-600 hover:text-white'}`}
                        >
                          {user.isSuspended ? <UserCheck size={18}/> : <UserX size={18}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/40">
            <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">Audit Log</h3>
            <span className="text-xs font-bold text-gray-500">{logs.length} Entries recorded</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 border-b border-white/10">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase">Timestamp</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase">Admin</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase">Content</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase">Action</th>
                  <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-4 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2"><Clock size={12}/> {new Date(log.timestamp).toLocaleString()}</div>
                    </td>
                    <td className="px-8 py-4 font-bold text-sm text-gray-200">{log.adminName}</td>
                    <td className="px-8 py-4 font-bold text-sm text-gray-300">{log.contentTitle}</td>
                    <td className="px-8 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        log.action === 'approved' ? 'bg-green-600/20 text-green-500' : 
                        log.action === 'rejected' ? 'bg-red-600/20 text-red-600' :
                        log.action === 'flagged' ? 'bg-orange-600/20 text-orange-500' :
                        'bg-yellow-600/20 text-yellow-500'
                      }`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-xs text-gray-500 italic max-w-xs truncate">{log.reason || 'No notes provided'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 w-full max-w-4xl rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase">Review: {reviewingItem.title}</h2>
                  <p className="text-xs text-gray-500">Creator: {reviewingItem.creator}</p>
                </div>
              </div>
              <button onClick={() => {setReviewingItem(null); setRejectionReason(''); setShowWarningInput(false);}} className="p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-video rounded-3xl overflow-hidden bg-black border border-white/5">
                  <img src={reviewingItem.thumbnail} className="w-full h-full object-cover" />
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase mb-2">Technical Info</h4>
                  <div className="grid grid-cols-2 gap-y-4">
                    <MetaField label="Category" value={reviewingItem.category} />
                    <MetaField label="Monetization" value={reviewingItem.monetization.toUpperCase()} />
                    <MetaField label="Type" value={reviewingItem.type.toUpperCase()} />
                    <MetaField label="Date Submitted" value={new Date(reviewingItem.submittedAt).toLocaleDateString()} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-gray-500 uppercase mb-2">Description</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{reviewingItem.description || "No description provided."}</p>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Moderation Action</h4>
                  {!showWarningInput ? (
                    <>
                      <textarea 
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Decision notes (required for rejection/flagging)..."
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-red-600"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <ActionButton variant="green" icon={Check} label="Approve" onClick={() => handleAction(reviewingItem.id, 'approved', rejectionReason)} />
                        <ActionButton variant="red" icon={X} label="Reject" disabled={!rejectionReason.trim()} onClick={() => handleAction(reviewingItem.id, 'rejected', rejectionReason)} />
                        <ActionButton variant="orange" icon={Flag} label="Flag" disabled={!rejectionReason.trim()} onClick={() => handleAction(reviewingItem.id, 'flagged', rejectionReason)} />
                        <ActionButton variant="yellow" icon={AlertCircle} label="Warn" onClick={() => setShowWarningInput(true)} />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 p-4 bg-yellow-600/5 rounded-2xl border border-yellow-600/20">
                      <p className="text-xs font-bold text-yellow-500 italic">This content will be approved with a visible content warning.</p>
                      <input 
                        type="text"
                        value={warningText}
                        onChange={(e) => setWarningText(e.target.value)}
                        placeholder="Warning message (e.g. Sensitive Content)..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-yellow-600"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleAction(reviewingItem.id, 'approved', 'Warning added', warningText)} disabled={!warningText.trim()} className="flex-1 bg-yellow-600 text-black py-2 rounded-xl font-black text-xs">Confirm</button>
                        <button onClick={() => setShowWarningInput(false)} className="px-4 bg-white/10 rounded-xl text-xs font-black">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal Sub-components
const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all whitespace-nowrap ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-500 hover:text-white'}`}>
    <Icon size={14} /> {label}
  </button>
);

const FilterOption = ({ icon: Icon, label, count, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all ${active ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:bg-white/5'}`}>
    <div className="flex items-center gap-3">
      <Icon size={16} />
      <span className="text-sm font-bold">{label}</span>
    </div>
    <span className="text-[10px] font-black bg-black/40 px-2 py-0.5 rounded-lg">{count}</span>
  </button>
);

const AdminCard = ({ icon: Icon, label, value, trend, warning }: any) => (
  <div className={`p-6 rounded-[40px] border transition-all ${warning ? 'bg-red-600/5 border-red-600/20' : 'bg-white/5 border-white/10'}`}>
     <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${warning ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white text-black'}`}>
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${warning ? 'text-red-600' : 'text-green-500'}`}>{trend}</span>
     </div>
     <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
     <h4 className="text-2xl font-black">{value}</h4>
  </div>
);

const MetaField = ({ label, value }: any) => (
  <div>
    <p className="text-[10px] text-gray-500 font-black uppercase mb-0.5">{label}</p>
    <p className="text-xs font-bold text-gray-200">{value}</p>
  </div>
);

const ActionButton = ({ variant, icon: Icon, label, onClick, disabled }: any) => {
  const styles: any = {
    green: "bg-green-600/10 text-green-500 border-green-600/20 hover:bg-green-600 hover:text-white",
    red: "bg-red-600/10 text-red-600 border-red-600/20 hover:bg-red-600 hover:text-white",
    orange: "bg-orange-600/10 text-orange-600 border-orange-600/20 hover:bg-orange-600 hover:text-white",
    yellow: "bg-yellow-600/10 text-yellow-500 border-yellow-600/20 hover:bg-yellow-600 hover:text-black",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`flex flex-col items-center justify-center gap-2 border p-3 rounded-2xl text-[10px] font-black uppercase transition-all disabled:opacity-20 ${styles[variant]}`}>
      <Icon size={18} /> {label}
    </button>
  );
};

export default AdminDashboard;
