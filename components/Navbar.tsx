
import React from 'react';
import { useApp, FIRST_ADMIN_ID } from '../App';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, logout, view, setView, landingContent } = useApp();

  const isMediaRole = user?.role === UserRole.TRUSTEE && user?.title?.includes('Media Coordinator');
  const isLawyer = user?.role === UserRole.TRUSTEE && user?.title === 'Lawyer';

  let navItems = [
    { id: 'dashboard', label: 'Home', icon: 'fa-house' },
  ];

  // Programs: Hidden for Media and Lawyer
  if (user?.role === UserRole.ADMIN || (user?.role === UserRole.TRUSTEE && !isMediaRole && !isLawyer)) {
    navItems.push({ id: 'programs', label: 'Programs', icon: 'fa-hand-holding-heart' });
  }

  // Impact (Reports): Hidden only for Media role (Restored for Lawyer)
  if (user?.role === UserRole.ADMIN || (user?.role === UserRole.TRUSTEE && !isMediaRole)) {
    navItems.push({ id: 'reports', label: 'Impact', icon: 'fa-chart-pie' });
  }

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ id: 'beneficiaries', label: 'Beneficiaries', icon: 'fa-people-roof' });
    navItems.push({ id: 'trustees', label: 'Board of Governance', icon: 'fa-building-shield' });
    navItems.push({ id: 'content-management', label: 'Public Site', icon: 'fa-desktop' });
    
    if (user.id === FIRST_ADMIN_ID) {
      navItems.push({ id: 'admin-management', label: 'Admins', icon: 'fa-user-shield' });
    }
  } else if (user?.role === UserRole.TRUSTEE) {
    if (isMediaRole) {
      navItems.push({ id: 'content-management', label: 'Public Site', icon: 'fa-desktop' });
    } else if (!isLawyer) {
      // Lawyers specifically should not see review applicants
      navItems.push({ id: 'beneficiaries', label: 'Review Applicants', icon: 'fa-people-roof' });
    }
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-8">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setView('dashboard')}
        >
          {landingContent.logoUrl ? (
            <img src={landingContent.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
          ) : (
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-100">A</div>
          )}
          <span className="font-extrabold text-gray-900 text-xl hidden sm:block tracking-tight">Albadar Trust</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-4 overflow-x-auto">
          {navItems.map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => setView(item.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center space-x-2 whitespace-nowrap ${
                view === item.id 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-xs`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
                {user.role === UserRole.TRUSTEE ? user.title || 'Governance' : user.role}
              </p>
            </div>
            
            <div 
              className="relative group cursor-pointer"
              onClick={() => setView('profile')}
            >
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                alt="avatar" 
                className={`w-10 h-10 rounded-full border-2 transition-all ${view === 'profile' ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-50' : 'border-gray-100 group-hover:border-emerald-200'}`}
              />
            </div>

            <button 
              onClick={logout}
              className="p-2.5 bg-gray-50 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all hidden md:block"
              title="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
