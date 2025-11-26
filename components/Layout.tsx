import React from 'react';
import { Sparkles, Home, MessageCircle, User, Wallet, ShieldCheck, UserCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userBalance: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userBalance }) => {
  return (
    <div className="min-h-screen bg-mystic-900 text-white flex flex-col font-sans relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-twinkle"></div>
        </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-mystic-900/90 backdrop-blur-md border-b border-mystic-700 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-mystic-gold animate-pulse" />
            <h1 className="text-xl font-serif font-bold text-mystic-gold">AstroSoul</h1>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1 bg-mystic-800 px-3 py-1 rounded-full border border-mystic-700 text-sm hover:border-mystic-gold transition-colors"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">₹{userBalance}</span>
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className="p-1 rounded-full hover:bg-mystic-800 transition-colors group"
                aria-label="My Account"
              >
                <UserCircle className="w-8 h-8 text-mystic-gold group-hover:text-white transition-colors" />
              </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-4 py-6 z-10 pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-mystic-900 border-t border-mystic-700 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center h-16">
          <NavButton icon={<Home />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavButton icon={<MessageCircle />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
          <NavButton icon={<ShieldCheck />} label="Admin" active={activeTab === 'admin'} onClick={() => setActiveTab('admin')} />
          <NavButton icon={<User />} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </div>
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${active ? 'text-mystic-gold' : 'text-gray-400 hover:text-gray-200'}`}
  >
    {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-xs mt-1 font-medium">{label}</span>
  </button>
);