import React, { useState, useEffect } from 'react';

const BANNERS = [
  { title: "Koleksi Terbesar 2026", desc: "Temukan gaya masa depanmu bersama SneakerHub hari ini." },
  { title: "Diskon 20% Terbatas!", desc: "Gunakan kode promo SNEAKERHUB2026 di keranjang belanja Anda." },
  { title: "SneakerCoin Segera Hadir", desc: "Kumpulkan poin loyalitas eksklusif di setiap transaksimu berikutnya." }
];

const ALL_PRODUCTS = [
  { id: 1, name: `Signature Edition`, category: 'sneakers', price: 2450000, rating: 4.9, tag: 'Eksklusif', img: 'https://pngimg.com/uploads/running_shoes/running_shoes_PNG5816.png', desc: 'Dirancang khusus dengan sensor responsif tingkat tinggi untuk kenyamanan maksimal.' },
  { id: 2, name: 'Urban Kinetic Pro v2', category: 'sneakers', price: 1950000, rating: 4.8, tag: 'Best Seller', img: 'https://pngimg.com/uploads/running_shoes/running_shoes_PNG5784.png', desc: 'Sepatu lari urban dengan fleksibilitas sol adaptif untuk segala medan.' },
  { id: 3, name: 'Cyberpunk Neon Glide', category: 'sneakers', price: 3200000, rating: 5.0, tag: 'Limited Drop', img: 'https://pngimg.com/uploads/running_shoes/running_shoes_PNG5825.png', desc: 'Edisi terbatas dengan pencahayaan aksen neon dan teknologi peredam kejut.' },
  { id: 4, name: 'Classic Oxford Executive', category: 'formal', price: 1850000, rating: 4.7, tag: 'Formal Men', img: 'https://pngimg.com/uploads/men_shoes/men_shoes_PNG7475.png', desc: 'Kulit asli premium untuk menyempurnakan penampilan profesional Anda.' },
  { id: 5, name: 'Chic Elegant Heels', category: 'formal', price: 2100000, rating: 4.9, tag: 'High Fashion', img: 'https://pngimg.com/uploads/women_shoes/women_shoes_PNG7470.png', desc: 'Kombinasi kemewahan dan keseimbangan ergonomis untuk acara formal.' },
  { id: 6, name: 'Tough Trekker Outdoor', category: 'boots', price: 2750000, rating: 4.8, tag: 'Outdoor', img: 'https://pngimg.com/uploads/boots/boots_PNG7797.png', desc: 'Tahan air dan dirancang kokoh untuk petualangan ekstrem di alam terbuka.' },
  { id: 7, name: 'Pro Sprint Football', category: 'sport', price: 2100000, rating: 4.8, tag: 'Athletic', img: 'https://pngimg.com/uploads/running_shoes/running_shoes_PNG5818.png', desc: 'Traksi maksimal di atas rumput lapangan untuk performa atletik terbaik.' },
  { id: 8, name: 'Alpine Snow Walker', category: 'boots', price: 3100000, rating: 4.9, tag: 'Winter Spec', img: 'https://pngimg.com/uploads/boots/boots_PNG7814.png', desc: 'Hangat dan kokoh melindungi kaki dari suhu dingin ekstrem dan salju.' }
];

export default function EcommerceStore({ userData, onLogout }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [notification, setNotification] = useState('');
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // State Animasi Keluar
  const [bannerIdx, setBannerIdx] = useState(0);

  const [theme, setTheme] = useState('cyber');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chosenSize, setChosenSize] = useState('40');
  const [chosenColor, setChosenColor] = useState('Midnight Black');

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  
  const [checkoutForm, setCheckoutForm] = useState({ name: userData?.username || '', address: '', method: 'E-Wallet (GoPay)' });

  useEffect(() => {
    const interval = setInterval(() => setBannerIdx(prev => (prev + 1) % BANNERS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const subtotalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (subtotalPrice * discountPercent) / 100;
  const finalTotalPrice = subtotalPrice - discountAmount;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SNEAKERHUB2026') {
      setDiscountPercent(20);
      setPromoMessage('✨ Kupon valid! Diskon 20% diterapkan.');
    } else {
      setDiscountPercent(0);
      setPromoMessage('❌ Kode kupon tidak ditemukan.');
    }
  };

  const handleConfirmAddToCart = () => {
    if (!selectedProduct) return;
    setCart(currentCart => [...currentCart, { ...selectedProduct, cartId: `${selectedProduct.id}-${Date.now()}-${Math.random()}`, size: chosenSize, color: chosenColor }]);
    setSelectedProduct(null);
    setIsCartBumping(true);
    setTimeout(() => setIsCartBumping(false), 500);
    setNotification(`⚡ ${selectedProduct.name} masuk keranjang!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsCheckoutFormOpen(false);
    setIsQROpen(true);
  };

  const handleConfirmPayment = () => {
    if (cart.length === 0) return;

    const newOrder = {
      orderId: 'SH-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      totalPaid: finalTotalPrice,
      method: checkoutForm.method,
      recipient: checkoutForm.name,
      address: checkoutForm.address,
      status: 'Sedang Dikemas 📦'
    };
    
    setOrderHistory(currentOrders => [newOrder, ...currentOrders]);
    setCart([]);
    setDiscountPercent(0);
    setPromoCode('');
    setPromoMessage('');
    setIsQROpen(false);
    setIsSuccessOpen(true);
  };

  // ANIMASI KELUAR (LOGOUT DENGAN GERBANG SEPATU & PELARI)
  const handleLogoutWithAnim = async () => {
    setIsExiting(true);
    await new Promise(r => setTimeout(r, 700)); // Durasi gerbang menutup
    onLogout();
  };

  const bubbles = Array.from({ length: 20 }).map((_, i) => ({
    id: i, left: `${Math.random() * 100}vw`, size: `${Math.random() * 40 + 10}px`,
    duration: `${Math.random() * 5 + 4}s`, delay: `${Math.random() * 5}s`
  }));

  const mainColor = theme === 'aquarium' ? '#0ea5e9' : '#38bdf8';
  const accentColor = theme === 'aquarium' ? '#7dd3fc' : '#a78bfa';
  const bgCard = theme === 'aquarium' ? 'rgba(8, 47, 73, 0.7)' : 'rgba(15, 23, 42, 0.8)';

  return (
    <div className={theme === 'aquarium' ? 'aquarium-bg' : ''} style={{ 
      height: '100vh', overflowY: 'auto', backgroundColor: '#070b14', 
      backgroundImage: theme === 'cyber' ? 'radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.1) 0%, transparent 45%), radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.1) 0%, transparent 45%)' : 'none', 
      color: '#f8fafc', padding: '2.5rem 2rem', fontFamily: 'Inter, system-ui, sans-serif', boxSizing: 'border-box', position: 'relative' 
    }}>
      
      {theme === 'aquarium' && bubbles.map(b => (
        <div key={b.id} className="bubble" style={{ left: b.left, width: b.size, height: b.size, animationDuration: b.duration, animationDelay: b.delay, '--duration': b.duration }}></div>
      ))}

      {/* --- ANIMASI GERBANG SEPATU & PELARI SAAT KELUAR (LOGOUT) --- */}
      {isExiting && (
        <>
          <div className="portal-shoe-gate-left gate-closing-left" style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, #082f49, #0ea5e9)' : '' }}>
            <img src="https://pngimg.com/uploads/running_shoes/running_shoes_PNG5816.png" alt="Gate Left" style={{ width: '180px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(56,189,248,0.7))', animation: 'floatShoe 2s infinite' }} />
            <h3 style={{ color: '#fff', marginTop: '1.5rem', letterSpacing: '2px', fontSize: '1.1rem' }}>KELUAR SESI...</h3>
          </div>
          
          <div className="portal-shoe-gate-right gate-closing-right" style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, #0ea5e9, #082f49)' : '' }}>
            <img src="https://pngimg.com/uploads/men_shoes/men_shoes_PNG7475.png" alt="Gate Right" style={{ width: '180px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(139,92,246,0.7))', animation: 'floatShoe 2s infinite 1s' }} />
            <h3 style={{ color: '#fff', marginTop: '1.5rem', letterSpacing: '2px', fontSize: '1.1rem' }}>SNEAKERHUB</h3>
          </div>

          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://i.giphy.com/media/3oKIPEhWlvCfrAEy7e/giphy.gif" alt="Pelari Kartun" style={{ width: '160px', height: '160px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(56,189,248,0.8))' }} />
          </div>
        </>
      )}

      {notification && (
        <div style={{ position: 'fixed', top: '25px', right: '25px', zIndex: 1200, background: `linear-gradient(135deg, ${mainColor} 0%, #0284c7 100%)`, color: '#070b14', padding: '16px 28px', borderRadius: '16px', fontWeight: '900', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', animation: 'slideUp 0.3s' }}>
          <span>🛒</span> {notification}
        </div>
      )}

      <header style={{ maxWidth: '1280px', margin: '0 auto 2.5rem auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
        <div>
          <span style={{ background: 'rgba(255,255,255,0.1)', color: mainColor, padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>Sesi Aktif: {userData?.email || userData?.username || 'Pengguna'}</span>
          <h1 style={{ margin: '8px 0 0 0', fontSize: '2.2rem', fontWeight: '900' }}>SneakerHub<span style={{ color: mainColor }}>.</span> Store</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={() => setIsGuideOpen(true)} style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${mainColor}`, color: mainColor, padding: '12px 18px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ❓ Panduan
          </button>
          <button onClick={() => setTheme(theme === 'cyber' ? 'aquarium' : 'cyber')} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px 18px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
            {theme === 'cyber' ? '🌊 Akuarium' : '⚡ Cyber'}
          </button>
          <button onClick={() => setIsHistoryOpen(true)} style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.4)', color: accentColor, padding: '12px 18px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
            📦 Riwayat ({orderHistory.length})
          </button>
          <button onClick={() => setIsCartOpen(true)} className={isCartBumping ? 'cart-bounce' : ''} style={{ background: 'rgba(255,255,255,0.1)', border: `1px solid ${mainColor}`, color: mainColor, padding: '12px 22px', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🛒 Keranjang <span style={{ background: mainColor, color: '#070b14', padding: '2px 8px', borderRadius: '20px', fontSize: '0.85rem' }}>{cart.length}</span>
          </button>
          <button onClick={handleLogoutWithAnim} style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#f43f5e' }}>Keluar</button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, rgba(3, 105, 161, 0.8) 0%, rgba(8, 47, 73, 0.9) 100%)' : 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.9) 100%)', backdropFilter: 'blur(20px)', border: `1px solid ${mainColor}`, borderRadius: '28px', padding: '3.5rem 2rem', marginBottom: '3rem', textAlign: 'center', transition: 'all 0.5s' }}>
          <span style={{ color: mainColor, fontWeight: '800', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>⚡ Pilihan Editor</span>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '2.5rem', fontWeight: '900', color: '#f8fafc' }}>{BANNERS[bannerIdx].title}</h2>
          <p style={{ margin: '0 auto', color: '#e2e8f0', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>{BANNERS[bannerIdx].desc}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '25px' }}>
            {BANNERS.map((_, idx) => <div key={idx} style={{ width: idx === bannerIdx ? '25px' : '8px', height: '8px', borderRadius: '10px', backgroundColor: idx === bannerIdx ? mainColor : 'rgba(255,255,255,0.2)' }} />)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.2rem' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[{ key: 'all', label: '🌟 Semua' }, { key: 'sneakers', label: '👟 Sneakers' }, { key: 'formal', label: '👞 Formal' }, { key: 'boots', label: '🥾 Boots' }, { key: 'sport', label: '⚽ Sport' }].map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', backgroundColor: activeCategory === cat.key ? mainColor : 'rgba(255,255,255,0.1)', color: activeCategory === cat.key ? '#070b14' : '#fff', transition: 'all 0.3s' }}>
                {cat.label}
              </button>
            ))}
          </div>
          <input type="text" placeholder="🔍 Cari model impian..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: '#fff', fontSize: '0.95rem', outline: 'none', width: '260px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {filteredProducts.map((item) => (
            <div key={item.id} className="product-card-anim" style={{ background: bgCard, backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '1.8rem', display: 'flex', flexDirection: 'column', transition: 'all 0.4s', cursor: 'pointer' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'; e.currentTarget.style.borderColor = mainColor; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', color: mainColor, fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>{item.tag}</span>
                <span style={{ color: '#fbbf24', fontSize: '0.85rem', fontWeight: 'bold' }}>⭐ {item.rating}</span>
              </div>
              <div style={{ position: 'relative', background: 'rgba(0,0,0,0.2)', height: '180px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <img src={item.img} alt={item.name} style={{ width: '85%', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))' }} />
              </div>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: '800' }}>{item.name}</h4>
              <p style={{ margin: '0 0 1rem 0', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.4' }}>{item.desc}</p>
              <p style={{ margin: 'auto 0 1.5rem 0', color: mainColor, fontSize: '1.25rem', fontWeight: '900' }}>Rp {item.price.toLocaleString('id-ID')}</p>
              <button onClick={() => { setSelectedProduct(item); setChosenSize('40'); setChosenColor('Midnight Black'); }} style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', backgroundColor: mainColor, color: '#070b14', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer' }}>+ Ke Keranjang</button>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL PANDUAN --- */}
      {isGuideOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-anim" style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, #082f49, #0369a1)' : 'linear-gradient(135deg, #0f172a, #1e1b4b)', border: `1px solid ${mainColor}`, borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: mainColor }}>❓ Panduan E-Commerce</h3>
              <button onClick={() => setIsGuideOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <div>🌊 <strong>Tema Akuarium:</strong> Ubah suasana toko menjadi bawah laut lengkap dengan gelembung!</div>
              <div>🎫 <strong>Kupon Diskon:</strong> Gunakan kode <strong>SNEAKERHUB2026</strong> di keranjang.</div>
              <div>📱 <strong>Simulasi GoPay QRIS:</strong> Lakukan checkout untuk memindai QR atas nama Ridho Affandi.</div>
              <div>🚪 <strong>Animasi Keluar:</strong> Tekan tombol Keluar untuk melihat gerbang sepatu dan pelari kartun beraksi.</div>
            </div>
            <button onClick={() => setIsGuideOpen(false)} style={{ width: '100%', padding: '12px', marginTop: '2rem', borderRadius: '12px', background: mainColor, color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Mengerti</button>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL PRODUK --- */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-anim" style={{ background: '#0f172a', border: `1px solid ${mainColor}`, borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '900' }}>Detail Produk</h3>
            <p style={{ margin: '0 0 1.5rem 0', color: mainColor, fontWeight: 'bold' }}>{selectedProduct.name}</p>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>Ukuran (EU)</label>
            <select value={chosenSize} onChange={(e) => setChosenSize(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1.2rem', outline: 'none' }}>
              {['38', '39', '40', '41', '42', '43', '44', '45'].map(sz => <option key={sz} value={sz} style={{ background: '#0f172a' }}>EU {sz}</option>)}
            </select>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>Warna</label>
            <select value={chosenColor} onChange={(e) => setChosenColor(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '2rem', outline: 'none' }}>
              {['Midnight Black', 'Cyber White', 'Electric Blue', 'Crimson Red'].map(col => <option key={col} value={col} style={{ background: '#0f172a' }}>{col}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setSelectedProduct(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
              <button onClick={handleConfirmAddToCart} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: mainColor, color: '#000', fontWeight: '900', cursor: 'pointer' }}>Tambah</button>
            </div>
          </div>
        </div>
      )}

      {/* --- LACI KERANJANG --- */}
      {isCartOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '420px', height: '100vh', background: '#0f172a', borderLeft: `1px solid ${mainColor}`, zIndex: 1250, padding: '2.5rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', boxShadow: '-30px 0 60px rgba(0,0,0,0.8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.2rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>Keranjang ({cart.length})</h3>
            <button onClick={() => setIsCartOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {cart.length > 0 ? cart.map((item) => (
              <div key={item.cartId} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: '0 0 6px 0', fontSize: '1rem' }}>{item.name}</h5>
                  <p style={{ margin: '0 0 4px 0', color: mainColor, fontWeight: '900' }}>Rp {item.price.toLocaleString('id-ID')}</p>
                  <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>EU: <strong>{item.size}</strong> | Warna: <strong>{item.color}</strong></span>
                </div>
                <button onClick={() => setCart(currentCart => currentCart.filter(c => c.cartId !== item.cartId))} style={{ background: 'rgba(244, 63, 94, 0.15)', border: 'none', color: '#f43f5e', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
              </div>
            )) : <div style={{ textAlign: 'center', marginTop: '5rem', color: '#64748b' }}><span style={{ fontSize: '3rem', display: 'block' }}>🛒</span><p>Kosong.</p></div>}
          </div>
          {cart.length > 0 && (
            <div style={{ marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px' }}>Kode Promo (SNEAKERHUB2026)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Masukkan kupon..." value={promoCode} onChange={(e) => setPromoCode(e.target.value)} style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', outline: 'none' }} />
                <button onClick={handleApplyPromo} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: mainColor, color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>Pakai</button>
              </div>
              {promoMessage && <p style={{ margin: '6px 0 0 0', fontSize: '0.75rem', color: discountPercent > 0 ? '#34d399' : '#f43f5e' }}>{promoMessage}</p>}
            </div>
          )}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}><span>Subtotal:</span><span>Rp {subtotalPrice.toLocaleString('id-ID')}</span></div>
            {discountPercent > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem', color: '#34d399' }}><span>Diskon ({discountPercent}%):</span><span>- Rp {discountAmount.toLocaleString('id-ID')}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '1.2rem', fontWeight: '900' }}><span>Total Akhir:</span><span style={{ color: mainColor }}>Rp {finalTotalPrice.toLocaleString('id-ID')}</span></div>
            <button disabled={cart.length === 0} onClick={() => { setIsCartOpen(false); setIsCheckoutFormOpen(true); }} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: cart.length === 0 ? '#475569' : mainColor, color: '#070b14', fontWeight: '900', fontSize: '1.05rem', cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>Checkout</button>
          </div>
        </div>
      )}

      {/* --- MODAL FORM PENGIRIMAN --- */}
      {isCheckoutFormOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={handleProceedToPayment} className="modal-anim" style={{ background: '#0f172a', border: `1px solid ${mainColor}`, borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '450px' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontWeight: '900', color: mainColor }}>Detail Pengiriman</h3>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>Nama Penerima</label>
            <input required type="text" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box' }} />
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>Alamat Lengkap</label>
            <textarea required rows="3" value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.3)', color: '#fff', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box' }}></textarea>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '8px' }}>Metode Pembayaran</label>
            <select disabled value={checkoutForm.method} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', marginBottom: '2rem', outline: 'none', cursor: 'not-allowed' }}>
              <option>E-Wallet (GoPay)</option>
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => { setIsCheckoutFormOpen(false); setIsCartOpen(true); }} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Kembali</button>
              <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: mainColor, color: '#000', fontWeight: '900', cursor: 'pointer' }}>Buat Pesanan</button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL QR CODE GOPAY --- */}
      {isQROpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-anim" style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: `0 0 40px ${mainColor}` }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#00a5cf', fontSize: '1.4rem', fontWeight: '900' }}>GoPay QRIS</h3>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' }}>Pindai QR ini untuk pembayaran</p>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '2px dashed #cbd5e1', display: 'inline-block', marginBottom: '1.5rem' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`GOPAY-RIDHO-AFFANDI-RP${finalTotalPrice}`)}`} alt="QR GoPay" style={{ width: '180px', height: '180px' }} />
            </div>
            <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b' }}>Merchant:</p>
              <p style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#0f172a', fontWeight: 'bold' }}>SneakerHub (Ridho Affandi)</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: '#64748b' }}>Total Tagihan:</p>
              <p style={{ margin: 0, fontSize: '1.3rem', color: '#00a5cf', fontWeight: '900' }}>Rp {finalTotalPrice.toLocaleString('id-ID')}</p>
            </div>
            <button onClick={handleConfirmPayment} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#00a5cf', color: '#fff', fontWeight: '900', fontSize: '1rem', cursor: 'pointer' }}>Saya Sudah Bayar</button>
            <button onClick={() => { setIsQROpen(false); setIsCheckoutFormOpen(true); }} style={{ width: '100%', padding: '12px', marginTop: '10px', background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: 'bold', cursor: 'pointer' }}>Batal</button>
          </div>
        </div>
      )}

      {/* --- MODAL SUKSES --- */}
      {isSuccessOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', zIndex: 1400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-anim" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', border: `2px solid ${mainColor}`, borderRadius: '30px', padding: '3rem 2rem', width: '100%', maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: '#f8fafc' }}>Pembayaran Diterima!</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5' }}>Dana berhasil masuk ke e-wallet <strong>Ridho Affandi</strong>. Pesanan diproses!</p>
            <button onClick={() => setIsSuccessOpen(false)} style={{ width: '100%', padding: '15px', borderRadius: '14px', border: 'none', backgroundColor: mainColor, color: '#000', fontWeight: '900', fontSize: '1rem', cursor: 'pointer' }}>Lihat Riwayat</button>
          </div>
        </div>
      )}

      {/* --- MODAL RIWAYAT --- */}
      {isHistoryOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1350, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-anim" style={{ background: '#0f172a', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '28px', padding: '2rem', width: '100%', maxWidth: '550px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>📦 Riwayat Pesanan ({orderHistory.length})</h3>
              <button onClick={() => setIsHistoryOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orderHistory.length > 0 ? orderHistory.map((ord) => (
                <div key={ord.orderId} style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: mainColor, fontWeight: 'bold' }}>{ord.orderId}</span>
                    <span style={{ color: '#cbd5e1' }}>{ord.date}</span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#a78bfa' }}>Status: <strong>{ord.status}</strong></p>
                  {ord.recipient && <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#cbd5e1' }}>Penerima: {ord.recipient}</p>}
                  <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {ord.items.map((item) => (
                      <span key={item.cartId} style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                        &bull; {item.name} (EU {item.size}, {item.color})
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: '10px', textAlign: 'right', fontWeight: '900', color: mainColor }}>Total: Rp {ord.totalPaid.toLocaleString('id-ID')}</div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b' }}>
                  <span style={{ fontSize: '3rem', display: 'block' }}>📦</span>
                  <p>Belum ada pesanan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}