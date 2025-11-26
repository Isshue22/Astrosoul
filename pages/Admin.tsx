import React, { useState } from 'react';
import { db } from '../services/db';
import { UserProfile, Feedback } from '../types';
import { Lock, Send } from 'lucide-react';

interface Props {
    user: UserProfile;
}

export const Admin: React.FC<Props> = ({ user }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [password, setPassword] = useState('');
    const [dailyMsg, setDailyMsg] = useState('');
    
    // Feedback State
    const [feedbackText, setFeedbackText] = useState('');
    const [rating, setRating] = useState(5);
    const feedbacks = db.getFeedbacks();

    const handleLogin = () => {
        if(password === 'admin123') {
            setIsAdmin(true);
            setDailyMsg(db.getDailyMessage());
        } else {
            alert("Incorrect password");
        }
    }

    const handleUpdateMsg = () => {
        db.setDailyMessage(dailyMsg);
        alert("Daily insight updated!");
    }

    const handleSubmitFeedback = () => {
        if(!feedbackText) return;
        const fb: Feedback = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name || 'Anonymous',
            rating: rating,
            comment: feedbackText,
            date: new Date().toISOString()
        };
        db.addFeedback(fb);
        setFeedbackText('');
        alert("Thank you for your feedback!");
    }

    // --- User View (Feedback) ---
    if (!isAdmin) {
        return (
            <div className="space-y-6">
                <div className="bg-mystic-800 p-6 rounded-2xl border border-mystic-700">
                    <h2 className="text-xl font-serif text-mystic-gold mb-4">Rate AstroSoul</h2>
                    <div className="flex gap-2 mb-4">
                        {[1,2,3,4,5].map(r => (
                            <button key={r} onClick={() => setRating(r)} className={`p-2 rounded-full ${rating >= r ? 'text-yellow-400' : 'text-gray-600'}`}>★</button>
                        ))}
                    </div>
                    <textarea 
                        className="w-full bg-mystic-900 p-3 rounded text-white text-sm border border-mystic-700 mb-3"
                        placeholder="Share your experience..."
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <button onClick={handleSubmitFeedback} className="bg-mystic-gold text-black px-4 py-2 rounded font-bold w-full flex justify-center items-center gap-2">
                        <Send size={16} /> Submit
                    </button>
                </div>

                <div className="border-t border-mystic-700 pt-6">
                    <h3 className="text-center text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
                        <Lock size={12} /> Admin Access
                    </h3>
                    <div className="flex gap-2 max-w-xs mx-auto">
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="bg-mystic-900 border border-mystic-700 rounded px-3 py-1 text-sm flex-1 text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleLogin} className="bg-gray-700 px-3 py-1 rounded text-xs text-white">Login</button>
                    </div>
                </div>
            </div>
        )
    }

    // --- Admin View ---
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-serif text-red-400">Admin Portal</h2>
                <button onClick={() => setIsAdmin(false)} className="text-xs text-gray-400 underline">Logout</button>
            </div>

            {/* Update Daily Message */}
            <div className="bg-mystic-800 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-2">Update Daily Insight</h3>
                <textarea 
                    className="w-full bg-mystic-900 p-2 text-sm text-white rounded border border-mystic-700 mb-2"
                    value={dailyMsg}
                    onChange={(e) => setDailyMsg(e.target.value)}
                />
                <button onClick={handleUpdateMsg} className="bg-emerald-600 text-white text-xs px-3 py-1 rounded">Update Website</button>
            </div>

            {/* View Users (Mock SQL) */}
            <div className="bg-mystic-800 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-2">Recent Feedbacks</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {feedbacks.map(fb => (
                        <div key={fb.id} className="bg-mystic-900 p-2 rounded text-xs">
                            <div className="flex justify-between text-gray-400">
                                <span>{fb.userName}</span>
                                <span className="text-yellow-400">{'★'.repeat(fb.rating)}</span>
                            </div>
                            <p className="text-gray-200 mt-1">{fb.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};