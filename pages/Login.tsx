import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { signUp, signIn, getCurrentUser } from '../utils/supabase';

interface LoginModalProps {
  onLogin: (user: User) => void;
  user: User | null;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, user, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegister) {
      // --- REGISTER LOGIC ---
      if (!name || !email || !password) {
        setError('Mohon lengkapi semua data.');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Format email tidak valid.');
        return;
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter.');
        return;
      }

      try {
        const result = await signUp(email, password, name);
        if (result.user && !result.user.email_confirmed_at) {
          setSuccessMsg('Akun berhasil dibuat! Silakan periksa email Anda untuk konfirmasi sebelum login.');
        } else {
          setSuccessMsg('Akun berhasil dibuat! Anda dapat login sekarang.');
        }
        setTimeout(() => {
          setIsRegister(false);
          setSuccessMsg('');
        }, 5000);
      } catch (error: any) {
        console.error('Signup error:', error);
        if (error.message?.includes('already registered')) {
          setError('Email sudah terdaftar. Silakan login atau gunakan email lain.');
        } else if (error.message?.includes('Password')) {
          setError('Password terlalu lemah. Gunakan minimal 6 karakter.');
        } else {
          setError(error.message || 'Terjadi kesalahan saat mendaftar. Pastikan email valid dan password cukup kuat.');
        }
      }

    } else {
      // --- LOGIN LOGIC ---
      if (!email || !password) {
        setError('Mohon lengkapi email dan password.');
        return;
      }

      try {
        await signIn(email, password);
        const user = await getCurrentUser();
        if (user) {
          onLogin(user);
          navigate(user.role === 'ADMIN' ? '/admin' : '/');
        } else {
          setError('Gagal mendapatkan data pengguna.');
        }
      } catch (error: any) {
        setError(error.message || 'Email atau password salah.');
      }
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false); // Reset password visibility on toggle
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl animate-scale-in overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-50 z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <span className="text-3xl font-black tracking-tighter text-blue-900">RENOVA</span>
          <p className="text-slate-500 mt-2 text-sm">
            {isRegister ? 'Buat akun baru untuk memulai' : 'Masuk untuk mengakses dasbor Anda'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-6 flex items-start gap-2 animate-pulse">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm p-4 rounded-xl mb-6 flex items-start gap-2 animate-pulse">
             <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div className="animate-fade-in-up">
              <label className="block text-slate-500 text-xs mb-1.5 font-bold uppercase tracking-wider">Nama Lengkap</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                placeholder="John Doe"
              />
            </div>
          )}
          
          <div className="animate-fade-in-up delay-100">
            <label className="block text-slate-500 text-xs mb-1.5 font-bold uppercase tracking-wider">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              placeholder="nama@email.com"
            />
          </div>
          
          <div className="animate-fade-in-up delay-200">
            <label className="block text-slate-500 text-xs mb-1.5 font-bold uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
              >
                {showPassword ? (
                  // Eye Slash (Hide)
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye (Show)
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 transform duration-150 mt-2 ${isRegister ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-900/20' : 'bg-blue-900 hover:bg-blue-800 shadow-blue-900/20'}`}
          >
            {isRegister ? 'Buat Akun' : 'Masuk'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
           <p className="text-slate-500 text-sm">
             {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}
             <button 
               onClick={toggleMode}
               className="ml-2 font-bold text-blue-800 hover:text-orange-600 hover:underline transition-colors"
             >
               {isRegister ? 'Masuk sekarang' : 'Daftar sekarang'}
             </button>
           </p>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;