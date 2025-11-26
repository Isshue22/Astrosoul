import { UserProfile, Transaction, Feedback, ZodiacSign } from '../types';

const DB_KEYS = {
  USER: 'astrosoul_user',
  TRANSACTIONS: 'astrosoul_transactions',
  FEEDBACKS: 'astrosoul_feedbacks',
  ADMIN_HOROSCOPE: 'astrosoul_admin_horoscope',
};

// Initial Mock User Data
const INITIAL_USER: UserProfile = {
  id: 'guest',
  name: '',
  dob: '',
  timeOfBirth: '',
  placeOfBirth: '',
  contactNumber: '',
  zodiacSign: ZodiacSign.Aries,
  isRegistered: false,
  walletBalance: 0,
  freeMinutesUsed: 0,
  isFreeTrialActive: true,
};

export const db = {
  // --- User Table Operations ---
  getUser: (): UserProfile => {
    const data = localStorage.getItem(DB_KEYS.USER);
    return data ? JSON.parse(data) : INITIAL_USER;
  },

  saveUser: (user: UserProfile): void => {
    localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
  },

  updateFreeMinutes: (minutes: number): boolean => {
    const user = db.getUser();
    const newUsed = user.freeMinutesUsed + minutes;
    
    // Cap at 5 minutes for free trial
    if (user.isFreeTrialActive && newUsed >= 5) {
      user.freeMinutesUsed = 5;
      user.isFreeTrialActive = false;
      db.saveUser(user);
      return false; // Trial ended
    }
    
    user.freeMinutesUsed = newUsed;
    db.saveUser(user);
    return true; // Trial continues
  },

  deductBalance: (amount: number): boolean => {
    const user = db.getUser();
    if (user.walletBalance >= amount) {
      user.walletBalance -= amount;
      db.saveUser(user);
      db.addTransaction({
        id: Date.now().toString(),
        userId: user.id,
        amount: amount,
        type: 'debit',
        description: 'Chat Session',
        date: new Date().toISOString()
      });
      return true;
    }
    return false;
  },

  addBalance: (amount: number): void => {
    const user = db.getUser();
    user.walletBalance += amount;
    db.saveUser(user);
    db.addTransaction({
      id: Date.now().toString(),
      userId: user.id,
      amount: amount,
      type: 'credit',
      description: 'Wallet Recharge',
      date: new Date().toISOString()
    });
  },

  // --- Transactions Table ---
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(DB_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },

  addTransaction: (tx: Transaction) => {
    const list = db.getTransactions();
    list.unshift(tx);
    localStorage.setItem(DB_KEYS.TRANSACTIONS, JSON.stringify(list));
  },

  // --- Feedback Table ---
  getFeedbacks: (): Feedback[] => {
    const data = localStorage.getItem(DB_KEYS.FEEDBACKS);
    return data ? JSON.parse(data) : [];
  },

  addFeedback: (fb: Feedback) => {
    const list = db.getFeedbacks();
    list.unshift(fb);
    localStorage.setItem(DB_KEYS.FEEDBACKS, JSON.stringify(list));
  },

  // --- Admin Portal Operations ---
  getDailyMessage: (): string => {
    return localStorage.getItem(DB_KEYS.ADMIN_HOROSCOPE) || " The stars are aligned in your favor today. Trust your intuition.";
  },

  setDailyMessage: (msg: string) => {
    localStorage.setItem(DB_KEYS.ADMIN_HOROSCOPE, msg);
  }
};