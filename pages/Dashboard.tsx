
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import ProgramCard from '../components/ProgramCard';

const Dashboard: React.FC = () => {
  const { user, programs, donations, expenses, setView, applications, addDonation, landingContent, addApplication } = useApp();
  
  // Donator-specific state
  const [selectedPlatform, setSelectedPlatform] = useState('Medical');
  const [donationAmount, setDonationAmount] = useState<string>('5000');
  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');

  // Beneficiary-specific state
  const [isQuickRequestOpen, setIsQuickRequestOpen] = useState(false);
  const [quickRequestType, setQuickRequestType] = useState('General');

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const activeProgramsCount = programs.filter(p => p.status === 'ACTIVE').length;

  const handleDirectDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    addDonation(amount, 'GENERAL', paymentMethod as any, `Platform: ${selectedPlatform}`);
    alert(`Thank you! Your donation of Rs. ${amount.toLocaleString()} for the ${selectedPlatform} platform has been received and is pending verification.`);
    setDonationAmount('');
  };

  const handleQuickRequest = () => {
    addApplication('GENERAL');
    alert(`Your request for ${quickRequestType} assistance has been submitted to the Board for review.`);
    setIsQuickRequestOpen(false);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('Account details copied to clipboard!');
  };

  const renderTrusteeDashboard = () => {
    const isLawyer = user?.role === UserRole.TRUSTEE && user?.title === 'Lawyer';
    const isMediaRole = user?.role === UserRole.TRUSTEE && user?.title?.includes('Media Coordinator');

    return (
      <div className="space-y-6 lg:space-y-8 animate-fade-in-up">
        <header className="px-1">
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Governance Dashboard</h1>
          <p className="text-xs lg:text-base text-gray-500 mt-1 font-medium">Reviewing applications and oversight of trust activities.</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <StatsCard label="Raised" value={`Rs. ${totalDonations.toLocaleString()}`} icon="fa-coins" color="emerald" />
          <StatsCard label="Spent" value={`Rs. ${totalExpenses.toLocaleString()}`} icon="fa-receipt" color="rose" />
          <StatsCard label="Active" value={activeProgramsCount.toString()} icon="fa-heart-pulse" color="blue" />
          <StatsCard label="Applicants" value={applications.length.toString()} icon="fa-people-group" color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8 space-y-6 lg:space-y-8">
            {!isMediaRole && (
              <section className="bg-white p-6 lg:p-8 rounded-2xl lg:rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6">Governance Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
                  {!isLawyer && (
                    <button onClick={() => setView('beneficiaries')} className="p-4 lg:p-6 bg-blue-50 rounded-2xl flex flex-col items-center text-blue-700 hover:bg-blue-100 transition-all border border-blue-100 active:scale-95">
                      <i className="fa-solid fa-people-roof text-xl lg:text-2xl mb-2 lg:mb-3"></i>
                      <span className="text-[10px] font-black uppercase tracking-wide">Review Applicants</span>
                    </button>
                  )}
                  <button onClick={() => setView('reports')} className="p-4 lg:p-6 bg-rose-50 rounded-2xl flex flex-col items-center text-rose-700 hover:bg-rose-100 transition-all border border-rose-100 active:scale-95">
                    <i className="fa-solid fa-file-invoice-dollar text-xl lg:text-2xl mb-2 lg:mb-3"></i>
                    <span className="text-[10px] font-black uppercase tracking-wide">Audit Log</span>
                  </button>
                </div>
              </section>
            )}
            <RecentActivity />
          </div>
        </div>
      </div>
    );
  };

  const renderDonatorDashboard = () => (
    <div className="space-y-6 lg:space-y-10 animate-fade-in-up">
      <header className="px-1">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Support Albadar Trust</h1>
        <p className="text-xs lg:text-base text-gray-500 mt-1 font-medium">Hello {user?.name.split(' ')[0]}, your contribution changes lives.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Official Accounts Card */}
          <section className="bg-emerald-900 p-8 rounded-[3rem] text-white shadow-2xl border border-emerald-800 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                  <i className="fa-solid fa-building-columns"></i>
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest">Official Trust Accounts</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {landingContent.officialAccounts.map((acc) => (
                  <div 
                    key={acc.id} 
                    onClick={() => copyToClipboard(acc.num)}
                    className="bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all cursor-pointer group/item relative active:scale-95"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-300/60">{acc.label}</p>
                      <i className="fa-regular fa-copy text-[10px] text-emerald-500 opacity-40 group-hover/item:opacity-100 transition-opacity"></i>
                    </div>
                    <p className="text-sm font-black tracking-wider text-white mb-1">{acc.num}</p>
                    <p className="text-[8px] text-emerald-100/40 uppercase font-bold tracking-widest truncate">{acc.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Donation Form */}
          <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Make an Impact</h3>
            <form onSubmit={handleDirectDonation} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Support Platform</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {['Medical', 'Education', 'Poverty alleviation', 'General'].map(platform => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setSelectedPlatform(platform)}
                      className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all active:scale-95 ${
                        selectedPlatform === platform ? 'border-emerald-600 bg-emerald-50' : 'border-gray-50 bg-gray-50'
                      }`}
                    >
                      <span className={`text-xs font-bold ${selectedPlatform === platform ? 'text-emerald-700' : 'text-gray-400'}`}>{platform}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (PKR)</label>
                  <input 
                    required 
                    type="number" 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold text-lg focus:ring-4 focus:ring-emerald-500/10" 
                    value={donationAmount} 
                    onChange={e => setDonationAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold focus:ring-4 focus:ring-emerald-500/10"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    {landingContent.officialAccounts.map(acc => <option key={acc.id} value={acc.label}>{acc.label}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all text-lg">
                Submit Donation Proof
              </button>
            </form>
          </section>
        </div>
        
        <div className="lg:col-span-4 space-y-8">
          <RecentActivity />
        </div>
      </div>
    </div>
  );

  const renderBeneficiaryDashboard = () => {
    const myApps = applications.filter(a => a.userId === user?.id);
    
    return (
      <div className="space-y-6 lg:space-y-10 animate-fade-in-up">
        <header className="px-1 flex justify-between items-end">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">My Assistance Portal</h1>
            <p className="text-xs lg:text-base text-gray-500 mt-1 font-medium">Tracking your requests and registered support demands.</p>
          </div>
          <button 
            onClick={() => setIsQuickRequestOpen(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-emerald-100 active:scale-95 transition-all hidden md:block"
          >
            <i className="fa-solid fa-plus mr-2"></i> New Request
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <i className="fa-solid fa-clock-rotate-left mr-3 text-emerald-600"></i>
                Track Applications
              </h3>
              
              <div className="space-y-4">
                {myApps.length > 0 ? (
                  myApps.map(app => {
                    const prog = programs.find(p => p.id === app.programId);
                    return (
                      <div key={app.id} className="p-6 rounded-[2.5rem] bg-gray-50 border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">#{app.id.slice(-6).toUpperCase()}</p>
                            <h4 className="font-bold text-gray-900">{prog?.title || 'General Assistance'}</h4>
                            <p className="text-[10px] text-gray-400 font-medium">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${
                            app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {app.status}
                          </div>
                        </div>

                        {app.status === 'REJECTED' && app.rejectionReason && (
                          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3">
                            <i className="fa-solid fa-circle-exclamation text-rose-500 mt-1"></i>
                            <div>
                              <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Application Feedback</p>
                              <p className="text-xs text-rose-600 font-medium leading-relaxed italic mt-1">
                                "{app.rejectionReason}"
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-gray-400 font-bold">No active applications found.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                <i className="fa-solid fa-hand-holding-hand mr-3 text-emerald-600"></i>
                Registered Demands
              </h3>
              <div className="flex flex-wrap gap-2">
                {user?.demands?.map(d => (
                  <span key={d} className="px-5 py-3 bg-blue-50 text-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    {d}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
              <h4 className="font-black text-lg mb-2">Need Help?</h4>
              <p className="text-xs text-blue-100 font-medium leading-relaxed mb-6">
                Our team is here to support you. If you have questions about your application or need urgent assistance, contact our support desk.
              </p>
              <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-bold text-sm">
                Chat with Support
              </button>
            </div>
            
            {/* Quick Request card for Mobile specifically */}
            <div className="md:hidden bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
              <h4 className="font-black text-lg text-amber-900 mb-2">Urgent Request?</h4>
              <p className="text-xs text-amber-700 font-medium leading-relaxed mb-6">
                If your need isn't covered by our programs, submit a quick request here.
              </p>
              <button 
                onClick={() => setIsQuickRequestOpen(true)}
                className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-amber-100"
              >
                Request Help
              </button>
            </div>
          </div>
        </div>

        {/* Quick Request Modal */}
        {isQuickRequestOpen && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-fade-in-up pb-12 sm:pb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Request Aid</h3>
                <button onClick={() => setIsQuickRequestOpen(false)} className="text-gray-400">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type of Assistance</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none font-bold"
                    value={quickRequestType}
                    onChange={(e) => setQuickRequestType(e.target.value)}
                  >
                    <option value="General">General Aid</option>
                    <option value="Medical">Medical Support</option>
                    <option value="Education">Education Fee</option>
                    <option value="Grocery">Grocery / Rashan</option>
                    <option value="Utility">Utility Bill Support</option>
                  </select>
                </div>
                <p className="text-[11px] text-gray-400 font-medium italic">
                  Note: A Trustee will review your request. Please ensure your contact details are up to date in your profile.
                </p>
                <button 
                  onClick={handleQuickRequest}
                  className="w-full bg-emerald-600 text-white font-bold py-5 rounded-[2rem] shadow-xl shadow-emerald-100 active:scale-95 transition-all text-lg"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!user) return null;

  switch (user.role) {
    case UserRole.ADMIN:
      return renderTrusteeDashboard();
    case UserRole.TRUSTEE:
      return renderTrusteeDashboard();
    case UserRole.DONATOR:
      return renderDonatorDashboard();
    case UserRole.BENEFICIARY:
      return renderBeneficiaryDashboard();
    default:
      return <div>Access Denied</div>;
  }
};

export default Dashboard;
