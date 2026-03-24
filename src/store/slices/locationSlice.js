import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ── Persist location in localStorage ─────────────────────
const savedCity = localStorage.getItem('qb_city');

export const detectLocation = createAsyncThunk(
  'location/detect',
  async (_, { dispatch, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          resolve({ coords: { lat, lng }, city: 'Your Location', address: 'Current Location' });
          // Background reverse geocode
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(r => r.json())
            .then(d => {
              const city    = d.address?.city || d.address?.town || d.address?.village || 'Your Location';
              const suburb  = d.address?.suburb || '';
              const address = suburb ? `${suburb}, ${city}` : city;
              dispatch(locationSlice.actions.updateCity({ city, address }));
              localStorage.setItem('qb_city', city);
            })
            .catch(() => {});
        },
        (err) => {
          const msg =
            err.code === 1 ? 'Location permission denied. Please search below.'
          : err.code === 2 ? 'Location unavailable. Please search below.'
          :                  'Location timed out. Please search below.';
          reject(new Error(msg));
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    });
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    coords:    null,
    address:   savedCity || null,
    city:      savedCity || null,
    confirmed: !!savedCity,   // skip modal if city was already set
    status:    'idle',
    error:     null,
  },
  reducers: {
    setManualLocation(state, { payload }) {
      state.address   = payload.address;
      state.city      = payload.city;
      state.confirmed = true;
      state.status    = 'succeeded';
      state.error     = null;
      localStorage.setItem('qb_city', payload.city);
    },
    updateCity(state, { payload }) {
      state.city    = payload.city;
      state.address = payload.address;
    },
    resetLocation(state) {
      state.confirmed = false;
      state.status    = 'idle';
      state.error     = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(detectLocation.pending, (state) => {
        state.status = 'loading';
        state.error  = null;
      })
      .addCase(detectLocation.fulfilled, (state, { payload }) => {
        state.coords    = payload.coords;
        state.city      = payload.city;
        state.address   = payload.address;
        state.confirmed = true;
        state.status    = 'succeeded';
        localStorage.setItem('qb_city', payload.city);
      })
      .addCase(detectLocation.rejected, (state, { error }) => {
        state.status = 'failed';
        state.error  = error.message;
      });
  },
});

export const { setManualLocation, updateCity, resetLocation } = locationSlice.actions;

export const selectCity      = (state) => state.location.city;
export const selectConfirmed = (state) => state.location.confirmed;
export const selectLocStatus = (state) => state.location.status;
export const selectLocError  = (state) => state.location.error;

export default locationSlice.reducer;
