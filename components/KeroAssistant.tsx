
import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { kero } from '../services/gemini';

const KeroAssistant: React.FC<{ user: any }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'kero', text: string }[]>([
    { role: 'kero', text: `Muraho ${user.name}! I am Kero. How can I help you enjoy RebaLive RW today?` }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);
    
    const response = await kero.getHelp(userMsg, user);
    setMessages(prev => [...prev, { role: 'kero', text: response || 'Sorry, I missed that.' }]);
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 bg-gradient-to-tr from-red-600 to-blue-600 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 group"
      >
        <Sparkles className="text-white" size={24} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 px-3 py-1 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ask Kero</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 lg:inset-auto lg:bottom-24 lg:right-8 lg:w-96 lg:h-[500px] bg-zinc-900 lg:rounded-3xl shadow-2xl z-[1000] border border-white/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Kero AI Assistant</p>
                <p className="text-[10px] text-green-500 uppercase font-bold">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-100 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500 italic animate-pulse">Kero is thinking...</div>}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-red-600 text-sm transition-all"
            />
            <button onClick={handleSend} className="p-2 bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default KeroAssistant;
