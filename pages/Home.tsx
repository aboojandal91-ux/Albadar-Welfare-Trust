
import React, { useState } from 'react';
import { useApp } from '../App';

const Home: React.FC = () => {
  const { setView, landingContent } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`${mobile ? 'flex flex-col space-y-6 text-center' : 'flex items-center space-x-8'}`}>
      <button onClick={() => scrollToSection('about')} className={`${mobile ? 'text-xl' : 'text-sm'} font-bold text-gray-500 hover:text-emerald-600 transition-colors outline-none`}>About Us</button>
      <button onClick={() => setView('team')} className={`${mobile ? 'text-xl' : 'text-sm'} font-bold text-gray-500 hover:text-emerald-600 transition-colors outline-none`}>Our Team</button>
      <button onClick={() => scrollToSection('gallery')} className={`${mobile ? 'text-xl' : 'text-sm'} font-bold text-gray-500 hover:text-emerald-600 transition-colors outline-none`}>Gallery</button>
      <button onClick={() => scrollToSection('impact')} className={`${mobile ? 'text-xl' : 'text-sm'} font-bold text-gray-500 hover:text-emerald-600 transition-colors outline-none`}>Our Impact</button>
      <button onClick={() => scrollToSection('contact')} className={`${mobile ? 'text-xl' : 'text-sm'} font-bold text-gray-500 hover:text-emerald-600 transition-colors outline-none`}>Contact</button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      {/* Public Header */}
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center shadow-sm safe-area-top">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
          {landingContent.logoUrl ? (
            <img src={landingContent.logoUrl} alt="Logo" className="w-9 h-9 md:w-10 md:h-10 object-contain rounded-lg" />
          ) : (
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-emerald-100">A</div>
          )}
          <span className="font-extrabold text-gray-900 text-lg md:text-xl tracking-tight truncate max-w-[150px] md:max-w-none">Albadar Welfare Trust</span>
        </div>
        
        <nav className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setView('login')}
            className="hidden sm:block bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            Portal Login
          </button>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 text-xl"
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-white pt-24 px-6 lg:hidden animate-fade-in-up">
          <NavLinks mobile />
          <div className="mt-12 flex flex-col space-y-4">
            <button 
              onClick={() => setView('login')}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl"
            >
              Portal Login
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-12 lg:py-32 px-6 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-emerald-50/30 -z-10"></div>
        <div className="absolute top-20 left-10 w-48 h-48 md:w-64 md:h-64 bg-emerald-100 rounded-full blur-[80px] md:blur-[100px] opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-blue-100 rounded-full blur-[100px] md:blur-[120px] opacity-30"></div>

        <div className="max-w-4xl animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-sm shadow-emerald-50">Empowering Humanity</span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
            {landingContent.heroTitle.split(' ').map((word, i, arr) => (
              i >= arr.length - 2 ? <span key={i} className="text-emerald-600">{word} </span> : word + ' '
            ))}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-500 font-medium mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            {landingContent.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <button 
              onClick={() => setView('login')}
              className="w-full sm:w-auto bg-emerald-600 text-white px-8 lg:px-10 py-4 lg:py-5 rounded-[2rem] font-bold text-base lg:text-lg shadow-2xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-1 active:scale-95"
            >
              Start Your Journey
            </button>
            <button 
              onClick={() => setView('team')}
              className="w-full sm:w-auto bg-white text-gray-700 border border-gray-100 px-8 lg:px-10 py-4 lg:py-5 rounded-[2rem] font-bold text-base lg:text-lg shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all active:scale-95"
            >
              Meet Our Team
            </button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="py-12 lg:py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {landingContent.stats.map((stat) => (
              <div key={stat.id} className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-gray-50 border border-gray-100 text-center hover:scale-105 transition-transform">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl ${stat.color} bg-white flex items-center justify-center text-xl lg:text-2xl mx-auto mb-4 lg:mb-6 shadow-xl shadow-gray-200/50`}>
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
                <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-[10px] lg:text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 px-6 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px] md:text-xs mb-4 block">Our Story</span>
            <h2 className="text-3xl lg:text-5xl font-black mb-6 lg:mb-8 leading-tight">{landingContent.aboutTitle}</h2>
            <p className="text-base lg:text-lg text-emerald-100/80 mb-8 leading-relaxed">
              {landingContent.aboutDescription}
            </p>
            <ul className="space-y-4">
              {['100% Zakat Policy', 'Blockchain-ready Transparency', 'Localized Field Officers', 'Zero Administrative Deductions'].map(item => (
                <li key={item} className="flex items-center space-x-3 text-emerald-100 font-bold text-sm lg:text-base">
                  <div className="w-5 h-5 lg:w-6 lg:h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[8px] lg:text-[10px]">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40 lg:rotate-3 hover:rotate-0 transition-transform duration-700">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800" alt="Volunteers" className="w-full h-[300px] lg:h-[500px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-4 lg:-bottom-10 lg:-left-10 bg-white p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] shadow-2xl text-gray-900 max-w-[200px] lg:max-w-xs -rotate-3 lg:-rotate-6">
              <p className="text-2xl lg:text-3xl font-black text-emerald-600 mb-1 lg:mb-2">98%</p>
              <p className="text-[10px] lg:text-sm font-bold text-gray-500 leading-tight">Of every rupee reaches the intended beneficiary directly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16 lg:py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 tracking-tight">Gallery of Hope</h2>
            <p className="text-sm lg:text-base text-gray-500 font-medium max-w-2xl mx-auto">Capturing moments where small acts of kindness create waves of change.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {landingContent.gallery.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-2xl lg:rounded-[2.5rem] aspect-[4/3] bg-gray-100 cursor-pointer shadow-lg">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-end p-6 lg:p-8">
                  <p className="text-white font-bold text-lg lg:text-xl">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 lg:mb-8 tracking-tight">Connect With Us</h2>
            <p className="text-sm lg:text-base text-gray-500 mb-10 lg:mb-12 font-medium">Have questions or want to volunteer? Our team is always ready to assist you.</p>
            
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm lg:text-base">Headquarters</h4>
                  <p className="text-xs lg:text-sm text-gray-500 leading-relaxed mt-1">{landingContent.contactAddress}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm lg:text-base">Direct Support</h4>
                  <p className="text-xs lg:text-sm text-gray-500 mt-1">{landingContent.contactPhone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-6 lg:p-10 rounded-2xl lg:rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6" onSubmit={e => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" className="w-full px-5 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm lg:text-base" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" className="w-full px-5 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm lg:text-base" placeholder="john@example.com" />
              </div>
              <div className="sm:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea className="w-full px-5 py-3 lg:px-6 lg:py-4 rounded-xl lg:rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[120px] lg:min-h-[150px] text-sm lg:text-base" placeholder="How can we help?"></textarea>
              </div>
              <button 
                type="button"
                onClick={() => alert('Message sent successfully!')}
                className="sm:col-span-2 bg-emerald-600 text-white font-bold py-4 lg:py-5 rounded-xl lg:rounded-[2rem] shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all transform active:scale-95 text-base lg:text-lg"
              >
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 lg:py-12 px-6 safe-area-bottom">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            {landingContent.logoUrl ? (
              <img src={landingContent.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            ) : (
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
            )}
            <span className="font-bold text-gray-900 text-lg">Albadar Welfare Trust</span>
          </div>
          <p className="text-gray-400 text-[10px] lg:text-xs font-medium text-center">© 2024 Albadar Welfare Trust. Registered PVO #K-1282.</p>
          <div className="flex space-x-6 lg:space-x-8">
            <button className="text-[10px] lg:text-xs font-bold text-gray-400 hover:text-emerald-600">Privacy</button>
            <button className="text-[10px] lg:text-xs font-bold text-gray-400 hover:text-emerald-600">Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
