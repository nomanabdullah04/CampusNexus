import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { privateAPI, publicAPI } from '../api/api';
import { useUser } from '../context/UserContext';

// ─── Forgot Password Modal ───────────────────────────────────────────────────
const ForgotPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendReset = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your university email'); return; }
    if (!email.endsWith('@cou.ac.bd')) {
      setError('Only Comilla University (@cou.ac.bd) emails are accepted');
      return;
    }
    setLoading(true);
    try {
      // Check if user exists via the API (login with wrong password to test)
      // We call a dedicated reset endpoint if available, else simulate
      await publicAPI.post('/auth/check-email', { email }).catch(() => {});
      setStep('reset');
    } catch (err) {
      setStep('reset'); // Still proceed to reset form
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await publicAPI.post('/auth/reset-password', { email, newPassword });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'white', borderRadius: '1.25rem',
        padding: '2rem', width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {step !== 'done' && (
            <button
              onClick={step === 'reset' ? () => setStep('email') : onClose}
              style={{ background: 'var(--color-ash)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowLeft size={18} color="var(--color-forest)" />
            </button>
          )}
          <div>
            <h2 style={{ color: 'var(--color-forest)', margin: 0, fontSize: '1.25rem' }}>
              {step === 'done' ? 'Password Reset' : 'Forgot Password?'}
            </h2>
            <p style={{ color: 'var(--color-slate)', margin: 0, fontSize: '0.8rem' }}>
              {step === 'email' ? 'Enter your university email to proceed' : step === 'reset' ? 'Set your new password' : ''}
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Step 1: Enter email */}
        {step === 'email' && (
          <form onSubmit={handleSendReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">University Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@cou.ac.bd"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '2.75rem' }}
                  id="forgot-email"
                  autoFocus
                />
              </div>
              <span className="form-hint">Must be a Comilla University (@cou.ac.bd) email</span>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="forgot-continue-btn">
              {loading ? 'Checking...' : 'Continue'}
            </button>
            <button type="button" className="btn btn-outline btn-full" onClick={onClose} style={{ marginTop: '-0.25rem' }}>
              Cancel
            </button>
          </form>
        )}

        {/* Step 2: Set new password */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--color-pearl)', borderRadius: 'var(--radius-md)', padding: '0.75rem', fontSize: '0.85rem', color: 'var(--color-slate)' }}>
              Resetting password for: <strong style={{ color: 'var(--color-forest)' }}>{email}</strong>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '2.75rem' }}
                  id="new-password"
                  autoFocus
                />
              </div>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '2.75rem' }}
                  id="confirm-password"
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} id="reset-password-btn">
              {loading ? 'Resetting...' : <><KeyRound size={18} /> Reset Password</>}
            </button>
          </form>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={56} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--color-forest)', marginBottom: '0.5rem' }}>Password Reset Successful!</h3>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <button className="btn btn-primary btn-full" onClick={onClose} id="done-btn">
              <LogIn size={18} /> Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Sign In Page ───────────────────────────────────────────────────────
const Sign = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useUser();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address'); return; }
    setLoading(true);
    try {
      const res = await publicAPI.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      await fetchUser();
      navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('⚠️ Cannot connect to the server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="auth-page">
        <div className="auth-card slide-up">
          <div className="auth-logo">
            <h1>Campus<span>Nexus</span></h1>
            <p>Sign in to continue to CampusNexus</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '2.75rem' }}
                  id="sign-in-email"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-sage)', fontSize: '0.8125rem',
                    fontWeight: 600, padding: 0, textDecoration: 'underline',
                  }}
                  id="forgot-password-link"
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-sage)' }} />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  style={{ paddingLeft: '2.75rem' }}
                  id="sign-in-password"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} id="sign-in-btn" style={{ marginTop: '1.5rem' }}>
              {loading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>

          <hr className="divider" />

          <p style={{ textAlign: 'center', color: 'var(--color-slate)' }}>
            Don't have an account?{' '}
            <Link to="/sign-up" style={{ color: 'var(--color-forest)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Sign;
