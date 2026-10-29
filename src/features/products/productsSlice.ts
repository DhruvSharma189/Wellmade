import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts } from '../../services/productsApi';
import type { PriceRange, Product, SortOption } from './productsTypes';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  query: string;
  category: string;
  priceRange: PriceRange;
  minRating: number;
  sort: SortOption;
}
const initialState: ProductsState = { items: [], status: 'idle', error: null, query: '', category: 'all', priceRange: 'all', minRating: 0, sort: 'featured' };
export const loadProducts = createAsyncThunk<Product[], void, { rejectValue: string }>('products/load', async (_, { signal, rejectWithValue }) => {
  try { return await fetchProducts(signal); } catch (error) { return rejectWithValue(error instanceof Error ? error.message : 'Unable to load products.'); }
});
const productsSlice = createSlice({
  name: 'products', initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) { state.query = action.payload; },
    setCategory(state, action: PayloadAction<string>) { state.category = action.payload; },
    setPriceRange(state, action: PayloadAction<PriceRange>) { state.priceRange = action.payload; },
    setMinRating(state, action: PayloadAction<number>) { state.minRating = action.payload; },
    setSort(state, action: PayloadAction<SortOption>) { state.sort = action.payload; },
    clearFilters(state) { state.query = ''; state.category = 'all'; state.priceRange = 'all'; state.minRating = 0; state.sort = 'featured'; },
  },
  extraReducers(builder) {
    builder.addCase(loadProducts.pending, state => { state.status = 'loading'; state.error = null; })
      .addCase(loadProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(loadProducts.rejected, (state, action) => { if (action.meta.aborted) { state.status = 'idle'; return; } state.status = 'failed'; state.error = action.payload ?? action.error.message ?? 'Unable to load products.'; });
  },
});
export const { setQuery, setCategory, setPriceRange, setMinRating, setSort, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
