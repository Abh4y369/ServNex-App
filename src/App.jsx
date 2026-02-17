import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Landing from './Pages/Landing'
import HotelList from './Pages/HotelList'
import SignUp from './Pages/SignUp'
import Login from './Credentials/Login'
import HotelDetail from './Pages/HotelDetail'
import HotelBooking from './Pages/HotelBooking'
import ForgotPassword from './Pages/ForgotPassword'
import MyBookings from './Pages/MyBookings'
import BusinessLogin from './Credentials/BusinessLogin'
import RestaurantList from './Pages/RestaurantList'
import RestaurantDetail from './Pages/RestaurantDetail'
import RestaurantReservation from './Pages/RestaurantReservation'
import Dashboard from './admin/components/Dashboard'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/login' element={<Login />} />
      <Route path='/login-business' element={<BusinessLogin />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/forgotpassword' element={<ForgotPassword />} />
      <Route path="/my-bookings" element={<MyBookings />} />

      {/* Hotel routes */}
      <Route
        path='/hotel'
        element={
          <ProtectedRoute>
            <HotelList />
          </ProtectedRoute>
        }
      />
      <Route path='/hotel/:id' element={<HotelDetail />} />
      <Route path='/booking/:id' element={<HotelBooking />} />

      {/* Restaurant routes */}
      <Route
        path='/restaurant'
        element={
          <ProtectedRoute>
            <RestaurantList />
          </ProtectedRoute>
        }
      />
      <Route path='/restaurant/:id' element={<RestaurantDetail />} />
      <Route path='/reservation/:id' element={<RestaurantReservation />} />

      {/* admin */}
      <Route path="/admin-dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App