import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import UserRegister from '../pages/auth/UserRegister'
import UserLogin from '../pages/auth/UserLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import Home from '../pages/general/home';
import FoodPartnerProfile from '../pages/foodPatner/Profile'
import CreateFood from '../pages/foodPatner/CreateFood';
import BottomNav from "../components/BottomNav";
import Saved from '../pages/general/Saved';
import ProfileReelsViewer from '../pages/foodPatner/ProfileReelsViewer';

const AppLayout = () => {
  const location = useLocation();

  // Paths where BottomNav should NOT show
  const hideNavOnRoutes = [
    "/user/login",
    "/user/register",
    "/food-partner/login",
    "/food-partner/register"
  ];

  const shouldHideNav = hideNavOnRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegister />} />
        <Route path="/food-partner/login" element={<FoodPartnerLogin />} />
        <Route path="/food-partner/:id" element={<FoodPartnerProfile />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/food-partner/:id/reels" element={<ProfileReelsViewer />} />
      </Routes>

      {!shouldHideNav && <BottomNav />}
    </>
  );
};


const AppRoutes = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default AppRoutes;
