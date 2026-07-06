import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Post from './pages/Post';
import Profile from './pages/Profile';
import Sign from './pages/Sign';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import RentalManagement from './pages/RentalManagement';
import Cart from './pages/Cart';
import Chat from './pages/Chat';
import PaymentGateway from './pages/PaymentGateway';

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Public auth routes (no navbar) */}
          <Route path="/sign-in" element={<Sign />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* All other routes with Navbar */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/products/:productId" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/events/:eventId" element={<Layout><EventDetail /></Layout>} />

          {/* Protected routes */}
          <Route path="/post" element={<Layout><ProtectedRoute><Post /></ProtectedRoute></Layout>} />
          <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
          <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
          <Route path="/rentals" element={<Layout><ProtectedRoute><RentalManagement /></ProtectedRoute></Layout>} />
          <Route path="/cart" element={<Layout><ProtectedRoute><Cart /></ProtectedRoute></Layout>} />
          <Route path="/chat" element={<Layout><ProtectedRoute><Chat /></ProtectedRoute></Layout>} />
          <Route path="/payment-gateway" element={<Layout><ProtectedRoute><PaymentGateway /></ProtectedRoute></Layout>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

