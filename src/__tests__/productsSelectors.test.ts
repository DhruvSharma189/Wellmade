import { describe, expect, it } from 'vitest';
import reducer, { setCategory, setPriceRange, setQuery, setSort } from '../features/products/productsSlice';
import { selectFilteredProducts } from '../features/products/productsSelectors';
import type { Product } from '../features/products/productsTypes';
import type { RootState } from '../app/store';
const products: Product[] = [
  { id: 1, title: 'Silver Ring', price: 15, description: 'Minimal jewelry', category: 'jewelery', image: '', rating: { rate: 4.2, count: 20 } },
  { id: 2, title: 'Canvas Bag', price: 35, description: 'Everyday carry', category: "men's clothing", image: '', rating: { rate: 3.5, count: 10 } },
  { id: 3, title: 'Gold Chain', price: 90, description: 'Classic jewelry', category: 'jewelery', image: '', rating: { rate: 4.8, count: 50 } },
];
const baseState = {
  products: { ...reducer(undefined, { type: 'init' }), items: products },
  feedback: { entries: [], status: 'idle' as const, error: null },
  cart: { items: [], wishlistIds: [], isCartOpen: false, quickViewProduct: null },
} as RootState;
describe('product filtering selectors', () => {
  it('filters by query across title and description', () => { const state = { ...baseState, products: { ...baseState.products, ...reducer(baseState.products, setQuery('everyday')) } }; expect(selectFilteredProducts(state).map(p => p.id)).toEqual([2]); });
  it('combines category and price filters', () => { let p = reducer(baseState.products, setCategory('jewelery')); p = reducer(p, setPriceRange('under-25')); expect(selectFilteredProducts({ ...baseState, products: p }).map(x => x.id)).toEqual([1]); });
  it('sorts by price ascending', () => { const p = reducer(baseState.products, setSort('price-asc')); expect(selectFilteredProducts({ ...baseState, products: p }).map(x => x.price)).toEqual([15, 35, 90]); });
});
