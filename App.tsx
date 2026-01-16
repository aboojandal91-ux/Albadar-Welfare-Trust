
import React, { useState, useEffect, createContext, useContext } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { UserRole, User, Program, Donation, Expense, Application, LandingPageContent } from './types';
import { INITIAL_USERS, INITIAL_PROGRAMS, INITIAL_DONATIONS, INITIAL_EXPENSES, INITIAL_APPLICATIONS, INITIAL_LANDING_CONTENT } from './services/mockData';

export const FIRST_ADMIN_ID = '1';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  donations: Donation[];
  setDonations: React.Dispatch<React.SetStateAction<Donation[]>>;
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  applications: Application[];
  setApplications: React.Dispatch<React.SetStateAction<Application[]>>;
  landingContent: LandingPageContent;
  setLandingContent: React.Dispatch<React.SetStateAction<LandingPageContent>>;
  view: string;
  setView: (view: string) => void;
  logout: () => void;
  addDonation: (amount: number, programId: string, method?: any, purpose?: string) => void;
  addApplication: (programId: string) => void;
  updateApplicationStatus: (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) => void;
  addProgram: (program: Omit<Program, 'id' | 'raised'>) => void;
  addUser: (user: Omit<User, 'id' | 'approved'>, initialDonation?: { amount: number, method: any, purpose: string }) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date' | 'userId'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Team from './pages/Team';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import BeneficiaryManagement from './pages/BeneficiaryManagement';
import TrusteeManagement from './pages/TrusteeManagement';
import PublicContentManagement from './pages/PublicContentManagement';
import AdminManagement from './pages/AdminManagement';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [programs, setPrograms] = useState<Program[]>(INITIAL_PROGRAMS);
  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [landingContent, setLandingContent] = useState<LandingPageContent>(INITIAL_LANDING_CONTENT);
  const [view, setView] = useState('home');

  useEffect(() => {
    const savedUser = localStorage.getItem('wt_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('wt_user', JSON.stringify(u));
      setView('dashboard');
    } else {
      localStorage.removeItem('wt_user');
      setView('home');
    }
  };

  const logout = () => handleSetUser(null);

  const addDonation = (amount: number, programId: string, method: any = 'EasyPaisa', purpose: string = '') => {
    const userId = user?.id || 'GUEST';
    const newDonation: Donation = {
      id: `d-${Date.now()}`,
      userId,
      programId,
      amount,
      method,
      date: new Date().toISOString(),
      status: 'SUCCESSFUL',
      purpose
    };
    setDonations(prev => [newDonation, ...prev]);
    if (programId !== 'GENERAL') {
      setPrograms(prev => prev.map(p => p.id === programId ? { ...p, raised: p.raised + amount } : p));
    }
  };

  const addUser = (data: Omit<User, 'id' | 'approved'>, initialDonation?: { amount: number, method: any, purpose: string }) => {
    const newUserId = `u-${Date.now()}`;
    const newUser: User = { ...data, id: newUserId, approved: true };
    setUsers(prev => [newUser, ...prev]);

    if (initialDonation && initialDonation.amount > 0) {
      const donation: Donation = {
        id: `d-init-${Date.now()}`,
        userId: newUserId,
        programId: 'GENERAL',
        amount: initialDonation.amount,
        method: initialDonation.method,
        date: new Date().toISOString(),
        status: 'SUCCESSFUL',
        purpose: initialDonation.purpose
      };
      setDonations(prev => [donation, ...prev]);
    }
  };

  const addApplication = (programId: string) => {
    if (!user) return;
    const newApp: Application = {
      id: `a-${Date.now()}`,
      userId: user.id,
      programId,
      status: 'PENDING',
      documents: ['Verified_ID.pdf'],
      appliedDate: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
  };

  const updateApplicationStatus = (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
    setApplications(prev => prev.map(app => app.id === id ? { ...app, status, rejectionReason } : app));
  };

  const addProgram = (data: Omit<Program, 'id' | 'raised'>) => {
    setPrograms(prev => [...prev, { ...data, id: `p-${Date.now()}`, raised: 0 }]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    if (user?.id === id) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('wt_user', JSON.stringify(updated));
    }
  };

  const deleteUser = (id: string) => {
    if (id === FIRST_ADMIN_ID) return;
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addExpense = (data: Omit<Expense, 'id' | 'date' | 'userId'>) => {
    if (!user) return;
    setExpenses(prev => [...prev, { ...data, id: `e-${Date.now()}`, date: new Date().toISOString(), userId: user.id }]);
  };

  const renderView = () => {
    if (!user) {
      if (view === 'login') return <Login />;
      if (view === 'team') return <Team />;
      return <Home />;
    }
    switch (view) {
      case 'dashboard': return <Dashboard />;
      case 'programs': return <Programs />;
      case 'reports': return <Reports />;
      case 'profile': return <Profile />;
      case 'beneficiaries': return <BeneficiaryManagement />;
      case 'trustees': return <TrusteeManagement />;
      case 'content-management': return <PublicContentManagement />;
      case 'admin-management': return <AdminManagement />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser: handleSetUser, programs, setPrograms, donations, setDonations, expenses, setExpenses, 
      users, setUsers, applications, setApplications, landingContent, setLandingContent, view, setView, logout,
      addDonation, addApplication, updateApplicationStatus, addProgram, addUser, updateUser, deleteUser, addExpense
    }}>
      <div className="min-h-screen flex flex-col pb-20 md:pb-0 bg-[#f8fafc]">
        {user && <Navbar />}
        <main className={`flex-grow ${view === 'home' || view === 'team' ? '' : 'container mx-auto px-4 py-6 md:py-10 max-w-full lg:max-w-6xl xl:max-w-7xl'}`}>
          {renderView()}
        </main>
        {user && <BottomNav />}
      </div>
      <SpeedInsights />
    </AppContext.Provider>
  );
};

export default App;
