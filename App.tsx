
import React, { useState, useEffect } from 'react';
import { 
  Home, PlayCircle, Music, BookOpen, Tv, Search, User, 
  LayoutDashboard, ShieldAlert, MessageCircle, Wallet,
  Menu, X, Bell, Globe, LogOut, CheckCircle2, ChevronRight
} from 'lucide-react';
import { AppView, User as UserType, LanguageCode } from './types';
import { api } from './services/api';

// Pages
import HomePage from './pages/Home';
import WatchPage from './pages/Watch';
import ListenPage from './pages/Listen';
import ReadPage from './pages/Read';
import LiveTVPage from './pages/LiveTV';
import CreatorStudio from './pages/CreatorStudio';
import AdminDashboard from './pages/AdminDashboard';
import KeroAssistant from './components/KeroAssistant';

const LANGUAGES: { code: LanguageCode, name: string, native: string }[] = [
  { code: 'rw', name: 'Kinyarwanda', native: 'Ikinyarwanda' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'sw', name: 'Kiswahili', native: 'Kiswahili' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'am', name: 'Ethiopian', native: 'አማርኛ' },
  { code: 'ar', name: 'Arabic', native: 'العربية' }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('HOME');
  const [user, setUser] = useState<UserType | null>(api.getCurrentUser());
  const [language, setLanguage] = useState<LanguageCode | null>(null);
  const [showLangSelect, setShowLangSelect] = useState(!localStorage.getItem('rebalive_lang'));
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize lang from storage
  useEffect(() => {
    const storedLang = localStorage.getItem('rebalive_lang') as LanguageCode;
    if (storedLang) setLanguage(storedLang);
  }, []);

  const handleLanguageSelect = (code: LanguageCode) => {
    setLanguage(code);
    localStorage.setItem('rebalive_lang', code);
    setShowLangSelect(false);
    if (user) api.updateLanguage(user.id, code);
  };

  const handleLogin = async (email: string, role: any) => {
    const newUser = await api.login(email, role);
    setUser(newUser);
    setShowLogin(false);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setView('HOME');
  };

  // Permission Guard
  const canAccess = (requiredRole: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (requiredRole === 'creator' && user.role === 'creator') return true;
    return user.role === requiredRole;
  };

  const renderView = () => {
    switch(view) {
      case 'HOME': return <HomePage setView={setView} />;
      case 'WATCH': return <WatchPage />;
      case 'LISTEN': return <ListenPage />;
      case 'READ': return <ReadPage />;
      case 'LIVE': return <LiveTVPage />;
      case 'STUDIO': return canAccess('creator') ? <CreatorStudio /> : <div className="p-20 text-center">Unauthorized Access</div>;
      case 'ADMIN': return canAccess('admin') ? <AdminDashboard /> : <div className="p-20 text-center">Unauthorized Access</div>;
      default: return <HomePage setView={setView} />;
    }
  };

  // 1. Language Selection Overlay
  if (showLangSelect) {
    return (
      <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center p-6 overflow-y-auto">
        <div className="max-w-4xl w-full space-y-12 py-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center font-bold italic text-4xl mx-auto shadow-2xl shadow-red-600/20">R</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">REBALIVE <span className="text-red-600">RW</span></h1>
            <p className="text-gray-400 text-lg">Hitamo ururimi ushaka gukoresha / Select your language</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LANGUAGES.map(lang => (
              <button 
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-600 hover:bg-white/10 transition-all text-center space-y-2"
              >
                <p className="text-xl font-black group-hover:text-red-600 transition-colors">{lang.native}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{lang.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('HOME')}>
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold italic">R</div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">REBALIVE <span className="text-red-600">RW</span></span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:border-red-600 transition-all">
          <Search size={18} className="text-gray-400" />
          <input type="text" placeholder="Search movies, music, books..." className="bg-transparent border-none outline-none px-3 w-full text-sm" />
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                <Wallet size={14} /> {user.credits.toLocaleString()} RWF
              </div>
              <button onClick={() => setView('PROFILE')} className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center text-xs font-bold cursor-pointer border-2 border-white/20">
                {user.name.charAt(0)}
              </button>
              <button onClick={handleLogout} className="p-2 hover:text-red-600 transition-colors hidden md:block">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-red-600 px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
            >
              LOG IN
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-[110] w-64 bg-black border-r border-white/10 p-4 space-y-1 transform transition-transform lg:relative lg:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-end lg:hidden mb-4">
            <button onClick={() => setIsMenuOpen(false)}><X size={24}/></button>
          </div>
          <NavItem icon={Home} label="Nyumbani" active={view === 'HOME'} onClick={() => {setView('HOME'); setIsMenuOpen(false);}} />
          <NavItem icon={PlayCircle} label="Filime" active={view === 'WATCH'} onClick={() => {setView('WATCH'); setIsMenuOpen(false);}} />
          <NavItem icon={Music} label="Umiziki" active={view === 'LISTEN'} onClick={() => {setView('LISTEN'); setIsMenuOpen(false);}} />
          <NavItem icon={BookOpen} label="Gusoma" active={view === 'READ'} onClick={() => {setView('READ'); setIsMenuOpen(false);}} />
          <NavItem icon={Tv} label="TV Live" active={view === 'LIVE'} onClick={() => {setView('LIVE'); setIsMenuOpen(false);}} />
          
          <div className="pt-8 pb-2 px-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Personal</div>
          <NavItem icon={User} label="Profile" active={view === 'PROFILE'} onClick={() => {setView('PROFILE'); setIsMenuOpen(false);}} />
          
          {user && (user.role === 'creator' || user.role === 'admin') && (
            <>
              <div className="pt-8 pb-2 px-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Workspace</div>
              <NavItem icon={LayoutDashboard} label="Creator Studio" active={view === 'STUDIO'} onClick={() => {setView('STUDIO'); setIsMenuOpen(false);}} />
            </>
          )}

          {user && user.role === 'admin' && (
            <NavItem icon={ShieldAlert} label="Admin Panel" active={view === 'ADMIN'} onClick={() => {setView('ADMIN'); setIsMenuOpen(false);}} />
          )}

          {user && (
            <div className="mt-auto p-4 bg-gradient-to-br from-red-900/20 to-blue-900/20 rounded-2xl border border-white/5">
              <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-tighter">Your Plan</p>
              <p className="text-sm font-black text-white">{user.subscription.toUpperCase()}</p>
              <button className="mt-3 w-full py-2 bg-red-600 hover:bg-red-700 text-xs font-bold rounded-lg transition-colors">UPGRADE</button>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20 lg:pb-0 relative">
          {renderView()}
          <KeroAssistant user={user || { name: 'Guest' }} />
        </main>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-[40px] border border-white/10 p-10 space-y-8 animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black">Login to RebaLive</h2>
              <p className="text-gray-500">Choose your role to continue testing</p>
            </div>
            <div className="space-y-4">
              <LoginRoleBtn label="Regular User" icon={User} onClick={() => handleLogin('user@test.com', 'user')} />
              <LoginRoleBtn label="Creator Account" icon={LayoutDashboard} onClick={() => handleLogin('creator@test.com', 'creator')} />
              <LoginRoleBtn label="Admin Access" icon={ShieldAlert} onClick={() => handleLogin('admin@rebalive.rw', 'admin')} />
            </div>
            <button onClick={() => setShowLogin(false)} className="w-full text-center text-sm font-bold text-gray-500 hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <Icon size={20} className={`${active ? 'scale-110' : 'group-hover:scale-110 transition-transform'}`} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const LoginRoleBtn = ({ label, icon: Icon, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-red-600 hover:bg-white/10 transition-all group">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-2xl bg-zinc-800 group-hover:bg-red-600 transition-colors">
        <Icon size={20} />
      </div>
      <span className="font-black">{label}</span>
    </div>
    <ChevronRight size={20} className="text-gray-500" />
  </button>
);

export default App;
