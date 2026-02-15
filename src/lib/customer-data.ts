import type {
  ServiceCategoryGroup,
  SubCategoryService,
  ServiceItem,
  ServiceOffer,
  PopularService,
  City,
} from "@/types/customer";

// ============================================
// CITIES
// ============================================
export const CITIES: City[] = [
  { id: "karachi", name: "Karachi", nameUrdu: "کراچی" },
  { id: "lahore", name: "Lahore", nameUrdu: "لاہور" },
  { id: "islamabad", name: "Islamabad", nameUrdu: "اسلام آباد" },
  { id: "rawalpindi", name: "Rawalpindi", nameUrdu: "راولپنڈی" },
  { id: "faisalabad", name: "Faisalabad", nameUrdu: "فیصل آباد" },
  { id: "multan", name: "Multan", nameUrdu: "ملتان" },
  { id: "peshawar", name: "Peshawar", nameUrdu: "پشاور" },
  { id: "quetta", name: "Quetta", nameUrdu: "کوئٹہ" },
  { id: "hyderabad", name: "Hyderabad", nameUrdu: "حیدر آباد" },
  { id: "sialkot", name: "Sialkot", nameUrdu: "سیالکوٹ" },
];

// ============================================
// SERVICE CATEGORY GROUPS (main categories like in Karsaaz)
// ============================================
export const SERVICE_CATEGORY_GROUPS: ServiceCategoryGroup[] = [
  {
    id: "home-maintenance",
    name: "Home Maintenance and Cleaning Services",
    nameUrdu: "گھریلو مرمت اور صفائی",
    image: "/images/categories/home-maintenance.png",
    description: "Electricians, Plumbers, AC Technicians, Home Cleaners & more",
  },
  {
    id: "tailoring",
    name: "Tailoring Services",
    nameUrdu: "درزی کی خدمات",
    image: "/images/categories/tailoring.png",
    description: "Stitching, Alterations, Custom Tailoring & more",
  },
  {
    id: "car-care",
    name: "Car Care Services",
    nameUrdu: "گاڑی کی دیکھ بھال",
    image: "/images/categories/car-care.png",
    description: "Car Wash, Repair, Oil Change, Tire Service & more",
  },
  {
    id: "home-construction",
    name: "Home Construction Services",
    nameUrdu: "تعمیراتی خدمات",
    image: "/images/categories/construction.png",
    description: "Mason, Carpenter, Painter, Tiles & more",
  },
];

// ============================================
// SUB-CATEGORIES (services within a group)
// ============================================
export const SUB_CATEGORY_SERVICES: SubCategoryService[] = [
  // Home Maintenance
  {
    id: "ac-services",
    name: "AC Services at Home",
    nameUrdu: "اے سی سروسز",
    image: "/images/services/ac-services.png",
    categoryId: "home-maintenance",
  },
  {
    id: "electrician-services",
    name: "Electrician Services",
    nameUrdu: "الیکٹریشن سروسز",
    image: "/images/services/electrician.png",
    categoryId: "home-maintenance",
  },
  {
    id: "plumber-services",
    name: "Plumber Services",
    nameUrdu: "پلمبر سروسز",
    image: "/images/services/plumber.png",
    categoryId: "home-maintenance",
  },
  {
    id: "home-cleaning",
    name: "Home Cleaning",
    nameUrdu: "گھر کی صفائی",
    image: "/images/services/cleaning.png",
    categoryId: "home-maintenance",
  },
  {
    id: "pest-control",
    name: "Pest Control",
    nameUrdu: "کیڑے مکوڑے کنٹرول",
    image: "/images/services/pest-control.png",
    categoryId: "home-maintenance",
  },
  {
    id: "water-tank-cleaning",
    name: "Water Tank Cleaning",
    nameUrdu: "پانی کی ٹنکی صفائی",
    image: "/images/services/water-tank.png",
    categoryId: "home-maintenance",
  },

  // Tailoring
  {
    id: "ladies-tailoring",
    name: "Ladies Tailoring",
    nameUrdu: "خواتین درزی",
    image: "/images/services/ladies-tailoring.png",
    categoryId: "tailoring",
  },
  {
    id: "gents-tailoring",
    name: "Gents Tailoring",
    nameUrdu: "مردانہ درزی",
    image: "/images/services/gents-tailoring.png",
    categoryId: "tailoring",
  },
  {
    id: "alteration-services",
    name: "Alterations & Repairs",
    nameUrdu: "تبدیلی اور مرمت",
    image: "/images/services/alteration.png",
    categoryId: "tailoring",
  },

  // Car Care
  {
    id: "car-wash",
    name: "Car Wash",
    nameUrdu: "کار واش",
    image: "/images/services/car-wash.png",
    categoryId: "car-care",
  },
  {
    id: "car-repair",
    name: "Car Repair",
    nameUrdu: "گاڑی مرمت",
    image: "/images/services/car-repair.png",
    categoryId: "car-care",
  },
  {
    id: "bike-repair",
    name: "Bike Repair",
    nameUrdu: "بائیک مرمت",
    image: "/images/services/bike-repair.png",
    categoryId: "car-care",
  },
  {
    id: "tire-service",
    name: "Tire & Puncture Service",
    nameUrdu: "ٹائر سروس",
    image: "/images/services/tire-service.png",
    categoryId: "car-care",
  },

  // Home Construction
  {
    id: "mason-services",
    name: "Mason / Tile Work",
    nameUrdu: "مستری / ٹائل ورک",
    image: "/images/services/mason.png",
    categoryId: "home-construction",
  },
  {
    id: "carpenter-services",
    name: "Carpenter Services",
    nameUrdu: "کارپینٹر سروسز",
    image: "/images/services/carpenter.png",
    categoryId: "home-construction",
  },
  {
    id: "painter-services",
    name: "Painter Services",
    nameUrdu: "پینٹر سروسز",
    image: "/images/services/painter.png",
    categoryId: "home-construction",
  },
  {
    id: "waterproofing",
    name: "Waterproofing",
    nameUrdu: "واٹر پروفنگ",
    image: "/images/services/waterproofing.png",
    categoryId: "home-construction",
  },
  {
    id: "welding-services",
    name: "Welding & Iron Work",
    nameUrdu: "ویلڈنگ اور لوہے کا کام",
    image: "/images/services/welding.png",
    categoryId: "home-construction",
  },
];

// ============================================
// INDIVIDUAL SERVICE ITEMS (bookable)
// ============================================
export const SERVICE_ITEMS: ServiceItem[] = [
  // AC Services
  {
    id: "ac-general-service",
    name: "AC General Service",
    nameUrdu: "اے سی جنرل سروس",
    image: "/images/items/ac-general.png",
    price: 2000,
    priceType: "fixed",
    subCategoryId: "ac-services",
    categoryId: "home-maintenance",
  },
  {
    id: "ac-repairing-service",
    name: "AC Repairing Service",
    nameUrdu: "اے سی مرمت سروس",
    image: "/images/items/ac-repair.png",
    price: 1500,
    priceType: "estimated",
    description: "Starting from, exact price varies after visit",
    subCategoryId: "ac-services",
    categoryId: "home-maintenance",
  },
  {
    id: "ac-installation-service",
    name: "AC Installation Service",
    nameUrdu: "اے سی لگانے کی سروس",
    image: "/images/items/ac-install.png",
    price: 3000,
    priceType: "fixed",
    subCategoryId: "ac-services",
    categoryId: "home-maintenance",
  },
  {
    id: "ac-dismounting-service",
    name: "AC Dismounting/Removal Service",
    nameUrdu: "اے سی اتارنے کی سروس",
    image: "/images/items/ac-dismount.png",
    price: 1500,
    priceType: "fixed",
    subCategoryId: "ac-services",
    categoryId: "home-maintenance",
  },
  {
    id: "ac-gas-refill",
    name: "AC Gas Refilling",
    nameUrdu: "اے سی گیس بھرنا",
    image: "/images/items/ac-gas.png",
    price: 3500,
    priceType: "estimated",
    description: "Price depends on AC type and gas required",
    subCategoryId: "ac-services",
    categoryId: "home-maintenance",
  },

  // Electrician Services
  {
    id: "wiring-service",
    name: "Wiring & Rewiring",
    nameUrdu: "وائرنگ اور ری وائرنگ",
    image: "/images/items/wiring.png",
    price: 1500,
    priceType: "estimated",
    description: "Starting from, exact price varies after inspection",
    subCategoryId: "electrician-services",
    categoryId: "home-maintenance",
  },
  {
    id: "switch-repair",
    name: "Switch & Socket Repair",
    nameUrdu: "سوئچ اور ساکٹ مرمت",
    image: "/images/items/switch-repair.png",
    price: 500,
    priceType: "fixed",
    subCategoryId: "electrician-services",
    categoryId: "home-maintenance",
  },
  {
    id: "fan-installation",
    name: "Fan Installation/Repair",
    nameUrdu: "پنکھا لگانا / مرمت",
    image: "/images/items/fan-install.png",
    price: 800,
    priceType: "fixed",
    subCategoryId: "electrician-services",
    categoryId: "home-maintenance",
  },
  {
    id: "light-fitting",
    name: "Light Fitting",
    nameUrdu: "لائٹ فِٹنگ",
    image: "/images/items/light-fitting.png",
    price: 600,
    priceType: "fixed",
    subCategoryId: "electrician-services",
    categoryId: "home-maintenance",
  },
  {
    id: "ups-installation",
    name: "UPS / Inverter Installation",
    nameUrdu: "یو پی ایس لگانا",
    image: "/images/items/ups-install.png",
    price: 2000,
    priceType: "estimated",
    description: "Price varies based on UPS type",
    subCategoryId: "electrician-services",
    categoryId: "home-maintenance",
  },

  // Plumber Services
  {
    id: "leak-repair",
    name: "Leak Repair",
    nameUrdu: "لیکیج مرمت",
    image: "/images/items/leak-repair.png",
    price: 800,
    priceType: "estimated",
    description: "Starting from, depends on leak severity",
    subCategoryId: "plumber-services",
    categoryId: "home-maintenance",
  },
  {
    id: "pipe-installation",
    name: "Pipe Installation",
    nameUrdu: "پائپ لگانا",
    image: "/images/items/pipe-install.png",
    price: 1200,
    priceType: "estimated",
    description: "Starting from, based on pipe length and material",
    subCategoryId: "plumber-services",
    categoryId: "home-maintenance",
  },
  {
    id: "tap-repair",
    name: "Tap / Faucet Repair",
    nameUrdu: "نلکا مرمت",
    image: "/images/items/tap-repair.png",
    price: 500,
    priceType: "fixed",
    subCategoryId: "plumber-services",
    categoryId: "home-maintenance",
  },
  {
    id: "toilet-repair",
    name: "Toilet Repair",
    nameUrdu: "ٹوائلٹ مرمت",
    image: "/images/items/toilet-repair.png",
    price: 1000,
    priceType: "estimated",
    subCategoryId: "plumber-services",
    categoryId: "home-maintenance",
  },
  {
    id: "geyser-installation",
    name: "Geyser Installation",
    nameUrdu: "گیزر لگانا",
    image: "/images/items/geyser-install.png",
    price: 1500,
    priceType: "fixed",
    subCategoryId: "plumber-services",
    categoryId: "home-maintenance",
  },

  // Home Cleaning
  {
    id: "full-home-cleaning",
    name: "Full Home Cleaning",
    nameUrdu: "مکمل گھر صفائی",
    image: "/images/items/home-cleaning.png",
    price: 3000,
    priceType: "estimated",
    description: "Price varies based on home size",
    subCategoryId: "home-cleaning",
    categoryId: "home-maintenance",
  },
  {
    id: "kitchen-deep-clean",
    name: "Kitchen Deep Clean",
    nameUrdu: "کچن گہری صفائی",
    image: "/images/items/kitchen-clean.png",
    price: 1500,
    priceType: "fixed",
    subCategoryId: "home-cleaning",
    categoryId: "home-maintenance",
  },
  {
    id: "sofa-cleaning",
    name: "Sofa / Carpet Cleaning",
    nameUrdu: "صوفہ / قالین صفائی",
    image: "/images/items/sofa-clean.png",
    price: 2000,
    priceType: "estimated",
    description: "Price depends on sofa/carpet size",
    subCategoryId: "home-cleaning",
    categoryId: "home-maintenance",
  },

  // Mason Services
  {
    id: "tile-work",
    name: "Tile Installation / Repair",
    nameUrdu: "ٹائل لگانا / مرمت",
    image: "/images/items/tile-work.png",
    price: 2000,
    priceType: "estimated",
    description: "Price per area, varies based on tile type",
    subCategoryId: "mason-services",
    categoryId: "home-construction",
  },
  {
    id: "wall-construction",
    name: "Wall Construction",
    nameUrdu: "دیوار بنانا",
    image: "/images/items/wall-build.png",
    price: 5000,
    priceType: "estimated",
    description: "Starting from, based on dimensions",
    subCategoryId: "mason-services",
    categoryId: "home-construction",
  },
  {
    id: "plastering",
    name: "Plastering Work",
    nameUrdu: "پلسٹر کا کام",
    image: "/images/items/plastering.png",
    price: 3000,
    priceType: "estimated",
    subCategoryId: "mason-services",
    categoryId: "home-construction",
  },

  // Carpenter Services
  {
    id: "door-repair",
    name: "Door Repair / Installation",
    nameUrdu: "دروازہ مرمت / لگانا",
    image: "/images/items/door-repair.png",
    price: 1500,
    priceType: "estimated",
    subCategoryId: "carpenter-services",
    categoryId: "home-construction",
  },
  {
    id: "cabinet-making",
    name: "Cabinet Making",
    nameUrdu: "کابینہ بنانا",
    image: "/images/items/cabinet.png",
    price: 5000,
    priceType: "estimated",
    description: "Starting from, based on size and material",
    subCategoryId: "carpenter-services",
    categoryId: "home-construction",
  },
  {
    id: "furniture-repair",
    name: "Furniture Repair",
    nameUrdu: "فرنیچر مرمت",
    image: "/images/items/furniture-repair.png",
    price: 1000,
    priceType: "estimated",
    subCategoryId: "carpenter-services",
    categoryId: "home-construction",
  },

  // Painter Services
  {
    id: "wall-painting",
    name: "Wall Painting",
    nameUrdu: "دیوار پینٹ",
    image: "/images/items/wall-paint.png",
    price: 2500,
    priceType: "estimated",
    description: "Price per room, varies based on room size",
    subCategoryId: "painter-services",
    categoryId: "home-construction",
  },
  {
    id: "exterior-painting",
    name: "Exterior Painting",
    nameUrdu: "باہر پینٹ",
    image: "/images/items/exterior-paint.png",
    price: 5000,
    priceType: "estimated",
    subCategoryId: "painter-services",
    categoryId: "home-construction",
  },

  // Car Services
  {
    id: "car-general-wash",
    name: "Car General Wash",
    nameUrdu: "کار جنرل واش",
    image: "/images/items/car-wash.png",
    price: 500,
    priceType: "fixed",
    subCategoryId: "car-wash",
    categoryId: "car-care",
  },
  {
    id: "car-detailing",
    name: "Car Interior Detailing",
    nameUrdu: "کار انٹیریئر ڈیٹیلنگ",
    image: "/images/items/car-detail.png",
    price: 3000,
    priceType: "fixed",
    subCategoryId: "car-wash",
    categoryId: "car-care",
  },
  {
    id: "bike-general-repair",
    name: "Bike General Repair",
    nameUrdu: "بائیک جنرل مرمت",
    image: "/images/items/bike-repair.png",
    price: 800,
    priceType: "estimated",
    subCategoryId: "bike-repair",
    categoryId: "car-care",
  },
];

// ============================================
// WEEKLY OFFERS
// ============================================
export const WEEKLY_OFFERS: ServiceOffer[] = [
  {
    id: "offer-1",
    title: "Service 1 – Electrician",
    image: "/images/offers/service-1.png",
    originalPrice: 3500,
    discountedPrice: 2500,
    priceType: "fixed",
  },
  {
    id: "offer-2",
    title: "Service 2 – Plumber",
    image: "/images/offers/service-2.png",
    originalPrice: 3000,
    discountedPrice: 2000,
    priceType: "fixed",
  },
  {
    id: "offer-3",
    title: "Service 3 – AC Technician",
    image: "/images/offers/service-3.png",
    originalPrice: 4000,
    discountedPrice: 2500,
    priceType: "fixed",
  },
  {
    id: "offer-4",
    title: "Service 4 – Painter",
    image: "/images/offers/service-4.png",
    originalPrice: 5000,
    discountedPrice: 3500,
    priceType: "fixed",
  },
  {
    id: "offer-5",
    title: "Service 5 – Carpenter",
    image: "/images/offers/service-5.png",
    originalPrice: 4500,
    discountedPrice: 3000,
    priceType: "fixed",
  },
  {
    id: "offer-6",
    title: "Service 6 – Cleaning",
    image: "/images/offers/service-6.png",
    originalPrice: 6000,
    discountedPrice: 3999,
    priceType: "fixed",
  },
];

// ============================================
// POPULAR SERVICES
// ============================================
export const POPULAR_SERVICES: PopularService[] = [
  {
    id: "pop-1",
    name: "Service 1 – Home Wiring Repair",
    image: "/images/popular/service-1.png",
    originalPrice: 3500,
    discountedPrice: 2500,
    priceType: "fixed",
    categoryId: "home-maintenance",
  },
  {
    id: "pop-2",
    name: "Service 2 – Pipe Leak Repair",
    image: "/images/popular/service-2.png",
    originalPrice: 2500,
    discountedPrice: 1800,
    priceType: "estimated",
    categoryId: "home-maintenance",
  },
  {
    id: "pop-3",
    name: "Service 3 – AC General Service",
    image: "/images/popular/service-3.png",
    originalPrice: 3000,
    discountedPrice: 2000,
    priceType: "fixed",
    categoryId: "home-maintenance",
  },
  {
    id: "pop-4",
    name: "Service 4 – Room Painting",
    image: "/images/popular/service-4.png",
    originalPrice: 12000,
    discountedPrice: 9000,
    priceType: "estimated",
    categoryId: "home-maintenance",
  },
  {
    id: "pop-5",
    name: "Service 5 – Door & Furniture Repair",
    image: "/images/popular/service-5.png",
    originalPrice: 4500,
    discountedPrice: 3000,
    priceType: "estimated",
    categoryId: "home-maintenance",
  },
  {
    id: "pop-6",
    name: "Service 6 – Deep House Cleaning",
    image: "/images/popular/service-6.png",
    originalPrice: 6000,
    discountedPrice: 4000,
    priceType: "fixed",
    categoryId: "home-maintenance",
  },
];

// ============================================
// REFERRAL SOURCES
// ============================================
export const REFERRAL_SOURCES = [
  { id: "facebook", name: "Facebook" },
  { id: "instagram", name: "Instagram" },
  { id: "youtube", name: "YouTube" },
  { id: "google", name: "Google" },
  { id: "friend", name: "Friend / Family" },
  { id: "other", name: "Other" },
];

// ============================================
// TIME SLOTS
// ============================================
export const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCategoryById(id: string): ServiceCategoryGroup | undefined {
  return SERVICE_CATEGORY_GROUPS.find((cat) => cat.id === id);
}

export function getSubCategoriesByCategoryId(categoryId: string): SubCategoryService[] {
  return SUB_CATEGORY_SERVICES.filter((sub) => sub.categoryId === categoryId);
}

export function getSubCategoryById(id: string): SubCategoryService | undefined {
  return SUB_CATEGORY_SERVICES.find((sub) => sub.id === id);
}

export function getServiceItemsBySubCategory(subCategoryId: string): ServiceItem[] {
  return SERVICE_ITEMS.filter((item) => item.subCategoryId === subCategoryId);
}

export function getServiceItemById(id: string): ServiceItem | undefined {
  return SERVICE_ITEMS.find((item) => item.id === id);
}

export function getPopularServicesByCategory(categoryId: string): ServiceItem[] {
  return SERVICE_ITEMS.filter((item) => item.categoryId === categoryId).slice(0, 6);
}

export function searchServices(query: string): ServiceItem[] {
  const q = query.toLowerCase();
  return SERVICE_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.nameUrdu.includes(q)
  );
}

export function searchSubCategories(query: string, categoryId?: string): SubCategoryService[] {
  const q = query.toLowerCase();
  return SUB_CATEGORY_SERVICES.filter(
    (sub) =>
      (sub.name.toLowerCase().includes(q) || sub.nameUrdu.includes(q)) &&
      (categoryId ? sub.categoryId === categoryId : true)
  );
}
