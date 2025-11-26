import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { db } from '../services/db';
import { Chat as GeminiChat } from "@google/genai";
import { Mic, Send, StopCircle, Clock, Volume2 } from 'lucide-react';

interface Props {
  user: UserProfile;
  refreshUser: () => void;
  setTab: (t: string) => void;
}

const COST_PER_MIN = 10;

export const Chat: React.FC<Props> = ({ user, refreshUser, setTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: `Namaste ${user.name}. I am Rishi. How may I guide you today?`, timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [chatSession, setChatSession] = useState<GeminiChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Timer Logic
  const [sessionActive, setSessionActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    const init = async () => {
      const chat = await createChatSession(user);
      setChatSession(chat);
      setSessionActive(true);
    };
    init();
    return () => setSessionActive(false);
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sessionActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
        
        // Every 60 seconds, check balance logic
        if ((seconds + 1) % 60 === 0) {
           const mins = 1;
           // Attempt to use free minutes or deduct balance
           const hasFree = db.updateFreeMinutes(mins);
           refreshUser();
           
           if (!hasFree) {
             // Free trial over or unavailable, try wallet
             if (!user.isFreeTrialActive) {
               const paid = db.deductBalance(COST_PER_MIN);
               refreshUser();
               if (!paid) {
                 // Out of money
                 setSessionActive(false);
                 alert("Insufficient balance! Please recharge.");
                 setTab('wallet');
               }
             }
           }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive, seconds, user.isFreeTrialActive, user.walletBalance]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !chatSession || !sessionActive) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMsg.text });
      const aiText = response.text || "I am meditating on that...";
      
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      
      // Auto-Speak
      speakText(aiText);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "The connection to the cosmos is weak. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Input (Web Speech API)
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.start();
  };

  // TTS
  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.9; // Deeper, more mystic voice
    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Session Header */}
      <div className="bg-mystic-800 p-3 rounded-t-xl border-b border-mystic-700 flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span>Astrologer Rishi</span>
        </div>
        <div className="flex items-center gap-2 text-mystic-gold font-mono">
            <Clock size={14} />
            {formatTime(seconds)}
            <span className="text-gray-400 text-xs ml-1">
                {user.isFreeTrialActive ? "(Free Trial)" : `(₹${COST_PER_MIN}/min)`}
            </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto bg-mystic-900/50 p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-mystic-700 text-white rounded-tr-none' : 'bg-mystic-800 border border-mystic-gold/30 text-gray-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-xs text-gray-500 animate-pulse">Rishi is consulting the stars...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-mystic-800 p-3 rounded-b-xl border-t border-mystic-700 flex items-center gap-2">
        <button onClick={toggleListening} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-mystic-700 text-gray-300 hover:text-white'}`}>
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
        </button>
        <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="flex-1 bg-mystic-900 border border-mystic-700 rounded-full px-4 py-2 text-sm text-white focus:border-mystic-gold outline-none"
            disabled={!sessionActive}
        />
        <button onClick={handleSend} disabled={!sessionActive} className="p-2 bg-mystic-gold text-black rounded-full hover:bg-yellow-500 disabled:opacity-50">
            <Send size={20} />
        </button>
      </div>
      
      {!sessionActive && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-xl backdrop-blur-sm">
              <div className="bg-mystic-800 p-6 rounded-xl border border-red-500 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Session Ended</h3>
                  <p className="text-gray-300 mb-4">Please recharge your wallet to continue consulting Rishi.</p>
                  <button onClick={() => setTab('wallet')} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold">Recharge Now</button>
              </div>
          </div>
      )}
    </div>
  );
};