// StyleSync Initial Demo Dataset for MCA Project Evaluation

export const INITIAL_SERVICES = [
  {
    id: 'srv-1',
    title: 'Signature Royal Haircut & Styling',
    category: 'Hair',
    price: 850,
    duration: '45 mins',
    description: 'Precision haircut with luxury scalp massage, hair wash, blow-dry and premium styling finish.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true
  },
  {
    id: 'srv-2',
    title: '24K Gold Glow Facial & Hydration',
    category: 'Skincare',
    price: 2200,
    duration: '60 mins',
    description: 'Deep pore cleansing, gold leaf hydration mask, facial massage, and anti-aging serum therapy.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true
  },
  {
    id: 'srv-3',
    title: 'Keratin Smoothing & Hair Spa',
    category: 'Hair',
    price: 3500,
    duration: '120 mins',
    description: 'Intense conditioning therapy for frizzy hair, strengthening hair cuticles and imparting silky shine.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: false
  },
  {
    id: 'srv-4',
    title: 'Elderly Gentle Grooming & Care',
    category: 'Special Care',
    price: 600,
    duration: '45 mins',
    description: 'Dedicated gentle hair trim, nail care, and soothing massage specially crafted for elderly/senior citizens at home.',
    image: 'https://images.unsplash.com/photo-1581579438747-104c53d0774b?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true
  },
  {
    id: 'srv-5',
    title: 'Gel Nail Art & Pedicure Spa',
    category: 'Nails',
    price: 1400,
    duration: '50 mins',
    description: 'Exfoliating foot soak, nail shaping, gel polish application, and custom nail art finish.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true
  },
  {
    id: 'srv-6',
    title: 'Royal Beard Craft & Hot Towel Spa',
    category: 'Grooming',
    price: 550,
    duration: '30 mins',
    description: 'Beard sculpting with essential oil massage, hot towel treatment, and post-shave balm.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true
  }
];

export const INITIAL_STAFF = [
  {
    id: 'stf-1',
    name: 'Alexander Wright',
    role: 'Senior Master Stylist',
    specialty: 'Hair & Beard Sculpting',
    rating: 4.9,
    experience: '8 Years',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'stf-2',
    name: 'Sophia Chen',
    role: 'Skincare & Spa Specialist',
    specialty: 'Facials & Home Care for Elderly',
    rating: 4.95,
    experience: '6 Years',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'stf-3',
    name: 'Marcus Vance',
    role: 'Nail Artist & Reflexologist',
    specialty: 'Manicure, Pedicure & Spa',
    rating: 4.8,
    experience: '5 Years',
    status: 'In Service',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-9021',
    customerName: 'Robert Vance (Elderly Care)',
    customerPhone: '+91 98765 43210',
    serviceTitle: 'Elderly Gentle Grooming & Care',
    serviceId: 'srv-4',
    stylistName: 'Sophia Chen',
    type: 'home-service',
    date: '2026-07-23',
    time: '11:00 AM',
    address: 'Flat 402, Sunshine Heights, M.G. Road, Bengaluru',
    landmark: 'Near Apollo Hospital',
    specialNotes: 'Customer is 76 years old and uses a wheelchair. Please be gentle.',
    amount: 600,
    status: 'Pending',
    paymentStatus: 'Paid (Razorpay)',
    paymentId: 'pay_RZP98234721',
    createdAt: '2026-07-22 14:30'
  },
  {
    id: 'BK-9022',
    customerName: 'Priya Sharma',
    customerPhone: '+91 91234 56789',
    serviceTitle: '24K Gold Glow Facial & Hydration',
    serviceId: 'srv-2',
    stylistName: 'Sophia Chen',
    type: 'in-shop',
    date: '2026-07-23',
    time: '02:00 PM',
    address: 'N/A (In-Shop)',
    landmark: '',
    specialNotes: 'Allergic to heavy fragrances.',
    amount: 2200,
    status: 'In-Progress',
    paymentStatus: 'Paid (Razorpay)',
    paymentId: 'pay_RZP88129034',
    createdAt: '2026-07-22 16:15'
  },
  {
    id: 'BK-9020',
    customerName: 'Arjun Mehta',
    customerPhone: '+91 99887 76655',
    serviceTitle: 'Signature Royal Haircut & Styling',
    serviceId: 'srv-1',
    stylistName: 'Alexander Wright',
    type: 'in-shop',
    date: '2026-07-22',
    time: '10:00 AM',
    address: 'N/A (In-Shop)',
    landmark: '',
    specialNotes: '',
    amount: 850,
    status: 'Completed',
    paymentStatus: 'Paid (Cash)',
    paymentId: 'CASH_10293',
    createdAt: '2026-07-22 09:10'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'pay_RZP98234721',
    bookingId: 'BK-9021',
    customerName: 'Robert Vance',
    amount: 600,
    method: 'Razorpay UPI (Google Pay)',
    status: 'Success',
    date: '2026-07-22 14:31'
  },
  {
    id: 'pay_RZP88129034',
    bookingId: 'BK-9022',
    customerName: 'Priya Sharma',
    amount: 2200,
    method: 'Razorpay Credit Card',
    status: 'Success',
    date: '2026-07-22 16:16'
  },
  {
    id: 'CASH_10293',
    bookingId: 'BK-9020',
    customerName: 'Arjun Mehta',
    amount: 850,
    method: 'Cash at Counter',
    status: 'Success',
    date: '2026-07-22 10:45'
  }
];

export const INITIAL_FEEDBACK = [
  {
    id: 'fb-101',
    customerName: 'Eleanor Vance (Daughter of Robert Vance)',
    serviceTitle: 'Elderly Gentle Grooming & Care',
    rating: 5,
    comment: 'Sophia from StyleSync came to our home for my elderly father. She was extremely patient, polite, and caring! Best home salon service experience.',
    date: '2026-07-21'
  },
  {
    id: 'fb-102',
    customerName: 'Arjun Mehta',
    serviceTitle: 'Signature Royal Haircut & Styling',
    rating: 5,
    comment: 'Alexander is a master at hair fading and styling. Superb luxury ambience in the salon too!',
    date: '2026-07-22'
  }
];
