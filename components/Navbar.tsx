
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onOpenLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/home' },
    { name: 'Katalog', path: '/catalog' },
    { name: 'Berita', path: '/news' },
    { name: 'Tentang Kami', path: '/about' },
    { name: 'Kontak', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="Renova Showroom Logo" className="h-12 w-auto drop-shadow-lg" />
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-baseline gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'text-orange-600 border-b-2 border-orange-500'
                      : 'text-white hover:text-orange-500 hover:-translate-y-0.5'
                  } px-3 py-2 text-sm font-medium transition-all duration-300`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User/Login Area */}
          <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-4 animate-fade-in">
                  <span className="text-sm text-gray-300 italic hidden lg:inline">Halo, {user.name}</span>
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="text-sm bg-gray-800 text-white hover:bg-gray-700 px-3 py-1 rounded transition-colors">Admin</Link>
                  )}
                  <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Keluar</button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-full text-sm font-semibold transition-all shadow-md shadow-orange-600/20 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  Masuk
                </button>
              )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-orange-500 hover:bg-gray-800 focus:outline-none transition-colors"
            >
              <svg className="h-7 w-7 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0)' }}>
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-gray-950 border-b border-gray-800 shadow-2xl animate-fade-in origin-top z-40">
          <div className="px-6 py-8 flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
            
            {/* Navigation Links */}
            <div className="space-y-2 mb-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-200 flex items-center justify-between group ${
                    isActive(link.path)
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500'
                      : 'text-white hover:bg-gray-800 hover:text-orange-500 hover:pl-6'
                  }`}
                >
                  {link.name}
                  <svg className={`w-5 h-5 transition-opacity ${isActive(link.path) ? 'opacity-100 text-orange-500' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-800 w-full mb-8"></div>

            {/* User Section */}
            <div className="mt-auto pb-8">
                {user ? (
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl shadow-sm border border-gray-700">
                            {user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-base font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-300 truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {user.role === 'ADMIN' && (
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center w-full bg-gray-800 text-white font-bold py-3.5 rounded-xl hover:bg-gray-700 transition-colors gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Dasbor Admin
                            </Link>
                        )}
                        <button 
                            onClick={() => { onLogout(); setIsOpen(false); }} 
                            className="flex items-center justify-center w-full text-red-500 font-bold py-3.5 rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-900 transition-all gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Keluar Akun
                        </button>
                    </div>
                </div>
                ) : (
                <div className="space-y-4">
                     <p className="text-center text-gray-300 text-sm mb-4">Masuk untuk mengakses fitur eksklusif</p>
                    <button
                        onClick={() => { setIsOpen(false); onOpenLogin(); }}
                        className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-800/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                        Masuk / Daftar
                    </button>
                </div>
                )}
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
