import { configureStore } from '@reduxjs/toolkit';
import locationReducer from './slices/locationSlice';
import authReducer     from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import productReducer  from './slices/productSlice';
import cartReducer     from './slices/cartSlice';

// ── ROOT STORE ────────────────────────────────────────────
export const store = configureStore({
  reducer: {
    location:   locationReducer,
    auth:       authReducer,
    categories: categoryReducer,
    products:   productReducer,
    cart:       cartReducer,
  },
});

// ── RE-EXPORTS (components import from '../store') ────────

// Location
export {
  detectLocation, setManualLocation, resetLocation,
  selectCity, selectConfirmed, selectLocStatus, selectLocError,
} from './slices/locationSlice';

// Auth
export {
  sendOtp, verifyOtp, updateProfile, logoutUser,
  openAuthModal, closeAuthModal, setPhone, clearAuthError, forceLogout,
  selectUser, selectIsLoggedIn, selectAuthModal,
  selectOtpSent, selectDevOtp, selectAuthPhone,
  selectAuthStatus, selectAuthError,
} from './slices/authSlice';

// Categories
export {
  fetchCategories, fetchCategoryBySlug, clearCurrentCategory,
  selectAllCategories, selectCategoriesStatus,
  selectCurrentCategory, selectCurrentCatStatus,
} from './slices/categorySlice';

// Products
export {
  fetchFeaturedProducts, fetchBanners, fetchCategoryProducts,
  searchProducts, fetchRelatedProducts,
  setActiveFilter, clearCategoryProducts, clearSearch, clearRelated,
  selectByCategory, selectBanners, selectPromoCards, selectOfferFilters,
  selectActiveFilter, selectHomeStatus, selectHomeError,
  selectCategoryProducts, selectCategoryTotal,
  selectCategoryStatus, selectCategoryError,
  selectRelatedProducts, selectRelatedStatus,
  selectSearchResults, selectSearchStatus,
} from './slices/productSlice';

// Cart
export {
  addToCart, removeFromCart, clearCart,
  fetchCart, addToCartAPI, removeFromCartAPI, clearCartAPI,
  selectCartItems, selectCartCount, selectCartTotal,
  selectCartStatus, selectCartError, selectItemQty,
} from './slices/cartSlice';

export default store;
