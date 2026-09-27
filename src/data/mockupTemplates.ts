export interface MockupTemplate {
  id: string;
  name: string;
  category: 'mugs' | 'apparel' | 'accessories';
  image: string;
  description: string;
  defaultPlacement: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    scale: number; // 20 - 100
    rotation: number; // -180 to 180
    opacity: number; // 0 - 100
    blendMode: 'multiply' | 'normal' | 'overlay' | 'screen' | 'darken';
    curve: number; // -50 to 50 (curvature for cylindrical products like mugs)
  };
  supportedColors: { name: string; hex: string }[];
  defaultColor: string;
  printAreaLabel: string;
}

export const MOCKUP_TEMPLATES: MockupTemplate[] = [
  {
    id: 'mug-white-ceramic',
    name: 'Classic Ceramic Coffee Mug',
    category: 'mugs',
    image: '/src/assets/images/mockup_mug_1790473188708.jpg',
    description: '11oz Glossy Ceramic Mug in a clean minimalist studio backdrop with soft ambient lighting.',
    defaultPlacement: {
      x: 48,
      y: 52,
      scale: 32,
      rotation: 0,
      opacity: 92,
      blendMode: 'multiply',
      curve: 18, // Cylindrical wrap
    },
    supportedColors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Warm Cream', hex: '#F9F6EE' },
      { name: 'Matte Charcoal', hex: '#2A2C30' },
      { name: 'Terracotta', hex: '#C86D51' },
      { name: 'Sage Green', hex: '#879F84' },
      { name: 'Ocean Navy', hex: '#1D2A44' },
    ],
    defaultColor: '#FFFFFF',
    printAreaLabel: 'Front Center Mug Body',
  },
  {
    id: 'tshirt-crewneck',
    name: 'Premium Cotton Crewneck T-Shirt',
    category: 'apparel',
    image: '/src/assets/images/mockup_tshirt_1790473202586.jpg',
    description: '100% Combed ring-spun cotton flat lay with natural fabric folds and soft shadows.',
    defaultPlacement: {
      x: 50,
      y: 44,
      scale: 36,
      rotation: 0,
      opacity: 90,
      blendMode: 'multiply',
      curve: 0,
    },
    supportedColors: [
      { name: 'Classic White', hex: '#FFFFFF' },
      { name: 'Heather Grey', hex: '#D2D3D5' },
      { name: 'Midnight Black', hex: '#1C1D21' },
      { name: 'Vintage Navy', hex: '#23324C' },
      { name: 'Forest Green', hex: '#2B4336' },
      { name: 'Burgundy', hex: '#58212C' },
      { name: 'Dusty Rose', hex: '#D6A2A8' },
    ],
    defaultColor: '#FFFFFF',
    printAreaLabel: 'Center Chest Print Area',
  },
  {
    id: 'hoodie-streetwear',
    name: 'Heavyweight Pullover Hoodie',
    category: 'apparel',
    image: '/src/assets/images/mockup_hoodie_1790473212920.jpg',
    description: 'Cozy streetwear fleece hoodie flat lay with kangaroo pocket and rib cuffs.',
    defaultPlacement: {
      x: 50,
      y: 45,
      scale: 34,
      rotation: 0,
      opacity: 88,
      blendMode: 'multiply',
      curve: 0,
    },
    supportedColors: [
      { name: 'Heather Grey', hex: '#B8BAC0' },
      { name: 'Jet Black', hex: '#18191B' },
      { name: 'Washed Beige', hex: '#E2D8C7' },
      { name: 'Deep Pine', hex: '#21382C' },
      { name: 'Navy Blue', hex: '#1F2A3E' },
    ],
    defaultColor: '#B8BAC0',
    printAreaLabel: 'Chest / Torso Area',
  },
  {
    id: 'tote-canvas',
    name: 'Organic Cotton Canvas Tote Bag',
    category: 'accessories',
    image: '/src/assets/images/mockup_tote_1790473223821.jpg',
    description: 'Heavy duty eco-friendly canvas tote bag with reinforced handles on neutral surface.',
    defaultPlacement: {
      x: 50,
      y: 58,
      scale: 38,
      rotation: 0,
      opacity: 88,
      blendMode: 'multiply',
      curve: 0,
    },
    supportedColors: [
      { name: 'Natural Ecru', hex: '#F4EFE6' },
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Raw Black', hex: '#222326' },
      { name: 'Olive Drab', hex: '#4B5320' },
      { name: 'Mustard Gold', hex: '#DDA028' },
    ],
    defaultColor: '#F4EFE6',
    printAreaLabel: 'Main Body Center Area',
  },
];

export interface SampleLogo {
  id: string;
  name: string;
  tagline: string;
  category: string;
  svgDataUri: string;
}

// Crisp modern vector SVG logos ready for immediate testing
export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'nordic-roast',
    name: 'Nordic Roast Co.',
    tagline: 'Artisanal Coffee & Roastery',
    category: 'Food & Beverage',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="200" r="185" fill="#1C1815" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="#D4AF37" stroke-width="4" stroke-dasharray="8 6" />
        <path d="M140 240 L200 130 L260 240 Z" fill="none" stroke="#D4AF37" stroke-width="8" stroke-linejoin="round" />
        <path d="M175 240 L200 185 L225 240 Z" fill="#D4AF37" />
        <path d="M200 160 C185 175 185 200 200 215 C215 200 215 175 200 160 Z" fill="#E6CA65" />
        <text x="200" y="295" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#F8F6F0" text-anchor="middle" letter-spacing="4">NORDIC ROAST</text>
        <text x="200" y="325" font-family="system-ui, sans-serif" font-weight="600" font-size="14" fill="#D4AF37" text-anchor="middle" letter-spacing="6">ESTD. 2024</text>
      </svg>
    `)}`,
  },
  {
    id: 'apex-athletics',
    name: 'APEX Velocity',
    tagline: 'High Performance Sportswear',
    category: 'Apparel & Fitness',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <polygon points="200,40 340,320 280,320 200,160 120,320 60,320" fill="#0F172A" />
        <polygon points="200,110 260,250 220,250 200,200 180,250 140,250" fill="#3B82F6" />
        <text x="200" y="360" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#0F172A" text-anchor="middle" letter-spacing="8">APEX</text>
        <text x="200" y="385" font-family="system-ui, sans-serif" font-weight="700" font-size="13" fill="#3B82F6" text-anchor="middle" letter-spacing="5">PERFORMANCE</text>
      </svg>
    `)}`,
  },
  {
    id: 'botanica-organic',
    name: 'Botanica Organics',
    tagline: 'Pure Natural Skincare',
    category: 'Beauty & Lifestyle',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <circle cx="200" cy="180" r="130" fill="#EBF4EE" />
        <path d="M200,80 C240,110 270,160 250,220 C230,270 170,270 150,220 C130,160 160,110 200,80 Z" fill="#2D5A43" />
        <path d="M200,100 L200,250" stroke="#EBF4EE" stroke-width="5" stroke-linecap="round" />
        <path d="M200,140 C220,150 230,170 230,170" stroke="#EBF4EE" stroke-width="4" stroke-linecap="round" fill="none" />
        <path d="M200,180 C180,190 170,210 170,210" stroke="#EBF4EE" stroke-width="4" stroke-linecap="round" fill="none" />
        <text x="200" y="335" font-family="Georgia, serif" font-weight="bold" font-size="30" fill="#1C382A" text-anchor="middle" letter-spacing="3">BOTANICA</text>
        <text x="200" y="365" font-family="system-ui, sans-serif" font-weight="600" font-size="13" fill="#588157" text-anchor="middle" letter-spacing="6">ORGANIC ESSENTIALS</text>
      </svg>
    `)}`,
  },
  {
    id: 'waveform-sound',
    name: 'Waveform Labs',
    tagline: 'Audio Engineering & Acoustics',
    category: 'Tech & Media',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" rx="40" fill="#090D16" />
        <g transform="translate(70, 110)">
          <rect x="20" y="60" width="14" height="60" rx="7" fill="#6366F1" />
          <rect x="50" y="30" width="14" height="120" rx="7" fill="#818CF8" />
          <rect x="80" y="10" width="14" height="160" rx="7" fill="#A5B4FC" />
          <rect x="110" y="45" width="14" height="90" rx="7" fill="#6366F1" />
          <rect x="140" y="20" width="14" height="140" rx="7" fill="#4F46E5" />
          <rect x="170" y="40" width="14" height="100" rx="7" fill="#818CF8" />
          <rect x="200" y="70" width="14" height="40" rx="7" fill="#6366F1" />
        </g>
        <text x="200" y="330" font-family="system-ui, sans-serif" font-weight="800" font-size="28" fill="#F8FAFC" text-anchor="middle" letter-spacing="5">WAVEFORM</text>
        <text x="200" y="358" font-family="system-ui, sans-serif" font-weight="500" font-size="12" fill="#818CF8" text-anchor="middle" letter-spacing="7">SOUND STUDIOS</text>
      </svg>
    `)}`,
  },
  {
    id: 'cyber-pulse',
    name: 'CyberPulse 2088',
    tagline: 'Next-Gen Esports & Hardware',
    category: 'Gaming & Cyber',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <polygon points="200,40 350,130 350,270 200,360 50,270 50,130" fill="#110726" stroke="#EC4899" stroke-width="6" />
        <polygon points="200,85 295,150 295,250 200,315 105,250 105,150" fill="none" stroke="#06B6D4" stroke-width="4" stroke-dasharray="10 5" />
        <path d="M140,200 L180,200 L200,140 L220,260 L240,200 L260,200" fill="none" stroke="#F43F5E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="200" cy="140" r="6" fill="#06B6D4" />
        <circle cx="220" cy="260" r="6" fill="#F43F5E" />
      </svg>
    `)}`,
  },
  {
    id: 'wildwood-outdoors',
    name: 'Wildwood Goods',
    tagline: 'Heritage Outdoor Supply',
    category: 'Adventure & Gear',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect x="25" y="25" width="350" height="350" rx="30" fill="#1E2922" stroke="#E4B15E" stroke-width="5" />
        <path d="M200,70 L250,160 L225,160 L265,220 L235,220 L275,270 L125,270 L165,220 L135,220 L175,160 L150,160 Z" fill="#2E4A3B" stroke="#E4B15E" stroke-width="3" />
        <circle cx="200" cy="95" r="14" fill="#E4B15E" />
        <text x="200" y="325" font-family="Georgia, serif" font-weight="bold" font-size="26" fill="#F5E6CA" text-anchor="middle" letter-spacing="4">WILDWOOD</text>
        <text x="200" y="350" font-family="system-ui, sans-serif" font-weight="700" font-size="11" fill="#E4B15E" text-anchor="middle" letter-spacing="6">TRADE MARK • CO.</text>
      </svg>
    `)}`,
  },
];
