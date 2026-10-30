import { describe, expect, it } from 'vitest';
import cartReducer, {
  addToCart,
  clearCart,
  setCartOpen,
  toggleWishlist,
  updateQuantity,
} from '../features/cart/cartSlice';
import type { Product } from '../features/products/productsTypes';

const mockProduct: Product = {
  id: 42,
  title: 'Artisanal Ceramic Mug',
  price: 28,
  description: 'Handcrafted stoneware',
  category: 'everyday goods',
  image: 'https://example.com/mug.png',
};

describe('cartSlice reducer', () => {
  const initialState = {
    items: [],
    wishlistIds: [],
    isCartOpen: false,
    quickViewProduct: null,
  };

  it('adds a new product to the cart and opens the cart drawer', () => {
    const state = cartReducer(initialState, addToCart({ product: mockProduct, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.id).toBe(42);
    expect(state.items[0].quantity).toBe(2);
    expect(state.isCartOpen).toBe(true);
  });

  it('increments quantity when existing product is added again', () => {
    const withItem = {
      ...initialState,
      items: [{ product: mockProduct, quantity: 1 }],
    };
    const state = cartReducer(withItem, addToCart({ product: mockProduct, quantity: 3 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(4);
  });

  it('updates quantity and removes when quantity is zero', () => {
    const withItem = {
      ...initialState,
      items: [{ product: mockProduct, quantity: 2 }],
    };
    let state = cartReducer(withItem, updateQuantity({ id: 42, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);

    state = cartReducer(state, updateQuantity({ id: 42, quantity: 0 }));
    expect(state.items).toHaveLength(0);
  });

  it('toggles wishlist items', () => {
    let state = cartReducer(initialState, toggleWishlist(42));
    expect(state.wishlistIds).toEqual([42]);

    state = cartReducer(state, toggleWishlist(42));
    expect(state.wishlistIds).toEqual([]);
  });

  it('clears cart and manages drawer open status', () => {
    const withItem = {
      ...initialState,
      items: [{ product: mockProduct, quantity: 1 }],
      isCartOpen: true,
    };
    let state = cartReducer(withItem, clearCart());
    expect(state.items).toHaveLength(0);

    state = cartReducer(state, setCartOpen(false));
    expect(state.isCartOpen).toBe(false);
  });
});
