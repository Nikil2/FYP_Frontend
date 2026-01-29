import {
  Service,
  Feature,
  Testimonial,
  Stat,
  Worker,
} from "@/interfaces/landing-interfaces";
import { MOCK_WORKERS } from "@/lib/mock-data";

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

// Mock worker data - Now uses centralized data from lib/mock-data.ts
// This maintains the Worker interface format for the landing page
export const TOP_WORKERS: Worker[] = MOCK_WORKERS.map((worker) => ({
  id: worker.id,
  name: worker.name,
  skill: worker.category,
  rating: worker.rating,
  reviewCount: worker.reviewCount,
  distance: worker.distance,
  visitingFee: worker.visitingFee,
  isOnline: worker.isOnline,
  verified: worker.isVerified,
  profileImage: worker.profileImage,
}));
