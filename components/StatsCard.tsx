
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string;
  icon: string;
  color: 'emerald' | 'rose' | 'amber' | 'blue';
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color }) => {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default StatsCard;
