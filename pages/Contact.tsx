
import React, { useState } from 'react';
import { InboxMessage, Car } from '../types';

interface ContactProps {
  onSendMessage: (msg: Omit<InboxMessage, 'id' | 'date' | 'isRead'>) => void;
  cars?: Car[];
}

type TabType = 'message' | 'test-drive';

const Contact: React.FC<ContactProps> = ({ onSendMessage, cars = [] }) => {
  const [activeTab, setActiveTab] = useState<TabType>('message');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Get today's date in YYYY-MM-DD format (Local Time) for min attribute
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  // General Form State
  const [generalForm, setGeneralForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Test Drive Form State
  const [testDriveForm, setTestDriveForm] = useState({
    name: '',
    phone: '',
    email: '',
    carName: '',
    bookingDate: '',
    message: ''
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage({
        ...generalForm,
        type: 'general'
    });
    setIsSubmitted(true);
    setGeneralForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage({
        type: 'test-drive',
        name: testDriveForm.name,
        email: testDriveForm.email,
        phone: testDriveForm.phone,
        carName: testDriveForm.carName,
        bookingDate: testDriveForm.bookingDate,
        subject: `Booking Test Drive: ${testDriveForm.carName}`,
        message: testDriveForm.message || 'Saya ingin menjadwalkan test drive untuk mobil ini.'
    });
    setIsSubmitted(true);
    setTestDriveForm({ name: '', phone: '', email: '', carName: '', bookingDate: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen pt-12 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 animate-fade-in-up">
          <h2 className="text-orange-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Hubungi Kami</h2>
          <h1 className="text-5xl font-black text-slate-900">KONTAK & TEST DRIVE</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Container */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm animate-fade-in-up delay-100 overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab('message')}
                    className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'message' ? 'bg-white text-blue-900 border-b-2 border-blue-900' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                >
                    Kirim Pesan
                </button>
                <button 
                    onClick={() => setActiveTab('test-drive')}
                    className={`flex-1 py-6 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'test-drive' ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                >
                    Booking Test Drive
                </button>
            </div>

            <div className="p-8">
                {isSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl mb-8 flex items-center gap-4 animate-scale-in">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                    <h4 className="font-bold">Permintaan Terkirim!</h4>
                    <p className="text-sm opacity-80">Tim kami akan menghubungi Anda sesegera mungkin.</p>
                    </div>
                </div>
                )}

                {/* GENERAL FORM */}
                {activeTab === 'message' && (
                    <form onSubmit={handleGeneralSubmit} className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                            <label className="block text-slate-500 text-sm mb-2 font-medium">Nama Lengkap</label>
                            <input
                                required
                                type="text"
                                value={generalForm.name}
                                onChange={e => setGeneralForm({ ...generalForm, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="Masukkan nama Anda"
                            />
                            </div>
                            <div>
                            <label className="block text-slate-500 text-sm mb-2 font-medium">Alamat Email</label>
                            <input
                                required
                                type="email"
                                value={generalForm.email}
                                onChange={e => setGeneralForm({ ...generalForm, email: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="nama@contoh.com"
                            />
                            </div>
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm mb-2 font-medium">Subjek / Judul</label>
                            <input
                            required
                            type="text"
                            value={generalForm.subject}
                            onChange={e => setGeneralForm({ ...generalForm, subject: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Apa yang Anda minati?"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-500 text-sm mb-2 font-medium">Pesan Anda</label>
                            <textarea
                            required
                            rows={5}
                            value={generalForm.message}
                            onChange={e => setGeneralForm({ ...generalForm, message: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Bagaimana kami dapat membantu Anda?"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 transform hover:-translate-y-1"
                        >
                            Kirim Pesan
                        </button>
                    </form>
                )}

                {/* TEST DRIVE FORM */}
                {activeTab === 'test-drive' && (
                    <form onSubmit={handleTestDriveSubmit} className="space-y-6 animate-fade-in">
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-4 text-sm text-orange-800">
                            Silakan lengkapi data di bawah ini. Sales Consultant kami akan menghubungi WhatsApp Anda untuk konfirmasi jadwal.
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-slate-500 text-sm mb-2 font-medium">Nama Lengkap</label>
                                <input
                                    required
                                    type="text"
                                    value={testDriveForm.name}
                                    onChange={e => setTestDriveForm({ ...testDriveForm, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                    placeholder="Nama pemesan"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-500 text-sm mb-2 font-medium">No. WhatsApp / Telepon</label>
                                <input
                                    required
                                    type="tel"
                                    value={testDriveForm.phone}
                                    onChange={e => setTestDriveForm({ ...testDriveForm, phone: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                    placeholder="0812..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-500 text-sm mb-2 font-medium">Email</label>
                            <input
                                required
                                type="email"
                                value={testDriveForm.email}
                                onChange={e => setTestDriveForm({ ...testDriveForm, email: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                placeholder="nama@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-slate-500 text-sm mb-2 font-medium">Mobil Pilihan</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={testDriveForm.carName}
                                        onChange={e => setTestDriveForm({ ...testDriveForm, carName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>-- Pilih Mobil --</option>
                                        {cars.map(car => (
                                            <option key={car.id} value={car.name}>{car.name} ({car.year})</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-500 text-sm mb-2 font-medium">Rencana Tanggal</label>
                                <input
                                    required
                                    type="date"
                                    min={today}
                                    value={testDriveForm.bookingDate}
                                    onChange={e => setTestDriveForm({ ...testDriveForm, bookingDate: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all cursor-pointer caret-transparent"
                                    style={{ colorScheme: 'light' }}
                                    onClick={(e) => {
                                        try {
                                            if ('showPicker' in e.currentTarget) {
                                                (e.currentTarget as any).showPicker();
                                            }
                                        } catch (err) {
                                            // Fallback
                                        }
                                    }}
                                    onFocus={(e) => {
                                        try {
                                            if ('showPicker' in e.target) {
                                                (e.target as any).showPicker();
                                            }
                                        } catch (err) {
                                            // Fallback
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-500 text-sm mb-2 font-medium">Catatan Tambahan (Opsional)</label>
                            <textarea
                                rows={3}
                                value={testDriveForm.message}
                                onChange={e => setTestDriveForm({ ...testDriveForm, message: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                placeholder="Contoh: Saya ingin mencoba di pagi hari..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-900/20 active:scale-95 transform hover:-translate-y-1"
                        >
                            Jadwalkan Test Drive
                        </button>
                    </form>
                )}
            </div>
          </div>

          {/* Info & Map (Same as before) */}
          <div className="space-y-12 animate-fade-in-up delay-200">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Lokasi Kami</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Kunjungi showroom utama kami di Kemang. Kami menawarkan penayangan pribadi dan test drive dengan perjanjian.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-700 hover:text-blue-900 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-orange-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>Jl. Kemang Raya No. 42, Jakarta Selatan</span>
                </div>
                <div className="flex items-center gap-4 text-slate-700 hover:text-blue-900 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-orange-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>+62 21 555 1234</span>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder */}
            <div className="w-full h-80 rounded-3xl overflow-hidden bg-slate-200 relative group">
              <div className="absolute inset-0 bg-slate-100/80 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm opacity-100 group-hover:opacity-90 transition-opacity">
                 <svg className="w-12 h-12 text-orange-500 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                 </svg>
                 <span className="text-slate-500 font-medium">Tempat Integrasi Google Maps</span>
                 <p className="text-slate-400 text-xs mt-2">Peta akan ditampilkan di sini dengan kunci API</p>
              </div>
              <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800" alt="map placeholder" className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
