
import React, { useState } from 'react';
import { useApp, FIRST_ADMIN_ID } from '../App';
import { UserRole, User } from '../types';

const GOVERNANCE_ROLES = [
  'Chairman',
  'Vice Chairman',
  'Director',
  'Deputy Director',
  'Accountant',
  'Media Coordinator',
  'Assistant Media Coordinator',
  'Lawyer'
];

const getRoleColor = (title: string) => {
  if (title.includes('Chairman')) return 'bg-amber-100 text-amber-700 border-amber-200';
  if (title.includes('Director')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (title.includes('Accountant')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (title.includes('Media')) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (title.includes('Lawyer') || title.includes('Advisor')) return 'bg-indigo-100 text-indigo-700 border-indigo-200';
  if (title.includes('Vice')) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
};

const TrusteeManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', title: GOVERNANCE_ROLES[0] });
  
  const trustees = users.filter(u => u.role === UserRole.TRUSTEE);
  const isFirstAdmin = user?.id === FIRST_ADMIN_ID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirstAdmin) {
      alert("Only the 1st Admin can manage members of the Board of Governance.");
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, { 
        name: formData.name, 
        email: formData.email,
        title: formData.title 
      });
      alert('Member updated successfully!');
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: UserRole.TRUSTEE,
        title: formData.title,
        avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
      });
      alert('New member added to the Board of Governance!');
    }

    closeModal();
  };

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ 
      name: u.name, 
      email: u.email,
      title: u.title || GOVERNANCE_ROLES[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this governance member? This will revoke their administrative permissions within the trust.")) {
      deleteUser(id);
      alert("Member removed.");
    }
  };

  const closeModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', title: GOVERNANCE_ROLES[0] });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Board of Governance</h1>
          <p className="text-sm text-gray-500 font-medium">{trustees.length} active members overseeing operations</p>
        </div>
        {isFirstAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
          >
            <i className="fa-solid fa-plus text-lg"></i>
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trustees.map(trustee => (
          <div key={trustee.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col hover:border-emerald-200 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <img src={trustee.avatar || `https://ui-avatars.com/api/?name=${trustee.name}`} className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl border border-gray-50 shadow-sm object-cover" alt={trustee.name} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <i className="fa-solid fa-check text-[8px] text-white"></i>
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-gray-900 truncate text-lg leading-tight">{trustee.name}</h3>
                <p className="text-[11px] text-gray-400 font-medium truncate">{trustee.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-end mt-2">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getRoleColor(trustee.title || '')}`}>
                {trustee.title || 'Member'}
              </span>

              {isFirstAdmin && (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => handleEdit(trustee)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(trustee.id)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>
              )}
            </div>
            
            {/* Background Icon Decoration */}
            <div className="absolute -top-4 -right-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-building-shield text-8xl text-emerald-900"></i>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 p-6 lg:p-8 rounded-[2.5rem] border border-emerald-100 mt-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-emerald-900 font-bold mb-3 flex items-center">
            <i className="fa-solid fa-building-shield mr-2"></i> Board Guidelines
          </h3>
          <ul className="text-emerald-700 text-xs lg:text-sm space-y-3 font-medium">
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-3 shrink-0"></div>
              Board members have full auditing rights for all trust programs.
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-3 shrink-0"></div>
              Roles are designated by the Board of Trustees based on professional merit.
            </li>
            <li className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-3 shrink-0"></div>
              Legal and Financial oversight must be verified by the Accountant and Lawyer.
            </li>
          </ul>
        </div>
        <i className="fa-solid fa-landmark absolute top-1/2 -right-8 -translate-y-1/2 text-emerald-100 text-9xl opacity-40"></i>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl animate-fade-in-up pb-12 sm:pb-8">
            <h3 className="text-2xl font-black mb-6 text-gray-900">{editingUser ? 'Update Governance' : 'Add Board Member'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Hassan Ali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Role</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold transition-all appearance-none cursor-pointer"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  >
                    {GOVERNANCE_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Email</label>
                <input 
                  required
                  type="email"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="hassan@albadar.org"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-grow py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-grow py-4 rounded-[2rem] font-bold text-white bg-emerald-600 shadow-xl shadow-emerald-200 active:scale-95 transition-all">
                  {editingUser ? 'Save Updates' : 'Add to Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrusteeManagement;
