
import React, { useState } from 'react';
import { useApp } from '../App';
import ProgramCard from '../components/ProgramCard';

const Programs: React.FC = () => {
  const { programs } = useApp();
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'Health', 'Education', 'Relief', 'Infrastructure'];

  const filteredPrograms = filter === 'ALL' 
    ? programs 
    : programs.filter(p => p.category === filter);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Programs</h1>
          <p className="text-gray-500 mt-1 font-medium">Direct transparency, from donor to deed.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative flex-grow md:flex-grow-0">
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"></i>
             <input 
               type="text" 
               placeholder="Search programs..." 
               className="pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64 shadow-sm"
             />
          </div>
          <button className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm">
            <i className="fa-solid fa-sliders"></i>
          </button>
        </div>
      </header>

      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all uppercase tracking-widest ${
              filter === cat 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' 
                : 'bg-white text-gray-400 border border-gray-100 hover:border-emerald-200 hover:text-emerald-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredPrograms.map(p => (
          <ProgramCard key={p.id} program={p} />
        ))}
      </div>
      
      {filteredPrograms.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
            <i className="fa-solid fa-heart-crack text-4xl"></i>
          </div>
          <p className="text-gray-500 font-bold text-lg">No programs found in this category.</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => setFilter('ALL')}
            className="mt-6 text-emerald-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Programs;
