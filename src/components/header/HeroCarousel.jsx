// src/componentes/header/HeroCarousel.jsx
import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

// Estilos base de slick (necesarios)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./HeroCarousel.css";

// Banners por defecto (Home)
import banner1 from "../../assets/banner/banner3.jpg";
import banner2 from "../../assets/banner/banner1.jpg";
import banner3 from "../../assets/banner/banner9.jpg";

/** Flechas personalizadas */
function PrevArrow({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Anterior"
      className="hero-arrow hero-arrow--prev"
      onClick={onClick}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">
        <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
function NextArrow({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Siguiente"
      className="hero-arrow hero-arrow--next"
      onClick={onClick}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">
        <path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

/** Slides por defecto (se usan en Home si NO pasas prop `slides`) */
const defaultSlides = [
  {
    imagen: banner1,
    titulo: "ANIVERSÁRIO LENOVO",
    desc1: "VOCÊ É NOSSO CONVIDADO ESPECIAL!",
    desc2: "Aproveite até 45% OFF em ofertas imperdíveis em todo site!",
    boton: "Compre Agora",
    link: "/produtos",
  },
  {
    imagen: banner2,
    titulo: "Ofertas Gamer",
    desc1: "ANIVERSÁRIO LENOVO • DESCONTOS IMPERDÍVEIS",
    desc2: "Aproveite até R$ 3.000 OFF na Linha Gamer.",
    boton: "Comprar Agora",
    link: "/produto/14",
  },
  {
    imagen: banner3,
    titulo: "Lenovo Pro para Negocios",
    desc1: "SEJA LENOVO PRO, LIGUE 0800-539-6361...",
    desc2: "Sob medida para as necessidades do seu negócio.",
    boton: "Saiba Mais",
    link: "/contatos",
  },
];

export default function HeroCarousel({ slides: slidesProp }) {
  // Si te pasan slides, úsalo; si no, usa defaultSlides
  const slides = Array.isArray(slidesProp) && slidesProp.length ? slidesProp : defaultSlides;

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    adaptiveHeight: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [{ breakpoint: 640, settings: { arrows: false } }],
  };

  return (
    <section className="hero-carousel">
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div className="hero-slide" key={idx}>
            <img src={slide.imagen} alt={slide.titulo} className="hero-img" />

            <div className="hero-caption">
              <div className="hero-caption__inner">
                <h2 className="hero-title">{slide.titulo}</h2>
                <p className="hero-desc1">{slide.desc1}</p>
                <p className="hero-desc2">{slide.desc2}</p>
                <div className="hero-actions">
                  {slide.link ? (
                    <Link to={slide.link} className="hero-btn hero-btn--light">
                      {slide.boton}
                    </Link>
                  ) : (
                    <button type="button" className="hero-btn hero-btn--light">
                      {slide.boton}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="hero-gradient" aria-hidden="true" />
          </div>
        ))}
      </Slider>
    </section>
  );
}
