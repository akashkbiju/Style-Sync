import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  X, 
  Lock, 
  Smartphone, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ArrowRight,
  Zap,
  CheckCircle
} from 'lucide-react';

export const RazorpayModal = ({ bookingDetails, onPaymentSuccess, onClose }) => {
  const [method, setMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cash'
  const [upiSubMode, setUpiSubMode] = useState('qr'); // 'qr' | 'id'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [completedPaymentData, setCompletedPaymentData] = useState(null);

  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [errorMessage, setErrorMessage] = useState('');

  // Timer countdown for QR freshness simulation
  const [qrSeconds, setQrSeconds] = useState(300);

  useEffect(() => {
    if (qrSeconds <= 0) return;
    const timer = setInterval(() => {
      setQrSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [qrSeconds]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const amount = Number(bookingDetails?.amount) || 299;
  const merchantName = import.meta.env.VITE_UPI_MERCHANT_NAME || "StyleSync Salon";
  const merchantUpiId = import.meta.env.VITE_UPI_ID || "stylesync.salon@okaxis";
  const defaultQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&color=09090b&bgcolor=ffffff&data=${encodeURIComponent(`upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`)}`;
  const qrCodeUrl = import.meta.env.VITE_UPI_QR_IMAGE || defaultQrUrl;

  // Handle successful payment flow with celebratory animation
  const triggerSuccessSequence = (paymentData) => {
    setCompletedPaymentData(paymentData);
    setIsProcessing(false);
    setShowSuccessScreen(true);

    // Keep the celebration animation visible for 2.6 seconds, then transition to booking ticket
    setTimeout(() => {
      onPaymentSuccess(paymentData);
    }, 2600);
  };

  const handleSimulateUpiScan = () => {
    setIsProcessing(true);
    setProcessStep('Connecting with UPI gateway...');
    
    setTimeout(() => {
      setProcessStep('Verifying merchant QR scan...');
    }, 700);

    setTimeout(() => {
      setProcessStep('Authorizing zero-deduct transaction...');
    }, 1300);

    setTimeout(() => {
      const simulatedPaymentId = `pay_upi_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
      const utrNumber = `${Math.floor(400000000000 + Math.random() * 599999999999)}`;
      
      triggerSuccessSequence({
        id: simulatedPaymentId,
        utr: utrNumber,
        method: `UPI Instant QR (${merchantName})`,
        vpa: merchantUpiId,
        recipient: merchantName,
        amount: amount
      });
    }, 1800);
  };

  const handlePayNow = () => {
    setErrorMessage('');

    if (method === 'cash') {
      setIsProcessing(true);
      setProcessStep('Confirming Pay on Service booking...');
      setTimeout(() => {
        const cashPaymentId = `pay_cash_${Date.now()}`;
        triggerSuccessSequence({
          id: cashPaymentId,
          method: 'Cash on Service',
          amount: amount
        });
      }, 1000);
      return;
    }

    if (method === 'upi' && upiSubMode === 'qr') {
      handleSimulateUpiScan();
      return;
    }

    // Direct card/upi id/netbanking payment simulation
    setIsProcessing(true);
    setProcessStep('Contacting bank gateway...');

    setTimeout(() => {
      setProcessStep('Processing payment authentication...');
    }, 700);

    setTimeout(() => {
      const livePaymentId = `pay_live_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
      const utrNumber = `${Math.floor(400000000000 + Math.random() * 599999999999)}`;
      
      triggerSuccessSequence({
        id: livePaymentId,
        utr: utrNumber,
        method: method === 'upi' ? `UPI VPA (${upiId || 'client@upi'})` : method === 'card' ? 'Debit/Credit Card' : 'NetBanking',
        amount: amount
      });
    }, 1500);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <style>{`
        @keyframes scanBeam {
          0% { top: 6%; opacity: 0.85; }
          50% { opacity: 1; }
          100% { top: 92%; opacity: 0.85; }
        }
        @keyframes pulseGlowRing {
          0% { transform: scale(0.85); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 0.35; }
          100% { transform: scale(0.85); opacity: 0.9; }
        }
        @keyframes popSuccess {
          0% { transform: scale(0.4) rotate(-15deg); opacity: 0; }
          70% { transform: scale(1.12) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60px) rotate(180deg); opacity: 0; }
        }
        @keyframes fillBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '520px', 
          width: '92%',
          padding: 0, 
          overflow: 'hidden', 
          border: '1px solid rgba(51, 149, 255, 0.45)', 
          boxShadow: '0 0 45px rgba(51, 149, 255, 0.28), 0 20px 40px rgba(0, 0, 0, 0.85)',
          background: '#0a0d14'
        }}
      >
        
        {/* ========================================================================= */}
        {/* STATE A: PAYMENT SUCCESSFUL CELEBRATION ANIMATION SCREEN                 */}
        {/* ========================================================================= */}
        {showSuccessScreen ? (
          <div style={{ padding: '2.5rem 2rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 20%, #0d284a 0%, #060911 80%)', position: 'relative' }}>
            
            {/* Sparkle Confetti Elements */}
            <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '1.4rem', animation: 'confettiFall 2s ease infinite' }}>✨</div>
            <div style={{ position: 'absolute', top: '25px', right: '25px', fontSize: '1.5rem', animation: 'confettiFall 2.2s ease infinite 0.3s' }}>🎉</div>
            <div style={{ position: 'absolute', bottom: '40px', left: '30px', fontSize: '1.3rem', animation: 'confettiFall 2.4s ease infinite 0.6s' }}>💫</div>
            <div style={{ position: 'absolute', bottom: '50px', right: '35px', fontSize: '1.4rem', animation: 'confettiFall 2.1s ease infinite 0.2s' }}>🎊</div>

            {/* Glowing Success Pulsing Circle */}
            <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 1.5rem auto' }}>
              <div 
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0) 70%)',
                  animation: 'pulseGlowRing 2s ease-in-out infinite'
                }}
              />
              <div 
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 35px rgba(16, 185, 129, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                  animation: 'popSuccess 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                }}
              >
                <CheckCircle2 size={54} color="#ffffff" strokeWidth={2.6} />
              </div>
            </div>

            {/* Payment Success Heading */}
            <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', padding: '0.25rem 0.85rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              PAYMENT VERIFIED & APPROVED
            </div>

            <h2 className="font-serif gold-text" style={{ fontSize: '2rem', margin: '0 0 0.35rem 0', fontWeight: 800 }}>
              Payment Successful!
            </h2>
            <div style={{ color: '#e2e8f0', fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              ₹{completedPaymentData?.amount || amount} Received
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1.5rem 0' }}>
              {completedPaymentData?.method || 'UPI QR Instant Payment'}
            </p>

            {/* Transaction Receipt Card */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.45rem' }}>
                <span>Transaction Ref ID</span>
                <span style={{ color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>{completedPaymentData?.id || 'pay_upi_live'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.45rem' }}>
                <span>UPI Reference / UTR</span>
                <span style={{ color: '#60a5fa', fontFamily: 'monospace', fontWeight: 600 }}>{completedPaymentData?.utr || '428989201923'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.45rem' }}>
                <span>Paid To Recipient</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{merchantName} ({merchantUpiId})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
                <span>Project Simulation Mode</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>₹0 Deducted (Safe Zero-Deduct)</span>
              </div>
            </div>

            {/* Auto-redirect progress bar to booking ticket */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.4rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Loader2 size={13} className="animate-spin" color="var(--accent-gold)" /> Generating your Official Booking Ticket...
                </span>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>Confirmed ✓</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #10b981 0%, #d4af37 100%)',
                    animation: 'fillBar 2.5s ease-out forwards'
                  }} 
                />
              </div>
            </div>

          </div>
        ) : (
          /* STATE B: PAYMENT CHECKOUT & UPI QR CODE SCREEN */
          <>
            {/* Razorpay Branded Header */}
          <div style={{ background: 'linear-gradient(135deg, #07192f 0%, #0d284a 100%)', padding: '1.15rem 1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(51, 149, 255, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ background: '#3395ff', color: '#fff', padding: '0.4rem 0.7rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.92rem', letterSpacing: '0.04em', boxShadow: '0 0 12px rgba(51, 149, 255, 0.5)' }}>
                Razorpay
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.5)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                    🟢 LIVE INSTANT GATEWAY
                  </span>
                </div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#fff', marginTop: '0.2rem' }}>StyleSync Official Checkout</h4>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}>
              <X size={20} />
            </button>
          </div>

          {/* Payment Summary */}
          <div style={{ padding: '1.15rem 1.4rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount to Pay</div>
              <div className="gold-text font-serif" style={{ fontSize: '1.75rem', fontWeight: 800 }}>₹{amount}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{bookingDetails?.serviceTitle || 'Salon Appointment'}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)', marginTop: '0.15rem' }}>
                {bookingDetails?.type === 'home-service' ? '🏡 Elderly At-Home Care' : '✂️ In-Shop Salon Appointment'}
              </div>
            </div>
          </div>

          {/* Payment Methods Selection */}
          <div style={{ padding: '1.25rem 1.4rem' }}>
            
            {/* Method Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.2rem' }}>
              <button 
                type="button"
                onClick={() => setMethod('upi')}
                style={{
                  background: method === 'upi' ? 'rgba(51, 149, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: method === 'upi' ? '1.5px solid #3395ff' : '1px solid var(--border-subtle)',
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  color: method === 'upi' ? '#60a5fa' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                <QrCode size={18} /> UPI QR
              </button>

              <button 
                type="button"
                onClick={() => setMethod('card')}
                style={{
                  background: method === 'card' ? 'rgba(51, 149, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: method === 'card' ? '1.5px solid #3395ff' : '1px solid var(--border-subtle)',
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  color: method === 'card' ? '#60a5fa' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                <CreditCard size={18} /> Card
              </button>

              <button 
                type="button"
                onClick={() => setMethod('netbanking')}
                style={{
                  background: method === 'netbanking' ? 'rgba(51, 149, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: method === 'netbanking' ? '1.5px solid #3395ff' : '1px solid var(--border-subtle)',
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  color: method === 'netbanking' ? '#60a5fa' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                <Building2 size={18} /> NetBank
              </button>

              <button 
                type="button"
                onClick={() => setMethod('cash')}
                style={{
                  background: method === 'cash' ? 'rgba(51, 149, 255, 0.2)' : 'rgba(255,255,255,0.04)',
                  border: method === 'cash' ? '1.5px solid #3395ff' : '1px solid var(--border-subtle)',
                  padding: '0.65rem 0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  color: method === 'cash' ? '#60a5fa' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                <Banknote size={18} /> Cash
              </button>
            </div>

            {/* =================================================================== */}
            {/* UPI SECTION WITH DYNAMIC QR CODE                                    */}
            {/* =================================================================== */}
            {method === 'upi' && (
              <div>
                {/* Submode Switcher: QR Code vs UPI ID */}
                <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', padding: '3px', marginBottom: '1.1rem' }}>
                  <button
                    type="button"
                    onClick={() => setUpiSubMode('qr')}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      background: upiSubMode === 'qr' ? '#3395ff' : 'transparent',
                      color: upiSubMode === 'qr' ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <QrCode size={14} /> Scan UPI QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpiSubMode('id')}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      background: upiSubMode === 'id' ? '#3395ff' : 'transparent',
                      color: upiSubMode === 'id' ? '#fff' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Smartphone size={14} /> Enter UPI ID / VPA
                  </button>
                </div>

                {upiSubMode === 'qr' ? (
                  <div style={{ textAlign: 'center' }}>
                    
                    {/* Merchant Header info */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.35rem 0.85rem', borderRadius: '9999px', marginBottom: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{merchantName}</span>
                      <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontFamily: 'monospace' }}>({merchantUpiId})</span>
                    </div>

                    {/* QR Code Container with High-Tech Laser Beam */}
                    <div 
                      style={{ 
                        display: 'inline-block',
                        position: 'relative',
                        padding: '8px',
                        background: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 0 30px rgba(51, 149, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.7)',
                        border: '2px solid rgba(51, 149, 255, 0.6)',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Scanning Laser Beam */}
                      <div 
                        style={{
                          position: 'absolute',
                          left: '4px',
                          right: '4px',
                          height: '3px',
                          background: 'linear-gradient(90deg, transparent 0%, #3395ff 50%, #10b981 80%, transparent 100%)',
                          boxShadow: '0 0 14px #3395ff, 0 0 8px #10b981',
                          borderRadius: '2px',
                          pointerEvents: 'none',
                          zIndex: 10,
                          animation: 'scanBeam 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate'
                        }}
                      />

                      <img 
                        src={qrCodeUrl} 
                        alt="Akash Biju Google Pay QR Code" 
                        style={{ 
                          width: '210px', 
                          height: 'auto',
                          maxHeight: '260px',
                          display: 'block', 
                          borderRadius: '10px',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>

                    {/* Timer and App Pills */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginTop: '0.75rem', fontSize: '0.75rem' }}>
                      <span style={{ color: '#94a3b8' }}>
                        QR Expires in: <strong style={{ color: '#fbbf24' }}>{formatTimer(qrSeconds)}</strong>
                      </span>
                      <span style={{ color: 'var(--border-strong)' }}>|</span>
                      <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                        <ShieldCheck size={13} /> Verified UPI
                      </span>
                    </div>

                    {/* Supported Apps Chips */}
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.6rem', marginBottom: '0.85rem' }}>
                      {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'CRED', 'Amazon Pay'].map(app => (
                        <span key={app} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '9999px', color: '#cbd5e1' }}>
                          {app}
                        </span>
                      ))}
                    </div>

                    {/* Safe Zero-Deduct Guarantee Banner */}
                    <div style={{ padding: '0.65rem 0.85rem', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.76rem', color: '#6ee7b7', textAlign: 'center', marginBottom: '1rem', lineHeight: '1.4' }}>
                      🛡️ <strong>Zero Money Deduction:</strong> Scan with any UPI app or tap below — <strong>no money will be deducted</strong> from your bank account, and your booking ticket will confirm instantly!
                    </div>

                    {/* Scan & Pay Button */}
                    <button 
                      type="button"
                      onClick={handleSimulateUpiScan}
                      disabled={isProcessing}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                        transition: 'all 0.2s ease',
                        opacity: isProcessing ? 0.85 : 1
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> {processStep || 'Verifying QR Payment...'}
                        </>
                      ) : (
                        <>
                          <Zap size={18} /> I Have Scanned &amp; Paid (Simulate Approval)
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* UPI ID Input Form */
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Enter Virtual Payment Address (VPA)</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>e.g. mobile@upi</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                      placeholder="e.g. 9876543210@paytm or name@okaxis"
                    />
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem' }}>
                      💡 A collect request will be approved in zero-deduction test mode.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =================================================================== */}
            {/* CARD PAYMENT FORM                                                   */}
            {/* =================================================================== */}
            {method === 'card' && (
              <div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Card Number</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="4532 •••• •••• 8892"
                    maxLength={19}
                    value={cardNumber} 
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Valid Thru</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="MM/YY" 
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>CVV</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="•••" 
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =================================================================== */}
            {/* NETBANKING SELECTION                                                */}
            {/* =================================================================== */}
            {method === 'netbanking' && (
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Select Bank</label>
                <select 
                  className="form-select"
                  value={selectedBank}
                  onChange={e => setSelectedBank(e.target.value)}
                >
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India">State Bank of India</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                  <option value="Punjab National Bank">Punjab National Bank</option>
                </select>
              </div>
            )}

            {/* =================================================================== */}
            {/* CASH ON SERVICE                                                     */}
            {/* =================================================================== */}
            {method === 'cash' && (
              <div style={{ padding: '0.9rem', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: '#fbbf24', marginBottom: '1rem' }}>
                💡 Exact payment of <strong>₹{amount}</strong> will be collected in cash by our specialist upon completion of service.
              </div>
            )}

            {errorMessage && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Security Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', color: 'var(--text-muted)', margin: '1rem 0 0.85rem 0', justifyContent: 'center' }}>
              <Lock size={13} color="#10b981" /> 256-Bit SSL Encrypted Razorpay Live Gateway (PCI-DSS Certified)
            </div>

            {/* Main Action Button (Only show if not in UPI QR mode, since QR has its own dedicated scan button) */}
            {!(method === 'upi' && upiSubMode === 'qr') && (
              <button 
                type="button"
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
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 18px rgba(51, 149, 255, 0.35)',
                  transition: 'all 0.2s ease',
                  opacity: isProcessing ? 0.8 : 1
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> {processStep || 'Processing Transaction...'}
                  </>
                ) : (
                  <>
                    {method === 'cash' ? `Confirm Booking (Pay ₹${amount} on Service)` : `Authorize ₹${amount} (Zero Deduction)`}
                  </>
                )}
              </button>
            )}
          </div>
        </>
        )}

      </div>
    </div>
  );
};

