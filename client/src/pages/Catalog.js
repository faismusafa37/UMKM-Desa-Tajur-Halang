import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaTruck, FaQrcode, FaClock, FaStore, FaSearch, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '../styles/Catalog.css';

const UmkmCard = ({ umkm }) => {
  const images = [
    umkm.image,
    umkm.image2,
    umkm.image3,
    umkm.image4
  ].filter(img => img);

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
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false
        }
      }
    ]
  };

  return (
    <div className="umkm-card" itemScope itemType="http://schema.org/LocalBusiness">
      <div className="card-image-container">
        {images.length > 0 ? (
          <Slider {...sliderSettings}>
            {images.map((img, index) => (
              <div key={index}>
                <img 
                  src={`/uploads/${img}`} 
                  alt={`${umkm.name} - ${index + 1}`} 
                  className="slider-image"
                  itemProp="image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Gambar+UMKM';
                  }}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img 
            src="https://via.placeholder.com/400x300?text=Gambar+UMKM" 
            alt="Default UMKM" 
            className="slider-image"
            itemProp="image"
          />
        )}
        {umkm.best_seller && (
          <div className="best-seller-label">Best Seller</div>
        )}
      </div>

      <div className="card-content">
        <h3 className="umkm-name" itemProp="name">{umkm.name}</h3>
        <p className="umkm-description" itemProp="description">{umkm.description}</p>
        <div className="umkm-details">
          <div className="detail-item" itemProp="openingHours" content={umkm.hours}>
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
      
      <div className="umkm-actions-modern">
        {umkm.whatsapp && (
          <a
            href={`https://wa.me/${umkm.whatsapp}`}
            className="wa-icon-btn"
            target="_blank"
            rel="noopener noreferrer nofollow"
            title="Chat WhatsApp"
            itemProp="telephone"
            content={umkm.whatsapp}
          >
            <FaWhatsapp />
          </a>
        )}
        {umkm.mapsLink && (
          <a
            href={umkm.mapsLink}
            className="maps-icon-btn"
            target="_blank"
            rel="noopener noreferrer nofollow"
            title="Dapatkan Arah"
            itemProp="hasMap"
            content={umkm.mapsLink}
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const scrollToCatalog = () => {
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const catalogSection = document.getElementById('catalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
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

  // SEO Metadata
  const pageTitle = "Katalog UMKM Desa Tajur Halang | Temukan Usaha Lokal Terbaik";
  const pageDescription = "Temukan berbagai UMKM dan IKM berkualitas di Desa Tajur Halang. Dukung perekonomian lokal dengan membeli produk dan jasa dari usaha kecil menengah sekitar.";
  const canonicalUrl = "https://umkm-tajurhalang.com/catalog";
  const siteName = "UMKM Desa Tajur Halang";
  const twitterHandle = "@umkmtajurhalang";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat data UMKM...</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="catalog-container">
        {/* SEO Meta Tags */}
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content="UMKM, IKM, Tajur Halang, usaha kecil, usaha menengah, katalog UMKM, ekonomi lokal" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href={canonicalUrl} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content="https://umkm-tajurhalang.com/img/og-image.jpg" />
          <meta property="og:site_name" content={siteName} />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content={twitterHandle} />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content="https://umkm-tajurhalang.com/img/twitter-image.jpg" />
          
          {/* Schema.org markup */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": pageTitle,
              "description": pageDescription,
              "url": canonicalUrl,
              "publisher": {
                "@type": "Organization",
                "name": siteName,
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://umkm-tajurhalang.com/img/logo.png"
                }
              }
            })}
          </script>
        </Helmet>

        {/* Header */}
        <header className={`main-header ${isMobileMenuOpen ? 'hidden' : ''}`}>
          <div className={`header-content ${isMobileMenuOpen ? 'hidden' : ''}`}>
            <div className="header-left">
              <div className="brand">
                <h1 className="brand-name">UMKM DESA TAJUR HALANG</h1>
                <p className="brand-tagline">Ekonomi Kuat, Masyarakat Sejahtera, Tajur Halang Maju!</p>
              </div>
              <nav className="main-nav" aria-label="Main navigation">
                <div 
                  className="nav-item" 
                  onMouseEnter={() => setIsDropdownOpen(true)} 
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <span className="nav-link" onClick={toggleDropdown}>
                    Menu
                  </span>
                  <div className={`nav-dropdown ${isDropdownOpen ? 'active' : ''}`}>
                    <Link to="/" onClick={closeDropdown}>Catalog</Link>
                    <Link to="/about" onClick={closeDropdown}>Tentang</Link>
                  </div>
                </div>
              </nav>
            </div>
            <div className="header-right">
              <Link to="/admin" className="admin-button" aria-label="Admin panel">
                <FaStore />
              </Link>
              <button 
                className="hamburger-menu" 
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
                <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
                <div className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></div>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav 
          className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`} 
          aria-label="Mobile navigation"
          aria-hidden={!isMobileMenuOpen}
        >
          <Link to="/" className="nav-link" onClick={closeMobileMenu}>Catalog</Link>
          <Link to="/about" className="nav-link" onClick={closeMobileMenu}>Tentang</Link>
          <Link to="/admin" className="admin-button" onClick={closeMobileMenu}>
            <FaStore /> Admin
          </Link>
        </nav>

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="hero-badge">UMKM CATALOG</div>
            <h1 className="hero-title">{bannerData.heroTitle}</h1>
            <p className="hero-description">
              {bannerData.heroDescription}
            </p>
            <button className="hero-cta" onClick={scrollToCatalog}>Lihat Catalog</button>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalog" className="catalog-section">
          <div className="section-header">
            <h1>Catalog UMKM Desa Tajur Halang</h1>
            <p>Berbagai usaha yang dapat Anda kunjungi di Desa Tajur Halang</p>
            <div className="search-bar">
              <label htmlFor="search-input" className="sr-only">Cari UMKM</label>
              <FaSearch className="search-icon" />
              <input
                type="text"
                id="search-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="mau cari apa hari ini?"
                className="search-input"
                aria-label="Cari UMKM"
              />
            </div>
            <div className="category-filter-bar" role="tablist" aria-label="Filter kategori UMKM">
              <button 
                className={`category-btn${categoryFilter === 'ALL' ? ' active' : ''}`} 
                onClick={() => setCategoryFilter('ALL')}
                role="tab"
                aria-selected={categoryFilter === 'ALL'}
              >
                Semua
              </button>
              <button 
                className={`category-btn${categoryFilter === 'UMKM' ? ' active' : ''}`} 
                onClick={() => setCategoryFilter('UMKM')}
                role="tab"
                aria-selected={categoryFilter === 'UMKM'}
              >
                UMKM
              </button>
              <button 
                className={`category-btn${categoryFilter === 'IKM' ? ' active' : ''}`} 
                onClick={() => setCategoryFilter('IKM')}
                role="tab"
                aria-selected={categoryFilter === 'IKM'}
              >
                IKM
              </button>
            </div>
          </div>

          <div className="umkm-grid" role="list">
            {currentCards.map((umkm) => (
              <UmkmCard key={umkm.id} umkm={umkm} role="listitem" />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <nav className="pagination" aria-label="Pagination navigation">
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  &laquo; Sebelumnya
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-label={`Halaman ${pageNumber}`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                >
                  Selanjutnya &raquo;
                </button>
              </nav>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="main-footer" role="contentinfo">
          <div className="footer-content">
            <div className="footer-brand">
              <h2>UMKM DESA TAJUR HALANG</h2>
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
              <img 
                src="/img/trilogi.png" 
                alt="Logo Trilogi" 
                style={{height: '35px', marginRight: '10px', verticalAlign: 'middle'}} 
                loading="lazy"
              />
              <img 
                src="/img/dharmacakra.png" 
                alt="Logo Dharmacakra" 
                style={{height: '35px', marginRight: '10px', verticalAlign: 'middle'}} 
                loading="lazy"
              />
              Powered by <strong style={{marginLeft: '8px'}}>KKN 4 Universitas Trilogi</strong>
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default Catalog;