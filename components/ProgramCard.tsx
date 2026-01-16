
import React, { useState } from 'react';
import { Program } from '../types';
import { useApp } from '../App';

interface ProgramCardProps {
  program: Program;
  isBeneficiary?: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, isBeneficiary = false }) => {
  const { addDonation, addApplication } = useApp();
  const progress = Math.min(100, (program.raised / program.goal) * 100);
  const [isDonating, setIsDonating] = useState(false);
  const [donationAmount, setDonationAmount] = useState(5000);

  const handleApply = () => {
    if (confirm(`Do you want to apply for the "${program.title}" program? We will use your registered profile documents.`)) {
      addApplication(program.id);
      alert('Application submitted successfully!');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full group">
      <div className="h-40 relative">
        <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide">
          {program.category}
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{program.title}</h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-4">{program.description}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-bold text-gray-900 mb-1">
            <span>Rs. {program.raised.toLocaleString()}</span>
            <span className="text-gray-400">Target: Rs. {program.goal.toLocaleString()}</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="mt-4 flex gap-2">
            {!isBeneficiary ? (
              <button 
                onClick={() => setIsDonating(true)}
                className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-emerald-100"
              >
                Donate Now
              </button>
            ) : (
              <button 
                onClick={handleApply}
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
              >
                Apply for Aid
              </button>
            )}
            <button 
              onClick={() => alert('Referral link copied to clipboard!')}
              className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-200 transition-all"
            >
              <i className="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </div>

      {isDonating && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Donate to {program.title}</h3>
              <button onClick={() => setIsDonating(false)} className="text-gray-400"><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Amount (PKR)</label>
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  className="w-full p-4 rounded-xl border border-gray-200 text-lg font-bold outline-none focus:ring-2 focus:ring-emerald-500" 
                  value={donationAmount} 
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {['EasyPaisa', 'JazzCash', 'Bank'].map(method => (
                  <button key={method} className="flex flex-col items-center p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-emerald-500 transition-all">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-600 mb-1">
                      <i className="fa-solid fa-wallet"></i>
                    </div>
                    <span className="text-[10px] font-bold">{method}</span>
                  </button>
                ))}
              </div>

              <button 
                className="w-full bg-emerald-600 py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-emerald-200 mt-4 active:scale-95 transition-all"
                onClick={() => {
                  addDonation(donationAmount, program.id);
                  alert(`Thank you for your donation of Rs. ${donationAmount.toLocaleString()}!`);
                  setIsDonating(false);
                }}
              >
                Confirm Donation
              </button>
              <p className="text-center text-[10px] text-gray-400">100% of your donation goes directly to the program.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramCard;
