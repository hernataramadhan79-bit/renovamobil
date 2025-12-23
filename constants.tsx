
import { Car, NewsPost, InboxMessage, Testimonial, AboutData } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: '1',
    name: 'Avanza 1.5 G CVT',
    brand: 'Toyota',
    price: 275000000,
    year: 2023,
    engine: '1.5L Dual VVT-i',
    transmission: 'CVT',
    image: 'https://images.unsplash.com/photo-1626322969986-e9d6efc25227?auto=format&fit=crop&q=80&w=1200',
    description: 'MPV sejuta umat dengan tampilan baru yang lebih modern. Penggerak roda depan (FWD) membuat kabin lebih luas dan konsumsi BBM lebih irit. Cocok untuk keluarga.',
    is_featured: true,
    mileage: 15000,
    fuel_type: 'Bensin',
    body_type: 'MPV',
    color: 'Purplish Silver',
    interior_color: 'Hitam / Coklat',
    tax_date: 'Mei 2025',
    previous_owners: 1,
    service_history: 'Lengkap (Auto2000)',
    condition: 'Bekas',
    location: 'Jakarta Selatan',
    seats: 7,
    plate_number: 'B 2910 TZU (Genap)',
    gallery: [
      'https://images.unsplash.com/photo-1626322969986-e9d6efc25227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: '2',
    name: 'Brio RS Urbanite',
    brand: 'Honda',
    price: 240000000,
    year: 2023,
    engine: '1.2L i-VTEC',
    transmission: 'CVT',
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1200',
    description: 'City car terlaris di Indonesia. Lincah, irit, dan sporty. Varian RS Urbanite dengan bodykit agresif, cocok untuk anak muda atau mobilitas harian di Jakarta.',
    is_featured: true,
    mileage: 8000,
    fuel_type: 'Bensin',
    body_type: 'Hatchback',
    color: 'Phoenix Orange Pearl',
    interior_color: 'Hitam dengan Aksen Oranye',
    tax_date: 'Agustus 2024',
    previous_owners: 1,
    service_history: 'Lengkap',
    condition: 'Bekas',
    location: 'Jakarta Barat',
    seats: 5,
    plate_number: 'B 1123 UKL (Ganjil)',
    gallery: [
        'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1533473359331-0135ef1bcfb0?auto=format&fit=crop&q=80&w=1200'
    ]
  },
  {
    id: '3',
    name: 'Xpander Ultimate',
    brand: 'Mitsubishi',
    price: 295000000,
    year: 2022,
    engine: '1.5L MIVEC',
    transmission: 'CVT',
    image: 'https://images.unsplash.com/photo-1625055082126-78b7b209c25f?auto=format&fit=crop&q=80&w=1200',
    description: 'MPV dengan suspensi paling nyaman di kelasnya. Desain Dynamic Shield yang gagah dan interior mewah dengan soft touch. AC double blower sangat dingin.',
    is_featured: true,
    mileage: 25000,
    fuel_type: 'Bensin',
    body_type: 'MPV',
    color: 'Quartz White Pearl',
    interior_color: 'Beige',
    tax_date: 'Januari 2025',
    previous_owners: 1,
    service_history: 'Lengkap (Mitsubishi Lautan)',
    condition: 'Bekas',
    location: 'Tangerang',
    seats: 7,
    plate_number: 'B 8899 EXP (Ganjil)'
  },
  {
    id: '4',
    name: 'Kijang Innova Reborn 2.4 V',
    brand: 'Toyota',
    price: 415000000,
    year: 2021,
    engine: '2.4L Diesel Turbo',
    transmission: 'Otomatis',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1200',
    description: 'Mobil keluarga paling tangguh dan dicari. Mesin diesel 2GD yang bertenaga dan badak. Kabin hening, fitur lengkap, captain seat opsional. Favorit travel.',
    is_featured: false,
    mileage: 45000,
    fuel_type: 'Diesel',
    body_type: 'MPV',
    color: 'Attitude Black',
    interior_color: 'Hitam Kayu',
    tax_date: 'Desember 2024',
    previous_owners: 1,
    service_history: 'Rutin Auto2000',
    condition: 'Bekas',
    location: 'Jakarta Selatan',
    seats: 7,
    plate_number: 'B 1998 KJG (Genap)'
  },
  {
    id: '5',
    name: 'HR-V SE CVT',
    brand: 'Honda',
    price: 385000000,
    year: 2023,
    engine: '1.5L DOHC i-VTEC',
    transmission: 'CVT',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=1200',
    description: 'Compact SUV yang stylish dengan fitur Honda Sensing lengkap. Panoramic glass roof memberikan kesan mewah dan luas. Sangat populer di kalangan eksekutif muda.',
    is_featured: false,
    mileage: 12000,
    fuel_type: 'Bensin',
    body_type: 'SUV',
    color: 'Sand Khaki Pearl',
    interior_color: 'Hitam Kulit',
    tax_date: 'Maret 2025',
    previous_owners: 1,
    service_history: 'Lengkap',
    condition: 'Bekas',
    location: 'Bekasi',
    seats: 5,
    plate_number: 'B 2233 HRV (Ganjil)'
  },
  {
    id: '6',
    name: 'Sigra 1.2 R DLX',
    brand: 'Daihatsu',
    price: 165000000,
    year: 2024,
    engine: '1.2L Dual VVT-i',
    transmission: 'Otomatis',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
    description: 'LCGC 7-seater paling ekonomis. Solusi tepat untuk taksi online atau keluarga muda. Perawatan murah, sparepart melimpah, dan sangat irit BBM.',
    is_featured: false,
    mileage: 5000,
    fuel_type: 'Bensin',
    body_type: 'MPV',
    color: 'Orange Metallic',
    interior_color: 'Hitam / Abu',
    tax_date: 'Juni 2025',
    previous_owners: 1,
    service_history: 'Lengkap',
    condition: 'Bekas',
    location: 'Depok',
    seats: 7,
    plate_number: 'B 4567 SGR (Ganjil)'
  },
  {
    id: '7',
    name: 'Ertiga Hybrid GX',
    brand: 'Suzuki',
    price: 260000000,
    year: 2023,
    engine: '1.5L Smart Hybrid',
    transmission: 'Otomatis',
    image: 'https://images.unsplash.com/photo-1658428236750-68195449089f?auto=format&fit=crop&q=80&w=1200',
    description: 'LMPV Hybrid pertama di kelasnya. Teknologi Smart Hybrid membuat konsumsi bahan bakar lebih efisien dan start-stop halus. Fitur Cruise Control tersedia.',
    is_featured: false,
    mileage: 18000,
    fuel_type: 'Hybrid',
    body_type: 'MPV',
    color: 'Magma Grey',
    interior_color: 'Hitam Wood Panel',
    tax_date: 'Oktober 2024',
    previous_owners: 1,
    service_history: 'Lengkap',
    condition: 'Bekas',
    location: 'Jakarta Timur',
    seats: 7,
    plate_number: 'B 1010 ERT (Genap)'
  },
  {
    id: '8',
    name: 'Rush 1.5 S TRD Sportivo',
    brand: 'Toyota',
    price: 255000000,
    year: 2021,
    engine: '1.5L Dual VVT-i',
    transmission: 'Otomatis',
    image: 'https://images.unsplash.com/photo-1627454819213-17727e4b52af?auto=format&fit=crop&q=80&w=1200',
    description: 'LSUV RWD yang tangguh di segala medan jalanan Indonesia. Ground clearance tinggi, muat 7 penumpang. Desain sporty khas TRD.',
    is_featured: false,
    mileage: 38000,
    fuel_type: 'Bensin',
    body_type: 'SUV',
    color: 'White',
    interior_color: 'Hitam',
    tax_date: 'Juli 2024',
    previous_owners: 1,
    service_history: 'Lengkap',
    condition: 'Bekas',
    location: 'Bogor',
    seats: 7,
    plate_number: 'F 1234 RSH (Genap)'
  }
];

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: '1',
    title: 'Tips Merawat Transmisi CVT Agar Awet',
    excerpt: 'Pengguna mobil modern wajib tahu, ini cara mengemudi yang benar agar sabuk baja CVT tidak cepat putus.',
    content: 'Transmisi CVT semakin populer di Indonesia...',
    date: '2024-05-15',
    author: 'Renova Bengkel',
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Perbandingan Konsumsi BBM: Avanza vs Xpander',
    excerpt: 'Kami menguji dua MPV terlaris ini dalam rute dalam kota Jakarta yang macet dan tol luar kota.',
    content: 'Dalam pengujian rute kombinasi sejauh 200km...',
    date: '2024-05-12',
    author: 'Renova Test Drive',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_INBOX: InboxMessage[] = [
  {
    id: '1',
    type: 'general',
    name: 'Budi Santoso',
    email: 'budi.s@gmail.com',
    subject: 'Simulasi Kredit Innova',
    message: 'Halo admin, bisa tolong kirimkan simulasi kredit untuk Innova Reborn diesel DP 50 juta tenor 4 tahun?',
    date: '2024-05-14',
    isRead: false
  },
  {
    id: '2',
    type: 'test-drive',
    name: 'Diana Putri',
    email: 'diana.p@gmail.com',
    phone: '081234567890',
    carName: 'HR-V SE CVT',
    bookingDate: '2024-05-20',
    subject: 'Booking Test Drive: HR-V SE CVT',
    message: 'Saya ingin mencoba fitur Honda Sensing di jalan tol.',
    date: '2024-05-16',
    isRead: false
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Wijaya',
    role: 'Pembeli HR-V SE',
    rating: 5,
    comment: 'Pelayanan sangat ramah, proses kredit dibantu sampai goal. Mobilnya juga sangat mulus seperti baru. Recommended showroom!',
    date: '2024-05-10',
    isVisible: true
  },
  {
    id: '2',
    name: 'Denny Sumargo',
    role: 'Pembeli Fortuner',
    rating: 5,
    comment: 'Unit sangat terawat, jujur soal kondisi mobil. Harga bersaing dengan showroom lain di Jakarta Selatan.',
    date: '2024-04-22',
    isVisible: true
  },
  {
    id: '3',
    name: 'Jessica Tanoe',
    role: 'Trade-in Brio',
    rating: 4,
    comment: 'Proses trade-in cepat, harga taksiran mobil lama saya cukup tinggi. Terima kasih Renova!',
    date: '2024-03-15',
    isVisible: true
  }
];

export const INITIAL_ABOUT: AboutData = {
  description: "Selamat datang di Renova Mobil, destinasi utama Anda untuk menemukan kendaraan berkualitas tinggi dengan harga yang kompetitif. Sejak didirikan pada tahun 1998, kami telah mendedikasikan diri untuk mengubah pengalaman membeli mobil bekas menjadi sesuatu yang menyenangkan, transparan, dan terpercaya.\n\nDi Renova, setiap unit kendaraan melewati proses inspeksi 150 titik yang ketat oleh teknisi bersertifikat kami. Kami tidak hanya menjual mobil; kami menjual ketenangan pikiran. Komitmen kami terhadap kualitas memastikan bahwa setiap mobil yang keluar dari showroom kami siap untuk menemani perjalanan Anda tanpa rasa khawatir.",
  mission: "Menjadi showroom mobil terpercaya nomor satu di Indonesia yang mengutamakan kepuasan pelanggan melalui integritas, kualitas unit terbaik, dan layanan purna jual yang unggul.",
  gallery: [
    "https://images.unsplash.com/photo-1562141961-b5d1855d7f30?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200"
  ]
};

export const BRANDS = ['Semua', 'Toyota', 'Honda', 'Daihatsu', 'Mitsubishi', 'Suzuki', 'Nissan', 'Wuling', 'Mazda'];
