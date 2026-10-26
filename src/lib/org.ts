import business from '../data/business.json';
import { aggregateRating } from './facts';

// The organisation node every page carries (checker rule P-schema-identity).
export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'RoofingContractor',
  name: business.companyName,
  url: 'https://manchestergutters.co.uk',
  telephone: business.phone,
  email: business.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    addressCountry: business.address.country,
  },
  ...(aggregateRating ? { aggregateRating } : {}),
};
