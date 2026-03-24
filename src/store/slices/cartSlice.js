import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api';

// ── THUNKS — sync cart with backend when logged in ────────

// GET /api/cart
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/cart');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/cart/add
export const addToCartAPI = createAsyncThunk(
  'cart/addAPI',
  async ({ productId, qty = 1 }, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, qty }),
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/cart/remove
export const removeFromCartAPI = createAsyncThunk(
  'cart/removeAPI',
  async ({ productId, qty = 1 }, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ productId, qty }),
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE /api/cart
export const clearCartAPI = createAsyncThunk(
  'cart/clearAPI',
  async (_, { rejectWithValue }) => {
    try {
      await apiFetch('/cart', { method: 'DELETE' });
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:  {},   // local cart: { [productId]: { ...product, qty } }
    count:  0,
    total:  0,
    status: 'idle',
    error:  null,
  },
  reducers: {
    // Local add (before login or optimistic update)
    addToCart(state, { payload: item }) {
      const key      = item._id || item.id;
      const existing = state.items[key] || { ...item, qty: 0 };
      state.items[key] = { ...existing, qty: existing.qty + 1 };
      state.count += 1;
      state.total  = Math.round((state.total + item.price) * 100) / 100;
    },
    // Local remove
    removeFromCart(state, { payload: item }) {
      const key      = item._id || item.id;
      const existing = state.items[key];
      if (!existing || existing.qty === 0) return;
      if (existing.qty === 1) delete state.items[key];
      else state.items[key].qty -= 1;
      state.count -= 1;
      state.total  = Math.round((state.total - item.price) * 100) / 100;
    },
    // Clear local cart
    clearCart(state) {
      state.items = {};
      state.count = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    // When backend cart is fetched, sync local state
    builder
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        if (!payload) return;
        // Rebuild local items map from backend cart
        const items = {};
        (payload.items || []).forEach(item => {
          const key = item.productId?._id || item.productId;
          items[key] = {
            id:       key,
            _id:      key,
            name:     item.name,
            emoji:    item.emoji,
            unit:     item.unit,
            price:    item.price,
            oldPrice: item.oldPrice,
            qty:      item.qty,
          };
        });
        state.items = items;
        state.count = payload.itemCount || 0;
        state.total = payload.subtotal  || 0;
      });

    // When backend cart add succeeds, sync
    builder
      .addCase(addToCartAPI.pending,   (state) => { state.status = 'loading'; state.error = null; })
      .addCase(addToCartAPI.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        if (!payload) return;
        const items = {};
        (payload.items || []).forEach(item => {
          const key = item.productId?._id || item.productId;
          items[key] = {
            id: key, _id: key,
            name: item.name, emoji: item.emoji,
            unit: item.unit, price: item.price,
            oldPrice: item.oldPrice, qty: item.qty,
          };
        });
        state.items = items;
        state.count = payload.itemCount || 0;
        state.total = payload.subtotal  || 0;
      })
      .addCase(addToCartAPI.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload;
      });

    // Remove from backend
    builder
      .addCase(removeFromCartAPI.fulfilled, (state, { payload }) => {
        if (!payload) return;
        const items = {};
        (payload.items || []).forEach(item => {
          const key = item.productId?._id || item.productId;
          items[key] = {
            id: key, _id: key,
            name: item.name, emoji: item.emoji,
            unit: item.unit, price: item.price,
            oldPrice: item.oldPrice, qty: item.qty,
          };
        });
        state.items = items;
        state.count = payload.itemCount || 0;
        state.total = payload.subtotal  || 0;
      });

    // Clear backend cart
    builder
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.items = {};
        state.count = 0;
        state.total = 0;
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.count;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartStatus= (state) => state.cart.status;
export const selectCartError = (state) => state.cart.error;
export const selectItemQty   = (id)    => (state) => state.cart.items[id]?.qty || 0;

export default cartSlice.reducer;
