import React from 'react';
import { useSalon } from '../../context/SalonContext';

export const LandingPage = () => {
  const { setCustomerTab, setActiveRole } = useSalon();

  const servicesList = [
    {
      id: 'srv-1',
      title: 'Haircut',
      desc: 'Effortless scheduling and performance tracking.',
      price: 'From $60',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
      isElderly: false
    },
    {
      id: 'srv-2',
      title: 'Styling',
      desc: 'Modernizing styling, style in hair on styling.',
      price: 'From $45',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      isElderly: false
    },
    {
      id: 'srv-3',
      title: 'Coloring',
      desc: 'Donolocr invoicing and coloring management.',
      price: 'From $90',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
      isElderly: false
    },
    {
      id: 'srv-4',
      title: 'Spa',
      desc: 'Learn less scheduling and performance to Spa.',
      price: 'From $80',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      isElderly: false
    },
    {
      id: 'srv-5',
      title: 'Manicure',
      desc: 'Specialized booking and manicure in triumes.',
      price: 'From $35',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      isElderly: false
    },
    {
      id: 'srv-6',
      title: 'Home Services',
      desc: 'Specialized booking for luxury home visits & elderly care.',
      price: 'From $50',
      image: 'https://images.unsplash.com/photo-1581579438747-104c53d0774b?auto=format&fit=crop&w=600&q=80',
      isElderly: true
    }
  ];

  return (
    <div style={{ width: '100%', minHeight: '85vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Hero Section (Matching Provided HTML Code) */}
      <section className="relative min-h-[85vh] flex items-center pt-8 overflow-hidden">
        
        {/* Geometric Accents behind Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="geometric-accent w-80 h-80 rotate-45 -left-20 top-1/4"></div>
          <div className="geometric-accent w-64 h-64 rotate-[30deg] left-10 top-1/3"></div>
          <div className="geometric-accent w-48 h-48 rotate-12 left-40 top-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Left Model Image Container */}
          <div className="relative group">
            <div className="relative z-10 overflow-hidden border border-white/10 rounded">
              <img 
                alt="High fashion model with modern haircut" 
                className="w-full h-[480px] object-cover grayscale brightness-75 group-hover:grayscale-0 transition duration-700" 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full border border-primary/50 -z-10"></div>
          </div>

          {/* Right Text Content */}
          <div className="space-y-8">
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight uppercase font-bold tracking-tighter text-white">
              Revolutionizing<br/>
              <span className="text-white">Salon</span><br/>
              <span className="text-white/90">Management</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-lg font-light leading-relaxed">
              Modernizing operations for the high-fashion salon. Seamlessly integrate booking, staffing, elderly home visits, and style analytics.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              {/* Primary Animated Hover Get Started Button */}
              <button 
                onClick={() => { setActiveRole('customer'); setCustomerTab('home'); }}
                className="group relative px-10 py-4 bg-transparent border border-primary text-white font-bold uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(225,29,72,0.6)] cursor-pointer"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
              </button>

              {/* Secondary Home Service Button */}
              <button 
                onClick={() => { setActiveRole('customer'); setCustomerTab('book-home'); }}
                className="px-8 py-4 bg-transparent border border-white/40 text-white font-bold uppercase tracking-[0.15em] hover:border-white transition-all cursor-pointer"
              >
                Elderly Home Booking
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Services Grid Section (Matching Provided HTML Code) */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {servicesList.map(service => (
              <div 
                key={service.id}
                onClick={() => {
                  setActiveRole('customer');
                  if (service.isElderly) {
                    setCustomerTab('book-home');
                  } else {
                    setCustomerTab('catalog');
                  }
                }}
                className="group relative bg-zinc-900 border border-white/10 overflow-hidden cursor-pointer"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img 
                    alt={service.title} 
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition duration-500" 
                    src={service.image}
                  />
                  <div className="absolute inset-0 card-gradient"></div>
                  {/* Red bottom hover accent line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>

                <div className="p-4 relative">
                  <h3 className="font-display text-xl mb-2 font-bold uppercase text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                    {service.desc}
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {service.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
