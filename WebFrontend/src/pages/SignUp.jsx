import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';
import { publicAPI } from '../api/api';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (!name.trim() || !email.trim() || !password.trim()) { setError('Please fill in all fields'); return false; }
    if (name.trim().length < 2) { setError('Name must be at least 2 characters long'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address'); return false; }
    if (!email.trim().endsWith('@cou.ac.bd')) { setError('Only Comilla University emails are accepted (e.g. 123456@cou.ac.bd)'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters long'); return false; }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      await publicAPI.post('/auth/register', { name: name.trim(), email: email.trim(), password });
      setSuccess('Account created successfully! Welcome to CampusNexus!');
      setTimeout(() => navigate('/sign-in'), 2000);
    } catch (err) {
      if (!err.response) {
        setError('⚠️ Cannot connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-up">
        <div className="auth-logo">
          <h1>Campus<span>Nexus</span></h1>
          <p>Join CampusNexus today</p>
        </div>

        {error && <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} /> {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
              <input type="text" className="form-input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} style={{ paddingLeft: '2.75rem' }} id="signup-name" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
              <input type="email" className="form-input" placeholder="e.g. 123456@cou.ac.bd" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} style={{ paddingLeft: '2.75rem' }} id="signup-email" />
            </div>
            <span className="form-hint">⚠️ Only Comilla University emails accepted (e.g. <strong>123456@cou.ac.bd</strong>)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
              <input type="password" className="form-input" placeholder="Create a password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} style={{ paddingLeft: '2.75rem' }} id="signup-password" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="signup-btn" style={{ marginTop: '1.5rem' }}>
            {loading ? 'Creating Account...' : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-slate)', margin: '1rem 0' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
        <hr className="divider" />
        <p style={{ textAlign: 'center', color: 'var(--color-slate)' }}>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
