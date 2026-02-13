import { ServiceCategory } from "@/interfaces/auth-interfaces";

// ============================================
// SERVICES WITH SUB-SERVICES
// Bilingual: English + Urdu
// ============================================

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "electrician",
    name: "Electrician",
    nameUrdu: "الیکٹریشن",
    icon: "Zap",
    subServices: [
      { id: "elec-wiring", name: "Wiring & Rewiring", nameUrdu: "وائرنگ" },
      { id: "elec-switch", name: "Switch & Socket Repair", nameUrdu: "سوئچ اور ساکٹ مرمت" },
      { id: "elec-fan", name: "Fan Installation/Repair", nameUrdu: "پنکھا لگانا/مرمت" },
      { id: "elec-light", name: "Light Fitting", nameUrdu: "لائٹ لگانا" },
      { id: "elec-breaker", name: "Circuit Breaker / DB Board", nameUrdu: "سرکٹ بریکر" },
      { id: "elec-ups", name: "UPS / Inverter Installation", nameUrdu: "یو پی ایس لگانا" },
    ],
  },
  {
    id: "plumber",
    name: "Plumber",
    nameUrdu: "پلمبر",
    icon: "Droplet",
    subServices: [
      { id: "plumb-leak", name: "Leak Repair", nameUrdu: "لیکیج مرمت" },
      { id: "plumb-pipe", name: "Pipe Installation", nameUrdu: "پائپ لگانا" },
      { id: "plumb-tap", name: "Tap / Faucet Repair", nameUrdu: "نلکا مرمت" },
      { id: "plumb-toilet", name: "Toilet Repair", nameUrdu: "ٹوائلٹ مرمت" },
      { id: "plumb-drain", name: "Drain Cleaning", nameUrdu: "نالی صفائی" },
      { id: "plumb-geyser", name: "Geyser Installation", nameUrdu: "گیزر لگانا" },
    ],
  },
  {
    id: "carpenter",
    name: "Carpenter",
    nameUrdu: "کارپینٹر",
    icon: "Hammer",
    subServices: [
      { id: "carp-door", name: "Door Repair / Installation", nameUrdu: "دروازہ مرمت/لگانا" },
      { id: "carp-cabinet", name: "Cabinet Making", nameUrdu: "کابینہ بنانا" },
      { id: "carp-furniture", name: "Furniture Repair", nameUrdu: "فرنیچر مرمت" },
      { id: "carp-shelf", name: "Shelf Installation", nameUrdu: "شیلف لگانا" },
      { id: "carp-wood", name: "Wood Polishing", nameUrdu: "لکڑی پالش" },
    ],
  },
  {
    id: "painter",
    name: "Painter",
    nameUrdu: "پینٹر",
    icon: "Paintbrush",
    subServices: [
      { id: "paint-wall", name: "Wall Painting", nameUrdu: "دیوار پینٹ" },
      { id: "paint-exterior", name: "Exterior Painting", nameUrdu: "باہر پینٹ" },
      { id: "paint-wood", name: "Wood Painting / Polish", nameUrdu: "لکڑی پینٹ/پالش" },
      { id: "paint-waterproof", name: "Waterproofing", nameUrdu: "واٹر پروفنگ" },
      { id: "paint-texture", name: "Texture / Design Work", nameUrdu: "ٹیکسچر ڈیزائن" },
    ],
  },
  {
    id: "ac-technician",
    name: "AC Technician",
    nameUrdu: "اے سی ٹیکنیشن",
    icon: "Wind",
    subServices: [
      { id: "ac-install", name: "AC Installation", nameUrdu: "اے سی لگانا" },
      { id: "ac-repair", name: "AC Repair", nameUrdu: "اے سی مرمت" },
      { id: "ac-service", name: "AC General Service", nameUrdu: "اے سی سروس" },
      { id: "ac-gas", name: "Gas Refilling", nameUrdu: "گیس بھرنا" },
      { id: "ac-clean", name: "AC Deep Cleaning", nameUrdu: "اے سی صفائی" },
    ],
  },
  {
    id: "mason",
    name: "Mason",
    nameUrdu: "مستری / راج",
    icon: "Blocks",
    subServices: [
      { id: "mason-wall", name: "Wall Construction", nameUrdu: "دیوار بنانا" },
      { id: "mason-tile", name: "Tile Work", nameUrdu: "ٹائل لگانا" },
      { id: "mason-plaster", name: "Plastering", nameUrdu: "پلسٹر" },
      { id: "mason-floor", name: "Flooring", nameUrdu: "فرش لگانا" },
      { id: "mason-demo", name: "Demolition Work", nameUrdu: "توڑ پھوڑ" },
    ],
  },
  {
    id: "mechanic",
    name: "Mechanic",
    nameUrdu: "مکینک",
    icon: "Wrench",
    subServices: [
      { id: "mech-bike", name: "Bike Repair", nameUrdu: "بائیک مرمت" },
      { id: "mech-car", name: "Car Repair", nameUrdu: "گاڑی مرمت" },
      { id: "mech-oil", name: "Oil Change", nameUrdu: "آئل تبدیلی" },
      { id: "mech-tire", name: "Tire Puncture / Change", nameUrdu: "ٹائر مرمت" },
      { id: "mech-battery", name: "Battery Service", nameUrdu: "بیٹری سروس" },
    ],
  },
  {
    id: "home-cleaner",
    name: "Home Cleaner",
    nameUrdu: "صفائی والا",
    icon: "Sparkles",
    subServices: [
      { id: "clean-home", name: "Full Home Cleaning", nameUrdu: "گھر صفائی" },
      { id: "clean-kitchen", name: "Kitchen Deep Clean", nameUrdu: "کچن صفائی" },
      { id: "clean-bathroom", name: "Bathroom Cleaning", nameUrdu: "باتھ روم صفائی" },
      { id: "clean-sofa", name: "Sofa / Carpet Cleaning", nameUrdu: "صوفہ/قالین صفائی" },
      { id: "clean-tank", name: "Water Tank Cleaning", nameUrdu: "ٹنکی صفائی" },
    ],
  },
];
