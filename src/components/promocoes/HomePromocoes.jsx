// src/components/promocoes/HomePromocoes.jsx
import { Link } from "react-router-dom";
import "./HomePromocoes.css";

const CARDS = [
  {
    title: "Lançamentos Legion",
    text: "Conheça os lançamentos da linha de dispositivos gamer Legion.",
    img: "https://p2-ofp.static.pub/ShareResource/na/homepage/espots/lenovo-legion-pro-5i-gen8-espots.jpg",
    href: "https://www.lenovo.com/br/pt/laptops/resultados/?visibleDatas=11279:Legion",
  },
  {
    title: "ThinkPad",
    text: "Nossa linha ThinkPad, com dispositivos projetados para durabilidade.",
    img: "https://p3-ofp.static.pub/ShareResource/las/lenovo/2024/campaigns/junio/thinkpad-serie-t/espot-sales-card.jpg",
    href: "https://www.lenovo.com/br/pt/laptops/resultados/?visibleDatas=11279:ThinkPad",
  },
  {
    title: "Ofertas em Acessórios",
    text: "Headsets, mouses, mochilas e muito mais para completar seu setup.",
    img: "https://p2-ofp.static.pub//fes/cms/2024/01/05/uoc9artvj3ihjl9awgauu75x723nif913872.jpg",
    href: "https://www.lenovo.com/br/pt/d/promocoes/acessorios/",
  },
  {
    title: "Lenovo Pro para Negócios",
    text: "Acesso a preços exclusivos e consultoria técnica para sua empresa.",
    img: "https://www.isixsigma.com/wp-content/uploads/2018/11/shutterstock_1687550977-scaled.jpg",
    href: "https://www.lenovo.com/br/pt/business/benefits/?IPromoID=LEN724083",
  },
  {
    title: "Lenovo Gaming",
    text: "Explore notebooks, mouses, teclados e desktops gamer.",
    img: "https://p4-ofp.static.pub/ShareResource/na/landing-pages/benefits/blades/lenovo-pro-section2-desktop-1920.jpg",
    href: "https://www.lenovo.com/br/pt/gaming/?IPromoID=LEN524949",
  },
  {
    title: "Lenovo Educacional",
    text: "Descontos para estudantes e professores em dispositivos selecionados.",
    img: "https://p4-ofp.static.pub/ShareResource/na/landing-pages/benefits/blades/lenovo-pro-section3-desktop-1920.jpg",
    href: "https://www.lenovo.com/br/pt/estudantes/?IPromoID=LEN790074",
  },
];

// helper: detectar URL externa
const isExternal = (url) => /^https?:\/\//i.test(url);

export default function HomePromocoes() {
  return (
    <section className="promos">
      <div className="promos__header">
        <h2>Promoções</h2>
      </div>

      <div className="promos__grid">
        {CARDS.map((c, i) => {
          const clickable = i < 3; // solo las 3 de arriba toda la card clicable
          return (
            <article key={i} className={`promo ${clickable ? "is-clickable" : ""}`}>
              {/* Overlay clicable solo en las 3 primeras */}
              {clickable && (
                isExternal(c.href) ? (
                  <a
                    href={c.href}
                    className="promo__stretched"
                    aria-label={`Abrir ${c.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ) : (
                  <Link
                    to={c.href}
                    className="promo__stretched"
                    aria-label={`Abrir ${c.title}`}
                  />
                )
              )}

              {/* Bloque superior (visible en fila 1) */}
              <div className={`promo__head ${i < 3 ? "is-visible" : ""}`}>
                <h3 className="promo__title">{c.title}</h3>
                <p className="promo__text">{c.text}</p>
              </div>

              {/* Imagen */}
              <div className="promo__img">
                <img src={c.img} alt={c.title} loading="lazy" />
              </div>

              {/* Bloque inferior con botón (visible en fila 2) */}
              <div className={`promo__foot ${i >= 3 ? "is-visible" : ""}`}>
                <h3 className="promo__title">{c.title}</h3>
                <p className="promo__text">{c.text}</p>

                {i >= 3 && (
                  isExternal(c.href) ? (
                    <a
                      href={c.href}
                      className="promo__btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Saiba Mais
                    </a>
                  ) : (
                    <Link to={c.href} className="promo__btn">
                      Saiba Mais
                    </Link>
                  )
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
