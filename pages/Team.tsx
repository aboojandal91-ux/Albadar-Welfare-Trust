
import React from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';

export default function Team() {
  const { users, setView, landingContent } = useApp();

  const admins = users.filter(u => u.role === UserRole.ADMIN);
  const boardOfGovernance = users.filter(u => u.role === UserRole.TRUSTEE);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm safe-area-top">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
          {landingContent.logoUrl ? (
            <img src={landingContent.logoUrl} alt="Logo" className="w-9 h-9 md:w-10 md:h-10 object-contain rounded-lg" />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-emerald-100">A</div>
          )}
          <span className="font-extrabold text-gray-900 text-lg md:text-xl tracking-tight truncate max-w-[150px] md:max-w-none">Albadar Welfare Trust</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setView('home')}
            className="text-gray-500 hover:text-emerald-600 font-bold text-sm px-4 py-2 transition-colors hidden sm:block"
          >
            Back to Home
          </button>
          <button 
            onClick={() => setView('login')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            Portal Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-6 bg-emerald-50/30 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-sm">The Visionaries</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
            Meet the Hearts Behind <span className="text-emerald-600">Albadar</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Our team is comprised of dedicated professionals and volunteers committed to providing transparent, efficient, and compassionate welfare services across Pakistan.
          </p>
        </div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200 rounded-full blur-[100px] opacity-20 -translate-y-1/2"></div>
      </section>

      {/* Board of Trustees (Admins) */}
      <section className="py-16 lg:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-12">
            <div className="h-px bg-gray-100 flex-grow"></div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-widest text-center px-4">Board of Trustees</h2>
            <div className="h-px bg-gray-100 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admins.map((admin) => (
              <div key={admin.id} className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 text-center hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 hover:-translate-y-2">
                <div className="relative mb-6 inline-block">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-emerald-50 shadow-xl mx-auto">
                    <img 
                      src={admin.avatar || `https://ui-avatars.com/api/?name=${admin.name}&background=random`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={admin.name} 
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                    <i className="fa-solid fa-shield-check text-xs"></i>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">{admin.name}</h3>
                <p className="text-emerald-600 font-bold uppercase tracking-[0.15em] text-[10px] md:text-xs mb-4">
                  {admin.title || 'Trustee'}
                </p>
                {admin.bio && (
                  <p className="text-gray-400 text-sm leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {admin.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board of Governance (Trustees) */}
      <section className="py-16 lg:py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4 mb-12">
            <div className="h-px bg-gray-200 flex-grow"></div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-widest text-center px-4">Board of Governance</h2>
            <div className="h-px bg-gray-200 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardOfGovernance.map((member) => (
              <div key={member.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all group">
                <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border-2 border-emerald-50 mb-4">
                  <img 
                    src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    alt={member.name} 
                  />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1">{member.name}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mb-3">
                  {member.title || 'Governance Member'}
                </p>
                <div className="flex space-x-2 mt-auto">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer">
                    <i className="fa-brands fa-linkedin-in text-xs"></i>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer">
                    <i className="fa-solid fa-envelope text-xs"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {boardOfGovernance.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 font-bold">No additional governance members listed yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6 safe-area-bottom">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            {landingContent.logoUrl ? (
              <img src={landingContent.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            ) : (
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            )}
            <span className="font-bold text-gray-900 text-lg">Albadar Welfare Trust</span>
          </div>
          <p className="text-gray-400 text-xs font-medium text-center">© 2024 Albadar Welfare Trust. All Rights Reserved.</p>
          <div className="flex space-x-8">
            <button onClick={() => setView('home')} className="text-xs font-bold text-gray-400 hover:text-emerald-600">Home</button>
            <button onClick={() => setView('login')} className="text-xs font-bold text-gray-400 hover:text-emerald-600">Portal</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
