
import React, { useState, useRef } from 'react';
import { useApp } from '../App';
import { GalleryImage, Stat, TrustAccount } from '../types';

export default function PublicContentManagement() {
  const { landingContent, setLandingContent } = useApp();
  const [activeTab, setActiveTab] = useState<'branding' | 'hero' | 'about' | 'stats' | 'gallery' | 'accounts' | 'contact'>('branding');
  
  const [isAddGalleryModalOpen, setIsAddGalleryModalOpen] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', url: '', type: 'url' as 'url' | 'file' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: string, value: any) => {
    setLandingContent(prev => ({ ...prev, [field]: value }));
  };

  const handleStatUpdate = (id: string, field: keyof Stat, value: string) => {
    const updatedStats = landingContent.stats.map(s => s.id === id ? { ...s, [field]: value } : s);
    updateField('stats', updatedStats);
  };

  const handleAccountUpdate = (id: string, field: keyof TrustAccount, value: string) => {
    const updatedAccounts = landingContent.officialAccounts.map(a => a.id === id ? { ...a, [field]: value } : a);
    updateField('officialAccounts', updatedAccounts);
  };

  const handleAddGalleryImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.url) {
      alert("Please provide both a title and an image.");
      return;
    }

    const newImage: GalleryImage = {
      id: `g-${Date.now()}`,
      url: newGalleryItem.url,
      title: newGalleryItem.title
    };

    updateField('gallery', [newImage, ...landingContent.gallery]);
    setNewGalleryItem({ title: '', url: '', type: 'url' });
    setIsAddGalleryModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewGalleryItem(prev => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteGalleryImage = (id: string) => {
    if (confirm("Are you sure you want to remove this image from the gallery?")) {
      updateField('gallery', landingContent.gallery.filter(g => g.id !== id));
    }
  };

  const handleGalleryUpdate = (id: string, field: keyof GalleryImage, value: string) => {
    const updatedGallery = landingContent.gallery.map(g => g.id === id ? { ...g, [field]: value } : g);
    updateField('gallery', updatedGallery);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Public Home Editor</h1>
        <p className="text-gray-500 mt-1 font-medium">Control the content shown to visitors on the landing page.</p>
      </header>

      <div className="flex space-x-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide">
        {(['branding', 'hero', 'about', 'stats', 'gallery', 'accounts', 'contact'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20">
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Application Branding</h3>
            <div className="space-y-8 max-w-md">
              <div className="flex flex-col items-center">
                <div className="relative group mb-4">
                  <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-300">
                    {landingContent.logoUrl ? (
                      <img src={landingContent.logoUrl} alt="App Logo" className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="text-center p-4">
                        <i className="fa-solid fa-image text-gray-300 text-2xl mb-2"></i>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Logo Set</p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-2xl border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <i className="fa-solid fa-pen text-xs"></i>
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={logoInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
                <p className="text-xs text-gray-400 font-medium text-center leading-relaxed">
                  The logo will appear in the Navbar, Login screen, and Footer. Best used with transparent PNGs.
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Logo Direct URL</label>
                <div className="flex space-x-2">
                  <input 
                    className="flex-grow px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                    placeholder="https://example.com/logo.png"
                    value={landingContent.logoUrl || ''}
                    onChange={(e) => updateField('logoUrl', e.target.value)}
                  />
                  {landingContent.logoUrl && (
                    <button 
                      onClick={() => updateField('logoUrl', '')}
                      className="px-6 rounded-2xl bg-rose-50 text-rose-600 font-bold text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Hero Section</h3>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Main Headline</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold text-lg lg:text-xl"
                value={landingContent.heroTitle}
                onChange={(e) => updateField('heroTitle', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Hero Subtitle</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[100px]"
                value={landingContent.heroSubtitle}
                onChange={(e) => updateField('heroSubtitle', e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">About Us Section</h3>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">About Title</label>
              <input 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                value={landingContent.aboutTitle}
                onChange={(e) => updateField('aboutTitle', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all min-h-[150px]"
                value={landingContent.aboutDescription}
                onChange={(e) => updateField('aboutDescription', e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Impact Metrics</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {landingContent.stats.map(stat => (
                <div key={stat.id} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Label</label>
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold" 
                        value={stat.label}
                        onChange={(e) => handleStatUpdate(stat.id, 'label', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Value</label>
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold" 
                        value={stat.value}
                        onChange={(e) => handleStatUpdate(stat.id, 'value', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">FA Icon (e.g. fa-heart)</label>
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm" 
                        value={stat.icon}
                        onChange={(e) => handleStatUpdate(stat.id, 'icon', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Color Class</label>
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm" 
                        value={stat.color}
                        onChange={(e) => handleStatUpdate(stat.id, 'color', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Gallery Management</h3>
              <button 
                onClick={() => setIsAddGalleryModalOpen(true)}
                className="bg-emerald-600 text-white px-4 md:px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
              >
                <i className="fa-solid fa-plus mr-2"></i> Add Image
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingContent.gallery.map(img => (
                <div key={img.id} className="rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden flex flex-col group">
                  <div className="h-44 relative bg-gray-200">
                    <img src={img.url} className="w-full h-full object-cover" alt="preview" />
                    <button 
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 text-rose-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-rose-50"
                    >
                      <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                      <input 
                        placeholder="Title"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                        value={img.title}
                        onChange={(e) => handleGalleryUpdate(img.id, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Source URL (Editable)</label>
                      <input 
                        placeholder="Image URL"
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-[10px] outline-none truncate" 
                        value={img.url}
                        onChange={(e) => handleGalleryUpdate(img.id, 'url', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Official Donation Accounts</h3>
            <p className="text-xs text-gray-400 font-medium">These details are shown to new donators during registration.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingContent.officialAccounts.map(acc => (
                <div key={acc.id} className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 space-y-5">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      <i className={`fa-solid ${acc.icon}`}></i>
                    </div>
                    <h4 className="font-bold text-gray-900">{acc.label}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Label</label>
                    <input 
                      className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold" 
                      value={acc.label}
                      onChange={(e) => handleAccountUpdate(acc.id, 'label', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Number / Details</label>
                    <input 
                      className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold" 
                      value={acc.num}
                      onChange={(e) => handleAccountUpdate(acc.id, 'num', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Title</label>
                    <input 
                      className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-sm font-bold" 
                      value={acc.name}
                      onChange={(e) => handleAccountUpdate(acc.id, 'name', e.target.value)}
                    />
                  </div>

                  {acc.label.toLowerCase().includes('bank') && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">IBAN (Optional)</label>
                      <input 
                        className="w-full px-4 py-2 rounded-xl bg-white border border-gray-100 text-[10px] font-mono" 
                        value={acc.iban || ''}
                        onChange={(e) => handleAccountUpdate(acc.id, 'iban', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={landingContent.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={landingContent.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                <textarea 
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={landingContent.contactAddress}
                  onChange={(e) => updateField('contactAddress', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
          <button 
            onClick={() => alert('All changes have been saved.')}
            className="bg-emerald-600 text-white px-8 md:px-10 py-4 rounded-[2rem] font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all transform active:scale-95 text-sm md:text-base"
          >
            Publish Changes
          </button>
        </div>
      </div>

      {isAddGalleryModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-900">Add Gallery Image</h3>
              <button onClick={() => setIsAddGalleryModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-rose-600 transition-all flex items-center justify-center">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddGalleryImageSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image Title</label>
                <input 
                  required
                  placeholder="e.g. Health Camp Karachi"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image Source</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setNewGalleryItem(prev => ({ ...prev, type: 'url', url: '' }))}
                    className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${newGalleryItem.type === 'url' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                  >
                    <i className="fa-solid fa-link mr-2"></i> Online URL
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setNewGalleryItem(prev => ({ ...prev, type: 'file', url: '' }));
                      fileInputRef.current?.click();
                    }}
                    className={`py-3 rounded-xl border-2 font-bold text-xs transition-all ${newGalleryItem.type === 'file' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-50 bg-gray-50 text-gray-400'}`}
                  >
                    <i className="fa-solid fa-file-image mr-2"></i> From Device
                  </button>
                </div>
                
                {newGalleryItem.type === 'url' ? (
                  <input 
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    value={newGalleryItem.url}
                    onChange={(e) => setNewGalleryItem(prev => ({ ...prev, url: e.target.value }))}
                  />
                ) : (
                  <div className="space-y-4">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {newGalleryItem.url && (
                      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-gray-100">
                        <img src={newGalleryItem.url} className="w-full h-full object-cover" alt="upload-preview" />
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-lg">
                          <i className="fa-solid fa-check"></i>
                        </div>
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl border border-dashed border-gray-200 text-xs font-bold hover:bg-white hover:border-emerald-200 transition-all"
                    >
                      {newGalleryItem.url ? 'Choose Another Image' : 'Click to Upload Image'}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 flex space-x-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddGalleryModalOpen(false)}
                  className="flex-grow py-4 rounded-2xl font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-4 rounded-[2rem] font-bold text-white bg-emerald-600 shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
