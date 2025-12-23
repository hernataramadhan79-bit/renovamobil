
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onOpenLogin?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenLogin }) => {
  return (
    <footer className="bg-blue-950 border-t border-blue-900 pt-16 pb-8 text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="inline-block group">
            <span className="text-3xl font-bold tracking-tighter text-white group-hover:text-orange-500 transition-colors">RENOVA</span>
            <span className="text-xs block tracking-[0.4em] font-light text-blue-300 -mt-1 uppercase group-hover:text-white transition-colors">Mobil</span>
          </Link>
          <p className="mt-6 text-blue-200 max-w-sm leading-relaxed">
            Mendefinisikan ulang pengalaman membeli mobil dengan pilihan kendaraan paling bergengsi di dunia yang dikurasi. Keunggulan dalam gerak sejak 1998.
          </p>
        </div>
        
        <div>
          <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-6">Tautan Cepat</h4>
          <ul className="space-y-4 text-blue-200 text-sm">
            <li><Link to="/catalog" className="hover:text-white hover:translate-x-1 transition-all inline-block">Inventaris</Link></li>
            <li><Link to="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tentang Kami</Link></li>
            <li><Link to="/news" className="hover:text-white hover:translate-x-1 transition-all inline-block">Berita Terbaru</Link></li>
            <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Jadwalkan Kunjungan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-6">Hubungi Kami</h4>
          <ul className="space-y-4 text-blue-200 text-sm">
            <li className="flex items-start gap-3">
               <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               Jl. Kemang Raya No. 42, Jakarta
            </li>
            <li className="flex items-center gap-3">
               <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               +62 21 555 1234
            </li>
            <li className="flex items-center gap-3">
               <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
               info@renova.com
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-blue-900 text-center text-blue-400 text-xs">
        <p>&copy; 2024 Renova Luxury Automotive. Hak cipta dilindungi undang-undang.</p>
      </div>
    </footer>
  );
};

export default Footer;
