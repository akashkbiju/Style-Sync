// StyleSync AI Beauty Studio - Comprehensive Catalog & Styling Dataset
// Spanning Hair, Skin, Nail, Makeup, and Grooming Categories

// ─────────────────────────────────────────────────────────────────────────────
// 1. HAIR STUDIO DATA
// ─────────────────────────────────────────────────────────────────────────────

export const HAIRSTYLE_CATEGORIES = [
  { id: 'all', label: 'All Cuts' },
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'long', label: 'Long' },
  { id: 'curly', label: 'Curly' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'straight', label: 'Straight' },
  { id: 'trending', label: 'Trending 🔥' },
];

export const GENDER_FILTERS = [
  { id: 'all', label: 'All Styles' },
  { id: 'boy', label: 'Men & Boys' },
  { id: 'girl', label: 'Women & Girls' },
];

export const HAIRSTYLES = [
  // ─── MEN'S STYLES ───
  {
    id: 'hair-low-fade',
    name: 'Clean Low Fade',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'Low Fade', 'Clean', 'Professional'],
    trending: true,
    faceShapes: ['Oval', 'Round', 'Square'],
    hairTexture: ['Straight', 'Wavy', 'Curly'],
    maintenance: 'Low',
    recommendedService: "Men's Precision Fade & Cut",
    duration: '45 mins',
    price: 60,
    description: 'Tapered hairline starting just above ears, blending cleanly into longer top hair. Crisp and versatile for professional and casual styles.',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Finish with matte styling clay for non-greasy textured hold.'
  },
  {
    id: 'hair-mid-fade',
    name: 'Mid Taper Fade with Texture',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'Mid Fade', 'Textured', 'Modern'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Diamond'],
    hairTexture: ['Straight', 'Wavy'],
    maintenance: 'Medium',
    recommendedService: "Men's Precision Fade & Cut",
    duration: '45 mins',
    price: 60,
    description: 'Balanced fade starting midway up the temples, emphasizing textured scissor-cut length on the crown.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Spritz sea salt spray and air dry for effortless separation.'
  },
  {
    id: 'hair-textured-crop',
    name: 'Textured French Crop',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'French Crop', 'Fringe', 'Edgy'],
    trending: true,
    faceShapes: ['Oval', 'Oblong', 'Diamond'],
    hairTexture: ['Straight', 'Wavy'],
    maintenance: 'Low',
    recommendedService: "Men's Designer Crop",
    duration: '40 mins',
    price: 65,
    description: 'Blunt or textured micro-fringe paired with short faded sides. Framed to highlight sharp cheekbones.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Style forward with a pea-sized amount of styling paste.'
  },
  {
    id: 'hair-classic-pompadour',
    name: 'Modern Executive Pompadour',
    gender: 'boy',
    category: 'medium',
    tags: ['Medium', 'Pompadour', 'Volume', 'Classic'],
    trending: false,
    faceShapes: ['Round', 'Square', 'Oval'],
    hairTexture: ['Straight', 'Wavy'],
    maintenance: 'High',
    recommendedService: "Executive Grooming & Pompadour Cut",
    duration: '50 mins',
    price: 75,
    description: 'Swept upwards and backwards with high crown volume, tapered cleanly through the temples and neck.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Blow dry with a round brush for lift, set with medium-shine water pomade.'
  },
  {
    id: 'hair-curly-undercut',
    name: 'Curly Crown with Drop Undercut',
    gender: 'boy',
    category: 'curly',
    tags: ['Curly', 'Undercut', 'High Contrast'],
    trending: true,
    faceShapes: ['Oval', 'Diamond', 'Heart'],
    hairTexture: ['Curly', 'Wavy'],
    maintenance: 'Medium',
    recommendedService: "Curly Hair Sculpt & Fade",
    duration: '50 mins',
    price: 70,
    description: 'Natural defined ringlets on top paired with a sharp skin fade on the back and sides.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Use curl-enhancing cream on damp hair and scrunch gently.'
  },
  {
    id: 'hair-buzz-cut',
    name: 'Precision Military Buzz Cut',
    gender: 'boy',
    category: 'short',
    tags: ['Short', 'Buzz', 'Minimalist'],
    trending: false,
    faceShapes: ['Square', 'Oval', 'Diamond'],
    hairTexture: ['Straight', 'Wavy', 'Curly'],
    maintenance: 'Low',
    recommendedService: "Military Buzz & Edge Up",
    duration: '25 mins',
    price: 40,
    description: 'Ultra-clean uniform short clipper cut with razor-sharp temple lines.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Keep scalp moisturized with light argan hair serum.'
  },

  // ─── WOMEN'S STYLES ───
  {
    id: 'hair-layered-balayage',
    name: 'Long Butterfly Layers & Balayage',
    gender: 'girl',
    category: 'long',
    tags: ['Long', 'Layers', 'Balayage', 'Volume'],
    trending: true,
    faceShapes: ['Oval', 'Round', 'Square', 'Heart'],
    hairTexture: ['Straight', 'Wavy'],
    maintenance: 'High',
    recommendedService: "Master Cut & Sun-Kissed Balayage",
    duration: '90 mins',
    price: 180,
    description: 'Feathered face-framing butterfly layers with soft cascading waves and sun-kissed dimension.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Blowout with a large ceramic round barrel brush for buoyant movement.'
  },
  {
    id: 'hair-french-bob',
    name: 'Chic Parisian French Bob',
    gender: 'girl',
    category: 'short',
    tags: ['Short', 'Bob', 'French', 'Chic'],
    trending: true,
    faceShapes: ['Oval', 'Heart', 'Diamond'],
    hairTexture: ['Straight', 'Wavy'],
    maintenance: 'Medium',
    recommendedService: "Signature French Bob & Texture",
    duration: '60 mins',
    price: 90,
    description: 'Jawline-skimming blunt bob accompanied by soft brow-grazing curtain bangs.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Tuck one side behind the ear to highlight the jawline angle.'
  },
  {
    id: 'hair-beach-waves',
    name: 'Textured Mermaid Beach Waves',
    gender: 'girl',
    category: 'long',
    tags: ['Long', 'Wavy', 'Beach Waves', 'Effortless'],
    trending: true,
    faceShapes: ['Oval', 'Square', 'Oblong'],
    hairTexture: ['Wavy', 'Straight'],
    maintenance: 'Medium',
    recommendedService: "Thermal Styling & Beach Texture",
    duration: '50 mins',
    price: 75,
    description: 'Undone, relaxed S-pattern waves with textured ends for romantic, bohemian flair.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Alternate curl direction with a 1.25-inch curling iron and finish with texture spray.'
  },
  {
    id: 'hair-textured-pixie',
    name: 'Edgy Whispy Pixie Cut',
    gender: 'girl',
    category: 'short',
    tags: ['Short', 'Pixie', 'Feathered', 'Bold'],
    trending: false,
    faceShapes: ['Oval', 'Heart', 'Square'],
    hairTexture: ['Straight', 'Wavy'],
    maintenance: 'Medium',
    recommendedService: "Sculpted Pixie Cut & Styling",
    duration: '50 mins',
    price: 80,
    description: 'Cropped closely at nape with longer, feathered crown layers creating dimensional lift.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Piece out ends with dry texture wax for an effortless look.'
  },
  {
    id: 'hair-glass-hair',
    name: 'Glossy Mid-Length Glass Hair',
    gender: 'girl',
    category: 'medium',
    tags: ['Medium', 'Straight', 'Gloss', 'Sleek'],
    trending: true,
    faceShapes: ['Round', 'Heart', 'Oval'],
    hairTexture: ['Straight'],
    maintenance: 'Medium',
    recommendedService: "Keratin Gloss & Silk Press",
    duration: '75 mins',
    price: 130,
    description: 'Mirror-shine blunt lob falling just above the collarbones with ultra-smooth reflection.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Apply lightweight heat protectant oil before flat-ironing in small sections.'
  },
  {
    id: 'hair-curly-shag',
    name: '70s Retro Curly Shag',
    gender: 'girl',
    category: 'curly',
    tags: ['Curly', 'Shag', 'Retro', 'Volume'],
    trending: true,
    faceShapes: ['Oval', 'Oblong', 'Heart'],
    hairTexture: ['Curly'],
    maintenance: 'Medium',
    recommendedService: "Dry Curly Carve & Diffuse",
    duration: '60 mins',
    price: 95,
    description: 'Choppy short crown layers with curl-embracing curtain bangs for maximum body and bounce.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Diffuse upside down until 90% dry for massive retro root volume.'
  }
];

export const HAIR_COLORS = [
  { id: 'original', name: 'Natural / Match Mine', hex: 'transparent', description: 'Keeps your authentic hair tone' },
  { id: 'jet-black', name: 'Raven Black', hex: '#111116', description: 'Deep glossy blue-black' },
  { id: 'dark-chocolate', name: 'Dark Chocolate', hex: '#2b1b17', description: 'Rich dark espresso brunette' },
  { id: 'caramel-brown', name: 'Caramel Macchiato', hex: '#634433', description: 'Warm golden chestnut' },
  { id: 'honey-blonde', name: 'Honey Wheat Blonde', hex: '#b3905e', description: 'Sunlit warm golden tones' },
  { id: 'platinum-ice', name: 'Nordic Platinum', hex: '#dedad2', description: 'High-lift cool silver blonde' },
  { id: 'copper-auburn', name: 'Sunset Auburn', hex: '#8c3a27', description: 'Fiery copper cinnamon' },
  { id: 'burgundy-wine', name: 'Bordeaux Burgundy', hex: '#4e1124', description: 'Deep jewel ruby red' },
  { id: 'rose-gold', name: 'Pastel Rose Gold', hex: '#b87c7e', description: 'Shimmering blush metallic' },
  { id: 'ash-gray', name: 'Smokey Titanium', hex: '#7a7a85', description: 'Modern cool matte slate' },
];

export const FACE_SHAPES = [
  {
    id: 'Oval',
    name: 'Oval',
    description: 'Balanced symmetry with forehead slightly wider than chin and soft curved jawline.',
    bestStyles: ['Low Fade', 'Textured Crop', 'French Bob', 'Butterfly Layers'],
    avoidTips: 'Heavy blunt bangs that hide the balanced face length.'
  },
  {
    id: 'Round',
    name: 'Round',
    description: 'Similar width and length with soft curved jawline and full cheeks.',
    bestStyles: ['Pompadour', 'High Skin Fade', 'Long Layered Waves', 'Asymmetrical Bob'],
    avoidTips: 'Chin-length round bobs that accentuate fullness.'
  },
  {
    id: 'Square',
    name: 'Square',
    description: 'Strong, defined angular jawline with proportional forehead width.',
    bestStyles: ['Messy Textured Crop', 'Soft Waves', 'Side-Swept Undercut', 'Curtain Bangs'],
    avoidTips: 'Ultra-blunt geometric cuts that over-accentuate jaw sharpness.'
  },
  {
    id: 'Heart',
    name: 'Heart',
    description: 'Wider forehead tapering into a pointed, delicate chin.',
    bestStyles: ['French Bob', 'Mid Taper Fade', 'Shoulder Lob', 'Side Fringe'],
    avoidTips: 'Slicked back styles that add height without framing the lower face.'
  },
  {
    id: 'Diamond',
    name: 'Diamond',
    description: 'Narrow forehead and jawline with dramatic, prominent cheekbones.',
    bestStyles: ['Curly Drop Undercut', 'Whispy Pixie', 'Chin-Length Waves'],
    avoidTips: 'Excessive volume on the sides right at the cheekbones.'
  },
  {
    id: 'Oblong',
    name: 'Oblong',
    description: 'Face is noticeably longer than it is wide, with straight cheek line.',
    bestStyles: ['Textured Crop', 'Curtain Bangs', 'Layered Shag', 'Side Part Lob'],
    avoidTips: 'Extreme sky-high pompadours that lengthen the silhouette.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. SKIN STUDIO DATA
// ─────────────────────────────────────────────────────────────────────────────

export const SKIN_TYPES = [
  { id: 'normal', name: 'Normal / Balanced', description: 'Well-balanced sebum and moisture with smooth texture and minimal redness.' },
  { id: 'dry', name: 'Dry / Dehydrated', description: 'Low moisture retention, tight sensation, fine flakes, or dull complexion.' },
  { id: 'oily', name: 'Oily / Sebum-Prone', description: 'Elevated shine in the T-zone, enlarged pores, and active oil production.' },
  { id: 'combination', name: 'Combination', description: 'Oily forehead and nose with balanced or dry cheeks and perimeter.' },
  { id: 'sensitive', name: 'Sensitive / Reactive', description: 'Prone to localized redness, heat sensation, barrier weakness, or irritation.' },
];

export const SKIN_CONCERNS = [
  { id: 'hydration', name: 'Deep Hydration & Barrier', icon: 'Droplets', description: 'Infuse plumping moisture and restore cellular lipid barrier.' },
  { id: 'glow', name: 'Dullness & Radiance', icon: 'Sparkles', description: 'Buff away dead epidermal cells and reveal illuminated skin tone.' },
  { id: 'tan', name: 'Sun Damage & Anti-Tan', icon: 'Sun', description: 'Reverse pigmentation, brighten dark patches, and balance skin tone.' },
  { id: 'pores', name: 'Enlarged Pores & Texture', icon: 'Maximize', description: 'Refine skin surface roughness with gentle enzymatic exfoliation.' },
  { id: 'antiaging', name: 'Fine Lines & Firming', icon: 'Clock', description: 'Boost natural collagen production and improve skin bounce.' }
];

export const SKIN_TREATMENT_SERVICES = [
  {
    id: 'skin-hydra-glow',
    title: 'Hydra-Infusion Glow Facial',
    category: 'Skin Care',
    duration: '60 mins',
    price: 85,
    description: 'Multi-step vortex suction cleansing, hyaluronic acid infusion, and oxygen misting for immediate radiant glow.',
    idealFor: ['Dry', 'Normal', 'Combination'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'skin-ayur-detox',
    title: 'Ayurvedic Kumkumadi Botanical Facial',
    category: 'Skin Care',
    duration: '75 mins',
    price: 95,
    description: 'Saffron-infused kumkumadi tailam facial massage, sandalwood herbal pack, and lymphatic marma stimulation.',
    idealFor: ['Normal', 'Combination', 'Sensitive'],
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e7ad0ecb?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'skin-anti-tan',
    title: 'Bio-Enzyme Anti-Tan Treatment',
    category: 'Skin Care',
    duration: '45 mins',
    price: 65,
    description: 'Papaya enzyme de-tan pack followed by vitamin C serum iontophoresis to brighten hyperpigmentation.',
    idealFor: ['Oily', 'Combination', 'Normal'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'skin-deep-pore',
    title: 'Charcoal Deep Pore Refining Cleanse',
    category: 'Skin Care',
    duration: '50 mins',
    price: 70,
    description: 'Ultrasonic blackhead extraction, active activated bamboo charcoal mask, and cold hammer pore tightening.',
    idealFor: ['Oily', 'Combination'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. NAIL STUDIO DATA
// ─────────────────────────────────────────────────────────────────────────────

export const NAIL_SHAPES = [
  { id: 'almond', name: 'Almond', description: 'Tapered sides that round off at the tip, elongating fingers elegantly.' },
  { id: 'coffin', name: 'Coffin / Ballerina', description: 'Tapered edges ending in a blunt square tip; modern high-fashion favorite.' },
  { id: 'square', name: 'Classic Square', description: 'Straight edges with a clean horizontal tip; timeless and durable.' },
  { id: 'oval', name: 'Graceful Oval', description: 'Soft natural curved edge following the fingertip contour.' },
  { id: 'stiletto', name: 'Stiletto', description: 'Dramatic, sharply pointed apex for bold statement nail styling.' },
  { id: 'squoval', name: 'Squoval', description: 'Square shape with rounded softened corners; universally flattering.' },
];

export const NAIL_COLORS = [
  { id: 'cherry-rouge', name: 'Cherry Rouge', hex: '#8a0f28', finish: 'Gloss' },
  { id: 'nude-cashmere', name: 'Nude Cashmere', hex: '#d9baa2', finish: 'Cream' },
  { id: 'french-white', name: 'French Tip White', hex: '#fdfbf7', finish: 'Pure' },
  { id: 'noir-velvet', name: 'Midnight Noir', hex: '#16161a', finish: 'Matte' },
  { id: 'chrome-silver', name: 'Glazed Chrome', hex: '#d5dae2', finish: 'Chrome' },
  { id: 'emerald-gem', name: 'Imperial Emerald', hex: '#0f402c', finish: 'Metallic' },
  { id: 'lavender-mist', name: 'Lavender Mist', hex: '#b7a8c4', finish: 'Pastel' },
  { id: 'terracotta-spice', name: 'Terracotta Clay', hex: '#a6563d', finish: 'Gloss' },
  { id: 'gold-foil', name: 'Champagne Foil', hex: '#d4af37', finish: 'Glitter' },
  { id: 'coral-sunset', name: 'Living Coral', hex: '#e86f56', finish: 'Gloss' },
];

export const NAIL_DESIGNS = [
  {
    id: 'design-glazed-donut',
    name: 'Hailey Glazed Chrome',
    shape: 'Almond',
    color: '#d5dae2',
    style: 'Chrome Sheen',
    description: 'Iridescent pearl chrome powder buffed over neutral milky base for glassy reflection.',
    image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'design-french-ombre',
    name: 'French Baby Boomer Ombré',
    shape: 'Coffin',
    color: '#fdfbf7',
    style: 'Gradient Fade',
    description: 'Seamless gradient fade from sheer rosy pink cuticle to crisp milky white tip.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'design-minimal-gold',
    name: 'Minimalist Micro-French & Gold Foil',
    shape: 'Squoval',
    color: '#d4af37',
    style: 'Fine Art',
    description: 'Ultra-thin modern metallic edge with delicate gold leaf accent foil.',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'design-deep-ruby',
    name: 'Vampire Red Velvet Matte',
    shape: 'Almond',
    color: '#8a0f28',
    style: 'Matte Glam',
    description: 'Sultry Bordeaux dark cherry coated in velvet-touch matte topcoat.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=80'
  }
];

export const NAIL_SERVICES = [
  {
    id: 'nail-spa-mani',
    title: 'Luxury Gel Spa Manicure',
    duration: '45 mins',
    price: 45,
    description: 'Cuticle restoration, organic apricot scrub, hand massage, and long-lasting UV LED gel lacquer.'
  },
  {
    id: 'nail-ext-sculpt',
    title: 'Sculpted Gel Extensions & Custom Art',
    duration: '80 mins',
    price: 90,
    description: 'Full set lightweight builder gel extension with custom shape sculpt and 2 accent nail art designs.'
  },
  {
    id: 'nail-pedi-deluxe',
    title: 'Aromatherapy Reflexology Pedicure',
    duration: '55 mins',
    price: 55,
    description: 'Epsom salt foot soak, callus buffing, hot towel wrap, acupressure massage, and high-shine polish.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAKEUP STUDIO DATA
// ─────────────────────────────────────────────────────────────────────────────

export const MAKEUP_LOOKS = [
  {
    id: 'look-bridal-royal',
    name: 'Royal Heritage Bridal Glam',
    occasion: 'Wedding / Festive',
    description: 'Sculpted high-definition base, warm gold shimmer lid, winged eyeliner, and regal crimson lip.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80',
    lipColor: '#8f1527',
    blushColor: '#c85d68',
    recommendedService: 'Bridal Couture Makeup & Hair'
  },
  {
    id: 'look-natural-dewy',
    name: 'Clean Girl Dewy Glass Finish',
    occasion: 'Daywear / Cocktail',
    description: 'Sheer luminous skin tint, flushed apricot cheeks, brushed-up soap brows, and glazed nude lip.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    lipColor: '#c4826d',
    blushColor: '#e07d6a',
    recommendedService: 'Natural Dewy Glow Makeover'
  },
  {
    id: 'look-smokey-evening',
    name: 'Velvet Smokey Sunset',
    occasion: 'Evening / Red Carpet',
    description: 'Soft-diffused bronze and espresso eyeshadow, chiselled contour, and satin beige neutral lip.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80',
    lipColor: '#965a50',
    blushColor: '#a15555',
    recommendedService: 'Red Carpet Evening Glamour'
  },
  {
    id: 'look-festive-radiance',
    name: 'Kerala Kasavu Festive Radiance',
    occasion: 'Traditional / Onam / Pooja',
    description: 'Kohl-rimmed defined eyes, golden champagne temple highlight, and traditional vermilion lip.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80',
    lipColor: '#b52233',
    blushColor: '#b55a67',
    recommendedService: 'Traditional Occasion Makeover'
  }
];

export const LIP_SHADES = [
  { id: 'lip-crimson', name: 'Regal Crimson', hex: '#94192b', opacity: 0.65 },
  { id: 'lip-nude-satin', name: 'Warm Cashmere Nude', hex: '#be7d68', opacity: 0.60 },
  { id: 'lip-berry-velvet', name: 'Blackberry Velvet', hex: '#631831', opacity: 0.70 },
  { id: 'lip-coral-pop', name: 'Summer Coral', hex: '#cf5a48', opacity: 0.65 },
  { id: 'lip-pink-rose', name: 'Dusty English Rose', hex: '#ba6075', opacity: 0.60 },
  { id: 'lip-plum-noir', name: 'Spiced Plum', hex: '#542232', opacity: 0.70 },
];

export const BLUSH_SHADES = [
  { id: 'blush-peach', name: 'Sweet Apricot', hex: '#e88264', opacity: 0.35 },
  { id: 'blush-rose', name: 'Petal Rose', hex: '#d96a84', opacity: 0.35 },
  { id: 'blush-coral', name: 'Golden Amber', hex: '#c76b4a', opacity: 0.35 },
  { id: 'blush-berry', name: 'Berry Flush', hex: '#9e4359', opacity: 0.30 },
];

export const EYE_SHADES = [
  { id: 'eye-champagne', name: 'Champagne Shimmer', hex: '#d4af72', opacity: 0.40 },
  { id: 'eye-bronze', name: 'Metallic Bronze', hex: '#87532a', opacity: 0.50 },
  { id: 'eye-smokey', name: 'Smokey Charcoal', hex: '#262629', opacity: 0.55 },
  { id: 'eye-rose', name: 'Rose Quartz', hex: '#b36c7a', opacity: 0.45 },
];

export const MAKEUP_SERVICES = [
  {
    id: 'mu-bridal',
    title: 'Signature Bridal Makeover & Draping',
    duration: '120 mins',
    price: 250,
    description: 'Airbrush HD foundation, waterproof long-wear cosmetics, eyelash extensions, and sari/veil draping.'
  },
  {
    id: 'mu-party',
    title: 'Party & Cocktail Glam Makeup',
    duration: '60 mins',
    price: 90,
    description: 'Custom tailored evening look with contoured base, custom eye pigments, and long-wear setting mist.'
  },
  {
    id: 'mu-editorial',
    title: 'Personalized Beauty Consultation & Makeover',
    duration: '75 mins',
    price: 110,
    description: 'Facial anatomy assessment, personalized color matching session, and full event-ready application.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. GROOMING STUDIO DATA
// ─────────────────────────────────────────────────────────────────────────────

export const GROOMING_STYLES = [
  {
    id: 'groom-executive-fade',
    name: 'Executive Fade Beard',
    faceShapes: ['Round', 'Square', 'Oval'],
    maintenance: 'Low',
    tags: ['Tapered', 'Clean', 'Professional'],
    description: 'Seamless gradient from sideburns into a sharply sculpted, medium-density beard along the jawline.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Maintain with weekly razor lineup and hydrating cedarwood beard oil.'
  },
  {
    id: 'groom-designer-stubble',
    name: '3-Day Heavy Designer Stubble',
    faceShapes: ['Oval', 'Heart', 'Diamond', 'Square'],
    maintenance: 'Low',
    tags: ['Stubble', 'Rugged', 'Effortless'],
    description: 'Uniform 3mm stubble providing natural shadow and definition across the cheekbones and chin.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Trim twice weekly at 2.5mm and line the neck two fingers above the Adam’s apple.'
  },
  {
    id: 'groom-anchor-goatee',
    name: 'Sculpted Anchor Goatee',
    faceShapes: ['Round', 'Square'],
    maintenance: 'Medium',
    tags: ['Goatee', 'Angular', 'Sculpted'],
    description: 'Pointed chin beard tracing the jawline paired with a clean detached pencil moustache.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Keep cheeks completely smooth to let the geometric anchor draw the eye downward.'
  },
  {
    id: 'groom-full-lumberjack',
    name: 'Full Majestic Nordic Beard',
    faceShapes: ['Oval', 'Oblong', 'Diamond'],
    maintenance: 'High',
    tags: ['Full Beard', 'Voluminous', 'Bold'],
    description: 'Dense, substantial beard grown to 2–3 inches, trimmed into a squared masculine silhouette.',
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Brush daily with a boar bristle brush and apply warm beard balm to condition roots.'
  },
  {
    id: 'groom-clean-shave',
    name: 'Royal Hot Towel Clean Shave',
    faceShapes: ['Oval', 'Heart', 'Square', 'Round'],
    maintenance: 'Low',
    tags: ['Clean', 'Classic', 'Ultra-Smooth'],
    description: 'Satin-smooth straight-razor shave with pre-shave oil infusion and cold towel pore sealing.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    stylistTip: 'Never skip aftershave balm with chamomile to prevent ingrown hairs.'
  }
];

export const GROOMING_SERVICES = [
  {
    id: 'groom-royal-shave',
    title: 'Master Royal Hot Towel Shave',
    duration: '35 mins',
    price: 45,
    description: 'Double hot eucalyptus towel wrap, botanical lathering, feather-touch straight razor shave, and cooling alum treatment.'
  },
  {
    id: 'groom-beard-sculpt',
    title: 'Beard Sculpting, Taper & Razor Lineup',
    duration: '30 mins',
    price: 40,
    description: 'Precision scissor debulking, clippers fade, razor cheek and neck contouring, and hot oil hydration.'
  },
  {
    id: 'groom-combo-vip',
    title: 'Signature Haircut + Royal Beard Treatment',
    duration: '60 mins',
    price: 85,
    description: 'Complete transformation package: customized haircut, wash, styling, and complete beard sculpting spa.'
  }
];
