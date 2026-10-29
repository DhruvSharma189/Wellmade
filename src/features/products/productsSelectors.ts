import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export const selectProductsState = (state: RootState) => state.products;

export const selectCategories = createSelector([selectProductsState], (state) =>
  [...new Set(state.items.map((p) => p.category))].sort((a, b) => a.localeCompare(b))
);

export const selectFilteredProducts = createSelector([selectProductsState], (state) => {
  const query = state.query.trim().toLowerCase();
  const filtered = state.items.filter((product) => {
    const matchesQuery =
      !query || `${product.title} ${product.description} ${product.category}`.toLowerCase().includes(query);
    const matchesCategory = state.category === 'all' || product.category === state.category;
    const matchesPrice =
      state.priceRange === 'all' ||
      (state.priceRange === 'under-25'
        ? product.price < 25
        : state.priceRange === '25-75'
        ? product.price >= 25 && product.price <= 75
        : product.price > 75);
    const matchesRating = !state.minRating || (product.rating?.rate ?? 0) >= state.minRating;
    return matchesQuery && matchesCategory && matchesPrice && matchesRating;
  });

  switch (state.sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...filtered].sort((a, b) => b.price - a.price);
    case 'title-asc':
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    case 'rating-desc':
      return [...filtered].sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
    default:
      return filtered;
  }
});
