
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '../types';
import { getImageUrl } from '../utils/database';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10">
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl(car.image)}
          alt={car.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-900 shadow-sm">
          {car.brand}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{car.name}</h3>
          <span className="text-slate-500 text-sm font-medium">{car.year}</span>
        </div>
        
        <p className="text-slate-600 text-sm line-clamp-2 mb-6 h-10">
          {car.description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="block text-xs text-slate-400 uppercase tracking-tighter">Harga mulai dari</span>
            <span className="text-xl font-bold text-orange-600">
              Rp {car.price.toLocaleString('id-ID')}
            </span>
          </div>
          <Link 
            to={`/catalog/${car.id}`}
            className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
