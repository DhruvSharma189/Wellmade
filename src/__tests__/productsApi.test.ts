import { describe, expect, it } from 'vitest';
import { normalizeProduct } from '../services/productsApi';
describe('normalizeProduct', () => {
  it('normalizes a Fake Store API product', () => { expect(normalizeProduct({ id: 1, title: 'Item', price: '12.5', category: 'test', image: 'img.png', rating: { rate: 4.5, count: 12 } })).toEqual({ id: 1, title: 'Item', price: 12.5, description: 'No description is available for this item yet.', category: 'test', image: 'img.png', rating: { rate: 4.5, count: 12 } }); });
  it('rejects malformed products and handles optional fields', () => { expect(normalizeProduct({ id: 'bad', title: 'No id' })).toBeNull(); expect(normalizeProduct({ id: 2, title: 'Simple' })).toMatchObject({ id: 2, price: 0, category: 'Uncategorised', image: '' }); });
});
