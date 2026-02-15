// ============================================
// CUSTOMER BROWSING TYPES
// ============================================

export type PriceType = "fixed" | "estimated";

export interface ServiceOffer {
  id: string;
  title: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  priceType: PriceType;
}

export interface PopularService {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  priceType: PriceType;
  categoryId: string;
}

export interface ServiceCategoryGroup {
  id: string;
  name: string;
  nameUrdu: string;
  image: string;
  description: string;
}

export interface SubCategoryService {
  id: string;
  name: string;
  nameUrdu: string;
  image: string;
  categoryId: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  nameUrdu: string;
  image: string;
  price: number;
  priceType: PriceType;
  description?: string;
  subCategoryId: string;
  categoryId: string;
}

export interface BookingFormData {
  serviceId: string;
  serviceName: string;
  location: string;
  lat?: number;
  lng?: number;
  serviceDate: string;
  serviceTime: string;
  workDescription: string;
  referralSource: string;
  images: File[];
}

export interface City {
  id: string;
  name: string;
  nameUrdu: string;
}
