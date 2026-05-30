export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  locality: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 'tst-001',
    quote:
      'We had been searching for a 3 BHK in Gomti Nagar for months. Akshita Realty understood exactly what we wanted and closed the deal in three weeks — paperwork, registry and all.',
    name: 'Ananya & Rohit Saxena',
    role: 'Home buyers',
    locality: 'Gomti Nagar',
    rating: 5,
  },
  {
    id: 'tst-002',
    quote:
      'I needed to sell my late father\'s house in Aliganj without the usual broker chaos. Their valuation was spot-on and they brought me a serious buyer at a fair price.',
    name: 'Pratima Verma',
    role: 'Seller',
    locality: 'Aliganj',
    rating: 5,
  },
  {
    id: 'tst-003',
    quote:
      'As a tenant new to Lucknow, I was nervous about being misled. The team showed me only verified, RERA-clean listings and handled the rent deed end to end. Truly professional.',
    name: 'Kabir Ahmed',
    role: 'Tenant',
    locality: 'Hazratganj',
    rating: 5,
  },
  {
    id: 'tst-004',
    quote:
      'I invested in a premium project in Sushant Golf City on their recommendation. Two years on, the appreciation has been excellent. Their market read for Lucknow is genuinely sharp.',
    name: 'Sanjay Mishra',
    role: 'Investor',
    locality: 'Sushant Golf City',
    rating: 5,
  },
];
