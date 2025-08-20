import React from 'react';
import Header from './components/header/Header';
import HeroCarousel from './components/header/HeroCarousel';
import Footer from './components/footer/Footer';



function App() {
  return (
    <div className="App">
      <Header />  
      <HeroCarousel /> 
      <Footer />
    </div>
  );
}

export default App;
