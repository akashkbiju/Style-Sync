import React, { useState } from 'react';
import { useSalon } from '../../context/SalonContext';
import { 
  Calendar, 
  Home, 
  CreditCard, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  PlusCircle,
  HeartHandshake
} from 'lucide-react';
import { BookInShop } from './BookInShop';
import { BookHomeService } from './BookHomeService';
import { CustomerBookings } from './CustomerBookings';
import { ServiceCatalog } from './ServiceCatalog';

export const CustomerHome = () => {
  const { 
    customerTab, 
    setCustomerTab, 
    bookings, 
    payments, 
    feedback,
    addFeedback,
    setActiveRole
  } = useSalon();

  const [activeSideTab, setActiveSideTab] = useState('bookings'); // 'bookings' | 'home-service' | 'payments' | 'feedback' | 'catalog'
  const [newFeedbackComment, setNewFeedbackComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
    <div className="w-full pb-12">
      
      {/* Dynamic Views based on sub tab */}
      {customerTab === 'book-inshop' ? (
        <BookInShop />
      ) : customerTab === 'book-home' ? (
        <BookHomeService />
      ) : customerTab === 'catalog' ? (
        <ServiceCatalog />
      ) : customerTab === 'payments' || activeSideTab === 'payments' ? (
        <div className="neon-panel p-8">
          <h2 className="font-display text-3xl text-white mb-6">
            Online Payment Records
          </h2>
          <div className="flex flex-col gap-4">
            {payments.map(pay => (
              <div key={pay.id} className="neon-card flex justify-between items-center p-4">
                <div>
                  <div className="font-bold text-white text-lg">{pay.customerName}</div>
                  <div className="text-sm text-slate-400">ID: {pay.id} | {pay.method}</div>
                  <div className="text-xs text-slate-500">{pay.date}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">₹{pay.amount}</div>
                  <span className="badge badge-completed">{pay.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : customerTab === 'feedback' || activeSideTab === 'feedback' ? (
        <div className="neon-panel p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-3xl text-white">
              Customer Ratings & Reviews
            </h2>
            <button 
              onClick={() => setShowFeedbackModal(true)} 
              className="btn-red-neon px-4 py-2 text-xs"
            >
              Submit Feedback
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.map(fb => (
              <div key={fb.id} className="neon-card p-4">
                <div className="text-primary font-bold mb-2">
                  {'★'.repeat(fb.rating)}
                </div>
                <p className="text-white italic text-sm mb-3">
                  "{fb.comment}"
                </p>
                <div className="text-xs text-slate-400">
                  — {fb.customerName} ({fb.serviceTitle})
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Complete Integrated High Fashion Home Page Layout */
        <div className="space-y-16">
          
          {/* Section 1: Hero Banner matching Provided HTML Code */}
          <section className="relative min-h-[75vh] flex items-center pt-4 overflow-hidden">
            
            {/* Geometric Accents */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="geometric-accent w-80 h-80 rotate-45 -left-20 top-1/4"></div>
              <div className="geometric-accent w-64 h-64 rotate-[30deg] left-10 top-1/3"></div>
              <div className="geometric-accent w-48 h-48 rotate-12 left-40 top-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              
              {/* Left Model Image */}
              <div className="relative group">
                <div className="relative z-10 overflow-hidden border border-white/10 rounded">
                  <img 
                    alt="High fashion model with modern suit styling" 
                    className="w-full h-auto max-h-[560px] object-cover object-top aspect-[3/4] grayscale brightness-90 group-hover:grayscale-0 transition duration-700" 
                    src="/hero_model.png"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-full h-full border border-primary/50 -z-10"></div>
              </div>

              {/* Right Content */}
              <div className="space-y-6">
                <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight uppercase font-bold tracking-tighter text-white">
                  Revolutionizing<br/>
                  <span className="text-white">Salon</span><br/>
                  <span className="text-white/90">Management</span>
                </h1>

                <p className="text-xl text-slate-400 max-w-lg font-light leading-relaxed">
                  Modernizing operations for the high-fashion salon. Seamlessly integrate booking, staffing, elderly home visits, and style analytics.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  {/* Primary Get Started Button */}
                  <button 
                    onClick={() => setCustomerTab('book-inshop')}
                    className="group relative px-10 py-4 bg-transparent border border-primary text-white font-bold uppercase tracking-[0.2em] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(225,29,72,0.6)] cursor-pointer"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0"></div>
                  </button>

                  <button 
                    onClick={() => setCustomerTab('book-home')}
                    className="px-8 py-4 bg-transparent border border-white/40 text-white font-bold uppercase tracking-[0.15em] hover:border-white transition-all cursor-pointer"
                  >
                    Elderly Home Booking
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Section 2: Services Grid matching Provided HTML Code */}
          <section className="relative z-10">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-display text-4xl font-bold uppercase text-white mb-6">
                Featured <span className="text-primary">Services</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {servicesList.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => {
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

          {/* Section 3: Customer Quick Actions & Appointments (Screenshot 3 Dashboard) */}
          <section className="max-w-7xl mx-auto pt-6 border-t border-white/10">
            <div className="mb-8">
              <h2 className="font-display text-4xl font-bold text-white mb-1">
                Hello, <span className="text-primary">Sarah Jenkins</span>
              </h2>
              <p className="text-slate-400 text-sm">Manage your salon appointments and home visit requests below.</p>
            </div>

            {/* 2 Big Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              
              {/* Card 1: Book a New Service */}
              <div className="neon-card p-8 border-l-4 border-l-primary flex flex-col justify-between space-y-6">
                <div>
                  <Calendar size={36} className="text-primary mb-4" />
                  <h3 className="font-display text-2xl font-bold text-white uppercase">
                    Book a New Service
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Schedule an in-shop luxury hair, styling, skincare, or spa session.
                  </p>
                </div>
                <button 
                  onClick={() => setCustomerTab('book-inshop')}
                  className="btn-red-neon self-start"
                >
                  BOOK NOW
                </button>
              </div>

              {/* Card 2: Request Home Service */}
              <div className="neon-card p-8 border-l-4 border-l-primary flex flex-col justify-between space-y-6">
                <div>
                  <Home size={36} className="text-primary mb-4" />
                  <h3 className="font-display text-2xl font-bold text-white uppercase">
                    Request Home Service
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Specialized home salon visits for senior citizens & elderly clients.
                  </p>
                </div>
                <button 
                  onClick={() => setCustomerTab('book-home')}
                  className="btn-red-neon self-start"
                >
                  REQUEST NOW
                </button>
              </div>

            </div>

            {/* Upcoming Appointments List */}
            <div>
              <h3 className="font-display text-3xl font-bold text-white uppercase mb-6">
                Upcoming Appointments
              </h3>

              <div className="space-y-4">
                
                {/* Appointment 1 */}
                <div className="flex justify-between items-center p-5 bg-zinc-900/80 border border-white/10 rounded">
                  <div>
                    <h4 className="text-white text-lg font-semibold">
                      Haircut with Stylist Anna
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">
                      Oct 26, 2023 - 10:00 AM
                    </p>
                  </div>
                  <span className="badge badge-confirmed">
                    Confirmed
                  </span>
                </div>

                {/* Appointment 2 */}
                <div className="flex justify-between items-center p-5 bg-zinc-900/80 border border-white/10 rounded">
                  <div>
                    <h4 className="text-white text-lg font-semibold">
                      Manicure
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">
                      Nov 2, 2023 - 2:00 PM
                    </p>
                  </div>
                  <span className="badge badge-scheduled">
                    Scheduled
                  </span>
                </div>

                {/* Additional User Bookings */}
                {bookings.map(b => (
                  <div key={b.id} className="flex justify-between items-center p-5 bg-zinc-900/80 border border-white/10 rounded">
                    <div>
                      <h4 className="text-white text-lg font-semibold">
                        {b.serviceTitle} {b.stylistName ? `with ${b.stylistName}` : ''} {b.type === 'home-service' ? '(Home Visit)' : ''}
                      </h4>
                      <p className="text-slate-400 text-sm mt-1">
                        {b.date} - {b.time} {b.address ? `| ${b.address}` : ''}
                      </p>
                    </div>
                    <span className={`badge ${b.status === 'Completed' ? 'badge-completed' : 'badge-confirmed'}`}>
                      {b.status}
                    </span>
                  </div>
                ))}

              </div>
            </div>

          </section>

        </div>
      )}

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-2xl text-white mb-4">
              Submit Rating & Feedback
            </h3>
            
            <div className="form-group">
              <label className="form-label">Service Rating</label>
              <select className="form-select" value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
                <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                <option value={3}>⭐⭐⭐ (3/5) Average</option>
                <option value={2}>⭐⭐ (2/5) Poor</option>
                <option value={1}>⭐ (1/5) Very Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review / Comments</label>
              <textarea 
                className="form-textarea" 
                rows={4} 
                placeholder="Share your experience with Style Sync salon or home service..."
                value={newFeedbackComment}
                onChange={e => setNewFeedbackComment(e.target.value)}
              />
            </div>

            <div className="flex gap-4 justify-end mt-6">
              <button className="btn-secondary" onClick={() => setShowFeedbackModal(false)}>Cancel</button>
              <button 
                className="btn-red-neon" 
                onClick={() => {
                  if(!newFeedbackComment.trim()) return alert('Please enter your review');
                  addFeedback({
                    customerName: 'Sarah Jenkins',
                    serviceTitle: 'Haircut & Styling',
                    rating: newRating,
                    comment: newFeedbackComment
                  });
                  setNewFeedbackComment('');
                  setShowFeedbackModal(false);
                  alert('Thank you! Your feedback has been recorded.');
                }}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
