
import React, { useState, useRef } from 'react';
import { useApp } from '../App';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '', 
    avatar: user?.avatar || '' 
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, {
      name: formData.name,
      phone: formData.phone,
      avatar: formData.avatar
    });
    setIsEditModalOpen(false);
    alert('Profile updated successfully!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    
    updateUser(user.id, {
      password: passwordData.newPassword
    });
    
    setIsPasswordModalOpen(false);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    alert('Password updated successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
        <div className="relative inline-block mb-6 mt-4">
          <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-xl mx-auto">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
              alt="profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-2xl border-4 border-white flex items-center justify-center text-xs shadow-lg hover:scale-110 transition-transform"
          >
            <i className="fa-solid fa-camera"></i>
          </button>
        </div>
        <h2 className="text-2xl font-black text-gray-900 leading-tight">{user.name}</h2>
        <div className="flex items-center justify-center space-x-2 mt-2">
           <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
             {user.role}
           </span>
           {user.approved && (
             <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
               Verified
             </span>
           )}
        </div>
        <div className="mt-6 flex flex-col items-center space-y-1">
          <p className="text-gray-400 text-sm font-medium flex items-center">
            <i className="fa-solid fa-envelope mr-2 text-[10px]"></i> {user.email}
          </p>
          {user.phone && (
            <p className="text-gray-400 text-sm font-medium flex items-center">
              <i className="fa-solid fa-phone mr-2 text-[10px]"></i> {user.phone}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 bg-gray-50/50 border-b border-gray-50">
          <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] ml-1">Account Management</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="w-full p-5 flex items-center justify-between hover:bg-emerald-50/50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-user-pen"></i></div>
              <div className="text-left">
                <span className="font-bold text-gray-800 block">Edit Profile</span>
                <span className="text-[10px] text-gray-400 font-medium">Update name, phone, and photo</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 group-hover:translate-x-1 transition-transform"></i>
          </button>
          
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full p-5 flex items-center justify-between hover:bg-emerald-50/50 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-shield-halved"></i></div>
              <div className="text-left">
                <span className="font-bold text-gray-800 block">Security & Password</span>
                <span className="text-[10px] text-gray-400 font-medium">Update your account password</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 group-hover:translate-x-1 transition-transform"></i>
          </button>
          
          <button className="w-full p-5 flex items-center justify-between hover:bg-emerald-50/50 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-bell"></i></div>
              <div className="text-left">
                <span className="font-bold text-gray-800 block">Notification Hub</span>
                <span className="text-[10px] text-gray-400 font-medium">Custom alerts and updates</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 bg-gray-50/50 border-b border-gray-50">
          <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] ml-1">System</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <button className="w-full p-5 flex items-center justify-between hover:bg-emerald-50/50 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-gray-50 text-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-circle-question"></i></div>
              <div className="text-left">
                <span className="font-bold text-gray-700 block">Help Center</span>
                <span className="text-[10px] text-gray-400 font-medium">FAQs and technical support</span>
              </div>
            </div>
            <i className="fa-solid fa-chevron-right text-gray-300"></i>
          </button>
          
          <button onClick={logout} className="w-full p-5 flex items-center justify-between hover:bg-rose-50 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform"><i className="fa-solid fa-power-off"></i></div>
              <div className="text-left">
                <span className="font-bold text-rose-600 block">Terminate Session</span>
                <span className="text-[10px] text-rose-400 font-medium">Logout from this device</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Version 1.0.2 (Build 234)</p>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-fade-in-up pb-12 sm:pb-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-rose-600 transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex flex-col items-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-emerald-50 shadow-md">
                    <img 
                      src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}`} 
                      className="w-full h-full object-cover" 
                      alt="preview" 
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-emerald-600 rounded-2xl border border-white flex items-center justify-center shadow-lg"
                  >
                    <i className="fa-solid fa-cloud-arrow-up text-xs"></i>
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                  <input 
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-bold transition-all"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-grow py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-4 rounded-[2rem] font-bold text-white bg-emerald-600 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Management Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 shadow-2xl animate-fade-in-up pb-12 sm:pb-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900">Change Password</h3>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-rose-600 transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                  <input 
                    required
                    type="password"
                    placeholder="At least 6 characters"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold transition-all"
                    value={passwordData.newPassword}
                    onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input 
                    required
                    type="password"
                    placeholder="Confirm password"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 font-bold transition-all"
                    value={passwordData.confirmPassword}
                    onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  />
                </div>

                <div className="pt-4 flex space-x-4">
                  <button 
                    type="button" 
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="flex-grow py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-grow py-4 rounded-[2rem] font-bold text-white bg-amber-600 shadow-xl shadow-amber-200 active:scale-95 transition-all"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
