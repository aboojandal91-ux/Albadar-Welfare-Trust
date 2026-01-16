
import React, { useState } from 'react';
import { useApp, FIRST_ADMIN_ID } from '../App';
import { UserRole, User } from '../types';

const ADMIN_TITLES = [
  'Chairman',
  'Vice Chairman',
  'Director',
  'Deputy Director'
];

const AdminManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', title: ADMIN_TITLES[0] });
  
  const admins = users.filter(u => u.role === UserRole.ADMIN);
  const isFirstAdmin = user?.id === FIRST_ADMIN_ID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirstAdmin) {
      alert("Only the 1st Admin can manage other admins.");
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, { 
        name: formData.name, 
        email: formData.email,
        title: formData.title 
      });
      alert('Admin updated successfully!');
    } else {
      addUser({
        name: formData.name,
        email: formData.email,
        role: UserRole.ADMIN,
        title: formData.title,
        avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
      });
      alert('New Admin added successfully!');
    }
    
    closeModal();
  };

  const handleEdit = (u: User) => {
    setEditingUser(u);
    setFormData({ 
      name: u.name, 
      email: u.email, 
      title: u.title || ADMIN_TITLES[0] 
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this administrator? This action cannot be undone.")) {
      deleteUser(id);
      alert("Administrator removed.");
    }
  };

  const closeModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', title: ADMIN_TITLES[0] });
    setIsModalOpen(false);
  };

  if (!isFirstAdmin) {
    return (
      <div className="py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-lock text-3xl"></i>
        </div>
        <h2 className="text-2xl font-black text-gray-900">Access Denied</h2>
        <p className="text-gray-500 font-medium">Only the 1st Admin can access this restricted page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">Admin Management</h1>
          <p className="text-sm text-gray-500 font-medium">{admins.length} registered administrators</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all active:scale-95"
        >
          <i className="fa-solid fa-plus text-lg"></i>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between hover:border-purple-200 hover:shadow-md transition-all group">
            <div className="flex items-center space-x-4">
              <img src={admin.avatar || `https://ui-avatars.com/api/?name=${admin.name}`} className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border border-gray-50 shadow-sm" alt={admin.name} />
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-900 truncate">{admin.name}</h3>
                  {admin.id === FIRST_ADMIN_ID && (
                    <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-200 shrink-0">Root</span>
                  )}
                </div>
                <p className="text-xs text-purple-600 font-bold truncate">{admin.title || 'Administrator'}</p>
                <p className="text-[10px] text-gray-400 truncate">{admin.email}</p>
              </div>
            </div>
            {admin.id !== FIRST_ADMIN_ID && (
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(admin)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                >
                  <i className="fa-solid fa-pen-to-square text-xs"></i>
                </button>
                <button 
                  onClick={() => handleDelete(admin.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-purple-50 p-6 lg:p-8 rounded-[2.5rem] border border-purple-100 mt-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-purple-900 font-bold mb-3 flex items-center">
            <i className="fa-solid fa-user-shield mr-2"></i> Administrative Protocols
          </h3>
          <p className="text-purple-700 text-xs lg:text-sm leading-relaxed max-w-2xl font-medium">
            As the 1st Admin, you hold supreme authority. You can appoint other administrators and define their official titles to handle day-to-day operations and beneficiary verification.
          </p>
        </div>
        <i className="fa-solid fa-crown absolute top-1/2 -right-8 -translate-y-1/2 text-purple-100 text-9xl opacity-50"></i>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl animate-fade-in-up pb-12 sm:pb-8">
            <h3 className="text-2xl font-black mb-6 text-gray-900">{editingUser ? 'Edit Administrator' : 'Add New Admin'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  required
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Sajjad Malik"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Official Title</label>
                <div className="relative">
                  <select 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-bold transition-all appearance-none cursor-pointer"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  >
                    {ADMIN_TITLES.map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"></i>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 font-medium transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@albadar.org"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-grow py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" className="flex-grow py-4 rounded-[2rem] font-bold text-white bg-purple-600 shadow-xl shadow-purple-200 active:scale-95 transition-all">
                  {editingUser ? 'Save Changes' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
