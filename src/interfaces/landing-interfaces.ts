// Service categories interface
export interface Service {
  id: string;
  name: string;
  icon: string;
  startingPrice: number;
}

// Features interface
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

// Testimonials interface
export interface Testimonial {
  name: string;
  city: string;
  quote: string;
  rating: number;
  avatar?: string;
}

// Stats interface
export interface Stat {
  value: string;
  label: string;
}

// Worker data interface
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
  profileImage?: string | null;
  verified: boolean;
}
