import type { Product } from '../features/products/productsTypes';

const API_URL = import.meta.env.VITE_PRODUCTS_API_URL || 'https://fakestoreapi.com/products';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizeProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null;
  const id = Number(value.id);
  if (!Number.isFinite(id) || typeof value.title !== 'string') return null;

  const ratingValue = isRecord(value.rating) ? value.rating : undefined;
  const rate = ratingValue ? Number(ratingValue.rate) : NaN;
  const count = ratingValue ? Number(ratingValue.count) : NaN;

  return {
    id,
    title: value.title,
    price: Number.isFinite(Number(value.price)) ? Number(value.price) : 0,
    description:
      typeof value.description === 'string'
        ? value.description
        : 'No description is available for this item yet.',
    category: typeof value.category === 'string' ? value.category : 'Uncategorised',
    image: typeof value.image === 'string' ? value.image : '',
    ...(Number.isFinite(rate) && Number.isFinite(count) ? { rating: { rate, count } } : {}),
  };
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(API_URL, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(
      `Product request failed with status ${response.status}. Please check your connection or endpoint.`,
    );
  }
  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error(
      'The products API returned an unexpected response format. Expected an array of products.',
    );
  }
  return payload.map(normalizeProduct).filter((product): product is Product => product !== null);
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  const response = await fetch(`${API_URL.replace(/\/$/, '')}/${id}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (response.status === 404) throw new Error('PRODUCT_NOT_FOUND');
  if (!response.ok) {
    throw new Error(`Product request failed with status ${response.status}.`);
  }
  const payload: unknown = await response.json();
  const product = normalizeProduct(payload);
  if (!product) throw new Error('The product API returned an invalid or malformed product.');
  return product;
}
