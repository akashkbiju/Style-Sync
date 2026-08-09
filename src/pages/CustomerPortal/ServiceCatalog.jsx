import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { Scissors, Search, Clock, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const ServiceCatalog = () => {
  const { services, setCustomerTab } = useSalon();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Hair', 'Skincare', 'Nails', 'Grooming', 'Special Care'];

  const filteredServices = services.filter(service => {
    const matchesCat = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="font-serif gold-text" style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Salon Service Catalog</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore our menu of luxury haircuts, spa therapies, facials, and home care services</p>
      </div>

      {/* Search & Category Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search services by keyword..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? 'btn-gold' : 'btn-secondary'}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredServices.map(service => (
          <div key={service.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                />
                {service.homeServiceAvailable && (
                  <span className="badge badge-home" style={{ position: 'absolute', top: '10px', right: '10px', boxShadow: 'var(--shadow-sm)' }}>
                    <HeartHandshake size={13} /> Home Service Ready
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>{service.title}</h3>
                <span className="gold-text font-serif" style={{ fontSize: '1.25rem', fontWeight: 800 }}>₹{service.price}</span>
              </div>

              <span className="badge badge-inshop" style={{ marginBottom: '0.75rem' }}>
                Category: {service.category}
              </span>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {service.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {service.duration}
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {service.homeServiceAvailable && (
                  <button 
                    onClick={() => setCustomerTab('book-home')} 
                    className="btn-outline"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', borderColor: '#c084fc', color: '#c084fc' }}
                    title="Book as Home Service for Elderly"
                  >
                    Home Visit
                  </button>
                )}
                <button 
                  onClick={() => setCustomerTab('book-inshop')} 
                  className="btn-gold"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  Book In-Shop
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
