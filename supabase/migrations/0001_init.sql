-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Enums
create type user_role as enum ('buyer', 'seller', 'admin');
create type property_category as enum ('commercial', 'resell', 'premium_project');
create type listing_type as enum ('sale', 'rent');
create type property_status as enum ('draft', 'pending', 'published', 'sold', 'rejected');
create type property_source as enum ('admin', 'user');
create type lead_channel as enum ('enquiry_form', 'chatbot', 'valuation', 'whatsapp', 'contact');
create type lead_status as enum ('new', 'contacted', 'closed');
create type post_status as enum ('draft', 'published');

-- Profiles (1:1 with auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role user_role not null default 'buyer',
  created_at timestamptz not null default now()
);

-- Localities
create table localities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null default 'Lucknow',
  slug text unique not null,
  description text,
  ai_insights text,
  avg_price_per_sqft integer,
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

-- Properties
create table properties (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category property_category not null,
  listing_type listing_type not null default 'sale',
  price bigint not null,
  price_period text,
  bhk smallint,
  bedrooms smallint,
  bathrooms smallint,
  carpet_area_sqft integer,
  builtup_area_sqft integer,
  furnishing text,
  floor smallint,
  total_floors smallint,
  city text not null default 'Lucknow',
  locality_id uuid references localities(id) on delete set null,
  address text,
  latitude double precision,
  longitude double precision,
  amenities text[] not null default '{}',
  rera_id text,
  description text,
  highlights text[] not null default '{}',
  status property_status not null default 'draft',
  rejection_reason text,
  source property_source not null default 'admin',
  owner_id uuid references profiles(id) on delete set null,
  is_featured boolean not null default false,
  embedding vector(1536),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index properties_status_idx on properties(status);
create index properties_category_idx on properties(category);
create index properties_city_locality_idx on properties(city, locality_id);
create index properties_featured_idx on properties(is_featured) where is_featured;

-- Property images
create table property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  alt text,
  sort_order smallint not null default 0,
  is_cover boolean not null default false
);
create index property_images_property_idx on property_images(property_id);

-- Premium project extras
create table project_details (
  property_id uuid primary key references properties(id) on delete cascade,
  developer_name text,
  possession_date date,
  configurations jsonb not null default '[]',
  brochure_path text,
  total_units integer,
  project_status text,
  amenities_extended text[] not null default '{}'
);

-- Leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text,
  property_id uuid references properties(id) on delete set null,
  source_channel lead_channel not null default 'enquiry_form',
  status lead_status not null default 'new',
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index leads_status_idx on leads(status);

-- Valuations
create table valuations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  locality_id uuid references localities(id) on delete set null,
  area_sqft integer,
  bhk smallint,
  property_type text,
  estimated_low bigint,
  estimated_high bigint,
  created_at timestamptz not null default now()
);

-- Favorites
create table favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, property_id)
);

-- Saved searches
create table saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text,
  filters jsonb not null default '{}',
  notify boolean not null default false,
  created_at timestamptz not null default now()
);

-- Concierge chat
create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

-- Blog
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  cover_path text,
  excerpt text,
  body text,
  author text,
  status post_status not null default 'draft',
  published_at timestamptz,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- updated_at trigger for properties
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger properties_set_updated_at
  before update on properties
  for each row execute function set_updated_at();
