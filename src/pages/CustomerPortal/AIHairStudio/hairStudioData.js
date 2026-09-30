// StyleSync AI Hair Studio Data Catalog
// Comprehensive styles for Boys & Girls, curated color shades, and face shape guides

export const HAIRSTYLE_CATEGORIES = [
  { id: 'all', label: 'All Styles' },
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'straight', label: 'Straight' },
  { id: 'trending', label: 'Trending 🔥' },
];

export const GENDER_FILTERS = [
  { id: 'all', label: 'All Looks' },
  { id: 'boy', label: 'Boys & Men' },
  { id: 'girl', label: 'Girls & Women' },
];

export const HAIRSTYLES = [
  // ─────────────────── BOYS' HAIRSTYLES ───────────────────
  {
    id: 'boy-low-fade',
    name: 'Clean Low Fade',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'Low Fade', 'Clean', 'Professional'],
    trending: true,
    faceShapes: ['Oval', 'Round', 'Square'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy', 'Curly'],
    recommendedService: 'Men\'s Precision Fade & Cut',
    duration: '45 mins',
    price: 60,
    description: 'Subtle taper starting just above the ears, blending cleanly into longer top hair. Subtle and dapper for both corporate and casual wear.',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Ask your stylist to keep crisp edges around the neckline with a matte clay finish.'
  },
  {
    id: 'boy-mid-fade',
    name: 'Mid Taper Fade with Texture',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'Mid Fade', 'Textured', 'Modern'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Diamond'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Men\'s Precision Fade & Cut',
    duration: '45 mins',
    price: 60,
    description: 'Balanced fade starting midway up the head, providing strong contrast while showcasing textured length on top.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Style with sea salt spray and lightweight pomade to accentuate the separation.'
  },
  {
    id: 'boy-high-fade',
    name: 'High Skin Fade & Crop',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'High Fade', 'Athletic', 'Edgy'],
    trending: false,
    faceShapes: ['Round', 'Square'],
    maintenance: 'Medium',
    hairTexture: ['Straight', 'Wavy', 'Curly'],
    recommendedService: 'Men\'s Precision Fade & Cut',
    duration: '40 mins',
    price: 60,
    description: 'Bold high fade starting near the crown, emphasizing sharp bone structure and athletic definition.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Requires touch-ups every 2 to 3 weeks to keep the high fade razor-sharp.'
  },
  {
    id: 'boy-buzz-cut',
    name: 'Military Buzz Cut & Lineup',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'Buzz Cut', 'Minimal', 'Low Maintenance'],
    trending: false,
    faceShapes: ['Oval', 'Square'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy', 'Curly', 'Coily'],
    recommendedService: 'Express Clipper Cut & Beard Trim',
    duration: '30 mins',
    price: 45,
    description: 'Uniform short clipper cut with razor-sharp temple lineups. Extremely low maintenance and masculine.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Pair with a well-groomed stubble or beard for peak aesthetic symmetry.'
  },
  {
    id: 'boy-textured-crop',
    name: 'French Crop with Textured Fringe',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'French Crop', 'Fringe', 'Trending'],
    trending: true,
    faceShapes: ['Oval', 'Oblong', 'Heart'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Men\'s Precision Fade & Cut',
    duration: '45 mins',
    price: 60,
    description: 'Blunt or textured forward fringe paired with short tapered sides. Fantastic for framing the forehead and concealing high hairlines.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Use matte styling dust for instant lift and effortless disheveled texture.'
  },
  {
    id: 'boy-pompadour-undercut',
    name: 'Modern Pompadour Undercut',
    gender: 'boy',
    category: 'medium',
    tags: ['Medium', 'Pompadour', 'Undercut', 'Classic'],
    trending: true,
    faceShapes: ['Oval', 'Round', 'Square'],
    maintenance: 'High',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Gentlemen\'s Executive Cut & Style',
    duration: '50 mins',
    price: 70,
    description: 'Voluminous swept-back pompadour on top disconnected from tight undercut sides. Bold, luxurious, and rockstar classic.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Blow-dry with a round brush upward from the roots before locking in with high-hold pomade.'
  },
  {
    id: 'boy-quiff-slick',
    name: 'Textured Quiff & Tapered Sides',
    gender: 'boy',
    category: 'medium',
    tags: ['Medium', 'Quiff', 'Trending', 'Modern'],
    trending: true,
    faceShapes: ['Oval', 'Square', 'Round'],
    maintenance: 'Medium',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Men\'s Precision Fade & Cut',
    duration: '45 mins',
    price: 60,
    description: 'Upward swooping front quiff with soft matte separation. Accentuates cheekbones and provides youthful, elevated volume.',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Finger-comb through the fringe while blow-drying on medium heat for natural flow.'
  },
  {
    id: 'boy-curly-fade',
    name: 'Curly High-Top Taper Fade',
    gender: 'boy',
    category: 'curly',
    tags: ['Curly', 'High Top', 'Fade', 'Youthful'],
    trending: true,
    faceShapes: ['Oval', 'Square', 'Heart'],
    maintenance: 'Medium',
    hairTexture: ['Curly', 'Coily'],
    recommendedService: 'Curl Definition & Custom Fade',
    duration: '50 mins',
    price: 65,
    description: 'Embraces natural ringlets on top while keeping the sides cleanly faded. Clean, defined, and full of natural bouncy texture.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Apply curl leave-in conditioner to wet curls and avoid brushing dry hair.'
  },
  {
    id: 'boy-wavy-curtains',
    name: 'Wavy Middle Part & Flow',
    gender: 'boy',
    category: 'wavy',
    tags: ['Wavy', 'Medium', 'Curtains', 'Trending'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Oblong'],
    maintenance: 'Low',
    hairTexture: ['Wavy', 'Straight'],
    recommendedService: 'Scissor Cut & Texture Shaping',
    duration: '50 mins',
    price: 65,
    description: '90s revived middle-part curtains with natural gentle waves falling around cheekbones. Effortlessly charismatic.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Part down the center with damp hair and allow to air-dry with a dime of nourishing cream.'
  },
  {
    id: 'boy-long-flow',
    name: 'Surfer Waves & Long Layered Flow',
    gender: 'boy',
    category: 'long',
    tags: ['Long', 'Wavy', 'Layered', 'Free-Spirit'],
    trending: false,
    faceShapes: ['Oval', 'Square', 'Oblong'],
    maintenance: 'Medium',
    hairTexture: ['Wavy', 'Straight'],
    recommendedService: 'Long Hair Scissor Sculpting & Treatment',
    duration: '60 mins',
    price: 75,
    description: 'Shoulder-length textured layers with natural movement. Can be worn freely or tied into a clean half-knot.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Use a deep-nourishing hair mask weekly to keep long ends healthy and split-free.'
  },

  // ─────────────────── GIRLS' HAIRSTYLES ───────────────────
  {
    id: 'girl-butterfly-cut',
    name: 'Signature Butterfly Cut with Volume',
    gender: 'girl',
    category: 'long',
    tags: ['Long', 'Butterfly Cut', 'Voluminous', 'Trending'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Round', 'Square'],
    maintenance: 'Medium',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Signature Butterfly Cut & Blowout',
    duration: '60 mins',
    price: 85,
    description: 'Feathered face-framing shorter layers paired with cascading long lengths that give the illusion of shorter voluminous hair from the front.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Style with large velcro rollers or round brush blow-dry for that bouncy 90s supermodel blowout.'
  },
  {
    id: 'girl-wolf-cut',
    name: 'Modern Shaggy Wolf Cut',
    gender: 'girl',
    category: 'medium',
    tags: ['Medium', 'Wolf Cut', 'Shag', 'Edgy', 'Trending'],
    trending: true,
    faceShapes: ['Oval', 'Square', 'Round'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy', 'Curly'],
    recommendedService: 'Custom Shag & Razor Layering',
    duration: '55 mins',
    price: 75,
    description: 'A hybrid of the vintage shag cut and modern mullet with soft choppy crown layers and wispy face-framing curtain fringe.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Scrunch in styling foam on damp hair and diffuse dry to highlight the choppy layers.'
  },
  {
    id: 'girl-classic-bob',
    name: 'French Chic Chin-Length Bob',
    gender: 'girl',
    category: 'short',
    tags: ['Short', 'Bob Cut', 'Elegant', 'Timeless'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Oblong'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Precision Bob Cut & Gloss Treatment',
    duration: '50 mins',
    price: 70,
    description: 'Crisp chin-grazing blunt bob with subtle interior beveling. Exudes effortless Parisian elegance and sharp collarbone definition.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Tuck one side behind the ear to create chic asymmetrical intrigue.'
  },
  {
    id: 'girl-pixie-cut',
    name: 'Textured Pixie with Soft Side Fringe',
    gender: 'girl',
    category: 'short',
    tags: ['Short', 'Pixie Cut', 'Bold', 'Sculpted'],
    trending: false,
    faceShapes: ['Oval', 'Heart', 'Diamond'],
    maintenance: 'Low',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Precision Pixie Cut & Styling',
    duration: '45 mins',
    price: 65,
    description: 'Cropped tapered nape and ear line with soft longer feathery strands across the crown and forehead. Ultra chic and empowering.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Emphasize texture using a lightweight styling paste or dry wax stick.'
  },
  {
    id: 'girl-curtain-bangs-layers',
    name: 'Long Cascading Layers & Curtain Bangs',
    gender: 'girl',
    category: 'long',
    tags: ['Long', 'Curtain Bangs', 'Layered', 'Soft'],
    trending: true,
    faceShapes: ['Oval', 'Round', 'Square', 'Heart'],
    maintenance: 'Medium',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Long Layering Cut & Curtain Bangs',
    duration: '60 mins',
    price: 80,
    description: 'Romantic cheekbone-skimming curtain bangs sweeping outward into seamless long cascading layers that enhance body and bounce.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Blow-dry bangs forward and away from the face with a round brush for a soft curtain swoop.'
  },
  {
    id: 'girl-blunt-shoulder-lob',
    name: 'Sleek Shoulder-Length Lob',
    gender: 'girl',
    category: 'medium',
    tags: ['Medium', 'Lob', 'Straight', 'Professional'],
    trending: false,
    faceShapes: ['Round', 'Square', 'Oval'],
    maintenance: 'Low',
    hairTexture: ['Straight'],
    recommendedService: 'Blunt Cut Lob & Keratin Shine',
    duration: '50 mins',
    price: 70,
    description: 'Long bob resting right at the collarbones with crisp blunt ends. Elongates the neck and flatters round or square jawlines.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Finish with a gloss serum down the mid-lengths and ends for that mirror-like liquid hair sheen.'
  },
  {
    id: 'girl-curly-shag',
    name: 'Defined Curly Volume & Shag Bangs',
    gender: 'girl',
    category: 'curly',
    tags: ['Curly', 'Medium', 'Voluminous', 'Natural Texture'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Oblong'],
    maintenance: 'Medium',
    hairTexture: ['Curly', 'Coily'],
    recommendedService: 'Dry Curly Cut & Deep Hydration Treatment',
    duration: '65 mins',
    price: 85,
    description: 'Layered curly shape that eliminates the dreaded bottom-heavy triangle, creating beautiful balanced crown volume and soft curly bangs.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Style soaking wet with curl cream and curl gel, then diffuse on low heat without touching until fully dry.'
  },
  {
    id: 'girl-beach-waves',
    name: 'Effortless Sun-Kissed Beach Waves',
    gender: 'girl',
    category: 'wavy',
    tags: ['Wavy', 'Long', 'Boho', 'Effortless'],
    trending: true,
    faceShapes: ['Oval', 'Round', 'Square', 'Heart'],
    maintenance: 'Low',
    hairTexture: ['Wavy', 'Straight'],
    recommendedService: 'Texturizing Cut & Wave Style',
    duration: '55 mins',
    price: 75,
    description: 'Relaxed, lived-in loose waves with straight ends for that effortless coastal cool aesthetic.',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Leave the last 1.5 inches uncurled when using a curling iron for the authentic lived-in wave look.'
  },
  {
    id: 'girl-sleek-glass-straight',
    name: 'Ultra-Sleek Glass Hair Long Cut',
    gender: 'girl',
    category: 'straight',
    tags: ['Straight', 'Long', 'Glossy', 'High Fashion'],
    trending: false,
    faceShapes: ['Oval', 'Round', 'Heart'],
    maintenance: 'Medium',
    hairTexture: ['Straight'],
    recommendedService: 'Precision Straight Cut & Gloss Seal',
    duration: '60 mins',
    price: 80,
    description: 'Pin-straight, mirror-reflective long tresses cut with surgical precision. Exudes red carpet luxury and refined discipline.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Use a heat protectant spray and finish with a silk flat iron pass at 360°F.'
  },
  {
    id: 'girl-blunt-bangs-layers',
    name: 'Bold French Fringe & Face Framing',
    gender: 'girl',
    category: 'medium',
    tags: ['Medium', 'Blunt Bangs', 'Chic', 'Statement'],
    trending: false,
    faceShapes: ['Oval', 'Oblong', 'Heart'],
    maintenance: 'Medium',
    hairTexture: ['Straight', 'Wavy'],
    recommendedService: 'Full Fringe Cut & Styling',
    duration: '45 mins',
    price: 65,
    description: 'Full brow-skimming blunt bangs paired with soft tapered layers that soften cheekbones and accentuate the eyes.',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Blow-dry the fringe side-to-side flat against the forehead to prevent separation or cowlick splits.'
  }
];

// ─────────────────── HAIR COLOR PALETTE ───────────────────
export const HAIR_COLORS = [
  {
    id: 'original',
    name: 'Natural Hair (Keep As-Is)',
    family: 'Natural',
    hex: 'transparent',
    accentHex: '#d4af37',
    description: 'Preserves your natural hair color while experimenting with fresh cuts and shapes.'
  },
  {
    id: 'natural-black',
    name: 'Midnight Onyx Black',
    family: 'Black & Brown',
    hex: '#161314',
    accentHex: '#262224',
    description: 'Deep, rich jet black with high-gloss mirror shine.'
  },
  {
    id: 'dark-brown',
    name: 'Dark Espresso Brown',
    family: 'Black & Brown',
    hex: '#2b1911',
    accentHex: '#452b1e',
    description: 'Rich dark roast brown with subtle warmth in natural light.'
  },
  {
    id: 'chocolate-brown',
    name: 'Rich Chocolate Truffle',
    family: 'Black & Brown',
    hex: '#4a2c1b',
    accentHex: '#6b4129',
    description: 'Luscious warm cocoa tones that flatter olive and golden skin undertones.'
  },
  {
    id: 'light-brown',
    name: 'Golden Chestnut Brown',
    family: 'Black & Brown',
    hex: '#6b4c35',
    accentHex: '#8c6547',
    description: 'Soft multidimensional medium-light brown with warm amber glints.'
  },
  {
    id: 'warm-honey-blonde',
    name: 'Warm Honey Blonde',
    family: 'Blondes',
    hex: '#c99a4c',
    accentHex: '#dfb56b',
    description: 'Sun-drenched golden blonde with rich buttery dimension.'
  },
  {
    id: 'ash-blonde',
    name: 'Cool Ash Champagne Blonde',
    family: 'Blondes',
    hex: '#baa68c',
    accentHex: '#d1c1a9',
    description: 'Sophisticated cool-toned blonde that neutralizes brassy undertones.'
  },
  {
    id: 'platinum-ice',
    name: 'Nordic Platinum Ice',
    family: 'Blondes',
    hex: '#e2dddb',
    accentHex: '#ffffff',
    description: 'Striking ultra-pale cool blonde for an ethereal, editorial statement.'
  },
  {
    id: 'copper-amber',
    name: 'Spiced Copper & Amber',
    family: 'Reds & Coppers',
    hex: '#a64b2a',
    accentHex: '#c76239',
    description: 'Radiant vibrant copper packed with autumnal fire and dimension.'
  },
  {
    id: 'deep-burgundy',
    name: 'Royal Velvet Burgundy',
    family: 'Reds & Coppers',
    hex: '#4a121e',
    accentHex: '#731e31',
    description: 'Deep vampy wine red that looks mysterious indoors and glows crimson in sunlight.'
  },
  {
    id: 'ruby-crimson',
    name: 'Vibrant Ruby Crimson',
    family: 'Reds & Coppers',
    hex: '#8c1d2e',
    accentHex: '#b3273e',
    description: 'Vivid fashion-forward ruby tone with intense saturation.'
  },
  {
    id: 'toffee-balayage',
    name: 'Caramel Toffee Balayage',
    family: 'Highlights & Balayage',
    hex: '#875638',
    accentHex: '#c49366',
    description: 'Seamless hand-painted caramel ribbons woven through deep brunette roots.'
  },
  {
    id: 'smoky-silver',
    name: 'Smoky Titanium Silver',
    family: 'Fashion',
    hex: '#787a82',
    accentHex: '#a0a3ac',
    description: 'Futuristic slate-silver finish with cool metallic undertones.'
  },
  {
    id: 'rose-gold-blush',
    name: 'Metallic Rose Gold Blush',
    family: 'Fashion',
    hex: '#b3777c',
    accentHex: '#d4969b',
    description: 'Romantic pastel pink blended with warm golden blonde highlights.'
  }
];

// ─────────────────── FACE SHAPE DATA ───────────────────
export const FACE_SHAPES = [
  {
    id: 'Oval',
    name: 'Oval Face',
    description: 'Well-balanced proportions with slightly rounded jawline and forehead slightly wider than the chin.',
    bestStyles: ['Butterfly Cut', 'Clean Low Fade', 'Textured Quiff', 'French Bob', 'Cascading Layers'],
    avoidTips: 'Almost every hairstyle complements an oval shape. Avoid overly heavy bangs that hide facial symmetry.'
  },
  {
    id: 'Round',
    name: 'Round Face',
    description: 'Soft curves with equal width and length, fuller cheeks, and a rounded chin.',
    bestStyles: ['High Skin Fade', 'Modern Pompadour', 'Shoulder Lob', 'Butterfly Cut', 'Side Swept Fringe'],
    avoidTips: 'Opt for height and volume on top to elongate the face. Avoid chin-length bobs that add width to cheeks.'
  },
  {
    id: 'Square',
    name: 'Square Face',
    description: 'Strong, defined angular jawline with proportional forehead and cheekbones.',
    bestStyles: ['Soft Wavy Flow', 'French Crop', 'Curtain Bangs', 'Mid Taper Fade', 'Textured Layers'],
    avoidTips: 'Soft, layered, and wavy styles soften the angular jawline. Avoid harsh geometric boxy cuts.'
  },
  {
    id: 'Heart',
    name: 'Heart Face',
    description: 'Wider forehead and cheekbones tapering down to a delicate, pointed chin.',
    bestStyles: ['French Chic Bob', 'Curtain Bangs', 'Textured Crop', 'Curly Shag', 'Wavy Curtains'],
    avoidTips: 'Styles with width around the jawline or collarbones create balanced harmony with the narrower chin.'
  },
  {
    id: 'Oblong',
    name: 'Oblong / Rectangular',
    description: 'Longer facial silhouette with straight sides and balanced cheekbones.',
    bestStyles: ['French Crop with Fringe', 'Blunt Bangs', 'Chin-Length Bob', 'Beach Waves', 'Wavy Flow'],
    avoidTips: 'Horizontal bangs and cheekbone volume balance the length. Avoid ultra-high pomp volume that adds height.'
  },
  {
    id: 'Diamond',
    name: 'Diamond Face',
    description: 'Widest at high cheekbones with a narrower forehead and tapered pointed chin.',
    bestStyles: ['Textured Pixie', 'Curtain Bangs', 'Mid Taper Fade', 'Side Parting', 'Shoulder Lob'],
    avoidTips: 'Show off your sculpted cheekbones with soft face-framing fringe or textured side parts.'
  }
];
