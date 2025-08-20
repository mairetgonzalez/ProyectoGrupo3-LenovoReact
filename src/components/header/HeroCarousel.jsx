import React from "react";
import Slider from "react-slick";

// ► IMPORTANTE: estilos do slick (sem isso, as setas viram texto “Previous/Next”)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./HeroCarousel.css";

import banner1 from "../../assets/banner/banner1.jpg";
import banner2 from "../../assets/banner/banner6.jpg";
import banner3 from "../../assets/banner/banner7.jpg";




const slides = [
  { imagen: banner1, titulo: "Somos Lenovo", desc: "Nossa História", boton: "Saiba Mais" },
  { imagen: banner2, titulo: "Outlet Lenovo", desc: "Até 40% OFF!", boton: "Comprar Agora" },
  { imagen: banner3, titulo: "Promoções Exclusivas", desc: "Ofertas imperdíveis", boton: "Ver Mais" },
];

export default function HeroCarousel() {
  const settings = {
    dots: true,            // bolinhas de navegação
    arrows: true,          // setas (vão aparecer como ícones com o CSS do slick)
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    adaptiveHeight: false,
    responsive: [{ breakpoint: 900, settings: { arrows: false } }], // opcional: sem setas no mobile
  };

  return (
    <section className="hero-carousel">
      <Slider {...settings}>
        {slides.map((slide, idx) => (
          <div className="hero-slide" key={idx}>
            <img src={slide.imagen} alt={slide.titulo} className="hero-img" />
            <div className="hero-caption">
              <span className="hero-kicker">{slide.desc}</span>
              <h2>{slide.titulo}</h2>
              <button type="button">{slide.boton}</button>
            </div>
            {/* gradiente para melhorar contraste do texto */}
            <div className="hero-gradient" aria-hidden="true" />
          </div>
        ))}
      </Slider>
    </section>
  );
}
