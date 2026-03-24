import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api';
import { OFFER_FILTERS, PROMO_CARDS } from '../../data/staticData';

// ── THUNKS ────────────────────────────────────────────────

// GET /api/products/featured
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/products/featured');
      // Backend returns: { data: [{_id, categorySlug, products:[]}], byCategory:{} }
      // Use byCategory map directly if available, else build it
      if (data.byCategory && Object.keys(data.byCategory).length > 0) {
        return data.byCategory;
      }
      // Fallback: build from array
      const byCategory = {};
      (data.data || []).forEach(({ categorySlug, products }) => {
        byCategory[categorySlug] = products;
      });
      return byCategory;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET /api/banners
export const fetchBanners = createAsyncThunk(
  'products/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/banners');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET /api/products?category=groceries&subcat=atta&sort=price_asc...
// Uses categorySlug and subcategorySlug (strings) — backend handles resolution
export const fetchCategoryProducts = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categorySlug, subcat, sort, maxPrice, onSale, page = 1 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.set('category', categorySlug);   // backend param name is 'category'
      params.set('limit',    '50');
      params.set('page',     String(page));

      if (subcat   && subcat !== 'all') params.set('subcat',   subcat);   // subcategorySlug
      if (sort     && sort !== 'relevance') params.set('sort', sort);
      if (maxPrice && maxPrice < 1000)  params.set('maxPrice', String(maxPrice));
      if (onSale)                        params.set('onSale',  'true');

      const data = await apiFetch(`/products?${params.toString()}`);
      return {
        products: data.data  || [],
        total:    data.total || 0,
        page:     data.page  || 1,
        pages:    data.pages || 0,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET /api/products/search?q=term
export const searchProducts = createAsyncThunk(
  'products/search',
  async (query, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`/products/search?q=${encodeURIComponent(query)}`);
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET /api/products/:id/related
export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (productId, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`/products/${productId}/related`);
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────
const productSlice = createSlice({
  name: 'products',
  initialState: {
    // Home
    byCategory:   {},
    banners:      [],
    promoCards:   PROMO_CARDS,
    offerFilters: OFFER_FILTERS,
    activeFilter: 'bestsellers',
    homeStatus:   'idle',
    bannerStatus: 'idle',
    homeError:    null,

    // Category page
    categoryProducts: [],
    categoryTotal:    0,
    categoryPage:     1,
    categoryPages:    1,
    categoryStatus:   'idle',
    categoryError:    null,

    // Product detail - related
    relatedProducts: [],
    relatedStatus:   'idle',

    // Search
    searchResults: [],
    searchStatus:  'idle',
    searchQuery:   '',
    searchError:   null,
  },
  reducers: {
    setActiveFilter(state, { payload })  { state.activeFilter = payload; },
    clearCategoryProducts(state) {
      state.categoryProducts = [];
      state.categoryTotal    = 0;
      state.categoryPage     = 1;
      state.categoryPages    = 1;
      state.categoryStatus   = 'idle';
      state.categoryError    = null;
    },
    clearSearch(state) {
      state.searchResults = [];
      state.searchStatus  = 'idle';
      state.searchQuery   = '';
      state.searchError   = null;
    },
    clearRelated(state) {
      state.relatedProducts = [];
      state.relatedStatus   = 'idle';
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchFeaturedProducts.pending,   (state) => { state.homeStatus = 'loading'; state.homeError = null; })
      .addCase(fetchFeaturedProducts.fulfilled, (state, { payload }) => { state.homeStatus = 'succeeded'; state.byCategory = payload; })
      .addCase(fetchFeaturedProducts.rejected,  (state, { payload }) => { state.homeStatus = 'failed'; state.homeError = payload; });

    builder
      .addCase(fetchBanners.pending,   (state) => { state.bannerStatus = 'loading'; })
      .addCase(fetchBanners.fulfilled, (state, { payload }) => { state.bannerStatus = 'succeeded'; state.banners = payload; })
      .addCase(fetchBanners.rejected,  (state) => { state.bannerStatus = 'failed'; });

    builder
      .addCase(fetchCategoryProducts.pending,   (state) => { state.categoryStatus = 'loading'; state.categoryError = null; })
      .addCase(fetchCategoryProducts.fulfilled, (state, { payload }) => {
        state.categoryStatus   = 'succeeded';
        state.categoryProducts = payload.products;
        state.categoryTotal    = payload.total;
        state.categoryPage     = payload.page;
        state.categoryPages    = payload.pages;
      })
      .addCase(fetchCategoryProducts.rejected,  (state, { payload }) => { state.categoryStatus = 'failed'; state.categoryError = payload; });

    builder
      .addCase(fetchRelatedProducts.pending,   (state) => { state.relatedStatus = 'loading'; })
      .addCase(fetchRelatedProducts.fulfilled, (state, { payload }) => { state.relatedStatus = 'succeeded'; state.relatedProducts = payload; })
      .addCase(fetchRelatedProducts.rejected,  (state) => { state.relatedStatus = 'failed'; });

    builder
      .addCase(searchProducts.pending,   (state) => { state.searchStatus = 'loading'; state.searchError = null; })
      .addCase(searchProducts.fulfilled, (state, { payload }) => { state.searchStatus = 'succeeded'; state.searchResults = payload; })
      .addCase(searchProducts.rejected,  (state, { payload }) => { state.searchStatus = 'failed'; state.searchError = payload; });
  },
});

export const {
  setActiveFilter, clearCategoryProducts, clearSearch, clearRelated,
} = productSlice.actions;

export const selectByCategory       = (state) => state.products.byCategory;
export const selectBanners          = (state) => state.products.banners;
export const selectPromoCards       = (state) => state.products.promoCards;
export const selectOfferFilters     = (state) => state.products.offerFilters;
export const selectActiveFilter     = (state) => state.products.activeFilter;
export const selectHomeStatus       = (state) => state.products.homeStatus;
export const selectHomeError        = (state) => state.products.homeError;
export const selectCategoryProducts = (state) => state.products.categoryProducts;
export const selectCategoryTotal    = (state) => state.products.categoryTotal;
export const selectCategoryStatus   = (state) => state.products.categoryStatus;
export const selectCategoryError    = (state) => state.products.categoryError;
export const selectRelatedProducts  = (state) => state.products.relatedProducts;
export const selectRelatedStatus    = (state) => state.products.relatedStatus;
export const selectSearchResults    = (state) => state.products.searchResults;
export const selectSearchStatus     = (state) => state.products.searchStatus;

export default productSlice.reducer;
