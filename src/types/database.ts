// Hand-authored from supabase/migrations/0001_init.sql.
// Replace with `npx supabase gen types typescript --linked > src/types/database.ts`
// once the Supabase project is provisioned.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; phone: string | null; avatar_url: string | null; role: 'buyer' | 'seller' | 'admin'; created_at: string };
        Insert: { id: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; role?: 'buyer' | 'seller' | 'admin'; created_at?: string };
        Update: { id?: string; full_name?: string | null; phone?: string | null; avatar_url?: string | null; role?: 'buyer' | 'seller' | 'admin'; created_at?: string };
        Relationships: [];
      };
      localities: {
        Row: { id: string; name: string; city: string; slug: string; description: string | null; ai_insights: string | null; avg_price_per_sqft: number | null; latitude: number | null; longitude: number | null; created_at: string };
        Insert: { id?: string; name: string; city?: string; slug: string; description?: string | null; ai_insights?: string | null; avg_price_per_sqft?: number | null; latitude?: number | null; longitude?: number | null; created_at?: string };
        Update: { id?: string; name?: string; city?: string; slug?: string; description?: string | null; ai_insights?: string | null; avg_price_per_sqft?: number | null; latitude?: number | null; longitude?: number | null; created_at?: string };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: 'commercial' | 'resell' | 'premium_project';
          listing_type: 'sale' | 'rent';
          price: number;
          price_period: string | null;
          bhk: number | null;
          bedrooms: number | null;
          bathrooms: number | null;
          carpet_area_sqft: number | null;
          builtup_area_sqft: number | null;
          furnishing: string | null;
          floor: number | null;
          total_floors: number | null;
          city: string;
          locality_id: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          amenities: string[];
          rera_id: string | null;
          description: string | null;
          highlights: string[];
          status: 'draft' | 'pending' | 'published' | 'sold' | 'rejected';
          rejection_reason: string | null;
          source: 'admin' | 'user';
          owner_id: string | null;
          is_featured: boolean;
          embedding: string | null;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: 'commercial' | 'resell' | 'premium_project';
          listing_type?: 'sale' | 'rent';
          price: number;
          price_period?: string | null;
          bhk?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          carpet_area_sqft?: number | null;
          builtup_area_sqft?: number | null;
          furnishing?: string | null;
          floor?: number | null;
          total_floors?: number | null;
          city?: string;
          locality_id?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          amenities?: string[];
          rera_id?: string | null;
          description?: string | null;
          highlights?: string[];
          status?: 'draft' | 'pending' | 'published' | 'sold' | 'rejected';
          rejection_reason?: string | null;
          source?: 'admin' | 'user';
          owner_id?: string | null;
          is_featured?: boolean;
          embedding?: string | null;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: 'commercial' | 'resell' | 'premium_project';
          listing_type?: 'sale' | 'rent';
          price?: number;
          price_period?: string | null;
          bhk?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          carpet_area_sqft?: number | null;
          builtup_area_sqft?: number | null;
          furnishing?: string | null;
          floor?: number | null;
          total_floors?: number | null;
          city?: string;
          locality_id?: string | null;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          amenities?: string[];
          rera_id?: string | null;
          description?: string | null;
          highlights?: string[];
          status?: 'draft' | 'pending' | 'published' | 'sold' | 'rejected';
          rejection_reason?: string | null;
          source?: 'admin' | 'user';
          owner_id?: string | null;
          is_featured?: boolean;
          embedding?: string | null;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      property_images: {
        Row: { id: string; property_id: string; storage_path: string; alt: string | null; sort_order: number; is_cover: boolean };
        Insert: { id?: string; property_id: string; storage_path: string; alt?: string | null; sort_order?: number; is_cover?: boolean };
        Update: { id?: string; property_id?: string; storage_path?: string; alt?: string | null; sort_order?: number; is_cover?: boolean };
        Relationships: [];
      };
      project_details: {
        Row: { property_id: string; developer_name: string | null; possession_date: string | null; configurations: Json; brochure_path: string | null; total_units: number | null; project_status: string | null; amenities_extended: string[] };
        Insert: { property_id: string; developer_name?: string | null; possession_date?: string | null; configurations?: Json; brochure_path?: string | null; total_units?: number | null; project_status?: string | null; amenities_extended?: string[] };
        Update: { property_id?: string; developer_name?: string | null; possession_date?: string | null; configurations?: Json; brochure_path?: string | null; total_units?: number | null; project_status?: string | null; amenities_extended?: string[] };
        Relationships: [];
      };
      leads: {
        Row: { id: string; name: string; phone: string; email: string | null; message: string | null; property_id: string | null; source_channel: 'enquiry_form' | 'chatbot' | 'valuation' | 'whatsapp' | 'contact'; status: 'new' | 'contacted' | 'closed'; assigned_to: string | null; created_at: string };
        Insert: { id?: string; name: string; phone: string; email?: string | null; message?: string | null; property_id?: string | null; source_channel?: 'enquiry_form' | 'chatbot' | 'valuation' | 'whatsapp' | 'contact'; status?: 'new' | 'contacted' | 'closed'; assigned_to?: string | null; created_at?: string };
        Update: { id?: string; name?: string; phone?: string; email?: string | null; message?: string | null; property_id?: string | null; source_channel?: 'enquiry_form' | 'chatbot' | 'valuation' | 'whatsapp' | 'contact'; status?: 'new' | 'contacted' | 'closed'; assigned_to?: string | null; created_at?: string };
        Relationships: [];
      };
      valuations: {
        Row: { id: string; name: string; phone: string; email: string | null; locality_id: string | null; area_sqft: number | null; bhk: number | null; property_type: string | null; estimated_low: number | null; estimated_high: number | null; created_at: string };
        Insert: { id?: string; name: string; phone: string; email?: string | null; locality_id?: string | null; area_sqft?: number | null; bhk?: number | null; property_type?: string | null; estimated_low?: number | null; estimated_high?: number | null; created_at?: string };
        Update: { id?: string; name?: string; phone?: string; email?: string | null; locality_id?: string | null; area_sqft?: number | null; bhk?: number | null; property_type?: string | null; estimated_low?: number | null; estimated_high?: number | null; created_at?: string };
        Relationships: [];
      };
      favorites: {
        Row: { user_id: string; property_id: string; created_at: string };
        Insert: { user_id: string; property_id: string; created_at?: string };
        Update: { user_id?: string; property_id?: string; created_at?: string };
        Relationships: [];
      };
      saved_searches: {
        Row: { id: string; user_id: string; label: string | null; filters: Json; notify: boolean; created_at: string };
        Insert: { id?: string; user_id: string; label?: string | null; filters?: Json; notify?: boolean; created_at?: string };
        Update: { id?: string; user_id?: string; label?: string | null; filters?: Json; notify?: boolean; created_at?: string };
        Relationships: [];
      };
      chat_sessions: {
        Row: { id: string; user_id: string | null; created_at: string };
        Insert: { id?: string; user_id?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string | null; created_at?: string };
        Relationships: [];
      };
      chat_messages: {
        Row: { id: string; session_id: string; role: string; content: string; created_at: string };
        Insert: { id?: string; session_id: string; role: string; content: string; created_at?: string };
        Update: { id?: string; session_id?: string; role?: string; content?: string; created_at?: string };
        Relationships: [];
      };
      blog_posts: {
        Row: { id: string; slug: string; title: string; cover_path: string | null; excerpt: string | null; body: string | null; author: string | null; status: 'draft' | 'published'; published_at: string | null; tags: string[]; created_at: string };
        Insert: { id?: string; slug: string; title: string; cover_path?: string | null; excerpt?: string | null; body?: string | null; author?: string | null; status?: 'draft' | 'published'; published_at?: string | null; tags?: string[]; created_at?: string };
        Update: { id?: string; slug?: string; title?: string; cover_path?: string | null; excerpt?: string | null; body?: string | null; author?: string | null; status?: 'draft' | 'published'; published_at?: string | null; tags?: string[]; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_seller: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: 'buyer' | 'seller' | 'admin';
      property_category: 'commercial' | 'resell' | 'premium_project';
      listing_type: 'sale' | 'rent';
      property_status: 'draft' | 'pending' | 'published' | 'sold' | 'rejected';
      property_source: 'admin' | 'user';
      lead_channel: 'enquiry_form' | 'chatbot' | 'valuation' | 'whatsapp' | 'contact';
      lead_status: 'new' | 'contacted' | 'closed';
      post_status: 'draft' | 'published';
    };
    CompositeTypes: Record<string, never>;
  };
}
