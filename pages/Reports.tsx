
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useApp } from '../App';

const data = [
  { name: 'Jan', donations: 4000, expenses: 2400 },
  { name: 'Feb', donations: 3000, expenses: 1398 },
  { name: 'Mar', donations: 2000, expenses: 9800 },
  { name: 'Apr', donations: 2780, expenses: 3908 },
  { name: 'May', donations: 1890, expenses: 4800 },
  { name: 'Jun', donations: 2390, expenses: 3800 },
];

const pieData = [
  { name: 'Education', value: 400 },
  { name: 'Health', value: 300 },
  { name: 'Relief', value: 300 },
  { name: 'Infrastructure', value: 200 },
];

const COLORS = ['#10b981', '#3b82f6', '#f43f5e', '#f59e0b'];

const Reports: React.FC = () => {
  const { donations, expenses } = useApp();
  
  const totalRaised = donations.reduce((s, d) => s + d.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Audit & Impact</h1>
        <p className="text-gray-500 mt-1 font-medium">Real-time transparency of trust operations.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col h-full">
          <h3 className="text-lg font-bold mb-8 text-gray-800 flex items-center">
            <i className="fa-solid fa-chart-line mr-3 text-emerald-500"></i> Donation Growth
          </h3>
          <div className="h-80 w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="donations" stroke="#10b981" fillOpacity={1} fill="url(#colorDon)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-2 text-gray-800 flex items-center">
            <i className="fa-solid fa-chart-pie mr-3 text-emerald-500"></i> Allocation Summary
          </h3>
          <div className="h-80 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-2/3 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={8} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1 gap-4 mt-6 md:mt-0">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }}></div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{d.name}</p>
                    <p className="text-sm font-bold text-gray-900">{Math.round((d.value/1200)*100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h3 className="text-xl font-bold text-gray-900">Verified Ledger</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-all">
            <i className="fa-solid fa-download"></i>
            <span>Export Full Audit Report (PDF)</span>
          </button>
        </div>
        
        <div className="overflow-x-auto -mx-8 px-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                <th className="pb-6 pr-4">Trustee / Field Officer</th>
                <th className="pb-6 pr-4">Description</th>
                <th className="pb-6 pr-4">Category</th>
                <th className="pb-6 pr-4 text-right">Amount</th>
                <th className="pb-6 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 pr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">ZK</div>
                      <span className="font-bold text-gray-900">Zahid Khan</span>
                    </div>
                  </td>
                  <td className="py-5 pr-4 max-w-xs">
                    <p className="font-bold text-gray-800 text-sm truncate">Blanket distribution in North District</p>
                    <p className="text-[10px] text-gray-400 font-medium">Batch #B-9022 • 3 hours ago</p>
                  </td>
                  <td className="py-5 pr-4">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-extrabold uppercase">Relief</span>
                  </td>
                  <td className="py-5 pr-4 text-right font-extrabold text-gray-900">Rs. 12,500</td>
                  <td className="py-5 text-center">
                    <button className="w-10 h-10 rounded-xl border border-gray-100 text-gray-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-white transition-all shadow-sm">
                      <i className="fa-solid fa-magnifying-glass-chart text-xs"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Reports;
