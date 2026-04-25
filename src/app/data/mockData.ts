// ============================================================
// MOCK DATA — Kang AC Balap
// Semua data dummy untuk development. 
// Nanti tinggal switch ke Supabase real data.
// ============================================================

// ---------- SERVICES ----------
export const SERVICES = [
  {
    id: '1',
    name: 'Cuci AC',
    category: 'cuci',
    description: 'Pembersihan unit indoor & outdoor AC agar kembali dingin maksimal dan hemat listrik.',
    icon: '🧹',
    price_min: 50000,
    price_max: 150000,
    features: ['Cuci indoor unit', 'Pengecekan freon', 'Cek kelistrikan', 'Garansi 7 hari'],
    is_popular: true,
  },
  {
    id: '2',
    name: 'Pasang AC',
    category: 'pasang',
    description: 'Instalasi AC baru dengan pipa tembaga berkualitas dan pemasangan profesional.',
    icon: '🔧',
    price_min: 350000,
    price_max: 600000,
    features: ['Free pipa 3 meter', 'Bracket outdoor', 'Kabel instalasi', 'Garansi pasang 1 bulan'],
    is_popular: true,
  },
  {
    id: '3',
    name: 'Servis AC',
    category: 'servis',
    description: 'Perbaikan segala kerusakan AC — dari isi freon hingga ganti komponen.',
    icon: '⚡',
    price_min: 100000,
    price_max: 300000,
    features: ['Diagnosa kerusakan', 'Isi freon R32/R410a', 'Ganti sparepart', 'Garansi servis'],
    is_popular: false,
  },
  {
    id: '4',
    name: 'Bongkar & Pindah AC',
    category: 'servis',
    description: 'Bongkar AC dari lokasi lama dan pasang di lokasi baru dengan aman.',
    icon: '📦',
    price_min: 450000,
    price_max: 600000,
    features: ['Bongkar aman', 'Packing unit', 'Pasang di lokasi baru', 'Cek freon ulang'],
    is_popular: false,
  },
];

// ---------- PRICE LIST ----------
export const PRICE_LIST = [
  { service: 'Cuci AC Standard', pk_05_1: 50000, pk_15: 65000, pk_2: 80000, note: 'Indoor unit saja' },
  { service: 'Cuci AC Deep Clean', pk_05_1: 100000, pk_15: 120000, pk_2: 150000, note: 'Full bongkar + chemical' },
  { service: 'Isi Freon R32', pk_05_1: 150000, pk_15: 200000, pk_2: 250000, note: 'Include freon' },
  { service: 'Isi Freon R410a', pk_05_1: 200000, pk_15: 250000, pk_2: 300000, note: 'Include freon' },
  { service: 'Pasang AC Baru', pk_05_1: 350000, pk_15: 400000, pk_2: 500000, note: 'Include pipa 3m' },
  { service: 'Bongkar AC', pk_05_1: 150000, pk_15: 175000, pk_2: 200000, note: '-' },
  { service: 'Pindah AC (B+P)', pk_05_1: 450000, pk_15: 500000, pk_2: 600000, note: 'Bongkar + pasang' },
  { service: 'Ganti Kapasitor', pk_05_1: 150000, pk_15: 175000, pk_2: 200000, note: 'Include part' },
];

// ---------- TESTIMONIALS ----------
export const TESTIMONIALS = [
  { id: '1', name: 'Budi Santoso', rating: 5, comment: 'AC langsung dingin lagi setelah dicuci. Teknisinya ramah dan cepat. Recommended banget!', date: '2025-03-15', service: 'Cuci AC' },
  { id: '2', name: 'Sari Wulandari', rating: 5, comment: 'Pasang AC di rumah baru, hasilnya rapi dan bersih. Harga juga bersaing. Mantap!', date: '2025-02-20', service: 'Pasang AC' },
  { id: '3', name: 'Ahmad Fauzi', rating: 4, comment: 'Servis AC yang bocor freon, sekarang sudah normal lagi. Pelayanan cepat dan profesional.', date: '2025-04-01', service: 'Servis AC' },
  { id: '4', name: 'Dewi Lestari', rating: 5, comment: 'Sudah 3x pakai jasa Kang AC Balap. Selalu puas dengan hasilnya. Harga transparan!', date: '2025-01-10', service: 'Cuci AC' },
  { id: '5', name: 'Rudi Hermawan', rating: 5, comment: 'Pindah AC dari rumah lama ke rumah baru. Prosesnya cepat dan AC tetap berfungsi normal.', date: '2025-03-28', service: 'Pindah AC' },
  { id: '6', name: 'Rina Agustina', rating: 4, comment: 'Cuci AC 2 unit sekaligus, teknisi datang tepat waktu. AC jadi dingin dan wangi!', date: '2025-04-10', service: 'Cuci AC' },
];

// ---------- GALLERY ----------
export const GALLERY = [
  { id: '1', category: 'before_after', caption: 'Cuci AC Daikin 1 PK — Perumahan Citra Harmoni', image: '/placeholder-gallery-1.jpg' },
  { id: '2', category: 'before_after', caption: 'Deep Clean AC Samsung — Ruko Sidoarjo Kota', image: '/placeholder-gallery-2.jpg' },
  { id: '3', category: 'project', caption: 'Instalasi 3 Unit AC Panasonic — Kantor PT. Maju Bersama', image: '/placeholder-gallery-3.jpg' },
  { id: '4', category: 'before_after', caption: 'Cuci AC Sharp — Evaporator sangat kotor', image: '/placeholder-gallery-4.jpg' },
  { id: '5', category: 'project', caption: 'Pasang AC LG Dual Inverter 1.5 PK', image: '/placeholder-gallery-5.jpg' },
  { id: '6', category: 'team', caption: 'Tim Kang AC Balap siap melayani!', image: '/placeholder-gallery-6.jpg' },
];

// ---------- FAQ ----------
export const FAQ_DATA = [
  { question: 'Berapa biaya cuci AC?', answer: 'Biaya cuci AC mulai dari Rp 50.000 untuk AC 0.5-1 PK. Harga bervariasi tergantung ukuran PK dan jenis pembersihan (standard atau deep clean).' },
  { question: 'Berapa lama proses cuci AC?', answer: 'Proses cuci AC standard memakan waktu sekitar 30-45 menit per unit. Untuk deep clean (full bongkar), sekitar 1-1.5 jam per unit.' },
  { question: 'AC merk apa saja yang dilayani?', answer: 'Kami melayani semua merk AC: Daikin, Panasonic, Sharp, LG, Samsung, Midea, Polytron, TCL, dan lainnya.' },
  { question: 'Apakah ada garansi?', answer: 'Ya! Kami memberikan garansi 7 hari untuk cuci AC dan 1 bulan untuk pemasangan baru. Jika ada masalah, kami akan datang kembali tanpa biaya tambahan.' },
  { question: 'Area layanan meliputi mana saja?', answer: 'Kami melayani seluruh wilayah Sidoarjo dan sekitarnya termasuk Surabaya Selatan, Gresik, dan Mojokerto.' },
  { question: 'Bagaimana cara booking?', answer: 'Cukup hubungi kami via WhatsApp di 082138305151. Sampaikan jenis layanan, lokasi, dan waktu yang diinginkan. Kami akan segera merespons!' },
  { question: 'Apakah bisa servis di hari libur?', answer: 'Ya, kami melayani 7 hari seminggu termasuk hari libur nasional. Jam operasional: 08.00 - 20.00 WIB.' },
];

// ---------- STATS ----------
export const STATS = [
  { label: 'Pelanggan Puas', value: 500, suffix: '+' },
  { label: 'Rating Google', value: 4.9, suffix: '⭐' },
  { label: 'Tahun Pengalaman', value: 3, suffix: '+' },
  { label: 'Respon Cepat', value: 24, suffix: 'Jam' },
];

// ---------- COMPANY INFO ----------
export const COMPANY = {
  name: 'Kang AC Balap',
  tagline: 'Solusi AC Terpercaya di Sidoarjo',
  description: 'Jasa pemasangan, cuci, dan servis AC profesional untuk rumah dan kantor. Harga transparan, teknisi berpengalaman, garansi pekerjaan.',
  phone: '082138305151',
  whatsapp: '6282138305151',
  whatsappLink: 'https://wa.me/6282138305151',
  tiktok: '@kang.ac.balap',
  tiktokLink: 'https://www.tiktok.com/@kang.ac.balap',
  googleMapsLink: 'https://maps.google.com/?cid=14876238173329025546',
  address: 'Sidoarjo, Jawa Timur',
  coordinates: { lat: -7.3826304, lng: 112.607232 },
  operatingHours: '08.00 - 20.00 WIB (Setiap Hari)',
  serviceAreas: ['Sidoarjo Kota', 'Waru', 'Gedangan', 'Sedati', 'Buduran', 'Candi', 'Tanggulangin', 'Porong', 'Surabaya Selatan'],
};

// ---------- PROMO ----------
export const PROMOS = [
  { id: '1', title: 'Cuci AC Mulai 50rb!', description: 'Promo cuci AC standard untuk semua merk. Berlaku setiap hari!', discount: 0, badge: 'HEMAT', is_active: true },
  { id: '2', title: 'Diskon 10% Pasang AC Baru', description: 'Khusus pemasangan AC baru di bulan ini. Berlaku untuk semua merk & PK.', discount: 10, badge: 'PROMO', is_active: true },
  { id: '3', title: 'Paket Cuci 3 Unit = Gratis 1', description: 'Cuci 3 unit AC sekaligus, unit ke-4 GRATIS! Cocok untuk rumah & kantor.', discount: 25, badge: 'BEST DEAL', is_active: true },
];

// ---------- LINKTREE LINKS ----------
export const LINKTREE_LINKS = [
  { id: '1', title: '📞 Hubungi via WhatsApp', url: 'https://wa.me/6282138305151?text=Halo%20Kang%20AC%20Balap!%20Saya%20mau%20tanya%20tentang%20jasa%20AC', icon: 'phone', is_primary: true },
  { id: '2', title: '🌐 Website Resmi', url: '/', icon: 'globe', is_primary: false },
  { id: '3', title: '🎬 TikTok @kang.ac.balap', url: 'https://www.tiktok.com/@kang.ac.balap', icon: 'video', is_primary: false },
  { id: '4', title: '📍 Lokasi Google Maps', url: 'https://maps.google.com/?cid=14876238173329025546', icon: 'map', is_primary: false },
  { id: '5', title: '💰 Cek Harga Layanan', url: '/#harga', icon: 'tag', is_primary: false },
  { id: '6', title: '📅 Booking Online', url: '/#booking', icon: 'calendar', is_primary: false },
];

// ---------- AC BRANDS ----------
export const AC_BRANDS = [
  { name: 'Daikin', logo: '🇯🇵' },
  { name: 'Panasonic', logo: '🇯🇵' },
  { name: 'Sharp', logo: '🇯🇵' },
  { name: 'LG', logo: '🇰🇷' },
  { name: 'Samsung', logo: '🇰🇷' },
  { name: 'Midea', logo: '🇨🇳' },
  { name: 'Polytron', logo: '🇮🇩' },
  { name: 'TCL', logo: '🇨🇳' },
];
