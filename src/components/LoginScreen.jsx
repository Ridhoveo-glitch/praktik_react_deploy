import React, { useState, useEffect } from 'react';

const FOOTWEAR_TYPES = {
  sneakers: { name: 'Nike Air Max', img: 'https://pngimg.com/uploads/running_shoes/running_shoes_PNG5816.png' },
  formal: { name: 'Oxford Leather', img: 'https://pngimg.com/uploads/men_shoes/men_shoes_PNG7475.png' },
  boots: { name: 'Tough Trekker', img: 'https://pngimg.com/uploads/boots/boots_PNG7797.png' },
  sport: { name: 'Pro Cleats', img: 'https://pngimg.com/uploads/running_shoes/running_shoes_PNG5818.png' }
};

function DraggableObject({ children, startX, startY, isAqua }) {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => { setPos({ x: startX, y: startY }); }, [startX, startY, isAqua]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (isDragging) setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={!isDragging && isAqua ? "shoe-animated" : ""}
      style={{
        position: 'absolute', left: pos.x, top: pos.y,
        cursor: isDragging ? 'grabbing' : 'grab', zIndex: isDragging ? 100 : 10,
        touchAction: 'none', transition: isDragging ? 'none' : 'transform 0.2s', userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
}

export default function LoginScreen({ onLoginSuccess }) {
  const [type, setType] = useState('sneakers');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayPassword, setDisplayPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [hideContent, setHideContent] = useState(false);
  const [gateState, setGateState] = useState('idle');

  const [theme, setTheme] = useState('cyber');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    if (!password) return setDisplayPassword('');
    let i = 0;
    const int = setInterval(() => {
      setDisplayPassword(password.split('').map((_, j) => j < i ? '•' : '*&#@'[Math.floor(Math.random()*4)]).join(''));
      if (i++ >= password.length) clearInterval(int);
    }, 40);
    return () => clearInterval(int);
  }, [password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setIsLoading(false);
    
    setGateState('closing');
    await new Promise(r => setTimeout(r, 600));
    setHideContent(true); 
    setGateState('opening');

    setTimeout(() => {
      onLoginSuccess({ username: email.split('@')[0] || 'Pengguna', email, modelName: FOOTWEAR_TYPES[type].name, target: 'umum' });
    }, 300);
  };

  const isMobile = window.innerWidth < 768;
  const leftX = isMobile ? 10 : window.innerWidth * 0.05;
  const rightX = isMobile ? window.innerWidth - 130 : window.innerWidth * 0.82;

  const bubbles = Array.from({ length: 15 }).map((_, i) => ({
    id: i, left: `${Math.random() * 100}vw`, size: `${Math.random() * 40 + 10}px`,
    duration: `${Math.random() * 5 + 4}s`, delay: `${Math.random() * 5}s`
  }));

  const mainColor = theme === 'aquarium' ? '#0ea5e9' : '#38bdf8';

  return (
    <div className={`sneaker-bg-wrapper ${theme === 'aquarium' ? 'aquarium-bg' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
      
      <button onClick={() => setTheme(theme === 'cyber' ? 'aquarium' : 'cyber')} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 110, padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(0,0,0,0.5)', color: '#fff', cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)' }}>
        {theme === 'cyber' ? '🌊 Akuarium' : '⚡ Cyber'}
      </button>

      <button onClick={() => setIsGuideOpen(true)} style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 110, padding: '10px 20px', borderRadius: '30px', border: `1px solid ${mainColor}`, background: 'rgba(0,0,0,0.5)', color: mainColor, cursor: 'pointer', fontWeight: 'bold', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>❓</span> Panduan
      </button>

      {theme === 'aquarium' ? bubbles.map(b => (
        <div key={b.id} className="bubble" style={{ left: b.left, width: b.size, height: b.size, animationDuration: b.duration, animationDelay: b.delay, '--duration': b.duration }}></div>
      )) : (
        <><div className="neon-orb orb-1"></div><div className="neon-orb orb-2"></div></>
      )}

      {/* Sepatu Draggable */}
      <DraggableObject startX={leftX} startY={window.innerHeight * 0.2} isAqua={theme === 'aquarium'}>
        <div className="moving-shoe-card" style={{ background: theme === 'aquarium' ? 'rgba(3, 105, 161, 0.4)' : '' }}>
          <img src={FOOTWEAR_TYPES.formal.img} alt="Formal" style={{ width: '110px', height: '75px', objectFit: 'contain', pointerEvents: 'none' }} />
          <span style={{ fontSize: '0.75rem', color: theme === 'aquarium' ? '#bae6fd' : '#38bdf8', fontWeight: '800', display: 'block', pointerEvents: 'none' }}>Formal</span>
        </div>
      </DraggableObject>

      <DraggableObject startX={leftX} startY={window.innerHeight * 0.6} isAqua={theme === 'aquarium'}>
        <div className="moving-shoe-card" style={{ background: theme === 'aquarium' ? 'rgba(3, 105, 161, 0.4)' : '' }}>
          <img src={FOOTWEAR_TYPES.sneakers.img} alt="Sneakers" style={{ width: '110px', height: '75px', objectFit: 'contain', pointerEvents: 'none' }} />
          <span style={{ fontSize: '0.75rem', color: theme === 'aquarium' ? '#bae6fd' : '#a78bfa', fontWeight: '800', display: 'block', pointerEvents: 'none' }}>Sneakers</span>
        </div>
      </DraggableObject>

      <DraggableObject startX={rightX} startY={window.innerHeight * 0.2} isAqua={theme === 'aquarium'}>
        <div className="moving-shoe-card" style={{ background: theme === 'aquarium' ? 'rgba(3, 105, 161, 0.4)' : '' }}>
          <img src={FOOTWEAR_TYPES.boots.img} alt="Boots" style={{ width: '110px', height: '75px', objectFit: 'contain', pointerEvents: 'none' }} />
          <span style={{ fontSize: '0.75rem', color: theme === 'aquarium' ? '#bae6fd' : '#34d399', fontWeight: '800', display: 'block', pointerEvents: 'none' }}>Boots</span>
        </div>
      </DraggableObject>

      <DraggableObject startX={rightX} startY={window.innerHeight * 0.6} isAqua={theme === 'aquarium'}>
        <div className="moving-shoe-card" style={{ background: theme === 'aquarium' ? 'rgba(3, 105, 161, 0.4)' : '' }}>
          <img src={FOOTWEAR_TYPES.sport.img} alt="Sport" style={{ width: '110px', height: '75px', objectFit: 'contain', pointerEvents: 'none' }} />
          <span style={{ fontSize: '0.75rem', color: theme === 'aquarium' ? '#bae6fd' : '#fbbf24', fontWeight: '800', display: 'block', pointerEvents: 'none' }}>Sport</span>
        </div>
      </DraggableObject>

      <div className={`login-card ${hideContent ? 'hide-content' : ''}`} style={{ background: theme === 'aquarium' ? 'rgba(8, 47, 73, 0.7)' : 'rgba(11, 17, 32, 0.85)', borderColor: theme === 'aquarium' ? '#0ea5e9' : 'rgba(56,189,248,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ background: theme === 'aquarium' ? 'rgba(2, 132, 199, 0.3)' : 'rgba(56, 189, 248, 0.15)', color: theme === 'aquarium' ? '#7dd3fc' : '#38bdf8', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            {theme === 'aquarium' ? 'Undersea V2.6' : 'Cyber-Athletic V2.6'}
          </span>
          <h2 style={{ color: '#f8fafc', margin: '8px 0 4px 0', fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
            SneakerHub<span style={{ color: mainColor }}>.</span>
          </h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>Pilih Model & Autentikasi Sesi</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          {Object.keys(FOOTWEAR_TYPES).map((cat) => (
            <button key={cat} type="button" onClick={() => setType(cat)} style={{ flex: 1, padding: '9px 0', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.8rem', textTransform: 'capitalize', backgroundColor: type === cat ? mainColor : 'rgba(255,255,255,0.04)', color: type === cat ? '#070b14' : '#94a3b8', transition: 'all 0.3s' }}>
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', height: '150px', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <img src={FOOTWEAR_TYPES[type].img} alt="Pilihan" className="shoe-animated" style={{ maxWidth: '230px', height: '120px', objectFit: 'contain' }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Akses" style={{ width: '100%', padding: '13px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
          
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: '13px 16px', pointerEvents: 'none', fontFamily: 'monospace', fontSize: '0.95rem', letterSpacing: '2px', color: '#fff', display: 'flex', alignItems: 'center', zIndex: 2 }}>
              {displayPassword || <span style={{ color: '#64748b', letterSpacing: 'normal', fontFamily: 'system-ui' }}>Kata Sandi...</span>}
            </div>
            <input 
              type="text" required value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ 
                width: '100%', padding: '13px 16px', borderRadius: '14px', 
                border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', 
                fontFamily: 'monospace', fontSize: '0.95rem', color: 'transparent', 
                caretColor: mainColor, outline: 'none', boxSizing: 'border-box', 
                position: 'relative', zIndex: 3 
              }} 
            />
          </div>

          <button type="submit" disabled={isLoading || gateState !== 'idle' || !email || !password} style={{ width: '100%', padding: '15px', borderRadius: '14px', backgroundColor: isLoading ? '#64748b' : mainColor, color: '#070b14', border: 'none', fontWeight: '900', fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.3s' }}>
            {isLoading ? 'Memuat...' : gateState !== 'idle' ? 'Membuka Portal...' : 'Masuk ke Platform'}
          </button>
        </form>
      </div>

      {isGuideOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-anim" style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, #082f49, #0369a1)' : 'linear-gradient(135deg, #0f172a, #1e1b4b)', border: `1px solid ${mainColor}`, borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: mainColor }}>❓ Panduan Fitur Login</h3>
              <button onClick={() => setIsGuideOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.5' }}>
              <div>🏃‍♂️ <strong>Animasi Pelari Kartun:</strong> Saat login, karakter pelari kartun akan berlari melintasi gerbang portal menyambut Anda!</div>
              <div>🚪 <strong>Gerbang Portal Sepatu:</strong> Pintu portal dengan ilustrasi sepatu merapat dan membuka mulus ke toko!</div>
              <div>👆 <strong>Drag & Drop:</strong> Sepatu di sisi layar bisa digeser ke mana saja.</div>
            </div>
            <button onClick={() => setIsGuideOpen(false)} style={{ width: '100%', padding: '12px', marginTop: '2rem', borderRadius: '12px', background: mainColor, color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Tutup</button>
          </div>
        </div>
      )}

      {/* GERBANG PORTAL DENGAN ANIMASI PELARI KARTUN */}
      {gateState !== 'idle' && (
        <>
          <div className={`portal-shoe-gate-left ${gateState === 'closing' ? 'gate-closing-left' : 'gate-opening-left'}`} style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, #082f49, #0ea5e9)' : '' }}>
            <img src={FOOTWEAR_TYPES[type].img} alt="Gate Left" style={{ width: '180px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(56,189,248,0.7))', animation: 'floatShoe 2s infinite' }} />
            <h3 style={{ color: '#fff', marginTop: '1.5rem', letterSpacing: '2px', fontSize: '1.1rem' }}>MENYIAPKAN SESI...</h3>
          </div>
          
          <div className={`portal-shoe-gate-right ${gateState === 'closing' ? 'gate-closing-right' : 'gate-opening-right'}`} style={{ background: theme === 'aquarium' ? 'linear-gradient(135deg, #0ea5e9, #082f49)' : '' }}>
            <img src={FOOTWEAR_TYPES.formal.img} alt="Gate Right" style={{ width: '180px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 25px rgba(139,92,246,0.7))', animation: 'floatShoe 2s infinite 1s' }} />
            <h3 style={{ color: '#fff', marginTop: '1.5rem', letterSpacing: '2px', fontSize: '1.1rem' }}>SNEAKERHUB</h3>
          </div>

          {/* KARAKTER KARTUN ORANG LARI DI TENGAH GERBANG */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              src="https://i.giphy.com/media/3oKIPEhWlvCfrAEy7e/giphy.gif" 
              alt="Pelari Kartun" 
              style={{ width: '160px', height: '160px', objectFit: 'contain', filter: 'drop-shadow(0 0 15px rgba(56,189,248,0.8))' }} 
            />
          </div>
        </>
      )}

    </div>
  );
}