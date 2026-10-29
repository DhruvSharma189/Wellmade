import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import feedbackReducer, { FEEDBACK_STORAGE_KEY } from '../features/feedback/feedbackSlice';
import cartReducer, { CART_STORAGE_KEY, WISHLIST_STORAGE_KEY } from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    feedback: feedbackReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Persistence for feedback, cart, and wishlist
if (typeof window !== 'undefined') {
  let previousFeedback = store.getState().feedback.entries;
  let previousCart = store.getState().cart.items;
  let previousWishlist = store.getState().cart.wishlistIds;

  store.subscribe(() => {
    const state = store.getState();
    if (state.feedback.entries !== previousFeedback) {
      previousFeedback = state.feedback.entries;
      try {
        window.localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(previousFeedback));
      } catch {
        /* storage may be quota-limited */
      }
    }
    if (state.cart.items !== previousCart) {
      previousCart = state.cart.items;
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(previousCart));
      } catch {
        /* storage may be quota-limited */
      }
    }
    if (state.cart.wishlistIds !== previousWishlist) {
      previousWishlist = state.cart.wishlistIds;
      try {
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(previousWishlist));
      } catch {
        /* storage may be quota-limited */
      }
    }
  });
}
