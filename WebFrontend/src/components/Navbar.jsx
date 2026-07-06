import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Calendar, PlusCircle, User, Menu, X, LayoutDashboard, ClipboardList, ShoppingCart, MessageCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, clearUser } = useUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    clearUser();
    navigate('/');
    setMenuOpen(false);
  };

  const publicLinks = [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/products', label: 'Products', icon: <ShoppingBag size={18} /> },
    { to: '/events', label: 'Events', icon: <Calendar size={18} /> },
  ];

  const protectedLinks = [
    { to: '/post', label: 'Post', icon: <PlusCircle size={18} /> },
    { to: '/rentals', label: 'Rentals', icon: <ClipboardList size={18} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/profile', label: 'Profile', icon: <User size={18} /> },
    { to: '/cart', label: 'Cart', icon: <ShoppingCart size={18} /> },
    { to: '/chat', label: 'Chat', icon: <MessageCircle size={18} /> },
  ];

  const links = user ? [...publicLinks, ...protectedLinks] : publicLinks;

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        Campus<span>Nexus</span>
      </NavLink>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
        {user ? (
          <button className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/sign-in" className="btn btn-sage btn-sm" onClick={() => setMenuOpen(false)}>
            Sign In
          </NavLink>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <NotificationBell />
        <button className="navbar-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
