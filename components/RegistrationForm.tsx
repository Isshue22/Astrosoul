import React, { useState } from 'react';
import { UserProfile, ZodiacSign } from '../types';
import { db } from '../services/db';

interface Props {
  onComplete: () => void;
}

export const RegistrationForm: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    dob: '',
    timeOfBirth: '',
    placeOfBirth: '',
    contactNumber: '',
    zodiacSign: ZodiacSign.Aries,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      ...db.getUser(),
      ...formData as UserProfile,
      id: Date.now().toString(), // Simple ID generation
      isRegistered: true,
      isFreeTrialActive: true,
      freeMinutesUsed: 0,
      walletBalance: 0
    };
    db.saveUser(newUser);
    onComplete();
  };

  return (
    <div className="bg-mystic-800 p-6 rounded-2xl shadow-xl border border-mystic-700">
      <h2 className="text-2xl font-serif text-mystic-gold mb-4 text-center">Complete Your Profile</h2>
      <p className="text-gray-300 text-sm text-center mb-6">Enter your details to get precise predictions and <span className="text-green-400 font-bold">5 Minutes Free Chat!</span></p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Full Name</label>
          <input required name="name" onChange={handleChange} className="w-full bg-mystic-900 border border-mystic-700 rounded-lg p-3 text-white focus:border-mystic-gold outline-none" placeholder="e.g. Rahul Sharma" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-sm text-gray-400 mb-1">Date of Birth</label>
            <input required type="date" name="dob" onChange={handleChange} className="w-full bg-mystic-900 border border-mystic-700 rounded-lg p-3 text-white focus:border-mystic-gold outline-none" />
            </div>
            <div>
            <label className="block text-sm text-gray-400 mb-1">Time</label>
            <input required type="time" name="timeOfBirth" onChange={handleChange} className="w-full bg-mystic-900 border border-mystic-700 rounded-lg p-3 text-white focus:border-mystic-gold outline-none" />
            </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Place of Birth</label>
          <input required name="placeOfBirth" onChange={handleChange} className="w-full bg-mystic-900 border border-mystic-700 rounded-lg p-3 text-white focus:border-mystic-gold outline-none" placeholder="e.g. Mumbai, India" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Mobile Contact</label>
          <input required type="tel" name="contactNumber" onChange={handleChange} className="w-full bg-mystic-900 border border-mystic-700 rounded-lg p-3 text-white focus:border-mystic-gold outline-none" placeholder="+91 98765 43210" />
        </div>

        <div>
            <label className="block text-sm text-gray-400 mb-1">Zodiac Sign</label>
            <select name="zodiacSign" onChange={handleChange} className="w-full bg-mystic-900 border border-mystic-700 rounded-lg p-3 text-white focus:border-mystic-gold outline-none">
                {Object.values(ZodiacSign).map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                ))}
            </select>
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-mystic-gold to-yellow-600 text-black font-bold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all">
          Start My Journey
        </button>
      </form>
    </div>
  );
};