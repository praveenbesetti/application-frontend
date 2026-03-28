import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchCart, selectIsLoggedIn } from './store';

import LocationModal           from './components/LocationModal';
import AuthModal               from './components/AuthModal';
import { DesktopHeader,
         MobileHeader }        from './components/Header';
import BottomNav               from './components/BottomNav';

import HomePage                from './pages/HomePage';
import CategoryPage            from './pages/CategoryPage';
import ProductDetailPage       from './pages/ProductDetailPage';
import CartPage                from './pages/CartPage';
import SignInPage              from './pages/SignInPage';
import VillageSurveyForm from './components/Villagesurveyform';
import axios from 'axios';
axios.defaults.baseURL = 'https://myfarmapp.duckdns.org/api';
// axios.defaults.baseURL ='http://localhost:5000/api'
export default function App() {
  const dispatch   = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    // Always fetch categories (needed for header + home grid)
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Sync cart from backend when user is logged in
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
  }, [isLoggedIn, dispatch]);

  return (
    <>
      <LocationModal />
      <AuthModal />

      <DesktopHeader />
      <MobileHeader />

      <Routes>
        <Route path="/"                   element={<HomePage />}          />
        <Route path="/category/:catId"    element={<CategoryPage />}      />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/cart"               element={<CartPage />}          />
        <Route path="/signin"             element={<SignInPage />}        />
        <Route path='/SurveyForm'         element={<VillageSurveyForm/>}  />
      </Routes>

      <BottomNav />
    </>
  );
}
