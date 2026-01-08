
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Upload, BarChart3, MessageSquare, DollarSign, 
  Settings, Plus, Video, Music, Book, ArrowUpRight, ArrowDownRight,
  X, Globe, Sparkles, Filter, MoreVertical, Play, Eye, 
  Clock, Share2, Languages, ShieldCheck, Zap, Layers, Smartphone,
  FileText, CheckCircle2, ChevronRight, AlertTriangle, FileAudio,
  Type, Info, Search, Calendar, ChevronLeft, Loader2, Wallet
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { api } from '../services/api';
import { ContentItem, ContentType, StudioMetric, LanguageCode, ProcessingTask, MonetizationType } from '../types';
import { kero } from '../services/gemini';

type StudioTab = 'dashboard' | 'content' | 'analytics' | 'monetization' | 'translations' | 'ai-tools';

const CreatorStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('dashboard');
  const [showUpload, setShowUpload] = useState(false);
  const [user, setUser] = useState(api.getCurrentUser());
  const [content, setContent] = useState<ContentItem[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const all = await api.getAllContent();
    const creatorContent = all.filter(i => i.creator === user?.name);
    setContent(creatorContent);
    if (creatorContent.length > 0) generateInsights(creatorContent);
  };

  const generateInsights = async (items: ContentItem[]) => {
    setIsAnalyzing(true);
    const metrics = { totalViews: items.reduce((acc, i) => acc + i.views, 0), count: items.length, types: items.map(i => i.type) };
    const response = await kero.analyzeContentPerformance(metrics);
    setAiInsights(response);
    setIsAnalyzing(false);
  };

  const renderTab = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView content={content} aiInsights={aiInsights} isAnalyzing={isAnalyzing} />;
      case 'content': return <ContentView content={content} />;
      case 'analytics': return <AnalyticsView content={content} />;
      case 'monetization': return <MonetizationView content={content} user={user} />;
      case 'translations': return <TranslationsView content={content} />;
      case 'ai-tools': return <AiToolsView />;
      default: return <DashboardView content={content} aiInsights={aiInsights} isAnalyzing={isAnalyzing} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <aside className="w-64 border-r border-white/5 bg-[#080808] flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center font-black italic shadow-lg shadow-red-600/20">R</div>
            <span className="text-xl font-black tracking-tighter uppercase">Studio <span className="text-red-600">RW</span></span>
          </div>
          <nav className="space-y-1">
            <SideNavItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SideNavItem icon={Layers} label="Content" active={activeTab === 'content'} onClick={() => setActiveTab('content')} />
            <SideNavItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <SideNavItem icon={DollarSign} label="Monetization" active={activeTab === 'monetization'} onClick={() => setActiveTab('monetization')} />
            <SideNavItem icon={Languages} label="Translations" active={activeTab === 'translations'} onClick={() => setActiveTab('translations')} />
            <SideNavItem icon={Sparkles} label="Kero AI Tools" active={activeTab === 'ai-tools'} onClick={() => setActiveTab('ai-tools')} />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-white/5 bg-black/40">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 border border-white/10" />
             <div className="min-w-0">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 font-black uppercase">Verified Creator</p>
             </div>
          </div>
          <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2">
            <Settings size={14} /> Settings
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md flex items-center justify-between px-10 flex-none z-10">
           <h2 className="text-2xl font-black tracking-tight capitalize">{activeTab.replace('-', ' ')}</h2>
           <div className="flex items-center gap-4">
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all"><Share2 size={20}/></button>
              <button 
                onClick={() => setShowUpload(true)}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-[20px] font-black text-sm flex items-center gap-2 shadow-xl shadow-red-600/20 transition-all active:scale-95"
              >
                <Plus size={20} /> SMART WIZARD
              </button>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto no-scrollbar p-10 bg-gradient-to-b from-[#080808] to-[#050505]">
          {renderTab()}
        </div>
      </main>

      {showUpload && <UploadWizard onClose={() => {setShowUpload(false); loadData();}} user={user} />}
    </div>
  );
};

// --- ADVANCED UPLOAD WIZARD COMPONENT ---
const UploadWizard: React.FC<{ onClose: () => void, user: any }> = ({ onClose, user }) => {
  const [step, setStep] = useState(0); // 0 to 6
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingTasks, setProcessingTasks] = useState<ProcessingTask[]>([
    { id: '1', name: 'Language Detection', status: 'waiting', progress: 0 },
    { id: '2', name: 'HLS Transcoding', status: 'waiting', progress: 0 },
    { id: '3', name: 'Audio Normalization', status: 'waiting', progress: 0 },
    { id: '4', name: 'Thumbnail Generation', status: 'waiting', progress: 0 },
    { id: '5', name: 'Copyright Scan', status: 'waiting', progress: 0 }
  ]);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: 'Entertainment',
    originalLanguage: 'rw' as LanguageCode,
    tags: [] as string[]
  });
  const [monetization, setMonetization] = useState<MonetizationType>('free');
  const [price, setPrice] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);

  // Simulation: Progress Upload
  useEffect(() => {
    if (step === 1 && uploadProgress < 100) {
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setStep(2);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [step, uploadProgress]);

  // Simulation: AI Processing Tasks
  useEffect(() => {
    if (step === 2) {
      let currentTaskIdx = 0;
      const timer = setInterval(() => {
        setProcessingTasks(prev => {
          const newTasks = [...prev];
          const task = newTasks[currentTaskIdx];
          if (task.progress < 100) {
            task.status = 'processing';
            task.progress += 20;
          } else {
            task.status = 'completed';
            if (currentTaskIdx < newTasks.length - 1) {
              currentTaskIdx++;
            } else {
              clearInterval(timer);
              setTimeout(() => setStep(3), 1000);
            }
          }
          return newTasks;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleFinalPublish = async () => {
    setIsPublishing(true);
    await api.uploadContent({
      ...metadata,
      type: contentType || 'movie',
      monetization,
      creator: user.name,
      thumbnail: `https://picsum.photos/seed/${metadata.title}/800/450`,
      monetizationSettings: {
        enableAds: monetization === 'ads' || monetization === 'hybrid',
        ppvPrice: monetization === 'ppv' ? price : 0,
        creditsPrice: monetization === 'credits' ? price : 0
      }
    });
    setIsPublishing(false);
    onClose();
  };

  const steps = [
    "Format Selection",
    "Smart Upload",
    "AI Processing",
    "Details & Local",
    "Monetization",
    "Visibility",
    "Final Review"
  ];

  return (
    <div className="fixed inset-0 z-[2500] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4">
       <div className="bg-[#0c0c0c] w-full max-w-5xl rounded-[48px] border border-white/5 flex flex-col h-[85vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header & Progress */}
          <header className="p-8 border-b border-white/5 flex items-center justify-between flex-none bg-[#0a0a0a]">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
                   <Upload className="text-white" size={24} />
                </div>
                <div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter">REBALIVE <span className="text-red-600">UPLOAD</span> WIZARD</h3>
                   <div className="flex items-center gap-2 mt-1">
                      {steps.map((s, i) => (
                        <React.Fragment key={s}>
                           <div className={`text-[10px] font-black uppercase tracking-widest ${i <= step ? 'text-red-600' : 'text-gray-600'}`}>{s}</div>
                           {i < steps.length - 1 && <div className="w-4 h-px bg-white/5" />}
                        </React.Fragment>
                      ))}
                   </div>
                </div>
             </div>
             <button onClick={onClose} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all group">
                <X className="group-hover:rotate-90 transition-transform" />
             </button>
          </header>

          {/* Step Body */}
          <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
             {step === 0 && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="text-center space-y-2">
                     <h2 className="text-4xl font-black uppercase italic tracking-tighter">Select your format</h2>
                     <p className="text-gray-500 max-w-lg mx-auto">RebaLive RW supports multi-format distribution. Choose how you want to reach your audience.</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                     <SelectionCard icon={Video} title="Long Video" sub="Movies, shows, documentaries" active={contentType === 'movie'} onClick={() => {setContentType('movie'); setStep(1);}} />
                     <SelectionCard icon={Layers} title="Shorts" sub="Viral clips, highlights, loops" active={contentType === 'short'} onClick={() => {setContentType('short'); setStep(1);}} />
                     <SelectionCard icon={FileAudio} title="Audio/Podcast" sub="Music, stories, interviews" active={contentType === 'music'} onClick={() => {setContentType('music'); setStep(1);}} />
                     <SelectionCard icon={Book} title="Book/PDF" sub="Literature, scripts, educational" active={contentType === 'book'} onClick={() => {setContentType('book'); setStep(1);}} />
                     <SelectionCard icon={FileText} title="Article" sub="Blog posts, news, journals" active={contentType === 'article'} onClick={() => {setContentType('article'); setStep(1);}} />
                     <SelectionCard icon={Play} title="Live Event" sub="Concerts, matches, sessions" active={contentType === 'tv_channel'} onClick={() => {setContentType('tv_channel'); setStep(1);}} />
                  </div>
               </div>
             )}

             {step === 1 && (
               <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in fade-in duration-500">
                  <div className="w-full max-w-xl aspect-video rounded-[40px] border-4 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 group hover:border-red-600/20 transition-all bg-white/5 relative overflow-hidden">
                     {uploadProgress > 0 && <div className="absolute bottom-0 left-0 h-1.5 bg-red-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />}
                     <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                        <Upload size={40} className="text-white" />
                     </div>
                     <div className="text-center">
                        <h3 className="text-xl font-black uppercase">Dropping File...</h3>
                        <p className="text-sm text-gray-500">Kero AI is analyzing file headers ({uploadProgress}%)</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 bg-zinc-900 p-6 rounded-3xl border border-white/5 w-full max-w-md">
                     <Smartphone className="text-blue-500" />
                     <div className="flex-1">
                        <h4 className="text-sm font-bold">Low-Bandwidth Mode</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Optimized for Rwandan mobile networks</p>
                     </div>
                     <button onClick={() => setIsLowBandwidth(!isLowBandwidth)} className={`w-12 h-6 rounded-full p-1 transition-colors ${isLowBandwidth ? 'bg-red-600' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isLowBandwidth ? 'translate-x-6' : 'translate-x-0'}`} />
                     </button>
                  </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                     <div className="space-y-1">
                        <h2 className="text-3xl font-black uppercase tracking-tighter">AI Production Pipeline</h2>
                        <p className="text-gray-500">Kero is automatically preparing your content for the national library.</p>
                     </div>
                     <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center animate-spin">
                        <Loader2 className="text-blue-600" size={24} />
                     </div>
                  </div>
                  <div className="space-y-4">
                     {processingTasks.map(task => (
                        <div key={task.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.status === 'completed' ? 'bg-green-600 text-white' : 'bg-white/10 text-gray-500'}`}>
                                 {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                              </div>
                              <span className="font-bold text-sm tracking-tight">{task.name}</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${task.progress}%` }} />
                              </div>
                              <span className="text-[10px] font-black uppercase text-gray-500">{task.status}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-10 animate-in fade-in duration-500 pb-20">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 flex items-center gap-2">
                              Content Title <Sparkles size={12} className="text-red-600" />
                           </label>
                           <input 
                              type="text" 
                              value={metadata.title}
                              onChange={e => setMetadata({...metadata, title: e.target.value})}
                              placeholder="Kero suggests: 'Kigali Nights: The New Awakening'"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 outline-none focus:border-red-600 transition-all font-bold text-xl"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Description</label>
                           <textarea 
                              value={metadata.description}
                              onChange={e => setMetadata({...metadata, description: e.target.value})}
                              placeholder="Tell the world about your work..."
                              className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 outline-none focus:border-red-600 transition-all leading-relaxed text-gray-300"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Category</label>
                              <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-bold">
                                 <option>Entertainment</option>
                                 <option>Education</option>
                                 <option>Cultural/Traditional</option>
                                 <option>News & Media</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Original Language</label>
                              <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none font-bold">
                                 <option value="rw">Ikinyarwanda</option>
                                 <option value="en">English</option>
                                 <option value="fr">Français</option>
                                 <option value="sw">Kiswahili</option>
                              </select>
                           </div>
                        </div>
                     </div>
                     <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-red-600/10 to-blue-600/10 border border-white/5 p-8 rounded-[40px] space-y-6">
                           <div className="flex items-center gap-3">
                              <Languages className="text-red-600" />
                              <h4 className="font-black text-xs uppercase tracking-widest">Localization Engine</h4>
                           </div>
                           <p className="text-xs text-gray-500 leading-tight">AI will auto-translate metadata into 5 target languages for global reach.</p>
                           <div className="space-y-2">
                              <LangBadge lang="RW (Original)" status="verified" />
                              <LangBadge lang="EN (Global)" status="ai" />
                              <LangBadge lang="FR (Francophone)" status="ai" />
                              <LangBadge lang="SW (East Africa)" status="waiting" />
                           </div>
                           <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Manual Edit</button>
                        </div>
                        <div className="aspect-video bg-zinc-900 rounded-3xl border border-white/10 flex items-center justify-center relative group overflow-hidden">
                           <div className="absolute top-2 right-2 flex gap-1">
                              <button className="p-2 bg-black/60 rounded-lg"><Upload size={14}/></button>
                           </div>
                           <p className="text-[10px] font-black text-gray-700 uppercase">Thumbnail Preview</p>
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {step === 4 && (
               <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="text-center space-y-2">
                     <h2 className="text-4xl font-black uppercase italic tracking-tighter">Monetization Studio</h2>
                     <p className="text-gray-500">How would you like to earn from this masterpiece?</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <SelectionCard icon={Info} title="Free / Ad-Supported" sub="Reach maximum audience" active={monetization === 'free'} onClick={() => setMonetization('free')} />
                     <SelectionCard icon={DollarSign} title="Pay-Per-View (PPV)" sub="One-time ticket access" active={monetization === 'ppv'} onClick={() => setMonetization('ppv')} />
                     <SelectionCard icon={ShieldCheck} title="Subscription" sub="Exclusive for your members" active={monetization === 'premium'} onClick={() => setMonetization('premium')} />
                     <SelectionCard icon={Wallet} title="Credits System" sub="Spend RebaLive Credits" active={monetization === 'credits'} onClick={() => setMonetization('credits')} />
                  </div>
                  {(monetization === 'ppv' || monetization === 'credits') && (
                    <div className="max-w-md mx-auto space-y-4 p-8 bg-white/5 rounded-[40px] border border-white/10 text-center animate-in zoom-in-95">
                       <label className="text-xs font-black uppercase text-gray-500 tracking-widest">Set your price (RWF)</label>
                       <input 
                        type="number" 
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded-2xl p-6 text-3xl font-black text-center text-green-500 outline-none"
                       />
                       <p className="text-xs text-gray-600">Platform fee: 15%</p>
                    </div>
                  )}
               </div>
             )}

             {step === 5 && (
               <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="text-center space-y-2">
                     <h2 className="text-4xl font-black uppercase italic tracking-tighter">Visibility & Launch</h2>
                     <p className="text-gray-500">Define your release strategy.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                     <VisibilityOption title="Public" sub="Available to everyone" active={true} />
                     <VisibilityOption title="Private" sub="Only for chosen fans" />
                     <VisibilityOption title="Scheduled" sub="Release at specific time" icon={Calendar} />
                  </div>
                  <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-[40px] max-w-2xl mx-auto space-y-4">
                     <div className="flex items-center gap-3">
                        <Share2 className="text-blue-500" />
                        <h4 className="font-black text-sm uppercase">Auto-Promotion</h4>
                     </div>
                     <p className="text-xs text-gray-400">Kero will automatically create 5 short clips and post them to 'Shorts' to drive traffic to this main item.</p>
                     <div className="flex gap-2">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase">Enable</button>
                        <button className="px-6 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase">Settings</button>
                     </div>
                  </div>
               </div>
             )}

             {step === 6 && (
               <div className="space-y-10 animate-in fade-in duration-500">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[48px] overflow-hidden">
                     <div className="p-12 space-y-8">
                        <div className="flex flex-col md:flex-row gap-12">
                           <div className="w-full md:w-80 aspect-video rounded-3xl overflow-hidden bg-black flex-none relative">
                              <img src={`https://picsum.photos/seed/${metadata.title}/800/450`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                 <Play fill="white" />
                              </div>
                           </div>
                           <div className="space-y-6 flex-1">
                              <div>
                                 <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">{contentType}</span>
                                 <h2 className="text-4xl font-black italic tracking-tighter uppercase">{metadata.title || "Untilted Masterpiece"}</h2>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                 <ReviewTag label={metadata.category} />
                                 <ReviewTag label={metadata.originalLanguage.toUpperCase()} />
                                 <ReviewTag label={monetization.toUpperCase()} color="text-green-500" />
                              </div>
                              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{metadata.description}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <CheckItem label="Content Transcoded" />
                           <CheckItem label="Subtitles Generated" />
                           <CheckItem label="Copyright Clear" />
                           <CheckItem label="Monetization Active" />
                        </div>
                     </div>
                     <div className="bg-red-600/5 p-8 border-t border-red-600/10 flex items-center gap-4">
                        <AlertTriangle className="text-red-600" />
                        <p className="text-xs text-red-600 font-bold uppercase tracking-tight">Ensure your content follows our National Safety Guidelines before publishing.</p>
                     </div>
                  </div>
               </div>
             )}
          </div>

          {/* Footer Controls */}
          <footer className="p-8 border-t border-white/5 flex items-center justify-between flex-none bg-[#0a0a0a]">
             <div className="flex gap-4">
                {step > 0 && (
                   <button 
                     onClick={() => setStep(prev => prev - 1)}
                     className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase hover:bg-white/10 transition-all flex items-center gap-2"
                   >
                     <ChevronLeft size={16} /> Previous
                   </button>
                )}
             </div>
             <div className="flex gap-4">
                <button onClick={onClose} className="px-8 py-4 text-gray-500 text-xs font-black uppercase hover:text-white transition-colors">Save as Draft</button>
                {step < 6 ? (
                  <button 
                    onClick={() => setStep(prev => prev + 1)}
                    disabled={step === 0 && !contentType}
                    className="px-12 py-4 bg-red-600 rounded-[20px] text-xs font-black uppercase shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleFinalPublish}
                    disabled={isPublishing}
                    className="px-16 py-4 bg-white text-black rounded-[20px] text-xs font-black uppercase shadow-xl shadow-white/10 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    {isPublishing ? 'PUBLISHING...' : 'PUBLISH NOW'} <Zap size={16} fill="black" />
                  </button>
                )}
             </div>
          </footer>
       </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const SelectionCard = ({ icon: Icon, title, sub, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`p-8 rounded-[40px] border text-left space-y-4 transition-all group ${
      active ? 'bg-red-600 border-red-600 shadow-2xl shadow-red-600/20' : 'bg-white/5 border-white/5 hover:border-red-600/30'
    }`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${active ? 'bg-white text-red-600' : 'bg-white/5 text-gray-500 group-hover:bg-red-600 group-hover:text-white'}`}>
       <Icon size={24} />
    </div>
    <div>
       <h4 className="font-black text-lg uppercase tracking-tight">{title}</h4>
       <p className={`text-xs ${active ? 'text-white/70' : 'text-gray-500'}`}>{sub}</p>
    </div>
  </button>
);

const LangBadge = ({ lang, status }: any) => (
  <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
     <span className="text-[10px] font-black uppercase tracking-tight text-gray-400">{lang}</span>
     {status === 'verified' ? <CheckCircle2 size={12} className="text-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
  </div>
);

const VisibilityOption = ({ title, sub, icon: Icon = Globe, active = false }: any) => (
  <button className={`p-8 rounded-[40px] border text-center space-y-3 transition-all ${active ? 'bg-red-600 border-red-600 text-white shadow-2xl' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}>
     <Icon size={32} className="mx-auto" />
     <div>
        <h4 className="font-black uppercase tracking-tight">{title}</h4>
        <p className="text-[10px] font-bold uppercase opacity-70">{sub}</p>
     </div>
  </button>
);

const ReviewTag = ({ label, color = "text-gray-400" }: any) => (
  <span className={`bg-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 ${color}`}>{label}</span>
);

const CheckItem = ({ label }: any) => (
  <div className="flex items-center gap-3">
     <CheckCircle2 size={16} className="text-green-500" />
     <span className="text-xs font-bold text-gray-400">{label}</span>
  </div>
);

const SideNavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${active ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} className={active ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
    <span className="text-sm font-bold tracking-tight">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, change, subText }: any) => (
  <div className="bg-[#080808] border border-white/5 p-8 rounded-[40px] space-y-4 hover:border-red-600/20 transition-all shadow-xl">
     <div className="flex items-center justify-between">
        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-600/10 text-green-500' : 'bg-red-600/10 text-red-600'}`}>
           {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
           {change}
        </div>
     </div>
     <h4 className="text-3xl font-black">{value}</h4>
     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{subText}</p>
  </div>
);

const ActivityItem = ({ icon: Icon, label, time, color }: any) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
     <div className="flex items-center gap-3">
        <Icon size={16} className={color || 'text-gray-400'} />
        <span className="text-sm font-bold">{label}</span>
     </div>
     <span className="text-[10px] text-gray-600 font-bold">{time}</span>
  </div>
);

const MonetizationCard = ({ icon: Icon, label, value, color, disabled }: any) => (
  <div className={`p-8 rounded-[40px] border border-white/5 bg-[#080808] space-y-4 ${disabled ? 'opacity-30 grayscale' : ''}`}>
     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
        <Icon size={24} className={color} />
     </div>
     <h4 className="text-lg font-black">{label}</h4>
     <p className={`text-sm font-bold ${color}`}>{value}</p>
  </div>
);

const LangTag = ({ lang, status }: any) => {
   const styles: any = {
      verified: "bg-green-600 text-white",
      ai: "bg-blue-600/20 text-blue-500 border border-blue-500/20",
      none: "bg-white/5 text-gray-600"
   };
   return <span className={`text-[8px] font-black px-2 py-1 rounded-md ${styles[status]}`}>{lang}</span>
};

const ToolCard = ({ icon: Icon, label, description }: any) => (
  <div className="p-8 rounded-[40px] border border-white/5 bg-[#080808] space-y-3 hover:border-red-600/30 transition-all cursor-pointer group">
     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-all">
        <Icon size={24} className="group-hover:text-white" />
     </div>
     <h4 className="font-black text-sm uppercase tracking-tight">{label}</h4>
     <p className="text-xs text-gray-500 leading-tight">{description}</p>
  </div>
);

// Dashboard Views
const DashboardView = ({ content, aiInsights, isAnalyzing }: any) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <StatCard label="Total Reach" value={`${(content.reduce((acc: number, i: any) => acc + i.views, 0) / 1000).toFixed(1)}K`} trend="up" change="+12.5%" subText="Across all formats" />
       <StatCard label="Est. Revenue" value={`${(content.length * 450).toLocaleString()} RWF`} trend="up" change="+8.2%" subText="Last 30 days" />
       <StatCard label="Avg. Watch Time" value="12m 45s" trend="down" change="-2.1%" subText="Target: 15m" />
       <StatCard label="Global Fans" value="4.2K" trend="up" change="+22%" subText="8 countries" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
       <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#080808] border border-white/5 rounded-[40px] p-10 space-y-8 shadow-2xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Platform Growth</h3>
                <div className="flex gap-2">
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 text-red-600 rounded-lg text-xs font-bold border border-red-600/20"><div className="w-1.5 h-1.5 rounded-full bg-red-600" /> Video</div>
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 rounded-lg text-xs font-bold border border-blue-600/20"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Audio</div>
                </div>
             </div>
             <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={[{ name: 'Jan', v: 4000, a: 2400 }, { name: 'Feb', v: 3000, a: 1398 }, { name: 'Mar', v: 9800, a: 2000 }, { name: 'Apr', v: 3908, a: 2780 }, { name: 'May', v: 4800, a: 1890 }, { name: 'Jun', v: 3800, a: 2390 }, { name: 'Jul', v: 4300, a: 3490 }]}>
                      <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px'}} />
                      <Area type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={4} fill="url(#colorV)" />
                      <Area type="monotone" dataKey="a" stroke="#3b82f6" strokeWidth={4} fill="transparent" strokeDasharray="8 8" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>
       <div className="space-y-8">
          <div className="bg-gradient-to-br from-[#0a0a0a] to-[#080808] border border-white/5 rounded-[40px] p-8 space-y-6 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} /></div>
             <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center"><Sparkles className="text-white" size={20} /></div><h3 className="text-xl font-black">Kero Insights</h3></div>
             <div className="space-y-4">
                {isAnalyzing ? <div className="space-y-4"><div className="h-4 bg-white/5 rounded-full animate-pulse w-full" /><div className="h-4 bg-white/5 rounded-full animate-pulse w-3/4" /><div className="h-4 bg-white/5 rounded-full animate-pulse w-1/2" /></div> : <div className="text-sm text-gray-400 leading-relaxed font-medium whitespace-pre-wrap">{aiInsights || "Upload more content to get personal growth strategies from Kero AI."}</div>}
             </div>
             <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs hover:scale-105 transition-transform">ACT ON STRATEGY</button>
          </div>
          <div className="bg-[#080808] border border-white/5 rounded-[40px] p-8 space-y-6"><h3 className="text-lg font-black uppercase tracking-tight">Recent Activity</h3><div className="space-y-5"><ActivityItem icon={Play} label="New Stream" time="2m ago" /><ActivityItem icon={DollarSign} label="PPV Payout" time="1h ago" color="text-green-500" /><ActivityItem icon={Globe} label="Translation Ready" time="3h ago" color="text-blue-500" /></div></div>
       </div>
    </div>
  </div>
);

const ContentView = ({ content }: { content: ContentItem[] }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
       <div className="flex gap-2">
          <button className="px-4 py-2 bg-red-600 rounded-xl text-xs font-black">ALL CONTENT</button>
          <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-black text-gray-500 hover:text-white">VIDEOS</button>
          <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-black text-gray-500 hover:text-white">AUDIO</button>
          <button className="px-4 py-2 bg-white/5 rounded-xl text-xs font-black text-gray-500 hover:text-white">LIVE</button>
       </div>
       <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10"><Filter size={16} className="text-gray-500" /><span className="text-xs font-bold text-gray-400">Sort by: Date Added</span></div>
    </div>
    <div className="bg-[#080808] border border-white/5 rounded-[40px] overflow-hidden">
       <table className="w-full text-left">
          <thead className="bg-black/40 border-b border-white/5">
             <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Media</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Format</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Monetization</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Views</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
             {content.map(item => (
                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                   <td className="px-8 py-5"><div className="flex items-center gap-4"><img src={item.thumbnail} className="w-16 aspect-video rounded-xl object-cover border border-white/5" /><div className="min-w-0"><p className="font-bold text-sm truncate max-w-[200px]">{item.title}</p><p className="text-[10px] text-gray-500 uppercase font-black">{new Date(item.submittedAt).toLocaleDateString()}</p></div></div></td>
                   <td className="px-8 py-5 capitalize text-xs font-medium text-gray-400">{item.type}</td>
                   <td className="px-8 py-5"><span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase border ${item.status === 'approved' ? 'bg-green-600/10 text-green-500 border-green-600/20' : item.status === 'pending' ? 'bg-yellow-600/10 text-yellow-500 border-yellow-600/20 animate-pulse' : 'bg-red-600/10 text-red-600 border-red-600/20'}`}>{item.status}</span></td>
                   <td className="px-8 py-5"><span className="text-[10px] font-black uppercase text-gray-400">{item.monetization}</span></td>
                   <td className="px-8 py-5 font-bold text-sm text-white">{(item.views / 1000).toFixed(1)}K</td>
                   <td className="px-8 py-5 text-right"><div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><Eye size={16}/></button><button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><BarChart3 size={16}/></button><button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><MoreVertical size={16}/></button></div></td>
                </tr>
             ))}
          </tbody>
       </table>
    </div>
  </div>
);

const AnalyticsView = ({ content }: any) => (
  <div className="space-y-10 animate-in fade-in duration-500">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#080808] border border-white/5 rounded-[40px] p-10 space-y-6"><h3 className="text-xl font-black">Traffic Source</h3><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ name: 'Kigali', val: 4500 }, { name: 'Rubavu', val: 1200 }, { name: 'Huye', val: 800 }, { name: 'Musanze', val: 950 }, { name: 'Global', val: 3200 }]}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} /><YAxis hide /><Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '16px'}} /><Bar dataKey="val" fill="#ef4444" radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="bg-[#080808] border border-white/5 rounded-[40px] p-10 space-y-6"><h3 className="text-xl font-black">Audience Retention</h3><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={[{ t: '0:00', val: 100 }, { t: '1:00', val: 92 }, { t: '2:00', val: 85 }, { t: '5:00', val: 62 }, { t: '10:00', val: 55 }, { t: 'End', val: 42 }]}><XAxis dataKey="t" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} /><YAxis hide /><Area type="step" dataKey="val" stroke="#3b82f6" fill="#3b82f610" strokeWidth={3} /></AreaChart></ResponsiveContainer></div></div>
     </div>
  </div>
);

const MonetizationView = ({ content, user }: any) => (
  <div className="space-y-10 animate-in fade-in duration-500">
     <div className="bg-gradient-to-br from-[#0a0a0a] to-[#080808] border border-white/5 rounded-[40px] p-12 flex items-center justify-between shadow-2xl"><div className="space-y-4"><h3 className="text-4xl font-black tracking-tighter uppercase">Wallet Balance</h3><p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Available for payout</p><h2 className="text-6xl font-black text-green-500">{(user?.credits || 0).toLocaleString()} <span className="text-2xl text-white">RWF</span></h2></div><div className="flex flex-col gap-3"><button className="bg-white text-black px-12 py-5 rounded-3xl font-black text-sm shadow-xl hover:scale-105 transition-transform">WITHDRAW NOW</button><button className="bg-white/5 border border-white/10 px-12 py-5 rounded-3xl font-black text-sm hover:bg-white/10 transition-all">PAYOUT HISTORY</button></div></div>
     <div className="grid grid-cols-1 md:grid-cols-3 gap-8"><MonetizationCard icon={ShieldCheck} label="Ad Revenue" value="Active" color="text-green-500" /><MonetizationCard icon={Smartphone} label="Direct Support" value="Enabled" color="text-blue-500" /><MonetizationCard icon={Zap} label="Fan Badges" value="Unlock at 10K Views" color="text-yellow-500" disabled /></div>
  </div>
);

const TranslationsView = ({ content }: any) => (
  <div className="space-y-10 animate-in fade-in duration-500">
     <div className="flex items-center justify-between"><h3 className="text-xl font-black">Translation Management</h3><button className="bg-blue-600 px-6 py-2.5 rounded-xl font-black text-xs">AUTO-TRANSLATE ALL</button></div>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{content.slice(0, 6).map((item: any) => (<div key={item.id} className="bg-[#080808] border border-white/5 rounded-3xl p-6 space-y-5 group hover:border-blue-500/30 transition-all"><div className="flex items-center gap-4"><img src={item.thumbnail} className="w-12 h-12 rounded-xl object-cover" /><div className="min-w-0"><p className="font-bold text-sm truncate">{item.title}</p><p className="text-[10px] text-gray-500 font-black uppercase">{item.originalLanguage}</p></div></div><div className="flex flex-wrap gap-2"><LangTag lang="RW" status="verified" /><LangTag lang="FR" status="ai" /><LangTag lang="SW" status="none" /><LangTag lang="AR" status="none" /></div><button className="w-full py-3 bg-white/5 rounded-xl text-xs font-black uppercase group-hover:bg-blue-600 transition-all">Open Workbench</button></div>))}</div>
  </div>
);

const AiToolsView = () => (
  <div className="h-full flex flex-col items-center justify-center space-y-6 text-center py-20 animate-in zoom-in-95"><div className="w-24 h-24 bg-gradient-to-tr from-red-600 to-blue-600 rounded-[32px] flex items-center justify-center shadow-2xl animate-bounce"><Sparkles size={48} className="text-white" /></div><div className="space-y-2"><h3 className="text-3xl font-black uppercase italic tracking-tighter">Kero Pro Suite</h3><p className="text-gray-500 max-w-md">Automate your creative workflow with the most advanced AI for Rwandan content creators.</p></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl pt-10"><ToolCard icon={Play} label="Auto-Highlights" description="Extract shorts from long videos" /><ToolCard icon={Globe} label="Geo-Optimization" description="Suggest trending topics per region" /><ToolCard icon={MessageSquare} label="AI Moderator" description="Automatic toxic comment filtering" /></div></div>
);

export default CreatorStudio;
