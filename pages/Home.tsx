import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Testimonial, User } from '../types';
import CarCard from '../components/CarCard';
import SuccessModal from '../components/SuccessModal';

interface HomeProps {
  cars: Car[];
  testimonials?: Testimonial[];
  onAddTestimonial?: (data: any) => void;
  user?: User | null;
  onOpenLogin?: () => void;
}

const Home: React.FC<HomeProps> = ({ cars, testimonials = [], onAddTestimonial, user, onOpenLogin }) => {
  
  // State for Review Form
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-fill name if user logs in
  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmitReview = (e: React.FormEvent) => {
      e.preventDefault();
      if(onAddTestimonial) {
          setIsSubmitting(true);
          // Simulate network delay for effect
          setTimeout(() => {
              onAddTestimonial({
                  name,
                  rating,
                  comment,
                  role: role || 'Pengunjung Showroom'
              });
              // Reset form but keep name if logged in
              setName(user ? user.name : '');
              setComment('');
              setRole('');
              setRating(5);
              setIsSubmitting(false);
              setShowSuccessModal(true);
          }, 800);
      }
  };

  return (
    <div className="overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://imgcdn.oto.com/large/gallery/exterior/38/1240/toyota-kijang-innova-front-angle-low-view-351782.jpg"
            alt="Hero Car"
            className="w-full h-full object-cover animate-scale-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl animate-fade-in-up">
            Temukan mobil impian Anda  <span className="text-orange-500">dengan mudah dan aman</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-fade-in-up delay-100">
            Rasakan kemewahan dan performa yang tak tertandingi. Showroom kami menampilkan koleksi otomotif paling eksklusif di wilayah ini.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <Link
              to="/catalog"
              className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl shadow-orange-900/30"
            >
              Jelajahi Koleksi
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-bold transition-all border border-white/30 hover:border-white/60"
            >
              Jadwalkan Test Drive
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Services Summary */}
      <section className="py-20 bg-white border-b border-slate-200 animate-fade-in-up delay-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Inventaris', value: '150+', sub: 'Mobil Mewah' },
            { label: 'Pengalaman', value: '25', sub: 'Tahun Melayani' },
            { label: 'Klien Puas', value: '2k+', sub: 'Secara Global' },
            { label: 'Penghargaan', value: '12', sub: 'Layanan Pelanggan' },
          ].map((stat, idx) => (
            <div key={idx} className="text-center group hover:-translate-y-2 transition-transform duration-300">
              <span className="block text-4xl font-bold text-blue-900 mb-2 group-hover:text-orange-600 transition-colors">{stat.value}</span>
              <span className="block text-slate-700 font-bold">{stat.label}</span>
              <span className="block text-slate-500 text-sm">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 animate-fade-in-up">
            <div>
              <h2 className="text-orange-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Pilihan Terkurasi</h2>
              <h3 className="text-4xl font-bold text-slate-900">MODEL UNGGULAN</h3>
            </div>
            <Link to="/catalog" className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-2 mb-1 group transition-all">
              Lihat Semua Inventaris
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cars.map((car, idx) => (
              <div key={car.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-orange-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Suara Pelanggan</h2>
              <h3 className="text-4xl font-bold text-slate-900">APA KATA MEREKA</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {testimonials.length > 0 ? (
                  testimonials.slice(0, 3).map((t, idx) => (
                      <div key={t.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col animate-fade-in-up hover:-translate-y-1 transition-transform duration-300 overflow-hidden" style={{ animationDelay: `${idx * 150}ms` }}>
                          <div className="flex text-orange-400 mb-6 flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-5 h-5 ${i < t.rating ? 'fill-current' : 'text-slate-200'}`} viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                              ))}
                          </div>
                          <p className="text-slate-600 italic text-lg mb-8 flex-1 leading-relaxed break-words max-w-full">
                            "{t.comment}"
                          </p>
                          <div className="flex items-center gap-4 mt-auto border-t border-slate-50 pt-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl flex-shrink-0">
                                  {t.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                  <h4 className="font-bold text-slate-900 truncate">{t.name}</h4>
                                  <p className="text-xs text-slate-500 uppercase tracking-wide truncate">{t.role}</p>
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-span-3 text-center text-slate-400 italic">Belum ada ulasan ditampilkan.</div>
              )}
           </div>

           {/* Review Form Container */}
           <div className="max-w-2xl mx-auto bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-inner animate-fade-in-up delay-300 relative overflow-hidden">
               
               {user ? (
                 <>
                   <div className="text-center mb-8">
                       <h4 className="text-2xl font-bold text-slate-800 mb-2">Bagikan Pengalaman Anda</h4>
                       <p className="text-slate-500">Halo <span className="font-bold text-blue-900">{user.name}</span>, berikan penilaian Anda untuk Renova.</p>
                   </div>
                   
                   <form onSubmit={handleSubmitReview} className="space-y-6">
                       <div className="flex flex-col items-center justify-center mb-6">
                           <label className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-3">Rating Anda</label>
                           <div className="flex gap-2">
                               {[1, 2, 3, 4, 5].map((star) => (
                                   <button 
                                      key={star} 
                                      type="button" 
                                      onClick={() => setRating(star)}
                                      className="focus:outline-none transform transition-transform hover:scale-110"
                                   >
                                       <svg className={`w-10 h-10 ${rating >= star ? 'text-orange-400 fill-current' : 'text-slate-300'}`} viewBox="0 0 24 24">
                                           <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                       </svg>
                                   </button>
                               ))}
                           </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                               <input 
                                  required
                                  type="text" 
                                  placeholder="Nama Lengkap" 
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                  disabled={!!user} // Optional: Disable name editing if logged in
                               />
                           </div>
                           <div>
                               <input 
                                  type="text" 
                                  placeholder="Role (cth: Pengunjung / Pembeli)" 
                                  value={role}
                                  onChange={(e) => setRole(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                               />
                           </div>
                       </div>
                       
                       <textarea 
                          required
                          rows={4} 
                          placeholder="Tulis ulasan Anda di sini..." 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                       />

                       <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full bg-blue-900 text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                       >
                          {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                       </button>
                   </form>
                 </>
               ) : (
                 <div className="text-center py-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-800 mb-3">Masuk untuk Memberi Ulasan</h4>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                      Kami menghargai privasi dan keaslian ulasan. Silakan masuk atau daftar akun untuk membagikan pengalaman Anda bertransaksi dengan Renova.
                    </p>
                    <button 
                      onClick={onOpenLogin}
                      className="bg-blue-900 text-white font-bold py-3 px-10 rounded-full hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Masuk ke Akun
                    </button>
                 </div>
               )}

           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-blue-900 p-12 md:p-20 text-center shadow-2xl shadow-blue-900/20 group animate-fade-in-up">
            <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:scale-105 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200" alt="bg" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">SIAP MENEMUKAN MOBIL IMPIAN ANDA?</h2>
                <p className="text-blue-100 text-lg md:text-xl max-w-xl mx-auto mb-10">
                  Spesialis kami siap membantu Anda menemukan kendaraan sempurna yang sesuai dengan gaya hidup dan kebutuhan performa Anda.
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-white text-blue-900 px-12 py-4 rounded-full text-lg font-bold hover:bg-orange-50 hover:text-orange-600 transition-all shadow-xl hover:-translate-y-1"
                >
                  Hubungi Kami
                </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Success Modal for Review Submission */}
      <SuccessModal
        isOpen={showSuccessModal}
        title="Terima Kasih!"
        message="Ulasan Anda telah berhasil diterbitkan. Kami sangat menghargai feedback dari Anda."
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Home;