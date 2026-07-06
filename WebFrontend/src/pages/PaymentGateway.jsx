import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import { CreditCard, ShieldCheck, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const amountStr = searchParams.get('amount') || '0.00';
  const amount = parseFloat(amountStr);

  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [accountNumber, setAccountNumber] = useState('');
  const [pin, setPin] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
    }
  }, [user]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Form validations
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad') {
      if (!accountNumber || accountNumber.length < 11) {
        setError('Please enter a valid 11-digit mobile number.');
        setLoading(false);
        return;
      }
      const minPinLength = paymentMethod === 'bkash' ? 5 : 4;
      if (!pin || pin.length < minPinLength) {
        setError(`Please enter a valid ${minPinLength}-digit PIN.`);
        setLoading(false);
        return;
      }
    } else {
      if (!cardName) {
        setError('Please enter Cardholder Name.');
        setLoading(false);
        return;
      }
      if (!cardNumber || cardNumber.length < 16) {
        setError('Please enter a valid 16-digit card number.');
        setLoading(false);
        return;
      }
      if (!expiry || !cvv || cvv.length < 3) {
        setError('Please enter valid expiry date and CVV.');
        setLoading(false);
        return;
      }
    }

    try {
      const methodName = paymentMethod.toUpperCase();
      // 1. Simulate the external payment transaction by depositing the checkout amount to the wallet balance
      await privateAPI.post('/wallet/deposit', {
        amount,
        method: methodName,
      });

      // 2. Perform the checkout on the cart
      const res = await privateAPI.post('/cart/checkout');
      if (res.data.success) {
        setSuccess(`🎉 Payment via ${methodName} completed successfully! Cart has been checked out.`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Checkout Payment</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8125rem' }}>Secure external payment gateway</p>
        </div>
      </div>

      <div className="page-content-narrow" style={{ paddingBottom: '3rem' }}>
        <div className="card mb-4" style={{ border: '2px solid var(--color-forest)' }}>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)', fontWeight: 600 }}>Amount to Pay</span>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-forest)', margin: '0.5rem 0', fontWeight: 800 }}>
              ৳{amount.toFixed(2)}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', color: '#059669', fontSize: '0.8125rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 256-bit Secure Encryption
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error mb-3">{error}</div>}
        {success && <div className="alert alert-success mb-3">{success}</div>}

        <div className="card mb-4">
          <div className="card-body">
            <h3 style={{ margin: '0 0 1.25rem', color: 'var(--color-forest)', fontSize: '1.125rem' }}>Choose Payment Option</h3>

            {/* Payment Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'bkash' ? '2px solid #E2136E' : '1px solid var(--color-ash)',
                  background: paymentMethod === 'bkash' ? '#FFF0F5' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 600,
                  color: paymentMethod === 'bkash' ? '#E2136E' : 'var(--color-forest)'
                }}
              >
                <Smartphone size={20} /> bKash
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'nagad' ? '2px solid #F04A23' : '1px solid var(--color-ash)',
                  background: paymentMethod === 'nagad' ? '#FFF5F2' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 600,
                  color: paymentMethod === 'nagad' ? '#F04A23' : 'var(--color-forest)'
                }}
              >
                <Smartphone size={20} /> Nagad
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'card' ? '2px solid var(--color-forest)' : '1px solid var(--color-ash)',
                  background: paymentMethod === 'card' ? 'var(--color-pearl)' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 600,
                  color: paymentMethod === 'card' ? 'var(--color-forest)' : 'var(--color-forest)'
                }}
              >
                <CreditCard size={20} /> Card
              </button>
            </div>

            {/* Payment forms */}
            <form onSubmit={handlePaymentSubmit}>
              {paymentMethod === 'bkash' && (
                <div style={{ background: '#FFF0F5', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #FFD1E1', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, color: '#E2136E', fontSize: '1.125rem' }}>bKash Payment</span>
                    <span style={{ fontSize: '0.75rem', color: '#E2136E', border: '1px solid #E2136E', borderRadius: '4px', padding: '1px 6px', fontWeight: 600 }}>SIMULATOR</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#E2136E' }}>bKash Account Number *</label>
                    <input className="form-input" type="text" placeholder="e.g. 017XXXXXXXX" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))} maxLength={11} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#E2136E' }}>bKash PIN *</label>
                    <input className="form-input" type="password" placeholder="e.g. 5-Digit PIN" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} maxLength={5} required />
                  </div>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div style={{ background: '#FFF5F2', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #FFDDD5', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, color: '#F04A23', fontSize: '1.125rem' }}>Nagad Payment</span>
                    <span style={{ fontSize: '0.75rem', color: '#F04A23', border: '1px solid #F04A23', borderRadius: '4px', padding: '1px 6px', fontWeight: 600 }}>SIMULATOR</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#F04A23' }}>Nagad Account Number *</label>
                    <input className="form-input" type="text" placeholder="e.g. 017XXXXXXXX" value={accountNumber} onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ''))} maxLength={11} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#F04A23' }}>Nagad PIN *</label>
                    <input className="form-input" type="password" placeholder="e.g. 4-Digit PIN" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} maxLength={4} required />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Cardholder Name *</label>
                    <input className="form-input" type="text" placeholder="e.g. John Doe" value={cardName} onChange={e => setCardName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Card Number *</label>
                    <input className="form-input" type="text" placeholder="1234 5678 1234 5678" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))} maxLength={16} required />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">Expiry Date *</label>
                      <input className="form-input" type="text" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} maxLength={5} required />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label className="form-label">CVV *</label>
                      <input className="form-input" type="password" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ''))} maxLength={3} required />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-sage"
                style={{ width: '100%', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
                disabled={loading}
              >
                {loading ? 'Processing Secure Payment...' : (
                  <>
                    <span>Confirm & Pay ৳{amount.toFixed(2)}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
