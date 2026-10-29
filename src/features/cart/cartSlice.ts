import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../products/productsTypes';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  wishlistIds: number[];
  isCartOpen: boolean;
  quickViewProduct: Product | null;
}

const CART_STORAGE_KEY = 'wellmade-cart-v1';
const WISHLIST_STORAGE_KEY = 'wellmade-wishlist-v1';

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const initialState: CartState = {
  items: readStorage<CartItem[]>(CART_STORAGE_KEY, []),
  wishlistIds: readStorage<number[]>(WISHLIST_STORAGE_KEY, []),
  isCartOpen: false,
  quickViewProduct: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; quantity?: number }>) {
      const existing = state.items.find(i => i.product.id === action.payload.product.id);
      const qty = action.payload.quantity ?? 1;
      if (existing) {
        existing.quantity += qty;
      } else {
        state.items.push({ product: action.payload.product, quantity: qty });
      }
      state.isCartOpen = true;
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: number; quantity: number }>) {
      const item = state.items.find(i => i.product.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.product.id !== action.payload.id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
    toggleWishlist(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.wishlistIds.includes(id)) {
        state.wishlistIds = state.wishlistIds.filter(item => item !== id);
      } else {
        state.wishlistIds.push(id);
      }
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
    },
    setQuickViewProduct(state, action: PayloadAction<Product | null>) {
      state.quickViewProduct = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleWishlist,
  setCartOpen,
  setQuickViewProduct,
} = cartSlice.actions;

export { CART_STORAGE_KEY, WISHLIST_STORAGE_KEY };
export default cartSlice.reducer;
