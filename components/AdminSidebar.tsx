
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AdminSidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dasbor', path: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Mobil', path: '/admin/cars', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 11a2 2 0 11-4 0 2 2 0 014 0z M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z' },
    { name: 'Berita', path: '/admin/news', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
    { name: 'Testimoni', path: '/admin/testimonials', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { name: 'Pesan Masuk', path: '/admin/inbox', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { name: 'Edit Tentang Kami', path: '/admin/about', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`w-64 h-full bg-blue-900 border-r border-blue-950 flex flex-col text-white overflow-y-auto flex-shrink-0 transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'fixed inset-y-0 left-0 md:relative md:translate-x-0' : 'fixed inset-y-0 -translate-x-full md:relative md:translate-x-0'
      } md:flex`}>
        <div className="p-8 border-b border-blue-800 sticky top-0 bg-blue-900 z-10">
          <Link to="/" className="block">
            <span className="text-2xl font-bold tracking-tighter text-white">RENOVA</span>
            <span className="text-xs block tracking-[0.2em] font-light text-blue-300 -mt-1 uppercase">Admin CMS</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => isOpen && onToggle()} // Close sidebar on mobile when clicking link
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-blue-800 text-white font-semibold shadow-lg'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800 space-y-2 sticky bottom-0 bg-blue-900">
          <Link
            to="/"
            onClick={() => isOpen && onToggle()} // Close sidebar on mobile
            className="flex items-center px-4 py-3 text-blue-300 hover:bg-blue-800 hover:text-white rounded-lg transition-all"
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ke Website
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-all"
          >
            <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
