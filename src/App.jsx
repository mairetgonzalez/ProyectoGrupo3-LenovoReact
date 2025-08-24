// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/header/Header';
import HeroCarousel from './components/header/HeroCarousel';
import Produtos from './pages/Produtos';
import Footer from './components/footer/Footer';
import SobreNos from './pages/SobreNos';


// ✅ Home mínimo (si aún no tienes un Home.jsx)
//    Si luego creas un Home.jsx propio, puedes importarlo en vez de este.
function Home() {
  return (
    <>
      <HeroCarousel />
      {/* aquí puedes agregar secciones: destacados, etc. */}
    </>
  );
}

export default function App(){
  return (
    <>
      <Header />
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Home />} />

        {/* Lista de productos (ruta del front) */}
        <Route path="/produtos" element={<Produtos />} />

        {/* Lista de integrantes */}
        <Route path="/sobre" element={<SobreNos />} />


        {/* Redirección para rutas desconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}


/*
function App() {
  return (
    <div className="App">
      <Header />  
      <HeroCarousel /> 
      <ListProdutos />
      <Footer />
    </div>
  );
}

export default App;
*/