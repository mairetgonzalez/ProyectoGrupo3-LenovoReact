// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import Header from './components/header/Header';
import HeroCarousel from './components/header/HeroCarousel';
import Produtos from './pages/Produtos';
import Cart from './pages/Cart';
import Footer from './components/footer/Footer';
import SobreNos from './pages/SobreNos';
import ProductDetail from './pages/ProductDetail';

import CartProvider from './store/CartContext';
import { AuthProvider } from './store/AuthContext';

import Homepage from './pages/HomePage';
import Contato from "./pages/Contato";

// ✅ Home mínimo (si aún no tienes un Home.jsx)
function Home() {
  return (
    <>
      <HeroCarousel />
      <Homepage />
      {/* aquí puedes agregar secciones: destacados, etc. */}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Lista de productos */}
          <Route path="/produtos" element={<Produtos />} />

          {/* Detalle de producto */}
          <Route path="/produto/:id" element={<ProductDetail />} />

          {/* Carrito */}
          <Route path="/cart" element={<Cart />} />

          {/* Sobre nosotros */}
          <Route path="/sobre" element={<SobreNos />} />

          {/* Página de contacto */}
          <Route path="/contato" element={<Contato />} />

          {/* Redirección para rutas desconocidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}
