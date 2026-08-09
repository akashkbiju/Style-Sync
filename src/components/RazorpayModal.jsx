import React, { useState } from 'react';
import { CreditCard, QrCode, Building2, Banknote, ShieldCheck, CheckCircle2, Loader2, X } from 'lucide-react';

export const RazorpayModal = ({ bookingDetails, onPaymentSuccess, onClose }) => {
  const [method, setMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const razorpayPaymentId = `pay_RZP${Math.floor(10000000 + Math.random() * 90000000)}`;
      onPaymentSuccess({
        id: razorpayPaymentId,
        method: method === 'upi' ? 'Razorpay UPI' : method === 'card' ? 'Razorpay Card' : method === 'netbanking' ? 'Razorpay NetBanking' : 'Cash on Service'
      });
    }, 1800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', padding: 0, overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
        
        {/* Razorpay Branded Top Header */}
        <div style={{ background: 'linear-gradient(135deg, #0c2340 0%, #1a365d 100%)', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#3395ff', color: '#fff', padding: '0.4rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              Razorpay
            </div>
            <div>
              <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', fontSize: '0.7rem' }}>
                TEST MODE
              </span>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff', marginTop: '0.2rem' }}>StyleSync Salon Checkout</h4>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Payment Summary */}
        <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Amount Payable</div>
            <div className="gold-text font-serif" style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{bookingDetails?.amount}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{bookingDetails?.serviceTitle}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{bookingDetails?.type === 'home-service' ? '🏡 Home Service Visit' : '✂️ In-Shop Appointment'}</div>
          </div>
        </div>

        {/* Payment Methods Selection */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Select Payment Method</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <button 
              onClick={() => setMethod('upi')}
              style={{
                background: method === 'upi' ? 'rgba(51, 149, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                border: method === 'upi' ? '1px solid #3395ff' : '1px solid var(--border-subtle)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: method === 'upi' ? '#60a5fa' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <QrCode size={18} /> UPI (GPay/PhonePe)
            </button>

            <button 
              onClick={() => setMethod('card')}
              style={{
                background: method === 'card' ? 'rgba(51, 149, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                border: method === 'card' ? '1px solid #3395ff' : '1px solid var(--border-subtle)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: method === 'card' ? '#60a5fa' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <CreditCard size={18} /> Cards
            </button>

            <button 
              onClick={() => setMethod('netbanking')}
              style={{
                background: method === 'netbanking' ? 'rgba(51, 149, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                border: method === 'netbanking' ? '1px solid #3395ff' : '1px solid var(--border-subtle)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: method === 'netbanking' ? '#60a5fa' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <Building2 size={18} /> NetBanking
            </button>

            <button 
              onClick={() => setMethod('cash')}
              style={{
                background: method === 'cash' ? 'rgba(51, 149, 255, 0.15)' : 'rgba(255,255,255,0.04)',
                border: method === 'cash' ? '1px solid #3395ff' : '1px solid var(--border-subtle)',
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: method === 'cash' ? '#60a5fa' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <Banknote size={18} /> Cash on Service
            </button>
          </div>

          {/* Details Form based on method */}
          {method === 'upi' && (
            <div className="form-group">
              <label className="form-label">Virtual Payment Address (VPA / UPI ID)</label>
              <input 
                type="text" 
                className="form-input" 
                value={upiId} 
                onChange={(e) => setUpiId(e.target.value)} 
                placeholder="e.g. 9876543210@paytm"
              />
            </div>
          )}

          {method === 'card' && (
            <div>
              <div className="form-group">
                <label className="form-label">Card Number (Razorpay Test Mode)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={cardNumber} 
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Expiry</label>
                  <input type="text" className="form-input" value="12/28" readOnly />
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input type="text" className="form-input" value="123" readOnly />
                </div>
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div className="form-group">
              <label className="form-label">Select Bank</label>
              <select className="form-select">
                <option>HDFC Bank (Test)</option>
                <option>ICICI Bank (Test)</option>
                <option>State Bank of India (Test)</option>
                <option>Axis Bank (Test)</option>
              </select>
            </div>
          )}

          {method === 'cash' && (
            <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fbbf24', marginBottom: '1rem' }}>
              💡 Payment of ₹{bookingDetails?.amount} will be collected in cash by our stylist upon service completion.
            </div>
          )}

          {/* Secure Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem', justifyContent: 'center' }}>
            <ShieldCheck size={16} color="#10b981" /> 256-Bit SSL Encrypted Razorpay Test Gateway
          </div>

          {/* Action Button */}
          <button 
            onClick={handlePayNow} 
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: 'linear-gradient(135deg, #3395ff 0%, #1d4ed8 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(51, 149, 255, 0.3)'
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Processing Razorpay Transaction...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} /> Complete Payment (₹{bookingDetails?.amount})
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
