import React, { useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaHandshake,
  FaChartLine,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStore,
} from 'react-icons/fa';
import '../styles/About.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// ================= TEAM SECTION =================
const TeamSection = () => {
  const teamMembers = [
    { id: 1, name: "Misyal Soelaiman", role: "Ketua", image: "/img/Mishal.png", major: "Desain Komunikasi Visual" },
    { id: 2, name: "Musyaffa Salman", role: "Wakil Ketua", image: "/img/fais.png", major: "Teknik Informatika" },
    { id: 3, name: "Novia Safitri", role: "Sekretaris", image: "/img/novi.png", major: "Manajemen" },
    { id: 4, name: "Muhammad Dhafa", role: "Humas I", image: "/img/daffa.png", major: "Manajemen" },
    { id: 5, name: "Risa Puspita Zain", role: "Humas II", image: "/img/Risa.png", major: "Akuntansi" },
    { id: 6, name: "Hanifah Lu'lu Balqis", role: "Bendahara I", image: "/img/Lulu.png", major: "PGPAUD" },
    { id: 7, name: "Marsa Mahasina", role: "Bendahara II", image: "/img/marsha.png", major: "Manajemen" },
    { id: 8, name: "Charles Delbert", role: "Media", image: "/img/Charles.png", major: "Manajemen" }
  ];

  const sliderRef = React.useRef(null);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="team-section">
      <div className="container">
        <h2>Tim Pengembang</h2>
        <p className="subtitle">Dibuat dengan dedikasi oleh mahasiswa KKN 4 Universitas Trilogi</p>
        <div className="team-carousel-wrapper">
          <Slider {...sliderSettings} ref={sliderRef} className="team-slider">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.major}</p>
                </div>
              </div>
            ))}
          </Slider>
          <div className="carousel-controls">
            <button className="prev-btn" onClick={() => sliderRef.current.slickPrev()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="next-btn" onClick={() => sliderRef.current.slickNext()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ================= ABOUT PAGE =================
const About = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="about-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <div className="brand">
              <h1 className="brand-name">UMKM DESA TAJUR HALANG</h1>
              <p className="brand-tagline">Ekonomi Kuat, Masyarakat Sejahtera, Tajur Halang Maju!</p>
            </div>
            <nav className="main-nav">
              <Link to="/" className="nav-link">Catalog</Link>
              <Link to="/about" className="nav-link">Tentang</Link>
            </nav>
          </div>
          <div className="header-right">
            <Link to="/admin" className="admin-button"><FaStore /></Link>
            <div className="hamburger-menu" onClick={toggleMobileMenu}>
              <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
              <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
              <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMobileMenu}>Catalog</Link>
        <Link to="/about" className="nav-link" onClick={closeMobileMenu}>Tentang</Link>
        <Link to="/admin" className="admin-button" onClick={closeMobileMenu}><FaStore /></Link>
      </nav>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Tentang UMKM Desa Tajur Halang</h1>
          <p>Platform digital untuk mendukung dan mempromosikan usaha mikro, kecil, dan menengah di Tajur Halang</p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="vision-mission">
        <div className="container">
          <div className="vision-card">
            <h2>Visi</h2>
            <p>Menjadi platform digital terdepan dalam mendukung pertumbuhan dan keberlanjutan UMKM di Tajur Halang</p>
          </div>
          <div className="mission-card">
            <h2>Misi</h2>
            <p>Memberikan akses digital yang mudah dan efektif bagi UMKM untuk mempromosikan produk dan layanan mereka</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits">
        <div className="container">
          <h2>Keuntungan Bergabung</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon"><FaUsers /></div>
              <h3>Jangkauan Luas</h3>
              <p>Produk dan layanan Anda akan terlihat oleh ribuan pengunjung website</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><FaHandshake /></div>
              <h3>Kemudahan Akses</h3>
              <p>Pelanggan dapat dengan mudah menemukan informasi UMKM di sekitar mereka</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><FaChartLine /></div>
              <h3>Pertumbuhan Bisnis</h3>
              <p>Meningkatkan penjualan dan memperluas jaringan pelanggan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* How to Join */}
      <section className="how-to-join">
        <div className="container">
          <h2>Cara Bergabung</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Hubungi Admin</h3>
              <p>Kontak admin melalui WhatsApp atau email untuk mendaftarkan UMKM Anda</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Siapkan Data</h3>
              <p>Siapkan informasi lengkap UMKM termasuk foto produk dan jam operasional</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Verifikasi</h3>
              <p>Admin akan memverifikasi data dan menambahkan UMKM ke dalam catalog</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Live di Website</h3>
              <p>UMKM Anda akan langsung terlihat di website dan dapat diakses oleh banyak pengunjung</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-info">
        <div className="container">
          <h2>Informasi Kontak</h2>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon"><FaPhone /></div>
              <h3>Telepon</h3>
              <p>+62 878-4843-3617</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><FaEnvelope /></div>
              <h3>Email</h3>
              <p>admin@umkmtajurhalang.com</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon"><FaMapMarkerAlt /></div>
              <h3>Alamat</h3>
              <p>Tajur Halang, Bogor, Jawa Barat</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Siap Bergabung?</h2>
          <p>Daftarkan UMKM Anda sekarang dan mulai berkembang bersama kami</p>
          <div className="cta-buttons">
            <Link to="/contact" className="cta-button primary">Hubungi Kami</Link>
            <Link to="/" className="cta-button secondary">Lihat Catalog</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>UMKM DESA TAJUR HALANG</h3>
            <p>Ekonomi Kuat, Masyarakat Sejahtera, Tajur Halang Maju!</p>
          </div>
          <div className="footer-links">
            <Link to="/">Catalog</Link>
            <Link to="/about">Tentang</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 UMKM Catalog Desa Tajur Halang. Semua hak dilindungi.</p>
          <div className="powered-by">
            <img src="/img/trilogi.png" alt="Logo Trilogi" style={{height: '35px', marginRight: '10px'}} />
            <img src="/img/dharmacakra.png" alt="Logo Dharmacakra" style={{height: '35px', marginRight: '10px'}} />
            Powered by <strong style={{marginLeft: '8px'}}>KKN 4 Universitas Trilogi</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
