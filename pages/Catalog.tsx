
import React, { useState, useMemo } from 'react';
import { Car } from '../types';
import CarCard from '../components/CarCard';

interface CatalogProps {
  cars: Car[];
}

const Catalog: React.FC<CatalogProps> = ({ cars }) => {
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Generate dynamic brand list from existing cars
  const availableBrands = useMemo(() => {
    // Get unique brands from cars array
    const uniqueBrands = Array.from(new Set(cars.map(car => car.brand)));
    // Sort alphabetically
    uniqueBrands.sort();
    // Add 'Semua' at the beginning
    return ['Semua', ...uniqueBrands];
  }, [cars]);

  const filteredCars = cars.filter(car => {
    const matchesBrand = selectedBrand === 'Semua' || car.brand === selectedBrand;
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         car.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-12 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 animate-fade-in-up">
          <h2 className="text-orange-600 font-bold tracking-[0.3em] uppercase text-sm mb-4">Armada Kami</h2>
          <h1 className="text-5xl font-black text-slate-900 mb-8">INVENTARIS</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {availableBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-all border active:scale-95 ${
                    selectedBrand === brand
                      ? 'bg-blue-900 border-blue-900 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-900'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
            
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                placeholder="Cari model atau merek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-full px-6 py-3 text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm focus:shadow-md"
              />
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car, idx) => (
              <div key={car.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <CarCard car={car} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-slate-200 border-dashed animate-fade-in">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">Tidak ada mobil yang cocok</h3>
            <p className="text-slate-500">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
            <button
              onClick={() => { setSelectedBrand('Semua'); setSearchQuery(''); }}
              className="mt-8 text-orange-600 font-bold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
