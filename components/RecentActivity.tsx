
import React from 'react';

const RecentActivity: React.FC = () => {
  const activities = [
    { id: 1, type: 'donation', title: 'New Donation', desc: 'Rs. 2,500 received for Blanket Drive', time: '2 mins ago', icon: 'fa-heart', color: 'text-rose-500 bg-rose-50' },
    { id: 2, type: 'expense', title: 'Expense Proof', desc: 'Admin uploaded receipt for medical camp', time: '1 hour ago', icon: 'fa-file-invoice', color: 'text-emerald-500 bg-emerald-50' },
    { id: 3, type: 'approval', title: 'Beneficiary Verified', desc: 'Family assistance request approved', time: '5 hours ago', icon: 'fa-user-check', color: 'text-blue-500 bg-blue-50' },
  ];

  return (
    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Recent Activity</h3>
        <i className="fa-solid fa-ellipsis-vertical text-gray-300"></i>
      </div>
      <div className="space-y-6">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start space-x-4">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${act.color}`}>
              <i className={`fa-solid ${act.icon} text-sm`}></i>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-gray-900">{act.title}</p>
                <span className="text-[10px] text-gray-400">{act.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2 text-sm font-bold text-gray-400 hover:text-emerald-600 transition-colors">
        See All Logs
      </button>
    </section>
  );
};

export default RecentActivity;
