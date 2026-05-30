import type { Property } from '@/lib/data/types';
import { PropertyCard } from './property-card';
import { ProjectCard } from './project-card';

/**
 * Renders the right card for a listing: a development-oriented ProjectCard for
 * premium projects, and the standard PropertyCard for everything else.
 */
export function ListingCard({ property }: { property: Property }) {
  if (property.category === 'premium_project') {
    return <ProjectCard property={property} />;
  }
  return <PropertyCard property={property} />;
}
