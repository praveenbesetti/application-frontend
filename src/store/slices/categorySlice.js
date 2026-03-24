import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api';

// GET /api/categories  — returns categories with subcategories populated
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/categories');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// GET /api/categories/:slug
export const fetchCategoryBySlug = createAsyncThunk(
  'categories/fetchOne',
  async (slug, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`/categories/${slug}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    list:          [],
    status:        'idle',
    error:         null,
    current:       null,
    currentStatus: 'idle',
    currentError:  null,
  },
  reducers: {
    clearCurrentCategory(state) {
      state.current       = null;
      state.currentStatus = 'idle';
      state.currentError  = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending,   (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.status = 'succeeded'; state.list = payload; })
      .addCase(fetchCategories.rejected,  (state, { payload }) => { state.status = 'failed'; state.error = payload; });

    builder
      .addCase(fetchCategoryBySlug.pending,   (state) => { state.currentStatus = 'loading'; state.currentError = null; })
      .addCase(fetchCategoryBySlug.fulfilled, (state, { payload }) => { state.currentStatus = 'succeeded'; state.current = payload; })
      .addCase(fetchCategoryBySlug.rejected,  (state, { payload }) => { state.currentStatus = 'failed'; state.currentError = payload; });
  },
});

export const { clearCurrentCategory } = categorySlice.actions;

export const selectAllCategories    = (state) => state.categories.list;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCurrentCategory  = (state) => state.categories.current;
export const selectCurrentCatStatus = (state) => state.categories.currentStatus;

export default categorySlice.reducer;
