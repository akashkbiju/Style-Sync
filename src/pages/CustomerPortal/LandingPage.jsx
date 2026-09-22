import React from 'react';
import { useSalon } from '../../context/SalonContext';
import { Sparkles, Calendar, HeartHandshake, Scissors, ChevronRight } from 'lucide-react';

export const LandingPage = () => {
  const { setCustomerTab, setActiveRole } = useSalon();

  const featuredServices = [
    {
      id: 'srv-1',
      title: 'Haircut',
      desc: 'Effortless scheduling and performance tracking.',
      price: 'From $60',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'srv-2',
      title: 'Styling',
      desc: 'Modernizing styling, style in hair on styling.',
      price: 'From $45',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'srv-3',
      title: 'Coloring',
      desc: 'Donolocr invoicing and coloring managements.',
      price: 'From $90',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'srv-4',
      title: 'Spa',
      desc: 'Learn tless scheduling and performance to Spa.',
      price: 'From $80',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'srv-5',
      title: 'Manicure',
      desc: 'Specialian booking and manicure in triumes.',
      price: 'From $35',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'srv-6',
      title: 'Home Services',
      desc: 'Specialized booking for elderly clients.',
      price: 'From $50',
      isElderlySpecial: true,
      image: 'https://images.unsplash.com/photo-1581579438747-104c53d0774b?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div style={{ width: '100%', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '3rem', padding: '1rem 0 3rem' }}>
      
      {/* Hero Section (Matching Screenshot 2 layout) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.2fr)', gap: '3rem', alignItems: 'center', minHeight: '440px' }}>
        
        {/* Left Side: High-Fashion Portrait with Red Diamond Neon Frame Overlay */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Red Neon Geometric Diamond Overlay */}
          <div style={{
            position: 'absolute',
            width: '360px',
            height: '360px',
            border: '2px solid var(--accent-red)',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 30px rgba(255, 0, 60, 0.6), inset 0 0 20px rgba(255, 0, 60, 0.3)',
            zIndex: 1,
            pointerEvents: 'none'
          }} />

          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            border: '1px solid rgba(255, 0, 60, 0.7)',
            transform: 'rotate(45deg)',
            zIndex: 1,
            pointerEvents: 'none'
          }} />

          {/* Model Image */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            width: '310px',
            height: '380px',
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9)'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" 
              alt="High Fashion Model" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(60%) contrast(120%)'
              }}
            />
            {/* Subtle Red Shadow Wash */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(255, 0, 60, 0.3) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Right Side: Headline & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h1 className="font-serif" style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 700,
            lineHeight: 1.08,
            color: '#ffffff',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}>
            REVOLUTIONIZING<br />
            SALON<br />
            MANAGEMENT
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.15rem',
            fontWeight: 400,
            letterSpacing: '0.01em',
            maxWidth: '480px'
          }}>
            Modernizing operations for the high-fashion salon.
          </p>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('home'); }}
              className="btn-red-neon"
              style={{
                padding: '0.9rem 2.2rem',
                fontSize: '0.95rem',
                borderRadius: '8px'
              }}
            >
              GET STARTED
            </button>

            <button 
              onClick={() => { setActiveRole('customer'); setCustomerTab('book-home'); }}
              className="btn-red-outline"
              style={{
                padding: '0.9rem 1.8rem',
                fontSize: '0.88rem',
                borderRadius: '8px'
              }}
            >
              ELDERLY HOME SERVICE
            </button>
          </div>
        </div>

      </section>

      {/* Bottom Service Cards Grid (Matching Screenshot 2 Cards) */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
        {featuredServices.map(service => (
          <div 
            key={service.id}
            onClick={() => {
              setActiveRole('customer');
              if(service.isElderlySpecial) {
                setCustomerTab('book-home');
              } else {
                setCustomerTab('catalog');
              }
            }}
            className="neon-card"
            style={{
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              height: '310px',
              cursor: 'pointer',
              borderColor: service.isElderlySpecial ? 'var(--accent-red)' : 'rgba(255, 255, 255, 0.12)',
              boxShadow: service.isElderlySpecial ? '0 0 15px rgba(255, 0, 60, 0.4)' : 'none'
            }}
          >
            {/* Card Image */}
            <div style={{ width: '100%', height: '170px', borderRadius: '6px', overflow: 'hidden', position: 'relative', marginBottom: '0.75rem' }}>
              <img 
                src={service.image} 
                alt={service.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(70%) contrast(110%)' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
              {service.isElderlySpecial && (
                <span className="badge badge-confirmed" style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '0.7rem' }}>
                  Elderly Care
                </span>
              )}
            </div>

            {/* Service Details */}
            <div>
              <h3 className="font-serif" style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.2rem' }}>
                {service.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '0.6rem' }}>
                {service.desc}
              </p>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{service.price}</span>
              <span style={{ color: 'var(--accent-red)', fontSize: '0.78rem' }}>Book &rarr;</span>
            </div>

          </div>
        ))}
      </section>

    </div>
  );
};
