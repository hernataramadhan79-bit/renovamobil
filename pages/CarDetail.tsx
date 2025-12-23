
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Car } from '../types';

interface CarDetailProps {
  cars: Car[];
}

const CarDetail: React.FC<CarDetailProps> = ({ cars }) => {
  const { id } = useParams<{ id: string }>();
  const car = cars.find(c => c.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!car) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Mobil Tidak Ditemukan</h2>
        <Link to="/catalog" className="text-blue-600 hover:underline">Kembali ke Katalog</Link>
      </div>
    );
  }

  // Combine main image with gallery
  const galleryImages = [car.image, ...(car.gallery || [])];

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  // Helper component for detail rows
  const DetailRow = ({ label, value }: { label: string, value: string | number }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className="text-slate-900 text-sm font-bold text-right">{value}</span>
    </div>
  );

  const SpecCard = ({ icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center text-center">
        <div className="text-slate-400 mb-1">{icon}</div>
        <span className="text-[10px] uppercase text-slate-500 font-bold mb-0.5">{label}</span>
        <span className="text-sm font-bold text-slate-900 truncate w-full" title={String(value)}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <Link to="/catalog" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-900 transition-colors">
             <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
             Kembali ke Katalog
          </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: VISUALS & DETAILED CONTENT (66%) */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Image Slider */}
                <div className="space-y-4">
                    <div className="relative aspect-[16/10] bg-slate-200 rounded-3xl overflow-hidden group shadow-md border border-slate-200">
                        <img 
                            src={galleryImages[activeImageIndex]} 
                            alt={`${car.name} - view ${activeImageIndex + 1}`} 
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                        
                        {/* Navigation Arrows */}
                        {galleryImages.length > 1 && (
                            <>
                                <button 
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white p-3 rounded-full text-slate-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <button 
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur hover:bg-white p-3 rounded-full text-slate-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {galleryImages.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Description Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                     <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        Deskripsi Kendaraan
                     </h3>
                     <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                         {car.description}
                     </div>
                </div>

                {/* 3. Detailed Specs Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Spesifikasi Lengkap
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                         <DetailRow label="Warna Eksterior" value={car.color || '-'} />
                         <DetailRow label="Warna Interior" value={car.interior_color || '-'} />
                         <DetailRow label="Tipe Bodi" value={car.body_type || '-'} />
                         <DetailRow label="Jumlah Kursi" value={`${car.seats} Penumpang` || '-'} />
                         <DetailRow label="Plat Nomor" value={car.plate_number || '-'} />
                         <DetailRow label="Pajak Berlaku" value={car.tax_date || '-'} />
                         <DetailRow label="Riwayat Servis" value={car.service_history || '-'} />
                         <DetailRow label="Kepemilikan" value={`Tangan ke-${car.previous_owners}` || '-'} />
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: STICKY SIDEBAR (33%) */}
            <div className="lg:col-span-4 relative">
                <div className="sticky top-24 space-y-6">
                    
                    {/* Main Info Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${car.condition === 'Baru' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                {car.condition}
                            </span>
                            {car.is_featured && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                                    Unggulan
                                </span>
                            )}
                        </div>

                        {/* Title & Brand */}
                        <div className="mb-6">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{car.brand} • {car.year}</div>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight">{car.name}</h1>
                        </div>

                        {/* Price */}
                        <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Harga Penawaran</span>
                            <div className="text-3xl font-bold text-blue-900">
                                Rp {car.price.toLocaleString('id-ID')}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">*Harga dapat berubah sewaktu-waktu</span>
                        </div>

                        {/* Key Specs Grid (Small icons) */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <SpecCard 
                                icon={<svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                label="Mesin"
                                value={car.engine}
                            />
                            <SpecCard 
                                icon={<svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>}
                                label="Transmisi"
                                value={car.transmission}
                            />
                            <SpecCard 
                                icon={<svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>}
                                label="KM"
                                value={car.mileage > 0 ? `${(car.mileage / 1000).toFixed(1)}K` : '0'}
                            />
                             <SpecCard 
                                icon={<svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                label="Lokasi"
                                value={car.location || 'Showroom'}
                            />
                        </div>

                        {/* CTAs */}
                        <div className="space-y-3">
                            <Link to="/contact" className="flex items-center justify-center w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-900/10 active:scale-95 gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                WhatsApp Sekarang
                            </Link>
                             <Link to="/contact" className="block w-full bg-white border-2 border-slate-100 text-slate-700 text-center py-3.5 rounded-xl font-bold hover:border-orange-500 hover:text-orange-600 transition-all active:scale-95">
                                Jadwalkan Test Drive
                            </Link>
                        </div>
                    </div>

                    {/* Safety Badge */}
                    <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 text-blue-800 border border-blue-100">
                        <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <div>
                            <h4 className="font-bold text-sm">Jaminan Renova</h4>
                            <p className="text-xs mt-1 leading-relaxed">Kendaraan ini telah lulus inspeksi 150 titik dan dilengkapi garansi mesin 30 hari.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
