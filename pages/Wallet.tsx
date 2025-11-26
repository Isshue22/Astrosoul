import React, { useState } from 'react';
import { UserProfile } from '../types';
import { db } from '../services/db';
import { CreditCard, History, IndianRupee } from 'lucide-react';

interface Props {
  user: UserProfile;
  refreshUser: () => void;
}

export const Wallet: React.FC<Props> = ({ user, refreshUser }) => {
  const [amount, setAmount] = useState<number>(100);
  const transactions = db.getTransactions().filter(t => t.userId === user.id);

  const handleRecharge = () => {
    db.addBalance(amount);
    refreshUser();
    alert(`Success! Added ₹${amount} to your wallet.`);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 rounded-2xl shadow-xl border border-emerald-500/30 text-center">
        <p className="text-emerald-200 text-sm uppercase tracking-widest mb-1">Total Balance</p>
        <h2 className="text-4xl font-serif font-bold text-white flex justify-center items-center">
           <IndianRupee size={32} /> {user.walletBalance}
        </h2>
      </div>

      {/* Recharge Section */}
      <div className="bg-mystic-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="text-mystic-gold" /> Add Money
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
              {[50, 100, 200, 500, 1000, 2000].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`py-2 rounded border transition-all ${amount === val ? 'bg-mystic-gold text-black border-mystic-gold font-bold' : 'bg-mystic-900 border-mystic-700 text-gray-300 hover:border-gray-500'}`}
                  >
                      ₹{val}
                  </button>
              ))}
          </div>
          <button 
            onClick={handleRecharge}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg shadow-lg transition-colors"
          >
              Proceed to Pay ₹{amount}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">Secured by MockPay (Simulated)</p>
      </div>

      {/* Transaction History */}
      <div className="bg-mystic-800 p-4 rounded-2xl">
          <h3 className="text-md font-bold text-gray-300 mb-3 flex items-center gap-2">
              <History size={18} /> History
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {transactions.length === 0 && <p className="text-gray-500 text-sm">No transactions yet.</p>}
              {transactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center bg-mystic-900/50 p-3 rounded border border-mystic-700/50">
                      <div>
                          <div className="text-sm font-medium text-gray-200">{tx.description}</div>
                          <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</div>
                      </div>
                      <div className={`font-mono font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};