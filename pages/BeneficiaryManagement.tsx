
import React, { useState } from 'react';
import { useApp } from '../App';
import { User } from '../types';

const BeneficiaryManagement: React.FC = () => {
  const { applications, users, updateApplicationStatus } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Rejection Modal State
  const [rejectionModalAppId, setRejectionModalAppId] = useState<string | null>(null);
  const [rejectionComment, setRejectionComment] = useState('');

  const handleAction = (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    updateApplicationStatus(id, status, reason);
    if (status === 'REJECTED') {
      setRejectionModalAppId(null);
      setRejectionComment('');
    }
    alert(`Application ${status.toLowerCase()} successfully.`);
  };

  const filteredApplications = applications.filter(app => {
    const applicant = users.find(u => u.id === app.userId);
    return applicant?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           app.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const openUserDetails = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setSelectedUser(user);
  };

  const handleViewMedicalReport = (base64: string) => {
    const win = window.open();
    if (win) {
      if (base64.startsWith('data:application/pdf')) {
        win.document.write(`<iframe width="100%" height="100%" src="${base64}"></iframe>`);
      } else {
        win.document.write(`<img src="${base64}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;" />`);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <i className="fa-solid fa-people-roof mr-3 text-emerald-600"></i>
            Beneficiary Registry
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Tracking {applications.length} aid recipients and applicants
          </p>
        </div>

        <div className="relative group">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none w-full md:w-80 shadow-sm transition-all"
          />
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Beneficiary ID</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Full Name</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Current Status</th>
                <th className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplications.map((app) => {
                const applicant = users.find(u => u.id === app.userId);
                const isPending = app.status === 'PENDING';
                
                return (
                  <tr key={app.id} className="group hover:bg-emerald-50/30 transition-colors">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        #{app.id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={applicant?.avatar || `https://ui-avatars.com/api/?name=${applicant?.name}&background=random`} 
                          className="w-10 h-10 rounded-xl shadow-sm border border-gray-100" 
                          alt="avatar" 
                        />
                        <div>
                          <p className="font-bold text-gray-900">{applicant?.name || 'Unknown User'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{applicant?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        app.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                        app.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                        'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          app.status === 'PENDING' ? 'bg-amber-500 animate-pulse' : 
                          app.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}></div>
                        {app.status}
                      </div>
                      {app.status === 'REJECTED' && app.rejectionReason && (
                         <p className="text-[9px] text-rose-400 font-medium mt-1 italic max-w-[150px] truncate" title={app.rejectionReason}>Reason: {app.rejectionReason}</p>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        {isPending && (
                          <>
                            <button 
                              onClick={() => handleAction(app.id, 'APPROVED')}
                              className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:scale-95"
                              title="Approve Beneficiary"
                            >
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button 
                              onClick={() => setRejectionModalAppId(app.id)}
                              className="w-10 h-10 rounded-xl bg-white text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95"
                              title="Reject Application"
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => openUserDetails(app.userId)}
                          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all flex items-center space-x-2"
                        >
                          <i className="fa-solid fa-user-gear"></i>
                          <span>Full Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              <i className="fa-solid fa-clipboard-question text-3xl"></i>
            </div>
            <p className="text-gray-500 font-bold text-lg">No beneficiaries found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search query or clear filters.</p>
          </div>
        )}
      </div>

      {/* Rejection Note Modal */}
      {rejectionModalAppId && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-fade-in-up">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Rejection Note</h3>
            <p className="text-sm text-gray-400 font-medium mb-6">Please provide a brief reason for rejecting this application. This feedback will be visible to the beneficiary.</p>
            
            <div className="space-y-4">
              <textarea 
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 font-medium transition-all min-h-[120px]"
                placeholder="e.g., Documents are unclear, criteria not met, etc."
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
              />
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => {
                    setRejectionModalAppId(null);
                    setRejectionComment('');
                  }}
                  className="flex-grow py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!rejectionComment.trim()}
                  onClick={() => handleAction(rejectionModalAppId, 'REJECTED', rejectionComment)}
                  className="flex-grow py-4 rounded-[2rem] font-bold text-white bg-rose-600 shadow-xl shadow-rose-200 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Approved</p>
          <h4 className="text-2xl font-black text-emerald-900">{applications.filter(a => a.status === 'APPROVED').length}</h4>
        </div>
        <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Pending Review</p>
          <h4 className="text-2xl font-black text-amber-900">{applications.filter(a => a.status === 'PENDING').length}</h4>
        </div>
        <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Total Applicants</p>
          <h4 className="text-2xl font-black text-rose-900">{applications.length}</h4>
        </div>
      </div>

      {/* Beneficiary Full Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="bg-emerald-600 p-8 text-white relative">
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/20 shadow-xl">
                  <img src={selectedUser.avatar} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <div>
                  <h3 className="text-3xl font-black leading-tight">{selectedUser.name}</h3>
                  <div className="flex items-center space-x-3 mt-1 opacity-90">
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg">Beneficiary Profile</span>
                    <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg">ID: #{selectedUser.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                        <i className="fa-solid fa-envelope text-emerald-600"></i>
                        <span className="text-sm font-bold text-gray-700">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl">
                        <i className="fa-solid fa-phone text-emerald-600"></i>
                        <span className="text-sm font-bold text-gray-700">{selectedUser.phone || 'No Phone Provided'}</span>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Identification Details</h4>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">CNIC Number</p>
                      <p className="text-lg font-black text-gray-900">{selectedUser.cnic || 'Not Recorded'}</p>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Requested Support (Demands)</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.demands?.map(d => (
                        <div key={d} className="flex flex-col space-y-2 w-full">
                          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100 flex items-center justify-between">
                            {d}
                            {(d.includes('Health') || d === 'Health') && selectedUser.medicalReport && (
                              <button 
                                onClick={() => handleViewMedicalReport(selectedUser.medicalReport!)}
                                className="bg-blue-600 text-white px-2 py-1 rounded-lg text-[8px] hover:bg-blue-700"
                              >
                                View Report
                              </button>
                            )}
                          </span>
                        </div>
                      )) || <p className="text-gray-400 italic text-xs">No specific demands selected.</p>}
                    </div>
                  </section>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Verification Documents</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">CNIC Front View</p>
                      <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                        {selectedUser.cnicFront ? (
                          <img src={selectedUser.cnicFront} className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-image text-gray-300 text-3xl"></i>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">CNIC Back View</p>
                      <div className="aspect-video bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
                        {selectedUser.cnicBack ? (
                          <img src={selectedUser.cnicBack} className="w-full h-full object-cover" />
                        ) : (
                          <i className="fa-solid fa-image text-gray-300 text-3xl"></i>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gray-50 border-t border-gray-100 flex space-x-4">
              <button 
                onClick={() => setSelectedUser(null)}
                className="flex-grow py-4 rounded-2xl font-bold text-gray-500 bg-white border border-gray-200 active:scale-95 transition-all"
              >
                Close Profile
              </button>
              <button 
                onClick={() => window.print()}
                className="px-8 py-4 rounded-2xl font-bold text-white bg-emerald-600 shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center space-x-2"
              >
                <i className="fa-solid fa-print"></i>
                <span>Print Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryManagement;
