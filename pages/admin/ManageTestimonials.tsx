import React, { useState } from 'react';
import { Testimonial } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';

interface ManageTestimonialsProps {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}

const ManageTestimonials: React.FC<ManageTestimonialsProps> = ({ testimonials, setTestimonials }) => {
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; name: string }>({ isOpen: false, id: '', name: '' });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete({ isOpen: true, id, name });
  };

  const confirmDeleteTestimonial = () => {
    setTestimonials(prev => {
      const updated = prev.filter(t => String(t.id) !== String(confirmDelete.id));
      return [...updated];
    });
    setConfirmDelete({ isOpen: false, id: '', name: '' });
    setSuccessModal({ isOpen: true, message: `Testimoni dari "${confirmDelete.name}" telah dihapus.` });
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, id: '', name: '' });
  };

  const toggleVisibility = (id: string) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, isVisible: !t.isVisible } : t
    ));
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Manajemen Testimoni</h1>
        <p className="text-slate-500">Kelola ulasan yang muncul di halaman beranda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {testimonials.map(item => (
          <div key={item.id} className={`bg-white rounded-2xl border p-6 shadow-sm transition-all relative ${item.isVisible ? 'border-slate-200' : 'opacity-70 grayscale bg-slate-50'}`}>
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-800">{item.name}</h3>
                <div className="text-orange-400 font-bold">★ {item.rating}</div>
             </div>
             <p className="text-sm text-slate-500 italic mb-6 leading-relaxed">"{item.comment}"</p>
             
             <div className="flex justify-between items-center border-t border-slate-50 pt-4 relative">
                <button 
                  type="button"
                  onClick={() => toggleVisibility(item.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${item.isVisible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                >
                    {item.isVisible ? 'Aktif' : 'Tersembunyi'}
                </button>
                
                <button 
                   type="button"
                   onClick={(e) => handleDelete(e, item.id, item.name)}
                   className="text-red-500 hover:text-red-700 p-2.5 rounded-full hover:bg-red-50 active:scale-90 transition-all cursor-pointer relative z-[100]"
                >
                   <svg className="w-6 h-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                </button>
             </div>
          </div>
        ))}
      </div>
      
      {testimonials.length === 0 && (
         <div className="text-center py-20 bg-white border border-dashed rounded-3xl text-slate-400 italic">Belum ada testimoni.</div>
      )}

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title="Hapus Testimoni"
        message={`Apakah Anda yakin ingin menghapus ulasan dari "${confirmDelete.name}"?`}
        onConfirm={confirmDeleteTestimonial}
        onCancel={cancelDelete}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        title="Berhasil Dihapus"
        message={successModal.message}
        onClose={() => setSuccessModal({ isOpen: false, message: '' })}
      />
    </div>
  );
};

export default ManageTestimonials;