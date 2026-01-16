
import React from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';

const BottomNav: React.FC = () => {
  const { view, setView, user } = useApp();

  const isMediaRole = user?.role === UserRole.TRUSTEE && user?.title?.includes('Media Coordinator');
  const isLawyer = user?.role === UserRole.TRUSTEE && user?.title === 'Lawyer';

  let navItems = [
    { id: 'dashboard', icon: 'fa-house', label: 'Home' },
  ];

  // Programs: Only for Admin and Non-restricted Trustees (Not Media, Not Lawyer)
  if (user?.role === UserRole.ADMIN || (user?.role === UserRole.TRUSTEE && !isMediaRole && !isLawyer)) {
    navItems.push({ id: 'programs', icon: 'fa-hand-holding-heart', label: 'Programs' });
  }

  // Impact: For Admin and Trustees EXCEPT Media Coordinator (Restored for Lawyer)
  if (user?.role === UserRole.ADMIN || (user?.role === UserRole.TRUSTEE && !isMediaRole)) {
    navItems.push({ id: 'reports', icon: 'fa-chart-pie', label: 'Impact' });
  }

  if (user?.role === UserRole.BENEFICIARY) {
    // Add "Assistance" view indicators for beneficiaries
    navItems.push({ id: 'dashboard', icon: 'fa-file-shield', label: 'Documents' });
  }

  navItems.push({ id: 'profile', icon: 'fa-user', label: 'Account' });

  if (user?.role === UserRole.ADMIN || isMediaRole) {
    // Insert site management if applicable
    navItems.splice(navItems.length - 2, 0, { id: 'content-management', icon: 'fa-desktop', label: 'Site' });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center md:hidden safe-area-bottom z-50">
      {navItems.map((item, idx) => (
        <button
          key={`${item.id}-${idx}`}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center space-y-1 ${view === item.id ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <i className={`fa-solid ${item.icon} text-lg`}></i>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
