
import React, { useState, useEffect, createContext, useContext } from 'react';
import { UserRole, User, Program, Donation, Expense, Application, LandingPageContent } from './types';
import { INITIAL_USERS, INITIAL_PROGRAMS, INITIAL_DONATIONS, INITIAL_EXPENSES, INITIAL_APPLICATIONS, INITIAL_LANDING_CONTENT } from './services/mockData';
import { db, auth, handleFirestoreError, OperationType } from './firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

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
  addUser: (user: Omit<User, 'id' | 'approved'>, initialDonation?: { amount: number, method: any, purpose: string }, uid?: string) => void;
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
  const [firebaseUserUid, setFirebaseUserUid] = useState<string | null>(null);

  // Firestore Sync Effect
  useEffect(() => {
    const unsubPrograms = onSnapshot(collection(db, 'programs'), (snapshot) => {
      setPrograms(snapshot.docs.map(doc => doc.data() as Program));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'programs'));

    const unsubConfig = onSnapshot(doc(db, 'config', 'landing'), (snapshot) => {
      if (snapshot.exists()) {
        setLandingContent(snapshot.data()?.landingContent as LandingPageContent);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'config/landing'));

    onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setFirebaseUserUid(fbUser.uid);
      } else {
        setFirebaseUserUid(null);
        setUser(null);
        if (view !== 'home' && view !== 'team' && view !== 'login') setView('home');
      }
    });

    return () => {
      unsubPrograms();
      unsubConfig();
    };
  }, []);

  // Secure collections (only fetch when user is signed in)
  useEffect(() => {
    if (!firebaseUserUid) return;

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const allUsers = snapshot.docs.map(doc => doc.data() as User);
      setUsers(allUsers);
      const currentUserProfile = allUsers.find(u => u.id === firebaseUserUid);
      if (currentUserProfile) {
        setUser(currentUserProfile);
        if (view === 'login' || view === 'home') setView('dashboard');
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'users'));

    return () => unsubUsers();
  }, [firebaseUserUid]);

  // Dependent collections based on user role
  useEffect(() => {
    if (!user) {
      setDonations(INITIAL_DONATIONS);
      setExpenses(INITIAL_EXPENSES);
      setApplications(INITIAL_APPLICATIONS);
      return;
    }

    const isAdmin = user.role === 'ADMIN';

    const donationsQuery = isAdmin 
      ? collection(db, 'donations') 
      : query(collection(db, 'donations'), where('userId', '==', user.id));

    const expensesQuery = isAdmin
      ? collection(db, 'expenses')
      : query(collection(db, 'expenses'), where('userId', '==', user.id));

    const applicationsQuery = isAdmin
      ? collection(db, 'applications')
      : query(collection(db, 'applications'), where('userId', '==', user.id));

    const unsubDonations = onSnapshot(donationsQuery, (snapshot) => {
      setDonations(snapshot.docs.map(doc => doc.data() as Donation));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'donations'));

    const unsubExpenses = onSnapshot(expensesQuery, (snapshot) => {
      setExpenses(snapshot.docs.map(doc => doc.data() as Expense));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'expenses'));

    const unsubApplications = onSnapshot(applicationsQuery, (snapshot) => {
      setApplications(snapshot.docs.map(doc => doc.data() as Application));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'applications'));

    return () => {
      unsubDonations();
      unsubExpenses();
      unsubApplications();
    };
  }, [user?.id, user?.role, view]); // rely on user id and role

  const handleSetUser = (u: User | null) => {
    setUser(u);
    if (!u) {
      setView('home');
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setView('home');
  };

  const addDonation = async (amount: number, programId: string, method: any = 'EasyPaisa', purpose: string = '') => {
    if (!firebaseUserUid) return;
    const donationId = `d-${Date.now()}`;
    const newDonation: Donation = {
      id: donationId,
      userId: firebaseUserUid,
      programId,
      amount,
      method,
      date: new Date().toISOString(),
      status: 'SUCCESSFUL',
      purpose
    };
    
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'donations', donationId), newDonation);
      if (programId !== 'GENERAL') {
        const prog = programs.find(p => p.id === programId);
        if (prog) {
          batch.update(doc(db, 'programs', programId), { raised: prog.raised + amount });
        }
      }
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'donations');
    }
  };

  const addUser = async (data: Omit<User, 'id' | 'approved'>, initialDonation?: { amount: number, method: any, purpose: string }, forcedUid?: string) => {
    const uidToUse = forcedUid || firebaseUserUid || `u-${Date.now()}`;
    const newUser: User = { ...data, id: uidToUse, approved: true };
    
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'users', uidToUse), newUser);
      
      if (initialDonation && initialDonation.amount > 0) {
        const donationId = `d-init-${Date.now()}`;
        const donation: Donation = {
          id: donationId,
          userId: uidToUse,
          programId: 'GENERAL',
          amount: initialDonation.amount,
          method: initialDonation.method,
          date: new Date().toISOString(),
          status: 'SUCCESSFUL',
          purpose: initialDonation.purpose
        };
        batch.set(doc(db, 'donations', donationId), donation);
      }
      await batch.commit();
      setUser(newUser);
      setView('dashboard');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const addApplication = async (programId: string) => {
    if (!firebaseUserUid) return;
    const appId = `a-${Date.now()}`;
    const newApp: Application = {
      id: appId,
      userId: firebaseUserUid,
      programId,
      status: 'PENDING',
      documents: ['Verified_ID.pdf'],
      appliedDate: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'applications', appId), newApp);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'applications');
    }
  };

  const updateApplicationStatus = async (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) => {
    try {
      if (status === 'REJECTED') {
        await updateDoc(doc(db, 'applications', id), { status, rejectionReason });
      } else {
        await updateDoc(doc(db, 'applications', id), { status });
      }
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, 'applications');
    }
  };

  const addProgram = async (data: Omit<Program, 'id' | 'raised'>) => {
    const pId = `p-${Date.now()}`;
    try {
      await setDoc(doc(db, 'programs', pId), { ...data, id: pId, raised: 0 });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'programs');
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', id), updates);
    } catch(error) {
       handleFirestoreError(error, OperationType.UPDATE, 'users');
    }
  };

  const deleteUser = async (id: string) => {
    if (id === FIRST_ADMIN_ID) return;
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch(error) {
       handleFirestoreError(error, OperationType.DELETE, 'users');
    }
  };

  const addExpense = async (data: Omit<Expense, 'id' | 'date' | 'userId'>) => {
    if (!firebaseUserUid) return;
    const eId = `e-${Date.now()}`;
    try {
      await setDoc(doc(db, 'expenses', eId), { ...data, id: eId, date: new Date().toISOString(), userId: firebaseUserUid });
    } catch(error) {
      handleFirestoreError(error, OperationType.CREATE, 'expenses');
    }
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
    </AppContext.Provider>
  );
};

export default App;
