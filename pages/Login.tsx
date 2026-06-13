import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { UserRole, User } from '../types';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { INITIAL_USERS } from '../services/mockData';

const Login: React.FC = () => {
  const { setUser, addUser, deleteUser, setView, users, landingContent } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.DONATOR);
  
  // Email/Password Auth Fields
  const [emailAuth, setEmailAuth] = useState('');
  const [passwordAuth, setPasswordAuth] = useState('');
  
  // Common Identity Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  
  // Donator Specific Fields
  const [cnic, setCnic] = useState('');
  const [donationRs, setDonationRs] = useState('');
  const [platform, setPlatform] = useState('EasyPaisa');

  // Beneficiary Specific Fields
  const [cnicFront, setCnicFront] = useState<string | undefined>(undefined);
  const [cnicBack, setCnicBack] = useState<string | undefined>(undefined);
  const [medicalReport, setMedicalReport] = useState<string | undefined>(undefined);
  const [selectedDemands, setSelectedDemands] = useState<string[]>([]);
  const [povertySubDemands, setPovertySubDemands] = useState<string[]>([]);
  const [welfareSubOption, setWelfareSubOption] = useState<string | undefined>(undefined);
  const [educationClass, setEducationClass] = useState('');
  const [educationSubDemands, setEducationSubDemands] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const medicalReportRef = useRef<HTMLInputElement>(null);

  const DEMAND_OPTIONS = [
    "Poverty alleviation", 
    "Health", 
    "Education", 
    "Welfare",
    "Welfare, Training and Rehabilitation of the persons with disabilities",
    "Recreational programmes intended to keep people away from anti-social activities",
    "Civic education, aimed at developing sense of civic responsibility",
    "Welfare and rehabilitation of patients",
    "Human Rights",
    "Religious education, Interfaith and Sectarian harmony",
    "Health and reproductive health",
    "Vocational and professional training"
  ];
  
  const POVERTY_SUB_OPTIONS = ["Rashan", "Shelter", "Need clothes"];
  const WELFARE_SUB_OPTIONS = ["Child Welfare", "Youth Welfare", "Women Welfare"];
  const EDUCATION_SUB_OPTIONS = ["Books & Stationary", "Academics"];

  // Force allowed role when registering
  useEffect(() => {
    if (isRegistering && (role === UserRole.ADMIN || role === UserRole.TRUSTEE)) {
      setRole(UserRole.DONATOR);
    }
  }, [isRegistering]);

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleDemand = (demand: string) => {
    setSelectedDemands(prev => {
      const exists = prev.includes(demand);
      if (exists) {
        if (demand === 'Welfare') setWelfareSubOption(undefined);
        if (demand === 'Poverty alleviation') setPovertySubDemands([]);
        if (demand === 'Education') {
          setEducationClass('');
          setEducationSubDemands([]);
        }
        return prev.filter(d => d !== demand);
      } else {
        return [...prev, demand];
      }
    });
  };

  const togglePovertySubDemand = (sub: string) => {
    // Modified to single-select
    setPovertySubDemands(prev => 
      prev.includes(sub) ? [] : [sub]
    );
  };

  const toggleEducationSubDemand = (sub: string) => {
    setEducationSubDemands(prev => 
      prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]
    );
  };

  const handleAuth = async (e: React.FormEvent, method: 'google' | 'email') => {
    e.preventDefault();
    if (isRegistering) {
      if (role === UserRole.ADMIN || role === UserRole.TRUSTEE) {
        alert('Board members and Admins cannot register publicly.');
        return;
      }
      
      if (!firstName || !lastName || !contactNo) {
        alert('Please fill in the primary identification fields (Name and Contact).');
        return;
      }

      if (role === UserRole.BENEFICIARY && !cnic) {
        alert('Please provide your CNIC Number.');
        return;
      }
      
      if (role === UserRole.DONATOR && !donationRs) {
        alert('Please provide your donation amount to complete registration.');
        return;
      }

      if (role === UserRole.BENEFICIARY) {
        if (!cnicFront || !cnicBack || !avatar || selectedDemands.length === 0) {
          alert('Beneficiaries must upload CNIC photos, a profile picture, and select support demands.');
          return;
        }
        if (selectedDemands.includes('Poverty alleviation') && povertySubDemands.length === 0) {
          alert('Please select specific needs for Poverty Alleviation.');
          return;
        }
        if (selectedDemands.includes('Health') && !medicalReport) {
          alert('Please upload a medical report for your health assistance request.');
          return;
        }
        if (selectedDemands.includes('Welfare') && !welfareSubOption) {
          alert('Please select a specific welfare category.');
          return;
        }
        if (selectedDemands.includes('Education')) {
          if (!educationClass || educationSubDemands.length === 0) {
            alert('Please provide your class name and select education requirements.');
            return;
          }
        }
      }

      try {
        let result;
        if (method === 'google') {
          const provider = new GoogleAuthProvider();
          result = await signInWithPopup(auth, provider);
        } else {
          if (!emailAuth || !passwordAuth) {
             alert('Please enter your email and password to register.');
             return;
          }
          result = await createUserWithEmailAndPassword(auth, emailAuth, passwordAuth);
        }
        
        const fbUid = result.user.uid;
        const fbEmail = result.user.email || emailAuth || '';
        
        const fullName = `${firstName} ${lastName}`.trim();
        
        // Build final demands with sub-details
        const finalDemands = selectedDemands.map(d => {
          if (d === 'Poverty alleviation' && povertySubDemands.length > 0) return `Poverty alleviation (${povertySubDemands.join(', ')})`;
          if (d === 'Welfare' && welfareSubOption) return `Welfare (${welfareSubOption})`;
          if (d === 'Education' && educationClass) return `Education (Class: ${educationClass}, Needs: ${educationSubDemands.join(', ')})`;
          return d;
        });

        const newUserPayload = {
          name: fullName,
          firstName, lastName, email: fbEmail, role,
          phone: contactNo,
          cnic, cnicFront, cnicBack, medicalReport,
          demands: finalDemands,
          avatar: avatar || result.user.photoURL || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
        };

        const initialDonation = role === UserRole.DONATOR ? {
          amount: Number(donationRs),
          method: platform as any,
          purpose: 'Initial registration donation'
        } : undefined;

        await addUser(newUserPayload, initialDonation, fbUid);
        alert('Registration successful! Welcome to Albadar Trust.');
        setIsRegistering(false);
      } catch (error: any) {
        alert('Error signing in: ' + error.message);
      }
    } else {
      try {
        let result;
        if (method === 'google') {
          const provider = new GoogleAuthProvider();
          result = await signInWithPopup(auth, provider);
        } else {
          if (!emailAuth || !passwordAuth) {
             alert('Please enter your email and password to login.');
             return;
          }
          try {
            result = await signInWithEmailAndPassword(auth, emailAuth, passwordAuth);
          } catch (internalError: any) {
            if (internalError.code === 'auth/user-not-found' || internalError.code === 'auth/invalid-credential') {
              const existingPreInvited = INITIAL_USERS.find(u => (u.role === UserRole.TRUSTEE || u.role === UserRole.ADMIN) && u.email.toLowerCase() === emailAuth.toLowerCase());
              if (existingPreInvited) {
                // First time login for an invited admin/trustee. Create their auth credential!
                result = await createUserWithEmailAndPassword(auth, emailAuth, passwordAuth);
                // Migrate the old user doc to the new UID
                const fbUid = result.user.uid;
                const { id, approved, ...userDataToCopy } = existingPreInvited;
                await addUser(userDataToCopy as Omit<User, 'id'|'approved'>, undefined, fbUid);
                return; // addUser handles setUser and setView
              }
            }
            throw internalError; // re-throw if not intercepted
          }
        }

        const userDocRef = doc(db, 'users', result.user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
           setUser(userDocSnap.data() as User);
           setView('dashboard');
        } else {
           alert('Account not found in our records. Please contact administration.');
           auth.signOut();
        }
      } catch (error: any) {
         alert('Error signing in: ' + error.message);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Account details copied to clipboard!');
  };

  const roleConfigs = [
    { role: UserRole.DONATOR, label: 'Donator', icon: 'fa-heart', color: 'bg-rose-100 text-rose-600' },
    { role: UserRole.BENEFICIARY, label: 'Beneficiary', icon: 'fa-people-roof', color: 'bg-blue-100 text-blue-600' },
    { role: UserRole.TRUSTEE, label: 'Governance', icon: 'fa-building-shield', color: 'bg-emerald-100 text-emerald-600' },
    { role: UserRole.ADMIN, label: 'Admin', icon: 'fa-user-lock', color: 'bg-amber-100 text-amber-600' },
  ];

  const filteredRoles = isRegistering ? roleConfigs.filter(r => r.role === UserRole.DONATOR || r.role === UserRole.BENEFICIARY) : roleConfigs;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 relative overflow-x-hidden">
      <button onClick={() => setView('home')} className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-emerald-600 font-bold group">
        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-emerald-50 transition-all">
          <i className="fa-solid fa-arrow-left text-xs"></i>
        </div>
        <span>Back to Home</span>
      </button>

      <div className={`w-full ${isRegistering ? 'max-w-[700px]' : 'max-w-[500px]'} bg-white p-6 sm:p-10 rounded-[40px] shadow-2xl border border-gray-100 transition-all duration-500`}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-[28px] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-xl">A</div>
          <h1 className="text-3xl font-extrabold text-[#111827]">Albadar Welfare Trust</h1>
          <p className="text-gray-400 font-medium mt-2">{isRegistering ? `New ${role} Account` : 'Secure Portal Login'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {filteredRoles.map((config) => (
            <button type="button" key={config.role} onClick={() => setRole(config.role)} className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 ${role === config.role ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-50 bg-[#F9FAFB]'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}><i className={`fa-solid ${config.icon} text-sm`}></i></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${role === config.role ? 'text-emerald-800' : 'text-gray-400'}`}>{config.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {isRegistering ? (
            <div className="space-y-6 animate-fade-in-up">
              {/* Profile Photo only for Beneficiaries */}
              {role === UserRole.BENEFICIARY && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                      {avatar ? <img src={avatar} className="w-full h-full object-cover" alt="Avatar" /> : <i className="fa-solid fa-camera text-gray-300 text-2xl"></i>}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <i className="fa-solid fa-plus text-xs"></i>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, setAvatar)} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Photo</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
                <input required type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
              </div>

              <input required type="tel" placeholder="Contact Number (WhatsApp)" value={contactNo} onChange={e => setContactNo(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />

              {/* Beneficiary CNIC */}
              {role === UserRole.BENEFICIARY && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Identity Verification</h3>
                  <input required={role === UserRole.BENEFICIARY} type="text" placeholder="CNIC Number (e.g. 42101-1234567-1)" value={cnic} onChange={e => setCnic(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => cnicFrontRef.current?.click()} className={`h-24 rounded-2xl border-2 border-dashed ${cnicFront ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-400'} flex flex-col items-center justify-center overflow-hidden relative`}>
                      {cnicFront ? <img src={cnicFront} className="absolute inset-0 w-full h-full object-cover opacity-30" /> : <i className="fa-regular fa-id-card mb-2 text-xl"></i>}
                      <span className="text-[10px] font-bold z-10">Upload Front</span>
                    </button>
                    <button type="button" onClick={() => cnicBackRef.current?.click()} className={`h-24 rounded-2xl border-2 border-dashed ${cnicBack ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-gray-50 text-gray-400'} flex flex-col items-center justify-center overflow-hidden relative`}>
                      {cnicBack ? <img src={cnicBack} className="absolute inset-0 w-full h-full object-cover opacity-30" /> : <i className="fa-regular fa-credit-card mb-2 text-xl"></i>}
                      <span className="text-[10px] font-bold z-10">Upload Back</span>
                    </button>
                  </div>
                  <input type="file" ref={cnicFrontRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, setCnicFront)} />
                  <input type="file" ref={cnicBackRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, setCnicBack)} />
                </div>
              )}

              {/* Beneficiary Demands */}
              {role === UserRole.BENEFICIARY && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Required Assistance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                    {DEMAND_OPTIONS.map(opt => (
                      <button type="button" key={opt} onClick={() => toggleDemand(opt)} className={`p-4 rounded-2xl text-left border-2 transition-all ${selectedDemands.includes(opt) ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'}`}>
                        <div className="flex items-start">
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center mr-3 shrink-0 ${selectedDemands.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                            {selectedDemands.includes(opt) && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                          </div>
                          <span className="text-xs font-semibold leading-relaxed">{opt}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Sub-Forms based on selected demands */}
                  {selectedDemands.includes('Poverty alleviation') && (
                    <div className="bg-amber-50 rounded-2xl p-4 mt-4 border border-amber-100">
                      <h4 className="text-[10px] font-black uppercase text-amber-800 mb-3">Poverty Need Specifics</h4>
                      <div className="flex flex-wrap gap-2">
                        {POVERTY_SUB_OPTIONS.map(sub => (
                          <button type="button" key={sub} onClick={() => togglePovertySubDemand(sub)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${povertySubDemands.includes(sub) ? 'bg-amber-500 text-white shadow-sm' : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-100'}`}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDemands.includes('Health') && (
                    <div className="bg-rose-50 rounded-2xl p-4 mt-4 border border-rose-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-rose-800 mb-1">Medical Proof Required</h4>
                        <p className="text-xs text-rose-600 font-medium">Upload latest doctor prescription</p>
                      </div>
                      <button type="button" onClick={() => medicalReportRef.current?.click()} className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${medicalReport ? 'bg-rose-500 text-white' : 'bg-white text-rose-500 border border-rose-200'}`}>
                        <i className={`fa-solid ${medicalReport ? 'fa-check' : 'fa-upload'} text-lg`}></i>
                      </button>
                      <input type="file" ref={medicalReportRef} className="hidden" onChange={(e) => handleFileRead(e, setMedicalReport)} />
                    </div>
                  )}

                  {selectedDemands.includes('Welfare') && (
                    <div className="bg-purple-50 rounded-2xl p-4 mt-4 border border-purple-100">
                      <h4 className="text-[10px] font-black uppercase text-purple-800 mb-3">Welfare Category</h4>
                      <select value={welfareSubOption || ''} onChange={e => setWelfareSubOption(e.target.value)} className="w-full bg-white border-purple-200 text-purple-800 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-400 outline-none">
                        <option value="" disabled>Select Category...</option>
                        {WELFARE_SUB_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  )}

                  {selectedDemands.includes('Education') && (
                    <div className="bg-blue-50 rounded-2xl p-4 mt-4 border border-blue-100 space-y-3">
                      <h4 className="text-[10px] font-black uppercase text-blue-800 mb-1">Education Details</h4>
                      <input type="text" placeholder="Current Class / Semester" value={educationClass} onChange={e => setEducationClass(e.target.value)} className="w-full px-4 py-3 bg-white border-blue-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-400 outline-none placeholder:text-blue-300 text-blue-800" />
                      <div className="flex flex-wrap gap-2 pt-2">
                        {EDUCATION_SUB_OPTIONS.map(sub => (
                          <button type="button" key={sub} onClick={() => toggleEducationSubDemand(sub)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${educationSubDemands.includes(sub) ? 'bg-blue-500 text-white shadow-sm' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-100'}`}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Initial Donation for Donators */}
              {role === UserRole.DONATOR && (
                <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700">
                      <i className="fa-solid fa-gift text-xs"></i>
                    </div>
                    <h3 className="text-sm font-bold text-emerald-900">Make an Initial Deposit</h3>
                  </div>
                  <div className="space-y-4">
                    <input required={role === UserRole.DONATOR} type="number" placeholder="Amount (Rs)" value={donationRs} onChange={e => setDonationRs(e.target.value)} className="w-full px-5 py-4 bg-white border-transparent rounded-2xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all font-bold text-emerald-900" />
                    <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full px-5 py-4 bg-white border-transparent rounded-2xl text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all font-bold text-emerald-900 appearance-none">
                      {landingContent.officialAccounts.map(acc => (
                        <option key={acc.id} value={acc.label}>{acc.label} ({acc.num})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Account Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="email" placeholder="Email Address (for Email Auth)" value={emailAuth} onChange={e => setEmailAuth(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
                  <input type="password" placeholder="Password (for Email Auth)" value={passwordAuth} onChange={e => setPasswordAuth(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
                </div>
              </div>
              
              <button type="submit" onClick={(e) => handleAuth(e, emailAuth ? 'email' : 'google')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-200 flex items-center justify-center space-x-3">
                <i className={`fa-solid ${emailAuth ? 'fa-envelope' : 'fa-google'} text-lg`}></i>
                <span>Register with {emailAuth ? 'Email' : 'Google'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up">
              <div className="space-y-4">
                <input type="email" placeholder="Email Address" value={emailAuth} onChange={e => setEmailAuth(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
                <input type="password" placeholder="Password" value={passwordAuth} onChange={e => setPasswordAuth(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-medium" />
              </div>
              <button type="button" onClick={(e) => handleAuth(e, 'email')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center space-x-3">
                <i className="fa-solid fa-envelope text-lg"></i>
                <span>Sign in with Email</span>
              </button>
              
              <div className="flex items-center space-x-4 my-2">
                 <div className="h-px flex-grow bg-gray-100"></div>
                 <span className="text-xs text-gray-400 font-medium">OR</span>
                 <div className="h-px flex-grow bg-gray-100"></div>
              </div>

              <button type="button" onClick={(e) => handleAuth(e, 'google')} className="w-full bg-[#111827] hover:bg-black text-white py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98] shadow-xl flex items-center justify-center space-x-3">
                <i className="fa-brands fa-google text-lg"></i>
                <span>Sign in with Google</span>
              </button>
            </div>
          )}

          <p className="text-center text-sm font-medium text-gray-500 pt-4">
            {isRegistering ? 'Already part of the trust?' : 'New to Albadar Trust?'}
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="ml-2 text-emerald-600 font-bold hover:underline">
               {isRegistering ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
