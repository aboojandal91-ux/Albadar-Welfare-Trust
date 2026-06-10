
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../App';
import { UserRole, User } from '../types';

const Login: React.FC = () => {
  const { setUser, addUser, setView, users, landingContent } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.DONATOR);
  
  // Basic Auth Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (role === UserRole.ADMIN || role === UserRole.TRUSTEE) {
        alert('Board members and Admins cannot register publicly.');
        return;
      }
      
      // Email and Password are now optional for registration
      if (!firstName || !lastName || !contactNo) {
        alert('Please fill in the primary identification fields (Name and Contact).');
        return;
      }

      // CNIC is now optional for Donators, but required for Beneficiaries
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
        firstName, lastName, email, role, password,
        phone: contactNo,
        cnic, cnicFront, cnicBack, medicalReport,
        demands: finalDemands,
        avatar: avatar || `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
      };

      const initialDonation = role === UserRole.DONATOR ? {
        amount: Number(donationRs),
        method: platform as any,
        purpose: 'Initial registration donation'
      } : undefined;

      addUser(newUserPayload, initialDonation);
      alert('Registration successful! Welcome to Albadar Trust.');
      setIsRegistering(false);
    } else {
      const foundUser = users.find(u => u.email === email && u.role === role);
      if (foundUser) {
        if (foundUser.password && foundUser.password !== password) {
          alert('Incorrect password.');
          return;
        }
        setUser(foundUser);
      } else {
        alert('User not found for this role.');
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

  // Helper for quick login buttons
  const quickLoginByRole = (targetRole: UserRole) => {
    const foundUser = users.find(u => u.role === targetRole);
    if (foundUser) setUser(foundUser);
  };

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
            <button key={config.role} onClick={() => setRole(config.role)} className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center space-y-2 ${role === config.role ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-50 bg-[#F9FAFB]'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}><i className={`fa-solid ${config.icon} text-sm`}></i></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${role === config.role ? 'text-emerald-800' : 'text-gray-400'}`}>{config.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {isRegistering ? (
            <div className="space-y-6 animate-fade-in-up">
              {/* Profile Photo only for Beneficiaries */}
              {role === UserRole.BENEFICIARY && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
                      {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <i className="fa-solid fa-camera text-2xl text-gray-200"></i>}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-lg transition-transform active:scale-95"><i className="fa-solid fa-plus text-xs"></i></button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, setAvatar)} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Picture of {role} *</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    {role === UserRole.BENEFICIARY ? 'Full Name *' : 'First Name *'}
                  </label>
                  <input required type="text" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500 transition-all" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    {role === UserRole.BENEFICIARY ? 'Son of / Wife of / Daughter of *' : 'Last Name *'}
                  </label>
                  <input required type="text" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500 transition-all" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>

              {role === UserRole.DONATOR && (
                <div className="space-y-6">
                  {/* Official Accounts Display Section */}
                  <div className="bg-emerald-900 p-6 rounded-[2.5rem] text-white space-y-4 shadow-xl border border-emerald-800">
                    <div className="flex items-center space-x-2 border-b border-emerald-800 pb-3 mb-4">
                      <i className="fa-solid fa-building-columns text-emerald-400"></i>
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Trust Official Accounts</h4>
                    </div>
                    
                    <div className="grid gap-3">
                      {landingContent.officialAccounts.map((acc) => (
                        <div key={acc.id} onClick={() => copyToClipboard(acc.num)} className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl border border-white/10 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <i className={`fa-solid ${acc.icon} text-xs`}></i>
                              </div>
                              <div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-emerald-300/60">{acc.label}</p>
                                <p className="text-xs font-black tracking-wider text-white group-hover:text-emerald-300 transition-colors">{acc.num}</p>
                                <p className="text-[7px] text-emerald-100/40 uppercase font-bold tracking-widest">{acc.name}</p>
                              </div>
                            </div>
                            <i className="fa-regular fa-copy text-[10px] text-emerald-500 group-hover:scale-110 transition-transform"></i>
                          </div>
                          {acc.iban && <p className="text-[7px] font-mono mt-1 text-emerald-500/50 truncate">IBAN: {acc.iban}</p>}
                        </div>
                      ))}
                    </div>
                    <p className="text-[9px] text-emerald-400/70 text-center italic font-medium px-4 leading-relaxed">Please make your contribution to any of the accounts above and declare the amount below to complete registration.</p>
                  </div>

                  <div className="bg-rose-50/30 p-6 rounded-[2rem] border border-rose-50 space-y-4 animate-fade-in-up">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">CNIC NO (Optional)</label>
                      <input type="text" placeholder="42201-XXXXXXX-X" className="w-full px-5 py-4 rounded-2xl bg-white border border-rose-100 outline-none font-medium focus:ring-2 focus:ring-rose-500" value={cnic} onChange={e => setCnic(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">Donation RS *</label>
                        <input required type="number" placeholder="Amount Sent" className="w-full px-5 py-4 rounded-2xl bg-white border border-rose-100 outline-none font-medium focus:ring-2 focus:ring-rose-500" value={donationRs} onChange={e => setDonationRs(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1">Paid Via *</label>
                        <select className="w-full px-5 py-4 rounded-2xl bg-white border border-rose-100 outline-none font-medium focus:ring-2 focus:ring-rose-500" value={platform} onChange={e => setPlatform(e.target.value)}>
                          {landingContent.officialAccounts.map(acc => (
                            <option key={acc.id} value={acc.label}>{acc.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {role === UserRole.BENEFICIARY && (
                <div className="bg-blue-50/30 p-6 rounded-[2rem] border border-blue-50 space-y-6 animate-fade-in-up">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">CNIC NO *</label>
                    <input required type="text" placeholder="42201-XXXXXXX-X" className="w-full px-5 py-4 rounded-2xl bg-white border border-blue-100 outline-none font-medium focus:ring-2 focus:ring-blue-500" value={cnic} onChange={e => setCnic(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-center">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">CNIC Front *</label>
                      <button type="button" onClick={() => cnicFrontRef.current?.click()} className="w-full aspect-video rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center overflow-hidden hover:border-blue-500 transition-all">
                        {cnicFront ? <img src={cnicFront} className="w-full h-full object-cover" /> : <i className="fa-solid fa-id-card text-blue-200 text-2xl"></i>}
                      </button>
                      <input type="file" ref={cnicFrontRef} className="hidden" accept="image/*" onChange={e => handleFileRead(e, setCnicFront)} />
                    </div>
                    <div className="space-y-2 text-center">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">CNIC Back *</label>
                      <button type="button" onClick={() => cnicBackRef.current?.click()} className="w-full aspect-video rounded-2xl border-2 border-dashed border-blue-200 bg-white flex items-center justify-center overflow-hidden hover:border-blue-500 transition-all">
                        {cnicBack ? <img src={cnicBack} className="w-full h-full object-cover" /> : <i className="fa-solid fa-id-card text-blue-200 text-2xl"></i>}
                      </button>
                      <input type="file" ref={cnicBackRef} className="hidden" accept="image/*" onChange={e => handleFileRead(e, setCnicBack)} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Demands (Select Multiple) *</label>
                    <div className="flex flex-wrap gap-2">
                      {DEMAND_OPTIONS.map(opt => (
                        <button 
                          key={opt} 
                          type="button" 
                          onClick={() => toggleDemand(opt)} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all text-left ${
                            selectedDemands.includes(opt) 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'bg-white text-blue-400 border border-blue-100 hover:bg-blue-50'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {selectedDemands.includes('Poverty alleviation') && (
                      <div className="mt-4 p-5 bg-white rounded-3xl border border-amber-100 space-y-4 animate-fade-in-up">
                        <div className="flex items-center space-x-2 mb-2">
                          <i className="fa-solid fa-hand-holding-hand text-amber-500 text-sm"></i>
                          <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Poverty Alleviation Needs (Single Select) *</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {POVERTY_SUB_OPTIONS.map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => togglePovertySubDemand(sub)}
                              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${povertySubDemands.includes(sub) ? 'bg-amber-600 text-white shadow-md' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                            >
                              <span>{sub}</span>
                              {povertySubDemands.includes(sub) && <i className="fa-solid fa-circle-check text-[10px]"></i>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDemands.includes('Welfare') && (
                      <div className="mt-4 p-5 bg-white rounded-3xl border border-blue-100 space-y-4 animate-fade-in-up">
                        <div className="flex items-center space-x-2 mb-2">
                          <i className="fa-solid fa-handshake-angle text-blue-500 text-sm"></i>
                          <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Select Welfare Category *</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {WELFARE_SUB_OPTIONS.map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => setWelfareSubOption(sub)}
                              className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${welfareSubOption === sub ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            >
                              <span>{sub}</span>
                              {welfareSubOption === sub && <i className="fa-solid fa-circle-check text-[10px]"></i>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDemands.includes('Education') && (
                      <div className="mt-4 p-5 bg-white rounded-3xl border border-emerald-100 space-y-5 animate-fade-in-up">
                        <div className="flex items-center space-x-2 mb-2">
                          <i className="fa-solid fa-graduation-cap text-emerald-500 text-sm"></i>
                          <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Education Details *</p>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Class Name</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. Class 10, Matric, Intermediate" 
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs font-bold focus:ring-2 focus:ring-emerald-500" 
                            value={educationClass}
                            onChange={e => setEducationClass(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Specific Requirements</label>
                          <div className="grid grid-cols-2 gap-2">
                            {EDUCATION_SUB_OPTIONS.map(sub => (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => toggleEducationSubDemand(sub)}
                                className={`flex items-center justify-center px-3 py-3 rounded-xl text-[10px] font-bold transition-all ${educationSubDemands.includes(sub) ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-50 text-emerald-600 border border-emerald-50 hover:bg-emerald-100'}`}
                              >
                                <span>{sub}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedDemands.includes('Health') && (
                    <div className="space-y-2 animate-fade-in-up">
                      <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-1">Health Report (PDF/Image) *</label>
                      <button type="button" onClick={() => medicalReportRef.current?.click()} className="w-full p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-white flex flex-col items-center justify-center space-y-2 hover:border-blue-500 transition-all">
                        {medicalReport ? (
                          <div className="flex flex-col items-center">
                            {medicalReport.startsWith('data:image') ? (
                              <img src={medicalReport} className="h-20 rounded-lg shadow-sm mb-2" />
                            ) : (
                              <i className="fa-solid fa-file-pdf text-rose-500 text-3xl mb-2"></i>
                            )}
                            <span className="text-[10px] font-bold text-gray-500">Document Uploaded Successfully</span>
                          </div>
                        ) : (
                          <>
                            <i className="fa-solid fa-file-medical text-blue-200 text-2xl"></i>
                            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Click to Upload Report</span>
                          </>
                        )}
                      </button>
                      <input type="file" ref={medicalReportRef} className="hidden" accept="image/*,application/pdf" onChange={e => handleFileRead(e, setMedicalReport)} />
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact NO *</label>
                <input required type="tel" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500" placeholder="+92 XXX XXXXXXX" value={contactNo} onChange={e => setContactNo(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Optional)</label>
                <input type="email" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Set Password (Optional)</label>
                <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" placeholder="email@example.com" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-medium focus:ring-2 focus:ring-emerald-500 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all mt-4">
            {isRegistering ? 'Submit Registration' : 'Sign In'}
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            {isRegistering ? 'Already a member?' : "New to the Trust?"} {' '}
            <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-emerald-600 font-bold hover:underline">
              {isRegistering ? 'Login Now' : 'Register Here'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
