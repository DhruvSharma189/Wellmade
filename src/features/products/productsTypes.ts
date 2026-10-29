export interface ProductRating { rate: number; count: number }
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ProductRating;
}
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'title-asc' | 'rating-desc';
export type PriceRange = 'all' | 'under-25' | '25-75' | 'over-75';
