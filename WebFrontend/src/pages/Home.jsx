import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, GraduationCap, Wrench, Calendar, Search } from 'lucide-react';
import Slider from '../components/Slider';
import FeaturedItemCard from '../components/FeaturedItemCard';
import { useUser } from '../context/UserContext';

const categories = [
  { label: 'Marketplace', icon: <ShoppingBag />, to: '/products?selling=SELL' },
  { label: 'Academia', icon: <GraduationCap />, to: '/products?category=BOOKS' },
  { label: 'Skills', icon: <Wrench />, to: '/products' },
  { label: 'Events', icon: <Calendar />, to: '/events' },
];

const Home = () => {
  const { user } = useUser();

  return (
    <div className="page-layout">
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-forest) 0%, #3a5a4e 100%)', padding: '2.5rem 1.5rem 2rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
          Campus<span style={{ color: 'var(--color-mint)' }}>Nexus</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Stay connected with your campus community
        </p>
        {user && (
          <p style={{ color: 'var(--color-mint)', fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
            Welcome back, {user.name}! 👋
          </p>
        )}
        {/* Search Bar */}
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <Link to="/products">
            <div className="search-bar" style={{ background: 'rgba(255,255,255,0.95)', cursor: 'pointer' }}>
              <Search size={20} />
              <span style={{ color: 'var(--color-slate)', flex: 1 }}>Search campus resources...</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Slider */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Slider />
      </div>

      {/* Content */}
      <div className="page-content">
        {/* Categories */}
        <section className="mb-8">
          <h2 style={{ color: 'var(--color-forest)', marginBottom: '1rem' }}>Categories</h2>
          <div className="category-grid">
            {categories.map((cat) => (
              <Link key={cat.label} to={cat.to} className="category-card">
                {cat.icon}
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Items */}
        <FeaturedItemCard />
      </div>
    </div>
  );
};

export default Home;
