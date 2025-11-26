import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { RegistrationForm } from './components/RegistrationForm';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';
import { Wallet } from './pages/Wallet';
import { Admin } from './pages/Admin';
import { db } from './services/db';
import { UserProfile } from './types';

function App() {
  const [user, setUser] = useState<UserProfile>(db.getUser());
  const [activeTab, setActiveTab] = useState('home');

  const refreshUser = () => {
    setUser(db.getUser());
  };

  useEffect(() => {
    // Check if user is registered, if not, stay on home but show registration eventually
    // For this flow, we check registration in render
  }, []);

  const renderContent = () => {
    if (!user.isRegistered) {
      return <RegistrationForm onComplete={refreshUser} />;
    }

    switch (activeTab) {
      case 'home':
        return <Home user={user} setTab={setActiveTab} />;
      case 'chat':
        return <Chat user={user} refreshUser={refreshUser} setTab={setActiveTab} />;
      case 'wallet':
        return <Wallet user={user} refreshUser={refreshUser} />;
      case 'profile':
        // Reuse registration form as read-only or edit in a real app, 
        // for now just show basic details or the form pre-filled.
        // Let's just show the registration form to allow editing.
        return (
            <div className="space-y-4">
                <div className="bg-mystic-800 p-4 rounded-xl text-center">
                    <h3 className="text-xl font-serif text-mystic-gold">{user.name}</h3>
                    <p className="text-gray-400">{user.contactNumber}</p>
                </div>
                <RegistrationForm onComplete={refreshUser} />
            </div>
        );
      case 'admin':
        return <Admin user={user} />;
      default:
        return <Home user={user} setTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userBalance={user.walletBalance}>
      {renderContent()}
    </Layout>
  );
}

export default App;