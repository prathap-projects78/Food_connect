import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/RestaurantDashboard';
import TrustDashboard from './pages/TrustDashboard';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/restaurant-dashboard" element={
          user?.role === 'RESTAURANT' ? <RestaurantDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/trust-dashboard" element={
          user?.role === 'TRUST' ? <TrustDashboard /> : <Navigate to="/login" />
        } />
      </Routes>
    </Router>
  );
}

export default App;
