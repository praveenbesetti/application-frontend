import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../api';

// ── Load persisted auth from localStorage ─────────────────
const savedUser  = (() => { try { return JSON.parse(localStorage.getItem('qb_user')); } catch { return null; } })();
const savedToken = localStorage.getItem('qb_access_token');

// ── THUNKS ────────────────────────────────────────────────

// POST /api/auth/send-otp
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      return data; // { otp } returned in dev mode
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/auth/verify-otp
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ phone, otp, name, email }, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp, name, email }),
      });
      // Persist tokens + user
      localStorage.setItem('qb_access_token',  data.data.accessToken);
      localStorage.setItem('qb_refresh_token', data.data.refreshToken);
      localStorage.setItem('qb_user', JSON.stringify(data.data.user));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// PUT /api/auth/me - update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates, { rejectWithValue }) => {
    try {
      const data = await apiFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      localStorage.setItem('qb_user', JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// POST /api/auth/logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (_) {}
    // Always clear local storage
    localStorage.removeItem('qb_access_token');
    localStorage.removeItem('qb_refresh_token');
    localStorage.removeItem('qb_user');
    return null;
  }
);

// ── SLICE ─────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:          savedUser  || null,
    accessToken:   savedToken || null,
    isLoggedIn:    !!(savedUser && savedToken),

    // OTP flow
    otpSent:       false,
    devOtp:        null,    // only in development
    phone:         '',

    // Auth modal
    modalOpen:     false,

    status:        'idle',
    error:         null,
  },
  reducers: {
    openAuthModal(state) {
      state.modalOpen = true;
      state.error     = null;
      state.otpSent   = false;
      state.devOtp    = null;
    },
    closeAuthModal(state) {
      state.modalOpen = false;
      state.otpSent   = false;
      state.devOtp    = null;
      state.error     = null;
      state.phone     = '';
      state.status    = 'idle';
    },
    setPhone(state, { payload }) {
      state.phone = payload;
    },
    clearAuthError(state) {
      state.error  = null;
      state.status = 'idle';
    },
    // Called on token expiry from api.js event
    forceLogout(state) {
      state.user        = null;
      state.accessToken = null;
      state.isLoggedIn  = false;
    },
  },
  extraReducers: (builder) => {

    // sendOtp
    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(sendOtp.fulfilled, (state, { payload }) => {
        state.status  = 'idle';
        state.otpSent = true;
        state.devOtp  = payload.otp || null; // dev mode
      })
      .addCase(sendOtp.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload;
      });

    // verifyOtp
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(verifyOtp.fulfilled, (state, { payload }) => {
        state.status      = 'succeeded';
        state.user        = payload.user;
        state.accessToken = payload.accessToken;
        state.isLoggedIn  = true;
        state.modalOpen   = false;
        state.otpSent     = false;
        state.devOtp      = null;
        state.error       = null;
      })
      .addCase(verifyOtp.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error  = payload;
      });

    // updateProfile
    builder
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.user = payload;
      });

    // logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user        = null;
        state.accessToken = null;
        state.isLoggedIn  = false;
        state.modalOpen   = false;
      });
  },
});

export const {
  openAuthModal, closeAuthModal,
  setPhone, clearAuthError, forceLogout,
} = authSlice.actions;

export const selectUser         = (state) => state.auth.user;
export const selectIsLoggedIn   = (state) => state.auth.isLoggedIn;
export const selectAuthModal    = (state) => state.auth.modalOpen;
export const selectOtpSent      = (state) => state.auth.otpSent;
export const selectDevOtp       = (state) => state.auth.devOtp;
export const selectAuthPhone    = (state) => state.auth.phone;
export const selectAuthStatus   = (state) => state.auth.status;
export const selectAuthError    = (state) => state.auth.error;

export default authSlice.reducer;
