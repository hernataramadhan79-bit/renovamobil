import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Car } from '../../types';
import { BRANDS } from '../../constants';
import ConfirmationModal from '../../components/ConfirmationModal';
import { getCars, createCar, updateCar, deleteCar, uploadImage } from '../../utils/supabase';

// --- KOMPONEN INPUT ANGKA DENGAN FORMAT ---
const FormattedNumberInput = ({ value, onValueChange, className, placeholder, min, required }) => {
  const [displayValue, setDisplayValue] = useState(() => (value || 0).toLocaleString('id-ID'));
  const isTypingRef = useRef(false);

  // Update display value when the external value changes, but not while typing
  useEffect(() => {
    if (!isTypingRef.current) {
      const formatted = (value || 0).toLocaleString('id-ID');
      setDisplayValue(formatted);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTypingRef.current = true;
    const rawValue = e.target.value.replace(/\./g, '');

    // Allow only numbers
    if (!/^\d*$/.test(rawValue)) {
      return;
    }

    const numericValue = Number(rawValue);
    const formatted = isNaN(numericValue) ? '' : numericValue.toLocaleString('id-ID');
    setDisplayValue(formatted);
  };

  const handleBlur = () => {
    isTypingRef.current = false;
    const rawValue = displayValue.replace(/\./g, '');
    const numericValue = Number(rawValue) || 0;
    onValueChange(numericValue);
    // Update display to formatted value
    setDisplayValue(numericValue.toLocaleString('id-ID'));
  }

  return (
    <input
      type="text" // Use text to allow for dots
      className={className}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      min={min}
      required={required}
    />
  );
};


interface ManageCarsProps {
  // No props needed, component manages its own data
}

const ManageCars: React.FC<ManageCarsProps> = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Mode View: 'list' atau 'form'
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; id: string; name: string }>({ isOpen: false, id: '', name: '' });

  // Load cars data
  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      const carsData = await getCars();
      setCars(carsData);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, []);
  
  const currentYear = new Date().getFullYear();
  
  // State awal form
  const initialFormState: Partial<Car> = {
    brand: 'Toyota', 
    name: '', 
    price: 0, 
    year: currentYear, 
    image: '', 
    description: '', 
    engine: '', 
    transmission: 'Otomatis', 
    mileage: 0, 
    fuel_type: 'Bensin', 
    body_type: 'MPV', 
    condition: 'Bekas', 
    location: 'Jakarta',
    seats: 7,
    plate_number: '',
    color: 'Hitam',
    interior_color: 'Original',
    tax_date: '',
    service_history: 'Lengkap',
    previous_owners: 1,
    is_featured: false, 
    gallery: []
  };

  const [formData, setFormData] = useState<Partial<Car>>(initialFormState);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([]);

  // Memoized form data to prevent unnecessary re-renders
  const memoizedFormData = useMemo(() => formData, [formData]);

  // Removed FormattedNumberInput - using simple number inputs with display formatting

  // Filter mobil
  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete({ isOpen: true, id, name });
  };

  const confirmDeleteCar = async () => {
    try {
      await deleteCar(confirmDelete.id);
      loadCars(); // Refresh data
    } catch (error) {
      console.error('Error deleting car:', error);
      // Fallback to local state update
      setCars(prevCars => prevCars.filter(car => String(car.id) !== String(confirmDelete.id)));
    }
    setConfirmDelete({ isOpen: false, id: '', name: '' });
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, id: '', name: '' });
  };

  const handleEdit = (car: Car) => {
    setFormData({ ...car, gallery: car.gallery || [] });
    setEditingId(car.id);
    setSelectedImageFile(null);
    setGalleryFiles(new Array((car.gallery || []).length).fill(null));
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSelectedImageFile(null);
    setGalleryFiles([]);
    setViewMode('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleCancel = () => {
    setViewMode('list');
    setEditingId(null);
  };

  // Removed custom handlers, using direct state update

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image;
      let galleryUrls = formData.gallery || [];

      // Upload main image if selected
      if (selectedImageFile) {
        imageUrl = await uploadImage(selectedImageFile);
      }

      // Upload gallery images
      const uploadedGalleryUrls = await Promise.all(
        galleryFiles.map(async (file, index) => {
          if (file) {
            return await uploadImage(file);
          }
          return galleryUrls[index] || '';
        })
      );

      // Filter out empty strings
      const filteredGalleryUrls = uploadedGalleryUrls.filter(url => url && url.trim() !== '');

      const carData = {
        ...formData,
        image: imageUrl,
        gallery: filteredGalleryUrls
      };

      if (editingId) {
        await updateCar(editingId, carData);
      } else {
        await createCar(carData);
      }
      loadCars(); // Refresh data
    } catch (error) {
      console.error('Error saving car:', error);
      // Fallback to local state update
      if (editingId) {
        setCars(prev => prev.map(c => c.id === editingId ? { ...formData, id: editingId } as Car : c));
      } else {
        const newCar = {
          ...formData,
          id: Math.random().toString(36).substr(2, 9)
        } as Car;
        setCars(prev => [newCar, ...prev]);
      }
    }
    setViewMode('list');
    setEditingId(null);
  };

  // Gallery Helpers - Optimized with useCallback
  const addGalleryUrl = useCallback(() => {
    setFormData(prev => ({...prev, gallery: [...(prev.gallery || []), '']}));
    setGalleryFiles(prev => [...prev, null]);
  }, []);

  const updateGalleryFile = useCallback((idx: number, file: File | null) => {
    setGalleryFiles(prev => {
      const newFiles = [...prev];
      newFiles[idx] = file;
      return newFiles;
    });
  }, []);

  const removeGalleryUrl = useCallback((idx: number) => {
    setFormData(prev => {
      const newGallery = [...(prev.gallery || [])];
      newGallery.splice(idx, 1);
      return {...prev, gallery: newGallery};
    });
    setGalleryFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(idx, 1);
      return newFiles;
    });
  }, []);

  // --- KOMPONEN UI INPUT TABEL (Spec Sheet Row) ---
  const FormRow = ({ label, children, required = false, helpText = '' }: { label: string, children: React.ReactNode, required?: boolean, helpText?: string }) => (
    <div className="grid grid-cols-1 md:grid-cols-12 border-b border-slate-200 last:border-b-0">
      {/* Kolom Label (Kiri) - Light Grey Background */}
      <div className="md:col-span-3 bg-slate-50 px-6 py-4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-200">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {helpText && <span className="text-[10px] text-slate-400 mt-1 font-normal leading-tight">{helpText}</span>}
      </div>
      {/* Kolom Input (Kanan) - White Background */}
      <div className="md:col-span-9 bg-white px-4 py-3 flex items-center">
        {children}
      </div>
    </div>
  );

  // Memoized Gallery Input Component
  const GalleryInput = React.memo(({ url, index, file, onFileChange, onRemove }: {
    url: string;
    index: number;
    file: File | null;
    onFileChange: (idx: number, file: File | null) => void;
    onRemove: (idx: number) => void;
  }) => (
    <div className="flex gap-3 items-start">
      <div className="flex-1">
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border border-slate-300 rounded bg-white text-slate-900 mb-1"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onFileChange(index, file);
          }}
        />
        {url && !file && (
          <p className="text-sm text-slate-500">Gambar saat ini: {url.split('/').pop()}</p>
        )}
      </div>
      <div className="w-16 h-12 bg-slate-100 border border-slate-300 rounded overflow-hidden flex items-center justify-center">
        {file ? (
          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
        ) : (url && url.trim() !== '') ? (
          <img src={url} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <span className="text-xs text-slate-400">No Img</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded border border-red-200 text-xs font-bold"
      >
        Hapus
      </button>
    </div>
  ));

  // Section Header yang lebih terang/bersih (tidak hitam/gelap)
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
      
      {/* --- MODE LIST / TABEL --- */}
      {viewMode === 'list' && (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                <h1 className="text-3xl font-bold text-slate-800">Manajemen Mobil</h1>
                <p className="text-slate-500">Kelola inventaris kendaraan yang ditampilkan di katalog.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <input
                            type="text"
                            placeholder="Cari unit..."
                            defaultValue={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full md:w-64 shadow-sm text-slate-700 placeholder:text-slate-400"
                        />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    
                    <button
                    type="button"
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                    >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Tambah Unit
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Foto</th>
                        <th className="px-6 py-4">Unit Kendaraan</th>
                        <th className="px-6 py-4">Spesifikasi Utama</th>
                        <th className="px-6 py-4">Harga & Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredCars.map(car => (
                        <tr key={car.id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-6 py-4 w-24">
                            <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                            {car.image ? (
                              <img src={car.image} alt={car.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Img'} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">No Img</div>
                            )}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-base">{car.name}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold border border-slate-200">{car.brand}</span>
                                <span>{car.year}</span>
                                <span className="text-slate-300">•</span>
                                <span className={car.condition === 'Baru' ? 'text-green-600 font-bold' : 'text-slate-500'}>{car.condition}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-slate-600 space-y-1">
                                <div className="flex items-center gap-1">
                                    <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    {car.transmission}
                                </div>
                                <div className="flex items-center gap-1">
                                     <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    {car.fuel_type}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="font-bold text-orange-600 text-base">Rp {(car.price || 0).toLocaleString('id-ID')}</div>
                            <div className="text-xs text-slate-400 mt-1">{(car.mileage || 0).toLocaleString('id-ID')} km</div>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                            <button 
                                type="button"
                                onClick={() => handleEdit(car)} 
                                className="px-3 py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-all text-xs font-bold border border-blue-200"
                            >
                                Edit
                            </button>
                            <button 
                                type="button"
                                onClick={(e) => handleDelete(e, car.id, car.name)} 
                                className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-all text-xs font-bold border border-red-200"
                            >
                                Hapus
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                {filteredCars.length === 0 && (
                <div className="text-center py-16">
                    <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <p className="text-slate-400 italic">Data tidak ditemukan.</p>
                </div>
                )}
            </div>
        </div>
      )}

      {/* --- MODE FORMULIR (SPEC SHEET) --- */}
      {viewMode === 'form' && (
        <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Form Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
                 <div>
                    <button onClick={handleCancel} className="text-slate-500 hover:text-blue-900 text-sm font-bold flex items-center gap-1 mb-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Kembali ke Daftar
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">{editingId ? 'Edit Dokumen Kendaraan' : 'Input Data Kendaraan Baru'}</h1>
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={handleCancel} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                        Batal
                    </button>
                    <button type="submit" form="mainCarForm" className="px-8 py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">
                        Simpan Data
                    </button>
                </div>
            </div>

            <form id="mainCarForm" onSubmit={handleSave} className="space-y-8 pb-12">
                
                {/* SECTION 1: DATA UTAMA */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Identitas & Penjualan" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>} />
                    
                    <FormRow label="Merek Kendaraan" required>
                         <select
                              className="w-full p-2.5 bg-white border border-slate-300 rounded focus:border-blue-500 focus:outline-none text-slate-900"
                              value={formData.brand}
                              onChange={e => setFormData(prev => ({...prev, brand: e.target.value}))}
                          >
                            {BRANDS.filter(b => b !== 'Semua').map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </FormRow>

                    <FormRow label="Model / Tipe Lengkap" required helpText="Contoh: Pajero Sport 2.4 Dakar Ultimate 4x2">
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 bg-white border border-slate-300 rounded focus:border-blue-500 focus:outline-none text-slate-900 placeholder:text-slate-400"
                            placeholder="Ketik nama lengkap..."
                            defaultValue={formData.name}
                            onBlur={e => setFormData(prev => ({...prev, name: e.target.value}))}
                        />
                    </FormRow>

                    <FormRow label="Harga Penawaran (IDR)" required>
                         <div className="relative w-full md:w-1/2">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                            <FormattedNumberInput
                                required
                                className="w-full pl-10 p-2.5 bg-white border border-slate-300 rounded focus:border-blue-500 focus:outline-none font-mono font-bold text-slate-900"
                                value={formData.price}
                                onValueChange={price => setFormData(prev => ({ ...prev, price }))}
                                placeholder="0"
                                min="0"
                            />
                        </div>
                    </FormRow>

                    <FormRow label="Kondisi Unit">
                        <div className="flex gap-6">
                            <label className="flex items-center cursor-pointer gap-2">
                                <input type="radio" name="condition" value="Bekas" defaultChecked={formData.condition === 'Bekas'} onChange={() => setFormData(prev => ({...prev, condition: 'Bekas'}))} className="w-4 h-4 text-blue-600 bg-white border-slate-300" />
                                <span className="text-slate-700 font-medium">Bekas (Used)</span>
                            </label>
                            <label className="flex items-center cursor-pointer gap-2">
                                <input type="radio" name="condition" value="Baru" defaultChecked={formData.condition === 'Baru'} onChange={() => setFormData(prev => ({...prev, condition: 'Baru'}))} className="w-4 h-4 text-blue-600 bg-white border-slate-300" />
                                <span className="text-slate-700 font-medium">Baru (New)</span>
                            </label>
                        </div>
                    </FormRow>

                    <FormRow label="Tampilkan pada Beranda" helpText="Centang untuk menampilkan mobil ini di halaman utama">
                        <label className="flex items-center cursor-pointer gap-3">
                            <input
                                type="checkbox"
                                checked={formData.is_featured || false}
                                onChange={(e) => setFormData(prev => ({...prev, is_featured: e.target.checked}))}
                                className="w-5 h-5 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-slate-700 font-medium">Ya, tampilkan di beranda</span>
                        </label>
                    </FormRow>
                </div>

                {/* SECTION 2: SPESIFIKASI TEKNIS */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Spesifikasi Mesin & Performa" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} />

                    <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="border-b border-slate-200 md:border-b-0 md:border-r">
                             <FormRow label="Tahun Pembuatan" required>
                                <input type="number" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900" defaultValue={formData.year || ''} onBlur={e => setFormData(prev => ({...prev, year: Number(e.target.value) || new Date().getFullYear()}))} />
                             </FormRow>
                         </div>
                         <FormRow label="Odometer (KM)" required>
                            <FormattedNumberInput
                                className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900"
                                value={formData.mileage}
                                onValueChange={mileage => setFormData(prev => ({ ...prev, mileage }))}
                                placeholder="0"
                                min="0"
                                required
                            />
                         </FormRow>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-200">
                         <div className="border-b border-slate-200 md:border-b-0 md:border-r">
                             <FormRow label="Transmisi">
                                <select className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900" defaultValue={formData.transmission} onBlur={e => setFormData(prev => ({...prev, transmission: e.target.value}))}>
                                    {['Otomatis', 'Manual', 'CVT', 'DCT', 'Tiptronic'].map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                             </FormRow>
                         </div>
                         <FormRow label="Bahan Bakar">
                            <select className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900" defaultValue={formData.fuel_type} onBlur={e => setFormData(prev => ({...prev, fuel_type: e.target.value}))}>
                                {['Bensin', 'Diesel', 'Listrik', 'Hybrid'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </FormRow>
                    </div>

                    <div className="border-t border-slate-200">
                        <FormRow label="Kapasitas Mesin" helpText="Isi dengan CC atau Liter">
                              <input type="text" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400" placeholder="Contoh: 1496 cc / 1.5L" defaultValue={formData.engine} onBlur={e => setFormData(prev => ({...prev, engine: e.target.value}))} />
                        </FormRow>
                    </div>
                </div>

                {/* SECTION 3: FISIK & INTERIOR */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Fisik & Interior" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />

                    <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="border-b border-slate-200 md:border-b-0 md:border-r">
                             <FormRow label="Warna Eksterior">
                                <input type="text" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400" placeholder="Warna bodi..." defaultValue={formData.color} onBlur={e => setFormData(prev => ({...prev, color: e.target.value}))} />
                             </FormRow>
                         </div>
                         <FormRow label="Warna Interior">
                            <input type="text" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400" placeholder="Warna jok/dashboard..." defaultValue={formData.interior_color} onBlur={e => setFormData(prev => ({...prev, interior_color: e.target.value}))} />
                         </FormRow>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-200">
                         <div className="border-b border-slate-200 md:border-b-0 md:border-r">
                             <FormRow label="Tipe Bodi">
                                <select className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900" defaultValue={formData.body_type} onBlur={e => setFormData(prev => ({...prev, body_type: e.target.value}))}>
                                    {['SUV', 'MPV', 'Sedan', 'Hatchback', 'Coupe', 'Pickup', 'Convertible', 'Station Wagon'].map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                             </FormRow>
                         </div>
                         <FormRow label="Kapasitas Kursi">
                            <FormattedNumberInput
                                className="w-20 p-2.5 border border-slate-300 rounded bg-white text-slate-900"
                                value={formData.seats}
                                onValueChange={seats => setFormData(prev => ({ ...prev, seats }))}
                                placeholder="0"
                                min="1"
                                required
                            />
                            <span className="ml-2 text-slate-500">Penumpang</span>
                         </FormRow>
                    </div>

                    <div className="border-t border-slate-200">
                        <FormRow label="Lokasi Unit">
                              <input type="text" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400" placeholder="Cabang showroom..." defaultValue={formData.location} onBlur={e => setFormData(prev => ({...prev, location: e.target.value}))} />
                        </FormRow>
                    </div>
                </div>

                {/* SECTION 4: LEGALITAS & RIWAYAT */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Legalitas & Riwayat" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />

                    <div className="grid grid-cols-1 md:grid-cols-2">
                         <div className="border-b border-slate-200 md:border-b-0 md:border-r">
                             <FormRow label="Nomor Polisi">
                                <input type="text" className="w-full p-2.5 border border-slate-300 rounded uppercase bg-white text-slate-900 placeholder:text-slate-400" placeholder="B 1234 XXX" defaultValue={formData.plate_number} onBlur={e => setFormData(prev => ({...prev, plate_number: e.target.value}))} />
                             </FormRow>
                         </div>
                         <FormRow label="Masa Pajak">
                            <input type="text" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400" placeholder="Bulan / Tahun" defaultValue={formData.tax_date} onBlur={e => setFormData(prev => ({...prev, tax_date: e.target.value}))} />
                         </FormRow>
                    </div>
                    <div className="border-t border-slate-200">
                        <FormRow label="Riwayat Servis">
                              <input type="text" className="w-full p-2.5 border border-slate-300 rounded bg-white text-slate-900 placeholder:text-slate-400" placeholder="Cth: Rutin Bengkel Resmi..." defaultValue={formData.service_history} onBlur={e => setFormData(prev => ({...prev, service_history: e.target.value}))} />
                        </FormRow>
                    </div>
                </div>

                {/* SECTION 5: MEDIA & DESKRIPSI */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <SectionHeader title="Media & Deskripsi" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />

                    <FormRow label="Foto Utama (Cover)" required helpText="Upload gambar berkualitas tinggi (Landscape)">
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
                                    <span className="text-xs text-slate-400">No Image</span>
                                  )}
                             </div>
                        </div>
                    </FormRow>

                    <FormRow label="Galeri Tambahan" helpText="Foto interior, mesin, dan sisi lain">
                        <div className="w-full space-y-3">
                             {formData.gallery && formData.gallery.map((url, idx) => (
                                <GalleryInput
                                    key={`gallery-${idx}`}
                                    url={url}
                                    index={idx}
                                    file={galleryFiles[idx] || null}
                                    onFileChange={updateGalleryFile}
                                    onRemove={removeGalleryUrl}
                                />
                             ))}
                             <button type="button" onClick={addGalleryUrl} className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                 Tambah Baris Foto
                             </button>
                        </div>
                    </FormRow>

                    <div className="border-t border-slate-200">
                        <div className="p-0">
                            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Deskripsi Lengkap</label>
                            </div>
                            <div className="p-0">
                                <textarea
                                    className="w-full p-6 min-h-[200px] border-none focus:ring-0 text-slate-700 leading-relaxed resize-y bg-white placeholder:text-slate-400"
                                    placeholder="Tuliskan kondisi detail mobil, fitur unggulan, minus (jika ada), dan promo..."
                                    defaultValue={formData.description}
                                    onBlur={e => setFormData(prev => ({...prev, description: e.target.value}))}
                                />
                            </div>
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
        title="Hapus Kendaraan"
        message={`Apakah Anda yakin ingin menghapus "${confirmDelete.name}" secara permanen?`}
        onConfirm={confirmDeleteCar}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ManageCars;