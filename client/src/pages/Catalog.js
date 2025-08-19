import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaTruck, FaQrcode, FaClock, FaStore, FaSearch, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Catalog.css';

const UmkmCard = ({ umkm }) => {
  const images = [umkm.image, umkm.image2, umkm.image3, umkm.image4].filter(img => img);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: images.length > 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [{ breakpoint: 768, settings: { arrows: false } }]
  };

  return (
    <div className="umkm-card">
      {/* Image Slider */}
      <div className="card-image-container">
        {images.length > 0 ? (
          <Slider {...sliderSettings}>
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={`/uploads/${img}`}
                  alt={`${umkm.name} - ${index + 1}`}
                  className="slider-image"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Gambar+UMKM'; }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src="https://via.placeholder.com/400x300?text=Gambar+UMKM"
            alt="Default UMKM"
            className="slider-image"
          />
        )}
        {umkm.best_seller && <div className="best-seller-label">Best Seller</div>}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <h3 className="umkm-name">{umkm.name}</h3>
        <p className="umkm-description">{umkm.description}</p>
        <div className="umkm-details">
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <span>{umkm.hours}</span>
          </div>
          <div className="umkm-features-modern">
            {umkm.can_deliver && (
              <span className="feature-badge-modern">
                <FaTruck className="feature-icon" /> Dapat Diantar
              </span>
            )}
            {umkm.can_qris && (
              <span className="feature-badge-modern">
                <FaQrcode className="feature-icon" /> Bayar QRIS
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="umkm-actions-modern">
        {umkm.whatsapp && (
          <a
            href={`https://wa.me/${umkm.whatsapp}`}
            className="wa-icon-btn"
            target="_blank"
            rel="noopener noreferrer"
            title="Chat WhatsApp"
          >
            <FaWhatsapp />
          </a>
        )}
        {umkm.mapsLink && (
          <a
            href={umkm.mapsLink}
            className="maps-icon-btn"
            target="_blank"
            rel="noopener noreferrer"
            title="Dapatkan Arah"
          >
            <FaMapMarkerAlt />
          </a>
        )}
      </div>
    </div>
  );
};

const Catalog = () => {
  const [umkmList, setUmkmList] = useState([]);
  const [bannerData, setBannerData] = useState({
    heroTitle: "Jelajahi UMKM Tajur Halang",
    heroDescription: "Temukan berbagai usaha mikro, kecil, dan menengah yang berkualitas di sekitar Anda",
    heroButtonText: "Lihat Catalog"
  });
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 9;
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [umkmResponse, bannerResponse] = await Promise.all([
        axios.get('/api/mysql/umkm'),
        axios.get('/api/mysql/banner')
      ]);

      const processedUmkmList = umkmResponse.data.map(umkm => ({
        ...umkm,
        can_deliver: Boolean(Number(umkm.can_deliver)),
        can_qris: Boolean(Number(umkm.can_qris)),
        best_seller: Boolean(Number(umkm.best_seller)),
      }));

      setUmkmList(processedUmkmList);
      setBannerData({
        heroTitle: bannerResponse.data.title || "Jelajahi UMKM Tajur Halang",
        heroDescription: bannerResponse.data.description || "Temukan berbagai usaha mikro, kecil, dan menengah yang berkualitas di sekitar Anda",
        heroButtonText: "Lihat Catalog"
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const scrollToCatalog = () => {
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredUmkmList = umkmList.filter(umkm =>
    (categoryFilter === 'ALL' || umkm.category === categoryFilter) &&
    ((umkm.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (umkm.description || '').toLowerCase().includes(search.toLowerCase()))
  );

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredUmkmList.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredUmkmList.length / cardsPerPage);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat data UMKM...</p>
      </div>
    );
  }

  // ✅ JSON-LD Schema untuk SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "UMKM Desa Tajur Halang",
    "image": "https://tajurhalangumkm.com/logo.png",
    "url": "https://tajurhalangumkm.com",
    "telephone": "+628123456789", 
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Tajur Halang",
      "addressLocality": "Bogor",
      "addressRegion": "Jawa Barat",
      "postalCode": "16320",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.4673,
      "longitude": 106.7931
    },
    "description": "Katalog UMKM Desa Tajur Halang - Temukan usaha mikro, kecil, dan menengah terbaik di Tajur Halang.",
    "openingHours": "Mo-Su 08:00-21:00",
    "sameAs": [
      "https://facebook.com/tajurhalangumkm",
      "https://instagram.com/tajurhalangumkm"
    ]
  };

  return (
    <div className="catalog-container">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <div className="brand">
              <h1 className="brand-name">UMKM DESA TAJUR HALANG</h1>
              <p className="brand-tagline">Ekonomi Kuat, Masyarakat Sejahtera, Tajur Halang Maju!</p>
            </div>
            <nav className="main-nav">
              <div 
                className="nav-item"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <span className="nav-link" onClick={toggleDropdown}>Menu</span>
                <div className={`nav-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                  <Link to="/" onClick={closeDropdown}>Catalog</Link>
                  <Link to="/about" onClick={closeDropdown}>Tentang</Link>
                </div>
              </div>
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
        
        <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Catalog</Link>
          <Link to="/about" className="nav-link" onClick={closeMobileMenu}>Tentang</Link>
          <Link to="/admin" className="admin-button" onClick={closeMobileMenu}><FaStore /> Admin</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"><div className="hero-overlay"></div></div>
        <div className="hero-content">
          <div className="hero-badge">UMKM CATALOG</div>
          <h1 className="hero-title">{bannerData.heroTitle}</h1>
          <p className="hero-description">{bannerData.heroDescription}</p>
          <button className="hero-cta" onClick={scrollToCatalog}>Lihat Catalog</button>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="catalog-section">
        <div className="section-header">
          <h2>Catalog UMKM</h2>
          <p>Berbagai usaha yang dapat Anda kunjungi di Desa Tajur Halang!</p>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="mau cari apa hari ini?"
              className="search-input"
            />
          </div>
          <div className="category-filter-bar">
            <button className={`category-btn${categoryFilter === 'ALL' ? ' active' : ''}`} onClick={() => setCategoryFilter('ALL')}>Semua</button>
            <button className={`category-btn${categoryFilter === 'UMKM' ? ' active' : ''}`} onClick={() => setCategoryFilter('UMKM')}>UMKM</button>
            <button className={`category-btn${categoryFilter === 'IKM' ? ' active' : ''}`} onClick={() => setCategoryFilter('IKM')}>IKM</button>
          </div>
        </div>

        <div className="umkm-grid">
          {currentCards.map((umkm) => (<UmkmCard key={umkm.id} umkm={umkm} />))}
        </div>

        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &laquo; Sebelumnya
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                  <button
                    key={pageNumber}
                    className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Selanjutnya &raquo;
              </button>
            </div>
          </div>
        )}
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
            <img src="/img/trilogi.png" alt="Logo Trilogi" style={{height: '35px', marginRight: '10px', verticalAlign: 'middle'}} />
            <img src="/img/dharmacakra.png" alt="Logo Dharmacakra" style={{height: '35px', marginRight: '10px', verticalAlign: 'middle'}} />
            Powered by <strong style={{marginLeft: '8px'}}>KKN 4 Universitas Trilogi</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Catalog;
