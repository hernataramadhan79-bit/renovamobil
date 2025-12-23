import React, { useState } from 'react';
import { InboxMessage } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';

interface ManageInboxProps {
  inbox: InboxMessage[];
  setInbox: React.Dispatch<React.SetStateAction<InboxMessage[]>>;
}

const ManageInbox: React.FC<ManageInboxProps> = ({ inbox, setInbox }) => {
  const [filter, setFilter] = useState<'all' | 'general' | 'test-drive'>('all');
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; name: string }>({ isOpen: false, id: '', name: '' });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  const filteredInbox = inbox.filter(msg => {
      if (filter === 'all') return true;
      const msgType = msg.type || 'general';
      return msgType === filter;
  });

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete({ isOpen: true, id, name });
  };

  const confirmDeleteMessage = () => {
    setInbox(prev => {
      const updated = prev.filter(msg => String(msg.id) !== String(confirmDelete.id));
      return [...updated];
    });
    setConfirmDelete({ isOpen: false, id: '', name: '' });
    setSuccessModal({ isOpen: true, message: `Pesan dari "${confirmDelete.name}" telah dihapus.` });
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, id: '', name: '' });
  };

  const toggleRead = (id: string) => {
    setInbox(prev => prev.map(msg =>
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };

  const handleReplyEmail = (msg: InboxMessage) => {
    const subject = `Re: ${msg.subject || 'Pertanyaan dari Renova Showroom'}`;
    const body = `Dear ${msg.name},

Terima kasih atas pesan Anda.

"${msg.message}"

Best regards,
Renova Mobil Showroom`;

    const mailtoLink = `mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  const handleReplyWhatsApp = (msg: InboxMessage) => {
    if (!msg.phone) {
      alert('Nomor WhatsApp tidak tersedia untuk pesan ini.');
      return;
    }

    const message = `Halo ${msg.name},

Terima kasih atas pesan Anda.

"${msg.message}"

Best regards,
Renova Mobil Showroom`;

    const whatsappLink = `https://wa.me/${msg.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Kotak Masuk</h1>
            <p className="text-slate-500">Lihat pesan pertanyaan dan booking test drive.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border shadow-sm relative z-20">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:text-slate-800'}`}>Semua</button>
            <button onClick={() => setFilter('general')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === 'general' ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:text-slate-800'}`}>Umum</button>
            <button onClick={() => setFilter('test-drive')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === 'test-drive' ? 'bg-orange-100 text-orange-800' : 'text-slate-500 hover:text-slate-800'}`}>Test Drive</button>
        </div>
      </header>

      <div className="space-y-4 relative z-10">
        {filteredInbox.map(msg => (
          <div key={msg.id} className={`p-6 rounded-2xl border transition-all relative ${msg.isRead ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-300 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{msg.name}</h3>
                <p className="text-xs text-slate-500">{msg.email}</p>
              </div>
              <div className="flex gap-2 items-center relative z-[100] pointer-events-auto">
                <button
                  type="button"
                  onClick={() => handleReplyEmail(msg)}
                  className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded hover:bg-green-200 transition-all flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
                {msg.phone && (
                  <button
                    type="button"
                    onClick={() => handleReplyWhatsApp(msg)}
                    className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded hover:bg-green-200 transition-all flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    WA
                  </button>
                )}
                {!msg.isRead && (
                  <button type="button" onClick={() => toggleRead(msg.id)} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded hover:bg-blue-200 transition-all">Dibaca</button>
                )}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, msg.id, msg.name)}
                  className="px-3 py-1 text-red-500 text-xs font-bold rounded hover:bg-red-50 border border-transparent hover:border-red-100 cursor-pointer transition-all active:scale-95"
                >
                  Hapus
                </button>
              </div>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-600">
              "{msg.message}"
            </div>
          </div>
        ))}
        {filteredInbox.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-slate-400 italic">Tidak ada pesan ditemukan.</div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmDelete.isOpen}
        title="Hapus Pesan"
        message={`Apakah Anda yakin ingin menghapus pesan dari "${confirmDelete.name}" secara permanen?`}
        onConfirm={confirmDeleteMessage}
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

export default ManageInbox;