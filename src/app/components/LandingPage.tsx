import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { SERVICES, TESTIMONIALS, FAQ_DATA, STATS, COMPANY, PROMOS, PRICE_LIST, AC_BRANDS, GALLERY } from "../data/mockData";
import { Phone, MessageCircle, MapPin, Clock, Star, ChevronDown, ChevronUp, Menu, X, Snowflake, Wrench, Wind, ArrowRight, CheckCircle, Shield, Zap, Thermometer, Globe, Play, ArrowUp } from "lucide-react";

// ─── WA TEMPLATE ───
const WA_TEMPLATE = "Hai kak aku [Nama] mau tanya-tanya dulu kira-kira di lokasi [Alamat] ku sekarang tuh bisa nggak buat pesen AC dan bisa dilakukan kapan?";
const WA_LINK = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(WA_TEMPLATE)}`;

// ─── ANIMATION VARIANTS ───
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

// ─── COMPONENTS ───
function Section({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  return (
    <motion.section ref={ref} id={id} className={`kab-section ${className}`} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}>
      {children}
    </motion.section>
  );
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── NAVBAR ───
function Navbar({ lang, setLang }: { lang: string, setLang: (l: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  
  const links = [
    { label: lang === "id" ? "Layanan" : "Services", href: "#layanan" },
    { label: lang === "id" ? "Harga" : "Pricing", href: "#harga" },
    { label: lang === "id" ? "Galeri" : "Gallery", href: "#galeri" },
    { label: lang === "id" ? "Testimoni" : "Reviews", href: "#testimoni" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className={`kab-nav ${scrolled || menuOpen ? "kab-nav-scrolled" : ""}`}>
      <div className="kab-nav-inner">
        <a href="#" className="kab-logo">
          <div className="kab-logo-icon"><Snowflake size={20} /></div>
          <span>Kang AC Balap</span>
        </a>
        <div className={`kab-nav-links ${menuOpen ? "kab-nav-links-open" : ""}`}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="kab-nav-link" onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <button className="kab-lang-toggle" onClick={() => setLang(lang === "id" ? "en" : "id")}>
            <Globe size={16} /> {lang === "id" ? "ID" : "EN"}
          </button>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-wa kab-btn-sm">
            <MessageCircle size={16} /> {lang === "id" ? "Hubungi WA" : "WhatsApp"}
          </a>
        </div>
        <button className="kab-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}

// ─── HERO ───
function Hero({ lang }: { lang: string }) {
  return (
    <section className="kab-hero" id="hero">
      <div className="kab-hero-image">
        <img src="/images/hero-ac-service.png" alt="Kang AC Balap - Service AC Panggilan Sidoarjo" loading="eager" fetchPriority="high" />
        <div className="kab-hero-overlay" />
      </div>
      <div className="kab-hero-content">
        <motion.div className="kab-hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <Snowflake size={14} /> {lang === "id" ? "#1 Jasa AC Terpercaya di Sidoarjo" : "#1 Trusted AC Service in Sidoarjo"}
        </motion.div>
        <motion.h1 className="kab-hero-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
          {lang === "id" ? "Jasa Service AC Panggilan Sidoarjo" : "Professional AC Service Sidoarjo"} <br />
          <span className="kab-gradient-text">{lang === "id" ? "Cepat, Dingin, Bergaransi!" : "Fast, Cold, Guaranteed!"}</span>
        </motion.h1>
        <motion.p className="kab-hero-subtitle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
          {lang === "id"
            ? "Pemasangan, cuci & servis AC untuk rumah dan kantor. Teknisi berpengalaman, harga transparan, garansi pekerjaan. Respon cepat dalam 24 jam!"
            : "Installation, cleaning & repair for home and office. Experienced technicians, transparent pricing, guaranteed work. Fast 24-hour response!"}
        </motion.p>
        <motion.div className="kab-hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-wa kab-btn-lg">
            <MessageCircle size={20} /> {lang === "id" ? "Chat WhatsApp" : "WhatsApp Us"}
          </a>
          <a href="#layanan" className="kab-btn kab-btn-glass kab-btn-lg">
            {lang === "id" ? "Lihat Layanan" : "View Services"} <ArrowRight size={18} />
          </a>
        </motion.div>
        <motion.div className="kab-hero-trust" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <div className="kab-trust-item"><Shield size={16} /> <span>{lang === "id" ? "Bergaransi" : "Guaranteed"}</span></div>
          <div className="kab-trust-item"><Zap size={16} /> <span>{lang === "id" ? "Respon 24 Jam" : "24h Response"}</span></div>
          <div className="kab-trust-item"><Star size={16} /> <span>Rating 4.9</span></div>
          <div className="kab-trust-item"><Thermometer size={16} /> <span>{lang === "id" ? "Semua Merk AC" : "All Brands"}</span></div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── STATS ───
function StatsSection({ lang }: { lang: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div className="kab-stats-wrap">
      <div className="kab-stats-grid" ref={ref}>
        {STATS.map((s, i) => (
          <motion.div key={i} className="kab-stat-card" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}>
            <span className="kab-stat-value"><Counter value={s.value} suffix={s.suffix} /></span>
            <span className="kab-stat-label">
              {lang === "en" && s.label === "Pelanggan Puas" ? "Happy Customers" :
               lang === "en" && s.label === "Tahun Pengalaman" ? "Years Experience" :
               lang === "en" && s.label === "Respon Cepat" ? "Fast Response" : s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── SERVICES ───
function ServicesSection({ lang }: { lang: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    "🧹": <Wind size={28} className="kab-svc-icon-svg" />,
    "🔧": <Wrench size={28} className="kab-svc-icon-svg" />,
    "⚡": <Zap size={28} className="kab-svc-icon-svg" />,
    "📦": <ArrowRight size={28} className="kab-svc-icon-svg" />,
  };
  return (
    <Section id="layanan" className="kab-services-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">💼 {lang === "id" ? "Layanan Kami" : "Our Services"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Jasa Service AC" : "Professional AC"} <span className="kab-gradient-text">{lang === "id" ? "Profesional" : "Services"}</span></h2>
      </motion.div>
      <div className="kab-services-grid">
        {SERVICES.map((s) => (
          <motion.div key={s.id} className="kab-service-card" variants={fadeUp} whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(22,163,74,0.15)" }}>
            {s.is_popular && <span className="kab-popular-badge">⭐ {lang === "id" ? "Populer" : "Popular"}</span>}
            <div className="kab-service-icon">{iconMap[s.icon] || <Snowflake size={28} />}</div>
            <h3 className="kab-service-name">{s.name}</h3>
            <p className="kab-service-desc">{s.description}</p>
            <div className="kab-service-price">
              {lang === "id" ? "Mulai" : "From"} <strong>Rp {(s.price_min / 1000).toFixed(0)}k</strong>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-wa kab-btn-full">
              <MessageCircle size={16} /> {lang === "id" ? "Pesan Sekarang" : "Book Now"}
            </a>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── BRANDS ───
function BrandsSection() {
  return (
    <Section className="kab-brands-section">
      <motion.p className="kab-brands-label" variants={fadeIn}>Melayani semua merk AC populer</motion.p>
      <motion.div className="kab-brands-grid" variants={fadeIn}>
        {AC_BRANDS.map(b => (
          <div key={b.name} className="kab-brand-item">
            <span className="kab-brand-flag">{b.logo}</span>
            <span className="kab-brand-name">{b.name}</span>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}

// ─── PROMO ───
function PromoSection() {
  return (
    <Section className="kab-promo-section">
      <div className="kab-promo-grid">
        {PROMOS.filter(p => p.is_active).map((p) => (
          <motion.div key={p.id} className="kab-promo-card" variants={fadeUp} whileHover={{ scale: 1.03 }}>
            <span className="kab-promo-badge">{p.badge}</span>
            <h3 className="kab-promo-title">{p.title}</h3>
            <p className="kab-promo-desc">{p.description}</p>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-glass kab-btn-sm">
              Klaim Promo <ArrowRight size={14} />
            </a>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── HOW IT WORKS ───
function HowItWorks({ lang }: { lang: string }) {
  const steps = [
    { num: "01", title: lang === "id" ? "Hubungi Kami" : "Contact Us", desc: "Chat via WhatsApp", icon: <MessageCircle size={24} />, color: "#25D366" },
    { num: "02", title: lang === "id" ? "Jadwalkan" : "Schedule", desc: "Pilih tanggal", icon: <Clock size={24} />, color: "#3B82F6" },
    { num: "03", title: lang === "id" ? "Teknisi Datang" : "We Arrive", desc: "Teknisi ke lokasi", icon: <Wrench size={24} />, color: "#F59E0B" },
    { num: "04", title: lang === "id" ? "AC Prima!" : "AC Fixed!", desc: "AC bersih dingin", icon: <Snowflake size={24} />, color: "#16A34A" },
  ];
  return (
    <Section className="kab-how-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">🚀 {lang === "id" ? "Cara Pesan" : "How it Works"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Cuma 4 Langkah Mudah" : "Just 4 Easy Steps"}</h2>
      </motion.div>
      <div className="kab-how-grid">
        {steps.map((s, i) => (
          <motion.div key={i} className="kab-how-card" variants={fadeUp} whileHover={{ y: -5 }}>
            <div className="kab-how-num">{s.num}</div>
            <div className="kab-how-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── GALLERY ───
function GallerySection({ lang }: { lang: string }) {
  return (
    <Section id="galeri" className="kab-gallery-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">📸 {lang === "id" ? "Galeri" : "Gallery"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Hasil Kerja Kami" : "Our Work"}</h2>
      </motion.div>
      <div className="kab-gallery-grid">
        <motion.div className="kab-gallery-item kab-gallery-featured" variants={fadeUp} whileHover={{ scale: 1.02 }}>
          <img src="/images/before-after-ac.png" alt="Before After Cuci AC" loading="lazy" />
          <div className="kab-gallery-caption">
            <span className="kab-gallery-badge">Before / After</span>
            <p>Deep Clean AC — Evaporator bersih maksimal</p>
          </div>
        </motion.div>
        <motion.div className="kab-gallery-item" variants={fadeUp} whileHover={{ scale: 1.02 }}>
          <img src="/images/ac-cool-room.png" alt="AC Terpasang di Ruangan" loading="lazy" />
          <div className="kab-gallery-caption">
            <span className="kab-gallery-badge">Project</span>
            <p>Instalasi AC Split — Kamar Premium</p>
          </div>
        </motion.div>
        <motion.div className="kab-gallery-item" variants={fadeUp} whileHover={{ scale: 1.02 }}>
          <img src="/images/hero-ac-service.png" alt="Teknisi AC Profesional" loading="lazy" />
          <div className="kab-gallery-caption">
            <span className="kab-gallery-badge">Tim Kami</span>
            <p>Teknisi profesional & berpengalaman</p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── TIKTOK & MAPS PREVIEW ───
function SocialProofSection({ lang }: { lang: string }) {
  return (
    <Section className="kab-social-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">📱 {lang === "id" ? "Viral di Sosmed" : "Viral on Socials"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Dipercaya Ribuan Warga Sidoarjo" : "Trusted by Thousands"}</h2>
      </motion.div>
      <div className="kab-social-grid">
        <motion.div className="kab-social-card kab-tiktok-card" variants={fadeUp}>
          <div className="kab-social-header">
            <img src="/images/hero-ac-service.png" className="kab-social-avatar" alt="TikTok" />
            <div>
              <strong>@kang.ac.balap</strong>
              <span><Counter value={15} suffix="K" /> Followers</span>
            </div>
            <a href={COMPANY.tiktokLink} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-sm kab-btn-primary">Follow</a>
          </div>
          <div className="kab-tiktok-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="kab-tiktok-video">
                <img src={i === 1 ? "/images/before-after-ac.png" : i === 2 ? "/images/ac-cool-room.png" : "/images/hero-ac-service.png"} alt="TikTok Video" />
                <div className="kab-tiktok-overlay">
                  <Play size={20} fill="white" />
                  <span><Counter value={Math.floor(Math.random() * 500 + 100)} suffix="K" /></span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div className="kab-social-card kab-maps-card" variants={fadeUp}>
          <div className="kab-social-header">
            <div className="kab-maps-score">4.9</div>
            <div>
              <div className="kab-maps-stars">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="#FBBF24" color="#FBBF24" />)}
              </div>
              <span>Google Maps Rating</span>
            </div>
          </div>
          <div className="kab-maps-reviews">
            <div className="kab-maps-review">
              <div className="kab-maps-r-head">
                <strong>Budi Santoso</strong>
                <div className="kab-maps-r-stars"><Star size={12} fill="#FBBF24" color="#FBBF24" /> x5</div>
              </div>
              <p>"Mantap teknisinya ramah, AC jadi dingin banget kaya di kutub utara! Pengerjaan super bersih."</p>
            </div>
            <div className="kab-maps-review">
              <div className="kab-maps-r-head">
                <strong>Siti Aminah</strong>
                <div className="kab-maps-r-stars"><Star size={12} fill="#FBBF24" color="#FBBF24" /> x5</div>
              </div>
              <p>"Pengerjaan cepat dan rapi. Harga juga transparan dari awal tidak ada tambahan aneh-aneh."</p>
            </div>
          </div>
          <a href={COMPANY.googleMapsLink} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-outline kab-btn-full kab-mt-auto">
            {lang === "id" ? "Lihat di Google Maps" : "View on Google Maps"}
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── TESTIMONIALS ───
function TestimonialsSection({ lang }: { lang: string }) {
  return (
    <Section id="testimoni" className="kab-testi-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">💬 {lang === "id" ? "Testimoni" : "Reviews"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Apa Kata Pelanggan Kami?" : "What Our Customers Say"}</h2>
      </motion.div>
      <div className="kab-testi-grid">
        {TESTIMONIALS.map((t) => (
          <motion.div key={t.id} className="kab-testi-card" variants={fadeUp} whileHover={{ y: -5 }}>
            <div className="kab-testi-stars">
              {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={16} fill="#FBBF24" color="#FBBF24" />)}
            </div>
            <p className="kab-testi-comment">"{t.comment}"</p>
            <div className="kab-testi-author">
              <div className="kab-testi-avatar">{t.name[0]}</div>
              <div>
                <strong>{t.name}</strong>
                <span className="kab-testi-service">{t.service}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ─── FAQ ───
function FAQSection({ lang }: { lang: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <Section id="faq" className="kab-faq-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">❓ FAQ</span>
        <h2 className="kab-section-title">{lang === "id" ? "Pertanyaan yang Sering Diajukan" : "Frequently Asked Questions"}</h2>
      </motion.div>
      <motion.div className="kab-faq-list" variants={fadeUp}>
        {FAQ_DATA.map((f, i) => (
          <div key={i} className={`kab-faq-item ${openIndex === i ? "kab-faq-open" : ""}`}>
            <button className="kab-faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <span>{f.question}</span>
              {openIndex === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div className="kab-faq-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                  <p>{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>
    </Section>
  );
}

// ─── PRICE TABLE ───
function PriceSection({ lang }: { lang: string }) {
  return (
    <Section id="harga" className="kab-price-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">💰 {lang === "id" ? "Daftar Harga" : "Pricing"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Harga Transparan," : "Transparent Pricing,"} <span className="kab-text-white">{lang === "id" ? "Tanpa Biaya Tersembunyi" : "No Hidden Fees"}</span></h2>
      </motion.div>
      <motion.div className="kab-price-table-wrap" variants={fadeUp}>
        <table className="kab-price-table">
          <thead>
            <tr>
              <th>{lang === "id" ? "Layanan" : "Service"}</th>
              <th>0.5-1 PK</th>
              <th>1.5 PK</th>
              <th>2 PK</th>
              <th>{lang === "id" ? "Ket." : "Note"}</th>
            </tr>
          </thead>
          <tbody>
            {PRICE_LIST.map((p, i) => (
              <tr key={i}>
                <td className="kab-price-service">{p.service}</td>
                <td>Rp {p.pk_05_1.toLocaleString("id-ID")}</td>
                <td>Rp {p.pk_15.toLocaleString("id-ID")}</td>
                <td>Rp {p.pk_2.toLocaleString("id-ID")}</td>
                <td className="kab-price-note">{p.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </Section>
  );
}

// ─── AREA LAYANAN ───
function AreaSection({ lang }: { lang: string }) {
  return (
    <Section id="kontak" className="kab-area-section">
      <motion.div className="kab-section-header" variants={fadeUp}>
        <span className="kab-section-badge">📍 {lang === "id" ? "Area Layanan" : "Coverage Area"}</span>
        <h2 className="kab-section-title">{lang === "id" ? "Kami Ada di Dekat Anda" : "We Are Near You"}</h2>
      </motion.div>
      <div className="kab-area-grid">
        <motion.div className="kab-area-map" variants={fadeUp}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63324.989!2d112.607232!3d-7.3826304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7dda7cf0f3f55%3A0xce81f54d7c96860a!2sSidoarjo!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
            width="100%" height="100%"
            style={{ border: 0, borderRadius: "16px" }}
            allowFullScreen loading="lazy"
            title="Area Layanan"
          />
        </motion.div>
        <motion.div className="kab-area-info" variants={fadeUp}>
          <h3>{lang === "id" ? "Wilayah yang Dilayani" : "Areas Covered"}</h3>
          <div className="kab-area-tags">
            {COMPANY.serviceAreas.map(a => (<span key={a} className="kab-area-tag">{a}</span>))}
          </div>
          <div className="kab-contact-info">
            <div className="kab-contact-item"><Phone size={18} /> <span>{COMPANY.phone}</span></div>
            <div className="kab-contact-item"><MapPin size={18} /> <span>{COMPANY.address}</span></div>
            <div className="kab-contact-item"><Clock size={18} /> <span>{COMPANY.operatingHours}</span></div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ─── SCROLL TO TOP ───
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="kab-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Scroll to Top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── FOOTER WITH OVERLAPPING CTA ───
function Footer({ lang }: { lang: string }) {
  return (
    <div className="kab-footer-wrapper">
      
      {/* Overlapping CTA Banner */}
      <div className="kab-footer-overlap-cta">
        <div className="kab-overlap-content">
          <h2>{lang === "id" ? "Ready To Get Started?" : "Ready To Get Started?"}</h2>
          <p>{lang === "id" ? "Pesan sekarang untuk mendapatkan jadwal tercepat hari ini!" : "Book now to get the fastest schedule today!"}</p>
        </div>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="kab-btn kab-btn-outline-white kab-btn-lg">
          {lang === "id" ? "Contact Us" : "Contact Us"}
        </a>
      </div>

      <footer className="kab-footer">
        <div className="kab-footer-inner">
          <div className="kab-footer-brand">
            <div className="kab-logo"><div className="kab-logo-icon"><Snowflake size={24} /></div> <span>Kang AC Balap</span></div>
            <p className="kab-footer-desc">{COMPANY.description}</p>
          </div>
          
          <div className="kab-footer-links-grid">
            <div className="kab-footer-links">
              <h4>Company</h4>
              <a href="#layanan">About</a>
              <a href="#kontak">Contact</a>
              <a href="#layanan">Careers</a>
              <a href="#testimoni">Team</a>
            </div>
            <div className="kab-footer-links">
              <h4>Services</h4>
              <a href="#layanan">Find a Technician</a>
              <a href="#galeri">Discover Inspiration</a>
              <a href="#harga">Pricing</a>
            </div>
            <div className="kab-footer-links">
              <h4>Support</h4>
              <a href="#faq">Privacy Policy</a>
              <a href="#faq">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="kab-footer-bottom">
          <p>© 2025 {COMPANY.name}. Sidoarjo, Jawa Timur — All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── MAIN LANDING PAGE ───
export function LandingPage() {
  const [lang, setLang] = useState<string>("id");

  return (
    <div className="kab-landing">
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <StatsSection lang={lang} />
      <ServicesSection lang={lang} />
      <BrandsSection />
      <PromoSection />
      <HowItWorks lang={lang} />
      <GallerySection lang={lang} />
      <SocialProofSection lang={lang} />
      <PriceSection lang={lang} />
      <TestimonialsSection lang={lang} />
      <FAQSection lang={lang} />
      <AreaSection lang={lang} />
      
      {/* Footer Wrapper contains the CTA and the main footer */}
      <Footer lang={lang} />
      
      <ScrollToTop />
      <motion.a
        href={WA_LINK} target="_blank" rel="noopener noreferrer"
        className="kab-floating-wa"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        title="Chat WhatsApp"
      >
        <MessageCircle size={28} />
        <span className="kab-floating-wa-label">{lang === "id" ? "Chat Kami" : "Chat Us"}</span>
      </motion.a>
    </div>
  );
}