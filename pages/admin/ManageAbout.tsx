
import React, { useState } from 'react';
import { AboutData } from '../../types';
import { uploadImage } from '../../utils/supabase';

interface ManageAboutProps {
  data: AboutData;
  onSave: (newData: AboutData) => void;
}

const ManageAbout: React.FC<ManageAboutProps> = ({ data, onSave }) => {
  const [formData, setFormData] = useState<AboutData>(data);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof AboutData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleAddGalleryUrl = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, '']
    }));
    setGalleryFiles(prev => [...prev, null]);
    setIsSaved(false);
  };

  const handleGalleryUrlChange = (index: number, value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = value;
    setFormData(prev => ({ ...prev, gallery: newGallery }));
    setIsSaved(false);
  };

  const handleRemoveGalleryUrl = (index: number) => {
    const newGallery = [...formData.gallery];
    newGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, gallery: newGallery }));
    setGalleryFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      return newFiles;
    });
    setIsSaved(false);
  };

  const handleGalleryFileChange = (index: number, file: File | null) => {
    setGalleryFiles(prev => {
      const newFiles = [...prev];
      newFiles[index] = file;
      return newFiles;
    });
    setIsSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload gallery images
      const uploadedGalleryUrls = await Promise.all(
        galleryFiles.map(async (file, index) => {
          if (file) {
            return await uploadImage(file);
          }
          return formData.gallery[index] || '';
        })
      );

      // Filter out empty strings
      const filteredGalleryUrls = uploadedGalleryUrls.filter(url => url && url.trim() !== '');

      const cleanedData = {
        ...formData,
        gallery: filteredGalleryUrls
      };
      onSave(cleanedData);
      setFormData(cleanedData);
      setGalleryFiles(new Array(filteredGalleryUrls.length).fill(null));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving about data:', error);
      // Still save with existing URLs if upload fails
      const cleanedData = {
        ...formData,
        gallery: formData.gallery.filter(url => url.trim() !== '')
      };
      onSave(cleanedData);
      setFormData(cleanedData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
          <header>
            <h1 className="text-3xl font-bold text-slate-800">Edit Profil & Galeri</h1>
            <p className="text-slate-500">Atur konten halaman "Tentang Kami".</p>
          </header>
          {isSaved && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 animate-fade-in text-sm font-bold">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Disimpan!
            </div>
          )}
      </div>

      <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Col: Text */}
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Konten Teks
                    </h3>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-slate-500 text-xs mb-2 uppercase font-bold tracking-widest">Deskripsi Perusahaan</label>
                            <textarea 
                                required 
                                rows={10}
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors leading-relaxed"
                                placeholder="Ceritakan sejarah dan nilai-nilai Renova..."
                            />
                        </div>

                        <div>
                            <label className="block text-slate-500 text-xs mb-2 uppercase font-bold tracking-widest">Visi / Misi</label>
                            <textarea 
                                required 
                                rows={4}
                                value={formData.mission}
                                onChange={(e) => handleChange('mission', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Misi perusahaan..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Gallery */}
            <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                             <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Galeri Foto
                        </h3>
                        <button 
                            type="button" 
                            onClick={handleAddGalleryUrl}
                            className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg font-bold transition-colors"
                        >
                            + Tambah Foto
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {formData.gallery.map((url, index) => (
                            <div key={index} className="flex gap-4 items-start group bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="w-20 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 shadow-sm">
                                    {galleryFiles[index] ? (
                                        <img src={URL.createObjectURL(galleryFiles[index]!)} alt="preview" className="w-full h-full object-cover" />
                                    ) : url ? (
                                        <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Error')} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 mb-1"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0] || null;
                                          handleGalleryFileChange(index, file);
                                        }}
                                    />
                                    {url && !galleryFiles[index] && (
                                      <p className="text-xs text-slate-500">Gambar saat ini: {url.split('/').pop()}</p>
                                    )}
                                    <div className="flex justify-between items-center px-1">
                                         <span className="text-[10px] text-slate-400 font-mono">IMG #{index + 1}</span>
                                         <button
                                            type="button"
                                            onClick={() => handleRemoveGalleryUrl(index)}
                                            className="text-xs text-red-400 hover:text-red-600 font-bold hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.gallery.length === 0 && (
                            <div className="text-center py-12 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                Belum ada foto di galeri.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-xl shadow-blue-900/10 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                        Simpan Semua Perubahan
                    </button>
                </div>
            </div>

          </div>
      </form>
    </div>
  );
};

export default ManageAbout;
