import React, { useState, useEffect } from 'react';
import { NewsPost } from '../../types';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getNews, createNews, updateNews, deleteNews, uploadImage } from '../../utils/supabase';

interface ManageNewsProps {
  // No props needed
}

const ManageNews: React.FC<ManageNewsProps> = () => {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; title: string }>({ isOpen: false, id: '', title: '' });
  
  const initialFormState: Partial<NewsPost> = { 
    title: '', 
    content: '', 
    image: '', 
    date: new Date().toISOString().split('T')[0],
    author: 'Admin Renova',
    excerpt: ''
  };

  const [formData, setFormData] = useState<Partial<NewsPost>>(initialFormState);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // Load news data
  const loadNews = async () => {
    try {
      setLoading(true);
      const newsData = await getNews();
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete({ isOpen: true, id, title });
  };

  const confirmDeleteNews = async () => {
    try {
      await deleteNews(confirmDelete.id);
      loadNews(); // Refresh data
    } catch (error) {
      console.error('Error deleting news:', error);
      // Fallback to local state
      setNews(prev => prev.filter(n => String(n.id) !== String(confirmDelete.id)));
    }
    setConfirmDelete({ isOpen: false, id: '', title: '' });
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, id: '', title: '' });
  };

  const handleEdit = (post: NewsPost) => {
    setFormData(post);
    setEditingId(post.id);
    setSelectedImageFile(null);
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSelectedImageFile(null);
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setViewMode('list');
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;

      // Upload image if selected
      if (selectedImageFile) {
        imageUrl = await uploadImage(selectedImageFile);
      }

      const postData = {
        ...formData,
        image: imageUrl,
        excerpt: formData.excerpt || (formData.content ? formData.content.substring(0, 100) + '...' : '')
      };

      if (editingId) {
        await updateNews(editingId, postData);
      } else {
        await createNews(postData);
      }
      loadNews(); // Refresh data
    } catch (error) {
      console.error('Error saving news:', error);
      // Fallback to local state
      if (editingId) {
        setNews(prev => prev.map(n => n.id === editingId ? { ...formData, id: editingId } as NewsPost : n));
      } else {
        const newPost = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          excerpt: formData.excerpt || (formData.content ? formData.content.substring(0, 100) + '...' : '')
        } as NewsPost;
        setNews(prev => [newPost, ...prev]);
      }
    }
    setViewMode('list');
    setEditingId(null);
  };

  // --- REUSABLE COMPONENTS (Sama seperti ManageCars) ---
  const FormRow = ({ label, children, required = false, helpText = '' }: { label: string, children: React.ReactNode, required?: boolean, helpText?: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 last:border-b-0">
      <div className="md:col-span-3 bg-slate-50 px-6 py-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helpText && <span className="text-[10px] text-slate-400 mt-1 font-normal leading-tight">{helpText}</span>}
      </div>
      <div className="md:col-span-9 bg-white px-4 py-3 flex items-center">
        {children}
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon }: { title: string, icon: any }) => (
    <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex items-center gap-3 rounded-t-lg mt-8 first:mt-0">
        <div className="text-blue-600 bg-white p-1.5 rounded-lg shadow-sm border border-slate-200">
            {icon}
        </div>
        <h3 className="font-bold text-slate-800 text-sm tracking-widest uppercase">{title}</h3>
    </div>
  );

  return (
    <div className="pb-20">
      
      {/* MODE LIST VIEW */}
      {viewMode === 'list' && (
          <div className="space-y-8 animate-fade-in">
              <header className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Manajemen Berita</h1>
                  <p className="text-slate-500">Tulis artikel untuk blog atau pengumuman showroom.</p>
                </div>
                <button 
                  type="button"
                  onClick={handleAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Tulis Berita
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map(post => (
                  <div key={post.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm group relative hover:shadow-md transition-shadow">
                    <div className="h-44 relative overflow-hidden bg-slate-100">
                      <img src={post.image} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt={post.title} />
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 z-[10]">
                        <button type="button" onClick={() => handleEdit(post)} className="bg-white/90 backdrop-blur text-blue-600 p-2 rounded-full shadow-lg border border-slate-100 hover:bg-blue-50 active:scale-90 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button type="button" onClick={(e) => handleDelete(e, post.id, post.title)} className="bg-white/90 backdrop-blur text-red-500 p-2 rounded-full shadow-lg border border-slate-100 hover:bg-red-50 active:scale-90 transition-all">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{post.author}</span>
                          <span className="text-xs text-slate-400 font-medium">{post.date}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 line-clamp-2 mb-2 leading-tight">{post.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
              {news.length === 0 && (
                  <div className="text-center py-20 bg-white border border-dashed rounded-3xl text-slate-400 italic">Belum ada berita.</div>
              )}
          </div>
      )}

      {/* MODE FORM VIEW */}
      {viewMode === 'form' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
             {/* Form Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
                 <div>
                    <button onClick={handleCancel} className="text-slate-500 hover:text-blue-900 text-sm font-bold flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Kembali ke Daftar
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">{editingId ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h1>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        Batal
                    </button>
                    <button type="submit" form="newsForm" className="px-8 py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                        Simpan Artikel
                    </button>
                </div>
            </div>

            <form id="newsForm" onSubmit={handleSave} className="space-y-8 pb-12">
                
                {/* SECTION 1: HEADER ARTIKEL */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Detail Publikasi" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /></svg>} />
                    
                    <FormRow label="Judul Artikel" required>
                         <input 
                            type="text" 
                            required 
                            className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-blue-500" 
                            defaultValue={formData.title} 
                            onBlur={e => setFormData({...formData, title: e.target.value})}
                            placeholder="Judul yang menarik..." 
                        />
                    </FormRow>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="border-b border-slate-200 md:border-b-0 md:border-r">
                             <FormRow label="Penulis">
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900" 
                                    defaultValue={formData.author} 
                                    onBlur={e => setFormData({...formData, author: e.target.value})} 
                                />
                             </FormRow>
                         </div>
                         <FormRow label="Tanggal Terbit">
                            <input
                                type="date"
                                required
                                className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900"
                                defaultValue={formData.date}
                                onBlur={e => setFormData(prev => ({...prev, date: e.target.value}))}
                            />
                         </FormRow>
                    </div>
                </div>

                {/* SECTION 2: MEDIA */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Gambar Sampul" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />

                    <FormRow label="Upload Gambar" required helpText="Gunakan gambar landscape resolusi tinggi.">
                        <div className="w-full flex gap-4 items-start">
                             <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-2.5 border border-slate-300 rounded mb-2 bg-white text-slate-900"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setSelectedImageFile(file);
                                      }
                                    }}
                                />
                                {formData.image && !selectedImageFile && (
                                  <p className="text-sm text-slate-500">Gambar saat ini: {formData.image.split('/').pop()}</p>
                                )}
                             </div>
                             <div className="w-32 h-20 bg-slate-100 border border-slate-300 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  {selectedImageFile ? (
                                    <img src={URL.createObjectURL(selectedImageFile)} className="w-full h-full object-cover" alt="Preview" />
                                  ) : formData.image ? (
                                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                  ) : (
                                    <span className="text-xs text-slate-400">No Img</span>
                                  )}
                             </div>
                        </div>
                    </FormRow>
                </div>

                {/* SECTION 3: KONTEN */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Konten Berita" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} />
                    
                    <div className="border-b border-slate-200">
                         <FormRow label="Kutipan Singkat (Excerpt)" helpText="Akan muncul di kartu preview.">
                            <textarea 
                                rows={2} 
                                className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-none focus:border-blue-500" 
                                defaultValue={formData.excerpt} 
                                onBlur={e => setFormData({...formData, excerpt: e.target.value})}
                                placeholder="Ringkasan singkat artikel..." 
                            />
                         </FormRow>
                    </div>

                    <div className="p-0">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                             <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Isi Artikel Lengkap</label>
                        </div>
                        <div className="p-0">
                            <textarea 
                                required 
                                rows={12} 
                                className="w-full p-6 border-none focus:ring-0 text-slate-700 leading-relaxed resize-y bg-white placeholder:text-slate-400" 
                                defaultValue={formData.content} 
                                onBlur={e => setFormData({...formData, content: e.target.value})}
                                placeholder="Mulai menulis artikel Anda di sini..." 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                     <button type="button" onClick={handleCancel} className="px-8 py-3 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        Batal
                    </button>
                    <button type="submit" className="px-10 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                        Simpan & Publikasikan
                    </button>
                </div>

            </form>
          </div>
        )}
  
        <ConfirmationModal
          isOpen={confirmDelete.isOpen}
          title="Hapus Artikel"
          message={`Apakah Anda yakin ingin menghapus artikel "${confirmDelete.title}" secara permanen?`}
          onConfirm={confirmDeleteNews}
          onCancel={cancelDelete}
        />
      </div>
    );
};

export default ManageNews;