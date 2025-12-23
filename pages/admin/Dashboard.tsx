
import React from 'react';
import { Car, NewsPost, InboxMessage } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  cars: Car[];
  news: NewsPost[];
  inbox: InboxMessage[];
}

const Dashboard: React.FC<DashboardProps> = ({ cars, news, inbox }) => {
  const unreadCount = inbox.filter(m => !m.isRead).length;

  // Chart Data: Cars per brand
  const brandData = Array.from(new Set(cars.map(c => c.brand))).map(brand => ({
    name: brand,
    count: cars.filter(c => c.brand === brand).length
  }));

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']; // Blue shades

  const StatCard = ({ title, value, sub, iconColor }: { title: string, value: string | number, sub: string, iconColor: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className={`w-3 h-3 rounded-full ${iconColor}`}></div>
      </div>
      <div className="text-3xl font-bold text-slate-800">{value}</div>
      <p className="text-slate-500 text-xs mt-1">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Dasbor Admin</h1>
        <p className="text-slate-500">Ikhtisar sistem dan metrik kinerja.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Inventaris" value={cars.length} sub="Kendaraan aktif" iconColor="bg-blue-600" />
        <StatCard title="Total Berita" value={news.length} sub="Artikel diterbitkan" iconColor="bg-orange-500" />
        <StatCard title="Pesan Baru" value={unreadCount} sub="Menunggu respon" iconColor="bg-red-500" />
        <StatCard title="Total Pesan" value={inbox.length} sub="Kotak masuk seumur hidup" iconColor="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Inventaris berdasarkan Merek</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={brandData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#1e293b' }}
                  itemStyle={{ color: '#2563eb' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Pesan Terbaru</h3>
          <div className="space-y-6">
            {inbox.slice(0, 5).map(msg => (
              <div key={msg.id} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold text-slate-800">{msg.name}</span>
                  <span className="text-[10px] text-slate-400">{msg.date}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{msg.subject}</p>
                {!msg.isRead && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase tracking-tighter">Baru</span>
                )}
              </div>
            ))}
            {inbox.length === 0 && <p className="text-slate-400 text-sm text-center py-8 italic">Belum ada pesan.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
