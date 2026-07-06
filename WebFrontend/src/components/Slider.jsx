import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    url: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Campus Marketplace',
    subtitle: 'Buy, Sell & Rent with fellow students',
    gradient: 'linear-gradient(135deg, #2D473E 0%, #40916C 100%)',
  },
  {
    url: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Academic Resources',
    subtitle: 'Find books, notes and more for your studies',
    gradient: 'linear-gradient(135deg, #1B4332 0%, #52B788 100%)',
  },
  {
    url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Campus Events',
    subtitle: 'Never miss what is happening on campus',
    gradient: 'linear-gradient(135deg, #2D473E 0%, #74C69D 100%)',
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className="slider-container">
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
        {/* Gradient background fallback */}
        <div style={{
          position: 'absolute', inset: 0,
          background: slide.gradient,
          zIndex: 0,
        }} />
        {/* Slide image */}
        {!imgError[current] && (
          <img
            key={current}
            src={slide.url}
            alt={slide.title}
            className="slider-image fade-in"
            style={{ display: 'block', position: 'relative', zIndex: 1, opacity: 0.92 }}
            onError={() => setImgError(prev => ({ ...prev, [current]: true }))}
          />
        )}
        {/* If image failed, show a styled gradient block */}
        {imgError[current] && (
          <div style={{
            width: '100%', height: 220,
            background: slide.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1,
          }}>
            <span style={{ fontSize: '3rem' }}>🎓</span>
          </div>
        )}
        {/* Caption overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          background: 'linear-gradient(to top, rgba(45,71,62,0.90), transparent)',
          padding: '1.5rem 1.5rem 1rem',
          color: 'white',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.2rem' }}>{slide.title}</h3>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>{slide.subtitle}</p>
        </div>
        {/* Prev button */}
        <button
          onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
          style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
        >
          <ChevronLeft size={20} />
        </button>
        {/* Next button */}
        <button
          onClick={() => setCurrent((c) => (c + 1) % slides.length)}
          style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 3, background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="slider-dots">
        {slides.map((_, i) => (
          <button key={i} className={`slider-dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
