// StyleSync AI Beauty Studio - Master Dataset
// Rich, curated catalogue for Hair, Skin, Nail, Makeup, and Grooming Studios

export const FACE_SHAPES = [
  {
    id: 'Oval',
    name: 'Oval Face Shape',
    ratio: '1:1.5 Balanced Ratio',
    description: 'Even proportions, softly curved jawline, and forehead slightly wider than the chin. Highly versatile.',
    bestStyles: ['Layered Waves', 'Textured Crop', 'Side Part Bob', 'Classic Fade', 'Sleek Lob'],
    avoidTips: 'Avoid heavy blunt bangs that unnecessarily shorten balanced facial symmetry.',
    groomingAdvice: 'Clean stubble or balanced short boxed beard maintains natural symmetry.'
  },
  {
    id: 'Round',
    name: 'Round Face Shape',
    ratio: '1:1 Soft Contour',
    description: 'Equal width and length with soft, rounded cheeks and curved jawline.',
    bestStyles: ['High Volume Pompadour', 'Long Layered Cut', 'Side-Swept Bangs', 'Vertical Quiff', 'Asymmetric Lob'],
    avoidTips: 'Avoid chin-length blunt cuts or wide afro bobs that add horizontal bulk.',
    groomingAdvice: 'Angular goatee or chin-strap beard creates lengthening definition.'
  },
  {
    id: 'Square',
    name: 'Square Face Shape',
    ratio: '1:1 Angular Contour',
    description: 'Strong, defined jawline and broad forehead with sharp angular bone structure.',
    bestStyles: ['Textured French Crop', 'Soft Shag', 'Side Swept Undercut', 'Curtain Bangs', 'Wavy Mid-Length'],
    avoidTips: 'Avoid sharp geometric bobs or slick-backed flat styles that over-emphasize jaw width.',
    groomingAdvice: 'Softened full beard or short tapered stubble softens prominent jaw corners.'
  },
  {
    id: 'Heart',
    name: 'Heart Face Shape',
    ratio: 'Wide Brow, Narrow Chin',
    description: 'Broad forehead tapering down to a delicate, pointed chin.',
    bestStyles: ['Collarbone Lob', 'Textured Curtain Bangs', 'Medium Wavy Shag', 'Side Part Fringe', 'Chin Length Bob'],
    avoidTips: 'Avoid heavy top volume without lower width; balance is needed at the chin line.',
    groomingAdvice: 'Fuller beard along the jaw and chin balances upper face width.'
  },
  {
    id: 'Diamond',
    name: 'Diamond Face Shape',
    ratio: 'Prominent Cheekbones',
    description: 'Narrow forehead and chin with high, dramatic cheekbones.',
    bestStyles: ['Chin-Length Bob', 'Textured Waves', 'Deep Side Part', 'Wispy Bangs', 'Medium Layered Shag'],
    avoidTips: 'Avoid excessive width at the cheekbone line; add volume at forehead or jawline.',
    groomingAdvice: 'Neat boxed beard fills out the narrower jawline.'
  },
  {
    id: 'Oblong',
    name: 'Oblong / Rectangular Face Shape',
    ratio: 'Longer than Wide',
    description: 'Long vertical face plane with uniform width across forehead, cheekbones, and jaw.',
    bestStyles: ['Voluminous Waves', 'Full Fringe / Bangs', 'Side Part Medium Bob', 'Textured Crop', 'Curly Lob'],
    avoidTips: 'Avoid towering pompadours or long pin-straight hair that elongates face further.',
    groomingAdvice: 'Fuller sideburns and wider mustache add horizontal visual balance.'
  }
];

export const HAIRSTYLES = [
  // ── Women / Long / Medium / Short / Curly / Layered ───────────────────────
  {
    id: 'w-long-layered-waves',
    name: 'Voluminous Butterfly Layers',
    gender: 'women',
    length: 'long',
    texture: 'wavy',
    category: 'layered',
    faceShapes: ['Oval', 'Square', 'Oblong', 'Heart'],
    description: 'Cascading butterfly layers designed for maximum bounce, movement, and face-framing softness.',
    stylistTip: 'Blow-dry with a 45mm round ceramic brush and finish with lightweight texturizing mist.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 6-8 weeks',
    availableService: 'Signature Butterfly Layer Cut & Blowdry',
    servicePrice: '$55',
    serviceDuration: '50 min',
    tags: ['Layered', 'Long', 'Popular', 'Trending']
  },
  {
    id: 'w-french-bob',
    name: 'Classic French Bob & Fringe',
    gender: 'women',
    length: 'short',
    texture: 'straight',
    category: 'short',
    faceShapes: ['Oval', 'Heart', 'Diamond'],
    description: 'Chic Parisian chin-skimming bob paired with wispy eyebrow-grazing fringe.',
    stylistTip: 'Air dry with a drop of argan hair serum for understated effortless Parisian sheen.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 4-5 weeks',
    availableService: 'Parisian French Bob Precision Cut',
    servicePrice: '$48',
    serviceDuration: '45 min',
    tags: ['Short', 'Chic', 'Classic']
  },
  {
    id: 'w-curtain-bangs-lob',
    name: 'Textured Lob with Curtain Bangs',
    gender: 'women',
    length: 'medium',
    texture: 'wavy',
    category: 'medium',
    faceShapes: ['Oval', 'Round', 'Square', 'Heart', 'Diamond'],
    description: 'Shoulder-grazing textured long bob featuring soft 70s-inspired cheekbone curtain bangs.',
    stylistTip: 'Pinch curtain bangs at the cheekbone peak while diffusing for instant contouring.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 6 weeks',
    availableService: 'Textured Lob & Curtain Fringe Styling',
    servicePrice: '$50',
    serviceDuration: '45 min',
    tags: ['Medium', 'Most Loved', 'Versatile']
  },
  {
    id: 'w-curly-shag',
    name: 'Modern Defined Curly Shag',
    gender: 'women',
    length: 'medium',
    texture: 'curly',
    category: 'curly',
    faceShapes: ['Oval', 'Square', 'Heart', 'Diamond'],
    description: 'Dynamic multi-layered shag specifically shaped for natural curly and coily volume.',
    stylistTip: 'Apply curl defining cream on soaking wet hair using the praying-hands method.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 8 weeks',
    availableService: 'Curl Sculpting & Diffused Definition Cut',
    servicePrice: '$58',
    serviceDuration: '60 min',
    tags: ['Curly', 'Medium', 'Natural Texture', 'Volume']
  },
  {
    id: 'w-sleek-glass-hair',
    name: 'Ultra-Sleek Glass Hair',
    gender: 'women',
    length: 'long',
    texture: 'straight',
    category: 'long',
    faceShapes: ['Oval', 'Round', 'Heart'],
    description: 'Precision one-length long cut polished to high-reflective mirror glass gloss.',
    stylistTip: 'Requires heat protector and keratin smoothing booster before ceramic pass.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Smooth treatment every 3 months',
    availableService: 'Glass Hair Silk Press & Precision Trim',
    servicePrice: '$65',
    serviceDuration: '60 min',
    tags: ['Long', 'Luxury', 'Minimalist']
  },
  {
    id: 'w-pixie-crop',
    name: 'Textured Pixie Crop',
    gender: 'women',
    length: 'short',
    texture: 'straight',
    category: 'short',
    faceShapes: ['Oval', 'Heart', 'Diamond'],
    description: 'Bold feminine pixie with feathered crown texture and soft tapered nape.',
    stylistTip: 'Style with matte styling paste worked through fingers for piecey definition.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 3-4 weeks',
    availableService: 'Textured Pixie Cut & Crown Sculpt',
    servicePrice: '$42',
    serviceDuration: '35 min',
    tags: ['Short', 'Bold', 'Low Maintenance']
  },

  // ── Men / Grooming / Short / Medium / Curly / Fade ─────────────────────────
  {
    id: 'm-textured-crop-fade',
    name: 'Textured Crop with Mid Skin Fade',
    gender: 'men',
    length: 'short',
    texture: 'straight',
    category: 'men',
    faceShapes: ['Oval', 'Square', 'Round', 'Diamond'],
    description: 'Contemporary European textured French crop paired with precision blurry mid skin fade.',
    stylistTip: 'Dust lightweight matte styling powder into roots and scrunch with fingertips.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Fade cleanup every 2-3 weeks',
    availableService: 'Master Barber Fade & French Crop',
    servicePrice: '$35',
    serviceDuration: '30 min',
    tags: ['Men', 'Short', 'Top Trend', 'Low Maintenance']
  },
  {
    id: 'm-classic-pompadour',
    name: 'Royal Executive Pompadour',
    gender: 'men',
    length: 'medium',
    texture: 'straight',
    category: 'men',
    faceShapes: ['Oval', 'Round', 'Square'],
    description: 'High-lift sculpted pompadour tapering neatly down to blended scissor-over-comb sides.',
    stylistTip: 'Pre-style with sea salt spray and lock the front quiff using water-soluble medium pomade.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 3-4 weeks',
    availableService: 'Executive Scissor Cut & Pompadour Blowout',
    servicePrice: '$40',
    serviceDuration: '40 min',
    tags: ['Men', 'Medium', 'Executive', 'Polished']
  },
  {
    id: 'm-wavy-curtains',
    name: '90s Flow Wavy Middle Part',
    gender: 'men',
    length: 'medium',
    texture: 'wavy',
    category: 'medium',
    faceShapes: ['Oval', 'Heart', 'Diamond', 'Square'],
    description: 'Relaxed center-parted layered curtain flow with natural ear-tucking movement.',
    stylistTip: 'Apply lightweight leave-in moisturizing conditioner and let dry naturally.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 6 weeks',
    availableService: 'Curtain Flow Layered Cut & Texturizing',
    servicePrice: '$38',
    serviceDuration: '35 min',
    tags: ['Medium', 'Men', 'Casual', 'Trending']
  },
  {
    id: 'm-curly-taper-fade',
    name: 'Textured Curly High Taper Fade',
    gender: 'men',
    length: 'short',
    texture: 'curly',
    category: 'curly',
    faceShapes: ['Oval', 'Square', 'Oblong'],
    description: 'High volume defined natural curl canopy with ultra-clean temple and neckline tapers.',
    stylistTip: 'Hydrate with curl foam and avoid comb brushing when dry to prevent frizz.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Taper refresh every 2 weeks',
    availableService: 'Curl Definition & High Taper Fade',
    servicePrice: '$38',
    serviceDuration: '35 min',
    tags: ['Curly', 'Men', 'Definition', 'Sharp']
  },
  {
    id: 'm-buzz-lineup',
    name: 'Military Buzz Cut & Razor Lineup',
    gender: 'men',
    length: 'short',
    texture: 'straight',
    category: 'short',
    faceShapes: ['Oval', 'Square', 'Diamond'],
    description: 'Ultra-clean #2 clipper uniform buzz finished with laser-sharp straight razor edge work.',
    stylistTip: 'Maintain with daily scalp moisturizer and SPF 50 sunscreen.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 2 weeks',
    availableService: 'Precision Buzz Cut & Razor Lineup',
    servicePrice: '$28',
    serviceDuration: '25 min',
    tags: ['Short', 'Men', 'Ultra Sharp', 'Athletic']
  },
  {
    id: 'm-side-part-fade',
    name: 'Modern Side Part Gentleman Taper',
    gender: 'men',
    length: 'short',
    texture: 'straight',
    category: 'men',
    faceShapes: ['Oval', 'Square', 'Oblong', 'Heart'],
    description: 'Timeless tailored gentleman side parting with clean tapered sides and natural shine.',
    stylistTip: 'Comb through with styling cream when damp for a sophisticated all-day hold.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80',
    maintenance: 'Trim every 3 weeks',
    availableService: 'Classic Gentleman Cut & Hot Towel Finish',
    servicePrice: '$36',
    serviceDuration: '30 min',
    tags: ['Short', 'Men', 'Business', 'Classic']
  }
];

export const HAIR_COLORS = [
  { id: 'original', name: 'Natural / Match Mine', hex: 'transparent', description: 'Keeps your authentic hair color' },
  { id: 'espresso-black', name: 'Midnight Espresso', hex: '#120f0d', description: 'Deep, rich black with glossy obsidian sheen' },
  { id: 'chestnut-brown', name: 'Chestnut Brown', hex: '#4a2c1d', description: 'Warm cocoa undertones with soft amber reflections' },
  { id: 'honey-blonde', name: 'Golden Honey Blonde', hex: '#d4af37', description: 'Sun-drenched dimensional blonde highlights' },
  { id: 'platinum-silver', name: 'Ice Platinum Silver', hex: '#e2e8f0', description: 'Ultra-cool Nordic metallic icy shimmer' },
  { id: 'burgundy-wine', name: 'Royal Burgundy Wine', hex: '#6b172a', description: 'Deep jewel-toned red velvet formulation' },
  { id: 'copper-auburn', name: 'Spiced Copper Auburn', hex: '#9c411e', description: 'Vibrant autumnal ginger copper vibrancy' },
  { id: 'rose-gold', name: 'Blush Rose Gold', hex: '#b76e79', description: 'Subtle pastel rose woven with champagne gold' }
];

export const SKIN_CARE_METRICS = [
  { key: 'redness', label: 'Redness / Sensitivity', unit: '%', optimal: 'Low', desc: 'Indicates vascular response, skin barrier irritation, or flush tone' },
  { key: 'oiliness', label: 'Sebum / Oil Balance', unit: '%', optimal: 'Balanced', desc: 'Specular reflectance across forehead and T-zone pore areas' },
  { key: 'texture', label: 'Skin Texture Smoothness', unit: '%', optimal: 'High', desc: 'Evenness of microscopic facial surface and stratum corneum' },
  { key: 'pores', label: 'Pore Refinement Index', unit: '%', optimal: 'Refined', desc: 'Visible density of enlarged follicular openings around nose/cheeks' },
  { key: 'hydration', label: 'Hydration & Barrier Plump', unit: '%', optimal: 'High', desc: 'Optical bounce and epidermal water retention level' }
];

export const NAIL_SHADES = [
  { id: 'crimson-ruby', name: 'Ruby Glam Red', hex: '#990011', finish: 'High Gloss Gel' },
  { id: 'ballet-slipper', name: 'Ballet Nude', hex: '#f4e4dd', finish: 'Sheer Gel' },
  { id: 'glazed-chrome', name: 'Hailey Glazed Chrome', hex: '#e8e8ed', finish: 'Mirror Chrome' },
  { id: 'french-white', name: 'French Tip Ivory', hex: '#fdfbf7', finish: 'Solid Creme' },
  { id: 'velvet-plum', name: 'Midnight Plum', hex: '#3b122d', finish: 'Velvet Matte' },
  { id: 'sage-pastel', name: 'Soft Sage Matcha', hex: '#a8bfa8', finish: 'Pastel Creme' },
  { id: 'gold-shimmer', name: 'Champagne Glitter', hex: '#d1b26f', finish: 'Micro-Glitter' },
  { id: 'noir-matte', name: 'Obsidian Noir', hex: '#171717', finish: 'Satin Matte' }
];

export const NAIL_DESIGNS = [
  {
    id: 'french-minimal',
    name: 'Micro French Minimalist',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
    description: 'Ultra-thin modern French smile lines on a clean neutral sheer base.',
    serviceCategory: 'Manicure'
  },
  {
    id: 'chrome-donut',
    name: 'Glazed Donut Pearl Chrome',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
    description: 'Iridescent pearl powder rubbed over creamy porcelain gel.',
    serviceCategory: 'Gel Extensions'
  },
  {
    id: 'ombre-blush',
    name: 'Rosewater Ombré Fade',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
    description: 'Soft seamless gradient melting from sheer blush root to milky white tip.',
    serviceCategory: 'Nail Art'
  },
  {
    id: 'gold-foil-accent',
    name: 'Artisan Gold Leaf Accents',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    description: 'Hand-placed 24k gold leaf flakes embedded in crystal clear builder gel.',
    serviceCategory: 'Luxury Nail Art'
  }
];

export const MAKEUP_LOOKS = [
  {
    id: 'clean-girl-glow',
    name: 'Clean Girl Soft Glow',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    description: 'Dewy skin tint, feathery brushed brows, soft cream rose blush, and glass lip oil.',
    lipstick: { name: 'Glossy Rose Nude', hex: '#cf7a7a' },
    blush: { name: 'Dewy Peachy Pink', hex: '#f28e8e' }
  },
  {
    id: 'red-carpet-glam',
    name: 'Classic Hollywood Crimson Glam',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
    description: 'Velvet matte red lips, winged feline eyeliner, sculpted contour, and satin skin.',
    lipstick: { name: 'Ruby Velvet Crimson', hex: '#b00b28' },
    blush: { name: 'Warm Terracotta Contour', hex: '#b56551' }
  },
  {
    id: 'bridal-elegance',
    name: 'Luxe Champagne Bridal',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
    description: 'Soft shimmering champagne lids, airbrushed complexion, and romantic dusty rose lips.',
    lipstick: { name: 'Dusty Rose Petal', hex: '#c9787e' },
    blush: { name: 'Subtle Rose Petal', hex: '#d98b96' }
  },
  {
    id: 'smoky-bronze',
    name: 'Smoky Bronze Sultry',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=700&q=80',
    description: 'Smoky copper-bronze diffused eye gradient, chiseled cheekbones, and creamy warm nude lips.',
    lipstick: { name: 'Warm Honeyed Nude', hex: '#ad6a52' },
    blush: { name: 'Sun-Drenched Bronze', hex: '#9e5239' }
  }
];

export const LIPSTICK_SHADES = [
  { id: 'crimson-ruby', name: 'Ruby Velvet Crimson', hex: '#9e1329', finish: 'Matte' },
  { id: 'dusty-rose', name: 'Dusty Rose Petal', hex: '#c9787e', finish: 'Satin' },
  { id: 'nude-mocha', name: 'Mocha Warm Nude', hex: '#945c48', finish: 'Cream' },
  { id: 'berry-plum', name: 'Deep Royal Plum', hex: '#631d38', finish: 'Velvet' },
  { id: 'peach-coral', name: 'Sun Coral Glow', hex: '#e07663', finish: 'Gloss' }
];

export const BLUSH_SHADES = [
  { id: 'peachy-pink', name: 'Soft Peachy Pink', hex: '#f08080' },
  { id: 'dusty-rose', name: 'Rosewood Mauve', hex: '#c08081' },
  { id: 'warm-terracotta', name: 'Warm Terracotta', hex: '#c86d51' },
  { id: 'berry-flush', name: 'Fresh Berry Flush', hex: '#b24c63' }
];

export const GROOMING_STYLES = [
  {
    id: 'crisp-heavy-stubble',
    name: 'Designer 3-Day Heavy Stubble',
    faceShapes: ['Oval', 'Square', 'Round', 'Oblong', 'Heart', 'Diamond'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    description: '3mm uniform designer stubble with sharp cheek line fading and tidy neck boundary.',
    stylistAdvice: 'Exfoliate twice weekly and apply lightweight beard oil to soften bristle tips.',
    serviceName: 'Beard Trim & Lineup'
  },
  {
    id: 'short-boxed-beard',
    name: 'Sculpted Short Boxed Beard',
    faceShapes: ['Oval', 'Round', 'Heart', 'Diamond'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    description: 'Neatly cropped 10-12mm beard sculpted into square masculine angles along the jaw.',
    stylistAdvice: 'Comb downward daily and trim mustache clear of upper lip border.',
    serviceName: 'Royal Beard Sculpt & Trim'
  },
  {
    id: 'classic-full-beard',
    name: 'Executive Classic Full Beard',
    faceShapes: ['Oval', 'Oblong', 'Square'],
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
    description: 'Thick, healthy, full-bodied beard meticulously shaped with tapering towards the neckline.',
    stylistAdvice: 'Use deep conditioning beard butter and wooden boar-bristle brush.',
    serviceName: 'Beard Spa & Steam Treatment'
  },
  {
    id: 'sharp-goatee',
    name: 'Precision Anchor Goatee',
    faceShapes: ['Square', 'Round', 'Diamond'],
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
    description: 'Distinct chin beard with connected or floating mustache and clean razor-shaved cheeks.',
    stylistAdvice: 'Requires precision razor work every 3-4 days to keep cheeks glass smooth.',
    serviceName: 'Hot Towel Razor Shave & Goatee Detail'
  },
  {
    id: 'clean-shaven-gentleman',
    name: 'Clean Shaven Royal Executive',
    faceShapes: ['Oval', 'Diamond', 'Square', 'Heart', 'Oblong'],
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80',
    description: 'Silky smooth hot-lather razor shave followed by cooling botanical pore astringent.',
    stylistAdvice: 'Hot towel pre-treatment opens pores, preventing ingrown hairs and razor burn.',
    serviceName: 'Signature Hot Towel Shave'
  }
];
