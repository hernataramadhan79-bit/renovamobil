
export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  year: number;
  engine: string;
  transmission: string;
  image: string;
  description: string;
  is_featured: boolean;
  // New Fields for Used Cars
  mileage: number;      // Jarak tempuh (KM)
  fuel_type: string;     // Bensin, Diesel, Listrik, Hybrid
  body_type: string;     // SUV, Sedan, Coupe, MPV
  color: string;        // Warna Eksterior
  interior_color: string;// Warna Interior
  tax_date: string;      // Pajak berlaku sampai
  previous_owners: number; // Jumlah pemilik sebelumnya
  service_history: string; // Rutin bengkel resmi, dll
  
  // Newest Additions
  condition: 'Baru' | 'Bekas';
  location: string;
  seats: number;
  plate_number: string; // e.g. "B 1234 XYZ (Genap)"
  
  // Gallery
  gallery?: string[]; // Array of image URLs
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  author: string;
}

export interface InboxMessage {
  id: string;
  type: 'general' | 'test-drive'; // Pembeda tipe pesan
  name: string;
  email: string;
  phone?: string;        // Khusus Test Drive
  carName?: string;      // Khusus Test Drive
  bookingDate?: string;  // Khusus Test Drive
  subject: string;       // General: Subject input, Test Drive: Auto generated
  message: string;
  date: string;
  isRead: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g. "Pembeli Pajero"
  rating: number; // 1-5
  comment: string;
  date: string;
  isVisible: boolean; // Untuk admin hide/show
}

export interface AboutData {
  description: string;
  mission: string;
  gallery: string[];
}

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
