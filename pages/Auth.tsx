
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Globe, ChevronRight, Facebook, Twitter, Github } from 'lucide-react';
import { api } from '../services/api';
import { UserRole } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: any) => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('viewer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (isLogin) {
        user = await api.login(email, password);
      } else {
        user = await api.signup(name, email, role);
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-black overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&q=80&w=2000" 
          alt="Rwanda Hills"
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Brand Logo - Top Left */}
      <div 
        className="absolute top-8 left-8 flex items-center gap-2 cursor-pointer z-20 group"
        onClick={onBack}
      >
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-bold italic text-white shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">R</div>
        <span className="text-2xl font-black tracking-tighter text-white">REBALIVE <span className="text-red-600">RW</span></span>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in duration-500">
        <div className="bg-zinc-900/80 backdrop-blur-3xl border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
          {/* Subtle Accent Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-blue-600 to-yellow-500" />
          
          <div className="p-8 md:p-12 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                {isLogin ? 'Enter your credentials to access your library' : 'Join Rwanda\'s leading multimedia platform'}
              </p>
            </div>

            {error && (
              <div className="bg-red-600/10 border border-red-600/20 p-4 rounded-2xl text-red-500 text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={20} />
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Jean Claude"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-600 transition-all text-white placeholder:text-gray-600"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={20} />
                  <input 
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-600 transition-all text-white placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Password</label>
                  {isLogin && <button type="button" className="text-[10px] font-black text-red-600 hover:text-red-500 uppercase tracking-widest">Forgot?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-600 transition-colors" size={20} />
                  <input 
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-red-600 transition-all text-white placeholder:text-gray-600"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">I want to be a</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setRole('viewer')}
                      className={`p-4 rounded-2xl border transition-all text-center ${role === 'viewer' ? 'bg-red-600 border-red-600 text-white font-black' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                    >
                      Viewer
                    </button>
                    <button 
                      type="button"
                      onClick={() => setRole('creator')}
                      className={`p-4 rounded-2xl border transition-all text-center ${role === 'creator' ? 'bg-red-600 border-red-600 text-white font-black' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                    >
                      Creator
                    </button>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-3xl font-black text-sm text-white shadow-xl shadow-red-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? 'Processing...' : (isLogin ? 'LOG IN' : 'CREATE ACCOUNT')}
                {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-zinc-900 px-4 text-gray-500">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <SocialBtn icon={Globe} />
              <SocialBtn icon={Facebook} />
              <SocialBtn icon={Twitter} />
            </div>

            <p className="text-center text-sm text-gray-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-red-600 font-black hover:text-red-500 underline underline-offset-4"
              >
                {isLogin ? 'Sign Up Free' : 'Log In Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialBtn = ({ icon: Icon }: any) => (
  <button className="flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
    <Icon size={20} className="text-gray-400 group-hover:text-white transition-colors" />
  </button>
);

export default AuthPage;
