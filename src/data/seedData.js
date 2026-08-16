// StyleSync Initial Dataset for MCA Project Evaluation

export const INITIAL_SERVICES = [
  // --- In-Shop & General Services ---
  {
    id: 'srv-1',
    title: 'Signature Royal Haircut & Styling',
    category: 'Hair',
    price: 850,
    duration: '45 mins',
    description: 'Precision haircut with luxury scalp massage, hair wash, blow-dry and premium styling finish.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: false
  },
  {
    id: 'srv-2',
    title: '24K Gold Glow Facial & Hydration',
    category: 'Skincare',
    price: 2200,
    duration: '60 mins',
    description: 'Deep pore cleansing, gold leaf hydration mask, facial massage, and anti-aging serum therapy.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: false
  },
  {
    id: 'srv-3',
    title: 'Keratin Smoothing & Hair Spa',
    category: 'Hair',
    price: 3500,
    duration: '120 mins',
    description: 'Intense conditioning therapy for frizzy hair, strengthening hair cuticles and imparting silky shine.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: false,
    seniorCare: false
  },
  {
    id: 'srv-5',
    title: 'Gel Nail Art & Pedicure Spa',
    category: 'Nails',
    price: 1400,
    duration: '50 mins',
    description: 'Exfoliating foot soak, nail shaping, gel polish application, and custom nail art finish.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: false
  },
  {
    id: 'srv-6',
    title: 'Royal Beard Craft & Hot Towel Spa',
    category: 'Grooming',
    price: 550,
    duration: '30 mins',
    description: 'Beard sculpting with essential oil massage, hot towel treatment, and post-shave balm.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: false
  },

  // --- Dedicated Home & Senior Citizen Services ---
  {
    id: 'srv-4',
    title: 'Elderly Gentle Grooming & Hair Care',
    category: 'Senior Care',
    price: 550,
    duration: '40 mins',
    description: 'Dedicated gentle hair trim, soft scalp combing, and calming head massage specially crafted for senior citizens at home.',
    image: 'https://images.unsplash.com/photo-1581579438747-104c53d0774b?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Popular for Seniors',
    benefits: ['Gentle Non-Rushed Service', 'Sensitive Scalp Care', 'Wheelchair Friendly']
  },
  {
    id: 'srv-7',
    title: 'Senior Geriatric Pedicure & Foot Reflexology',
    category: 'Senior Care',
    price: 799,
    duration: '50 mins',
    description: 'Warm antiseptic herbal foot soak, safe therapeutic nail trimming, callus softening, and soothing circulation massage for aching feet.',
    image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Circulation & Relief',
    benefits: ['Anti-Fungal Herbal Soak', 'Diabetic-Safe Nail Trimming', 'Acupressure Foot Massage']
  },
  {
    id: 'srv-8',
    title: 'Bedside Hair Wash & Gentle Blow-Dry',
    category: 'Senior Care',
    price: 699,
    duration: '45 mins',
    description: 'No-mess ergonomic bedside rinse basin wash, anti-dandruff herbal wash, mild conditioning, and gentle warm dry for bedridden or low-mobility seniors.',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Bedside Assisted',
    benefits: ['Zero-Spill Inflatable Basin', 'Tear-Free Herbal Shampoo', 'Zero Moving Required']
  },
  {
    id: 'srv-9',
    title: 'Senior Arthritis Hand & Nail Therapy',
    category: 'Senior Care',
    price: 650,
    duration: '40 mins',
    description: 'Warm essential oil soak, gentle cuticle care, light finger joint relief massage, and natural nail buffing for elderly arthritis comfort.',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Joint Comfort',
    benefits: ['Warm Oil Joint Soak', 'Gentle Cuticle Trimming', 'Finger Mobility Massage']
  },
  {
    id: 'srv-10',
    title: 'Ayurvedic Head, Neck & Shoulder Pain-Relief Massage',
    category: 'Senior Care',
    price: 899,
    duration: '45 mins',
    description: 'Traditional warm Brahmi, Ashwagandha & sesame oil massage targeting cervical stiffness, tension headaches, and calming insomnia.',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Stress & Sleep Aid',
    benefits: ['Warm Ayurvedic Herbal Oils', 'Cervical Stiffness Relief', 'Improves Sleep Quality']
  },
  {
    id: 'srv-11',
    title: 'Classic Senior Shave & Hot Towel Grooming',
    category: 'Senior Care',
    price: 450,
    duration: '30 mins',
    description: 'Old-school soothing hot towel softening, extra-safe single-stroke foam shave, alum block, and calming sandalwood moisturizer.',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Gentle Grooming',
    benefits: ['Hot Towel Softening', 'Nick-Free Safety Shave', 'Sandalwood Soothing Balm']
  },
  {
    id: 'srv-12',
    title: 'Elderly Royal Rejuvenation Combo Package',
    category: 'Senior Care',
    price: 1699,
    duration: '90 mins',
    description: 'Complete all-in-one home visit package: gentle haircut, foot reflexology massage, bedside hair wash, and soothing shoulder therapy.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
    homeServiceAvailable: true,
    seniorCare: true,
    tag: 'Best Value Package',
    benefits: ['All-in-One Complete Care', 'Haircut + Foot Spa + Massage', 'Save ₹800 Package Discount']
  }
];

export const INITIAL_STAFF = [
  {
    id: 'stf-1',
    name: 'Akash K Biju',
    role: 'Senior Master Stylist & Director',
    specialty: 'Hair & Beard Design, Senior Care Specialist',
    rating: 5.0,
    experience: '8 Years',
    status: 'Available',
    homeServiceCertified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    email: 'akash@stylesync.com',
    phone: '+91 98471 20061'
  },
  {
    id: 'stf-2',
    name: 'Ananya Nair',
    role: 'Senior Ayur-Therapist & Elderly Care Specialist',
    specialty: 'Geriatric Care, Bedside Scalp Therapy & Reflexology',
    rating: 4.98,
    experience: '7 Years',
    status: 'Available',
    homeServiceCertified: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    email: 'ananya@stylesync.com',
    phone: '+91 98472 30072'
  },
  {
    id: 'stf-3',
    name: 'Rahul Krishna',
    role: 'Precision Grooming & Shaving Specialist',
    specialty: 'Classic Hot Towel Shave, Hair Styling & Scalp Spa',
    rating: 4.90,
    experience: '6 Years',
    status: 'Available',
    homeServiceCertified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    email: 'rahul@stylesync.com',
    phone: '+91 98473 40083'
  },
  {
    id: 'stf-4',
    name: 'Meera Varma',
    role: 'Senior Skincare & Reflexology Specialist',
    specialty: '24K Gold Facials, Arthritis Hand Therapy & Nails',
    rating: 4.95,
    experience: '5 Years',
    status: 'Available',
    homeServiceCertified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    email: 'meera@stylesync.com',
    phone: '+91 98474 50094'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'BK-9021',
    customerName: 'K. R. Menon (Senior Care)',
    customerPhone: '+91 98470 11223',
    serviceTitle: 'Elderly Gentle Grooming & Hair Care',
    serviceId: 'srv-4',
    stylistName: 'Akash K Biju',
    type: 'home-service',
    date: '2026-08-20',
    time: '10:00 AM',
    address: 'Villa 14, Palm Grove Residency, Collectorate P.O., Kottayam',
    landmark: 'Near District Hospital',
    specialNotes: '[Special Needs: Wheelchair / Limited Mobility, Gentle Scalp Care] | Patient is 78 years old, requires gentle haircut and soothing scalp combing.',
    amount: 550,
    status: 'Pending',
    paymentStatus: 'Paid (Razorpay UPI)',
    paymentId: 'pay_RZP98234721',
    createdAt: '2026-08-16 10:30'
  },
  {
    id: 'BK-9022',
    customerName: 'Lakshmi Pillai',
    customerPhone: '+91 94471 55667',
    serviceTitle: '24K Gold Glow Facial & Hydration',
    serviceId: 'srv-2',
    stylistName: 'Meera Varma',
    type: 'in-shop',
    date: '2026-08-20',
    time: '02:00 PM',
    address: 'N/A (In-Shop Salon Visit)',
    landmark: '',
    specialNotes: 'Sensitive skin, please use herbal organic hydration pack.',
    amount: 2200,
    status: 'In-Progress',
    paymentStatus: 'Paid (Razorpay Card)',
    paymentId: 'pay_RZP88129034',
    createdAt: '2026-08-16 11:15'
  },
  {
    id: 'BK-9020',
    customerName: 'Dr. George Thomas',
    customerPhone: '+91 94472 88990',
    serviceTitle: 'Signature Royal Haircut & Styling',
    serviceId: 'srv-1',
    stylistName: 'Rahul Krishna',
    type: 'in-shop',
    date: '2026-08-20',
    time: '09:30 AM',
    address: 'N/A (In-Shop Salon Visit)',
    landmark: '',
    specialNotes: 'Executive classic styling with hot towel neck trim.',
    amount: 850,
    status: 'Completed',
    paymentStatus: 'Paid (Razorpay NetBanking)',
    paymentId: 'pay_RZP77263412',
    createdAt: '2026-08-15 16:00'
  },
  {
    id: 'BK-9023',
    customerName: 'Saraswathi Amma (Senior Care)',
    customerPhone: '+91 98473 66778',
    serviceTitle: 'Senior Geriatric Pedicure & Foot Reflexology',
    serviceId: 'srv-7',
    stylistName: 'Ananya Nair',
    type: 'home-service',
    date: '2026-08-21',
    time: '11:00 AM',
    address: 'House No. 42, Kailas Nagar, Kanjikuzhy, Kottayam',
    landmark: 'Opposite Mount Carmel School',
    specialNotes: '[Special Needs: Bedside Assisted Grooming, Diabetic-Safe] | Warm herbal soak and acupressure massage for foot arthritis comfort.',
    amount: 799,
    status: 'Pending',
    paymentStatus: 'Paid (Razorpay UPI)',
    paymentId: 'pay_RZP66382910',
    createdAt: '2026-08-16 14:00'
  }
];

export const INITIAL_PAYMENTS = [
  {
    id: 'pay_RZP98234721',
    bookingId: 'BK-9021',
    customerName: 'K. R. Menon (Senior Care)',
    serviceTitle: 'Elderly Gentle Grooming & Hair Care',
    amount: 550,
    method: 'Razorpay UPI (Google Pay)',
    status: 'Success',
    date: '2026-08-16',
    time: '10:32'
  },
  {
    id: 'pay_RZP88129034',
    bookingId: 'BK-9022',
    customerName: 'Lakshmi Pillai',
    serviceTitle: '24K Gold Glow Facial & Hydration',
    amount: 2200,
    method: 'Razorpay Card (Visa)',
    status: 'Success',
    date: '2026-08-16',
    time: '11:17'
  },
  {
    id: 'pay_RZP77263412',
    bookingId: 'BK-9020',
    customerName: 'Dr. George Thomas',
    serviceTitle: 'Signature Royal Haircut & Styling',
    amount: 850,
    method: 'Razorpay NetBanking (SBI)',
    status: 'Success',
    date: '2026-08-15',
    time: '16:05'
  },
  {
    id: 'pay_RZP66382910',
    bookingId: 'BK-9023',
    customerName: 'Saraswathi Amma (Senior Care)',
    serviceTitle: 'Senior Geriatric Pedicure & Foot Reflexology',
    amount: 799,
    method: 'Razorpay UPI (PhonePe)',
    status: 'Success',
    date: '2026-08-16',
    time: '14:05'
  }
];

export const INITIAL_FEEDBACK = [
  {
    id: 'fb-1',
    customerName: 'Adv. Suresh Kumar (for Father)',
    rating: 5,
    comment: 'Akash K Biju was exceptionally patient, respectful, and gentle with my 84-year-old father. He brought sanitized tools and finished the bedside haircut without any rush. Outstanding service!',
    date: '2026-08-16',
    service: 'Elderly Gentle Grooming & Hair Care'
  },
  {
    id: 'fb-2',
    customerName: 'Dr. Radhika Varma',
    rating: 5,
    comment: 'Ananya Nair provided a soothing therapeutic foot reflexology session for my mother who suffers from severe arthritis. Her pain reduced remarkably.',
    date: '2026-08-15',
    service: 'Senior Geriatric Pedicure & Foot Reflexology'
  },
  {
    id: 'fb-3',
    customerName: 'Arjun Nambiar',
    rating: 5,
    comment: 'Rahul Krishna gave me the best fade haircut and hot towel shave in town. Fast, hygienic, and extremely professional.',
    date: '2026-08-14',
    service: 'Signature Royal Haircut & Styling'
  }
];
