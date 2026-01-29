// Worker Detail Types
export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  customerAvatar?: string;
} 

export interface WorkerDetail {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: number;
  visitingFee: number;
  isOnline: boolean;
  isVerified: boolean;
  bio: string;
  experienceYears: number;
  specializations: string[];
  services: Service[];
  reviews: Review[];
  profileImage?: string | null;
  location: {
    lat: number;
    lng: number;
  };
}

export interface BookingFormData {
  serviceId: string;
  date: Date | null;
  timeSlot: string;
  address: string;
  jobDescription: string;
}

export type BookingStatus = "idle" | "booking-submitted" | "worker-en-route";
