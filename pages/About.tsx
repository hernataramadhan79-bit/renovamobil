
import React from 'react';
import { AboutData } from '../types';

interface AboutProps {
  data: AboutData;
}

const About: React.FC<AboutProps> = ({ data }) => {
  return (
    <div className="min-h-screen pt-12 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-orange-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Profil Perusahaan</h2>
          <h1 className="text-5xl font-black text-slate-900 mb-6">TENTANG RENOVA</h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </header>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
            {/* Text Content */}
            <div className="order-2 lg:order-1 animate-fade-in-up delay-100">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Warisan Kualitas Sejak 1998</h3>
                <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed whitespace-pre-line mb-8">
                    {data.description}
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-r-xl">
                    <h4 className="font-bold text-blue-900 mb-2 uppercase tracking-wide text-sm">Misi Kami</h4>
                    <p className="text-blue-800 italic font-medium">"{data.mission}"</p>
                </div>
            </div>

            {/* Main Image (First in Gallery) */}
            <div className="order-1 lg:order-2 animate-fade-in-up delay-200">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 aspect-[4/3] group">
                    <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                        src={data.gallery[0] || 'https://via.placeholder.com/800x600?text=Renova+Showroom'} 
                        alt="Renova Showroom Main" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </div>
        </div>

        {/* Gallery Section */}
        <div className="animate-fade-in-up delay-300">
            <h3 className="text-2xl font-bold text-slate-800 mb-8 text-center">Fasilitas & Showroom Kami</h3>
            
            {data.gallery.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.gallery.map((url, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-md hover:shadow-xl transition-all">
                            <img 
                                src={url} 
                                alt={`Renova Gallery ${idx + 1}`} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <span className="text-white font-bold tracking-wider">Renova Gallery</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                    Galeri foto belum tersedia.
                </div>
            )}
        </div>

        {/* Stats Section (Static for Layout) */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-16">
            <div className="text-center">
                <span className="block text-4xl font-black text-blue-900 mb-2">25+</span>
                <span className="text-slate-500 text-sm uppercase tracking-widest font-bold">Tahun Pengalaman</span>
            </div>
            <div className="text-center">
                <span className="block text-4xl font-black text-blue-900 mb-2">1000+</span>
                <span className="text-slate-500 text-sm uppercase tracking-widest font-bold">Unit Terjual</span>
            </div>
            <div className="text-center">
                <span className="block text-4xl font-black text-blue-900 mb-2">150</span>
                <span className="text-slate-500 text-sm uppercase tracking-widest font-bold">Titik Inspeksi</span>
            </div>
            <div className="text-center">
                <span className="block text-4xl font-black text-blue-900 mb-2">4.9</span>
                <span className="text-slate-500 text-sm uppercase tracking-widest font-bold">Rating Google</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;
