import React, { useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { db } from '../services/db';
import { generateHoroscope, generateLovePrediction } from '../services/geminiService';
import { Heart, Briefcase, Star, MessageCircle, Mic, DollarSign } from 'lucide-react';

interface Props {
  user: UserProfile;
  setTab: (t: string) => void;
}

export const Home: React.FC<Props> = ({ user, setTab }) => {
  const [horoscope, setHoroscope] = useState<string>('Aligning the stars...');
  const [adminMessage, setAdminMessage] = useState<string>('');
  const [lovePartner, setLovePartner] = useState('');
  const [loveResult, setLoveResult] = useState('');

  useEffect(() => {
    // Fetch daily horoscope on mount
    const fetchHoroscope = async () => {
      if (user.isRegistered) {
        const text = await generateHoroscope(user.zodiacSign);
        setHoroscope(text);
      }
    };
    fetchHoroscope();
    setAdminMessage(db.getDailyMessage());
  }, [user]);

  const handleLoveCalc = async () => {
      if(!lovePartner) return;
      setLoveResult("Reading the stars...");
      const result = await generateLovePrediction(user, lovePartner, "Unknown");
      setLoveResult(result);
  }

  if (!user.isRegistered) {
    return <div className="text-center mt-10">Please complete your profile to see your horoscope.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Daily Horoscope Card */}
      <div className="bg-gradient-to-br from-mystic-800 to-mystic-700 p-6 rounded-2xl shadow-lg border border-mystic-gold/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star size={100} />
        </div>
        <h2 className="text-xl font-serif text-mystic-gold mb-2 flex items-center gap-2">
            <Star className="fill-mystic-gold" size={20} />
            Daily Horoscope
        </h2>
        <p className="text-sm text-gray-300 italic mb-4">"{horoscope}"</p>
        <div className="text-xs text-purple-300 font-bold uppercase tracking-wider">
            {user.zodiacSign} • {new Date().toDateString()}
        </div>
      </div>

      {/* Admin Message / Daily Insight */}
      <div className="bg-mystic-800/50 p-4 rounded-xl border-l-4 border-emerald-500">
        <h3 className="font-bold text-emerald-400 mb-1">Today's Insight</h3>
        <p className="text-sm text-gray-300">{adminMessage}</p>
      </div>

      {/* Services Grid */}
      <div>
        <h3 className="text-lg font-serif text-white mb-4">Astrology Services</h3>
        <div className="grid grid-cols-2 gap-4">
            <ServiceCard 
                icon={<MessageCircle size={32} />} 
                title="Chat with Rishi" 
                desc={user.isFreeTrialActive ? "5 Min Free!" : "₹10/min"} 
                color="bg-blue-600"
                onClick={() => setTab('chat')}
            />
            <ServiceCard 
                icon={<Heart size={32} />} 
                title="Love Match" 
                desc="Compatibility" 
                color="bg-pink-600"
                onClick={() => document.getElementById('love-calc')?.scrollIntoView({ behavior: 'smooth'})}
            />
            <ServiceCard 
                icon={<Briefcase size={32} />} 
                title="Career" 
                desc="Path guidance" 
                color="bg-amber-600"
                onClick={() => setTab('chat')}
            />
             <ServiceCard 
                icon={<DollarSign size={32} />} 
                title="Wallet" 
                desc={`Bal: ₹${user.walletBalance}`} 
                color="bg-emerald-600"
                onClick={() => setTab('wallet')}
            />
        </div>
      </div>

      {/* Love Calculator Widget */}
      <div id="love-calc" className="bg-mystic-800 p-5 rounded-xl border border-pink-900/50">
          <h3 className="text-lg font-serif text-pink-400 mb-3 flex items-center gap-2">
              <Heart className="fill-pink-400" size={20} /> Love Prediction
          </h3>
          <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="Partner Name" 
                className="flex-1 bg-mystic-900 rounded p-2 text-sm border border-mystic-700 outline-none focus:border-pink-500"
                value={lovePartner}
                onChange={(e) => setLovePartner(e.target.value)}
              />
              <button 
                onClick={handleLoveCalc}
                className="bg-pink-600 text-white px-4 rounded font-bold text-sm"
              >
                  Check
              </button>
          </div>
          {loveResult && (
              <div className="bg-pink-900/30 p-3 rounded text-sm text-pink-200">
                  {loveResult}
              </div>
          )}
      </div>

       {/* Feedback Teaser */}
       <div className="mt-8 text-center">
         <p className="text-gray-400 text-sm">Love our app?</p>
         <button className="text-mystic-gold underline text-sm mt-1" onClick={() => setTab('admin')}>Leave a review</button>
       </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc, color, onClick }: { icon: any, title: string, desc: string, color: string, onClick: () => void }) => (
    <button onClick={onClick} className={`${color} p-4 rounded-xl shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform w-full text-white`}>
        {icon}
        <div className="text-center">
            <div className="font-bold text-sm">{title}</div>
            <div className="text-xs opacity-90">{desc}</div>
        </div>
    </button>
);