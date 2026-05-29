export type PropertyCategory = 'commercial' | 'resell' | 'premium_project';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'draft' | 'pending' | 'published' | 'sold' | 'rejected';

export interface PropertyImage { url: string; alt: string }

export interface ProjectDetails {
  developerName: string;
  possessionDate: string;
  configurations: { type: string; sizeSqft: number; price: number }[];
  brochureUrl?: string;
  totalUnits?: number;
  projectStatus?: string;
  amenitiesExtended: string[];
}

export interface Property {
  id: string; slug: string; title: string;
  category: PropertyCategory; listingType: ListingType;
  price: number; pricePeriod?: string | null;
  bhk?: number | null; bedrooms?: number | null; bathrooms?: number | null;
  carpetAreaSqft?: number | null; builtupAreaSqft?: number | null;
  furnishing?: string | null; floor?: number | null; totalFloors?: number | null;
  city: string; localitySlug: string; address?: string | null;
  latitude?: number | null; longitude?: number | null;
  amenities: string[]; reraId?: string | null;
  description: string; highlights: string[];
  status: PropertyStatus; source: 'admin' | 'user'; ownerId?: string | null;
  rejectionReason?: string | null;
  isFeatured: boolean; views: number;
  images: PropertyImage[];
  project?: ProjectDetails | null;
  createdAt: string;
}

export interface Locality {
  id: string; name: string; slug: string; city: string;
  description: string; aiInsights: string;
  avgPricePerSqft: number; latitude: number; longitude: number;
}

export interface Lead {
  id: string; name: string; phone: string; email?: string | null;
  message?: string | null; propertySlug?: string | null;
  sourceChannel: 'enquiry_form' | 'chatbot' | 'valuation' | 'whatsapp' | 'contact';
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export interface BlogPost {
  id: string; slug: string; title: string; coverUrl: string;
  excerpt: string; body: string; author: string;
  status: 'draft' | 'published'; publishedAt: string; tags: string[];
}

export interface PropertyFilters {
  category?: PropertyCategory; listingType?: ListingType; localitySlug?: string;
  minPrice?: number; maxPrice?: number; bhk?: number; query?: string;
  sort?: 'recent' | 'price_asc' | 'price_desc';
}
