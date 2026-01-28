// Service categories
export interface Service {
  id: string;
  name: string;
  icon: string;
  startingPrice: number;
}

export const SERVICES: Service[] = [
  { id: "electrician", name: "Electrician", icon: "Zap", startingPrice: 500 },
  { id: "plumber", name: "Plumber", icon: "Droplet", startingPrice: 500 },
  { id: "carpenter", name: "Carpenter", icon: "Hammer", startingPrice: 800 },
  { id: "painter", name: "Painter", icon: "Paintbrush", startingPrice: 600 },
  {
    id: "ac-technician",
    name: "AC Technician",
    icon: "Wind",
    startingPrice: 700,
  },
  { id: "mason", name: "Mason", icon: "Blocks", startingPrice: 1000 },
];

// Features
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export const FEATURES: Feature[] = [
  {
    title: "CNIC Verified Workers",
    description:
      "All workers are verified with CNIC and admin approval for your safety",
    icon: "Shield",
  },
  {
    title: "Live GPS Tracking",
    description:
      "Track your worker in real-time and know exactly when they'll arrive",
    icon: "MapPin",
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges. Negotiate prices directly with workers",
    icon: "DollarSign",
  },
  {
    title: "Secure In-App Chat",
    description:
      "Communicate safely with workers through our encrypted chat system",
    icon: "MessageSquare",
  },
  {
    title: "Ratings & Reviews",
    description: "Choose the best workers based on verified customer reviews",
    icon: "Star",
  },
  {
    title: "24/7 Support",
    description: "Our support team is always here to help you",
    icon: "Headphones",
  },
];

// Testimonials
export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ahmed Khan",
    city: "Karachi",
    quote:
      "Found a plumber in 10 minutes who fixed my leak same day! Amazing service.",
    rating: 5,
  },
  {
    name: "Fatima Ali",
    city: "Lahore",
    quote:
      "The electrician was professional and verified. I felt safe having him in my home.",
    rating: 5,
  },
  {
    name: "Hassan Raza",
    city: "Islamabad",
    quote:
      "As a carpenter, Mehnati helped me find consistent work. Highly recommend!",
    rating: 5,
  },
  {
    name: "Ayesha Malik",
    city: "Faisalabad",
    quote:
      "Transparent pricing and excellent workers. This is the future of home services!",
    rating: 4,
  },
];

// Stats
export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "10,000+", label: "Verified Workers" },
  { value: "50,000+", label: "Jobs Completed" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "25", label: "Cities Across Pakistan" },
];

// Navigation links
export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Workers", href: "#for-workers" },
  { label: "About", href: "#about" },
];

// Footer links
export const FOOTER_LINKS = {
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  forWorkers: [
    { label: "How It Works", href: "/workers/how-it-works" },
    { label: "Worker Benefits", href: "/workers/benefits" },
    { label: "Success Stories", href: "/workers/stories" },
  ],
  forCustomers: [
    { label: "Browse Services", href: "/services" },
    { label: "Safety Tips", href: "/safety" },
    { label: "FAQs", href: "/faqs" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Worker Agreement", href: "/worker-agreement" },
  ],
};

// Worker data types
export interface Worker {
  id: string;
  name: string;
  skill: string;
  rating: number;
  reviewCount: number;
  distance: number;
  visitingFee: number;
  isOnline: boolean;
  avatar?: string;
  profileImage?: string | null; // URL or null/undefined
  verified: boolean;
}

// Mock worker data
export const TOP_WORKERS: Worker[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    skill: "Electrician",
    rating: 4.9,
    reviewCount: 287,
    distance: 2.3,
    visitingFee: 500,
    isOnline: true,
    verified: true,
    profileImage: "/images/worker-1.jpg", // Example URL
  },
  {
    id: "2",
    name: "Muhammad Ali",
    skill: "Plumber",
    rating: 4.8,
    reviewCount: 195,
    distance: 3.5,
    visitingFee: 450,
    isOnline: true,
    verified: true,
    profileImage: null,
  },
  {
    id: "3",
    name: "Usman Khan",
    skill: "Carpenter",
    rating: 5.0,
    reviewCount: 312,
    distance: 1.8,
    visitingFee: 700,
    isOnline: false,
    verified: true,
    profileImage: null,
  },
  {
    id: "4",
    name: "Hassan Raza",
    skill: "Painter",
    rating: 4.7,
    reviewCount: 156,
    distance: 4.2,
    visitingFee: 550,
    isOnline: true,
    verified: true,
    profileImage: "/images/worker-4.jpg",
  },
  {
    id: "5",
    name: "Bilal Ahmed",
    skill: "AC Technician",
    rating: 4.9,
    reviewCount: 223,
    distance: 2.9,
    visitingFee: 650,
    isOnline: true,
    verified: true,
    profileImage: null,
  },
  {
    id: "6",
    name: "Imran Malik",
    skill: "Electrician",
    rating: 4.6,
    reviewCount: 178,
    distance: 5.1,
    visitingFee: 480,
    isOnline: false,
    verified: true,
    profileImage: null,
  },
  {
    id: "7",
    name: "Tariq Hussain",
    skill: "Mason",
    rating: 4.8,
    reviewCount: 264,
    distance: 3.7,
    visitingFee: 800,
    isOnline: true,
    verified: true,
    profileImage: "/images/worker-7.jpg",
  },
  {
    id: "8",
    name: "Kamran Shah",
    skill: "Plumber",
    rating: 4.9,
    reviewCount: 201,
    distance: 1.5,
    visitingFee: 520,
    isOnline: true,
    verified: true,
    profileImage: null,
  },
];
