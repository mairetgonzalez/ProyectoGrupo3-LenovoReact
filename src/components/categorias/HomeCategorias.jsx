// src/components/HomeCategories.jsx
import "./HomeCategoria.css";
import {
  Tag, Laptop, Monitor, Gamepad2, Brain, Briefcase,
  Smartphone, Headphones, Tv, BadgePercent,
  Table2Icon,
  Table2,
  TabletSmartphone
} from "lucide-react";
import { useLocation, Link } from "react-router-dom"; // 👈 usamos React Router

export default function HomeCategories() {
  // Lee los parámetros de la URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeSlug = searchParams.get("categoria"); // ej: ?categoria=gaming

  const categorias = [
    
    { label: "Notebooks",               slug: "notebooks",               Icon: Laptop },
    { label: "Desktops",                slug: "desktops",                Icon: Monitor },
    { label: "Celulares",               slug: "mobile",                  Icon: Smartphone },
    { label: "Tablets",                 slug: "tablets",                 Icon: TabletSmartphone},   
    { label: "Monitores",               slug: "monitores",               Icon: Tv },        
  ];

  return (
    <section className="lenovo-cats">
      <h2 className="lenovo-cats__title">Explore os Produtos Lenovo</h2>

      <ul className="lenovo-cats__list" role="list">
        {categorias.map(({ slug, label, Icon, underline }) => (
          <li key={slug} className="lenovo-cats__item">
            <Link
              to={`/produtos?categoria=${encodeURIComponent(slug)}`}
              className={`lenovo-cats__link ${slug === activeSlug ? "is-active" : ""}`}
              aria-label={`Abrir categoria ${label.replace("\n"," ")}`}
            >
              <span className="lenovo-cats__circle">
                <Icon className="lenovo-cats__icon" />
              </span>
              <span className={`lenovo-cats__label ${underline ? "is-underline" : ""}`}>
                {label.split("\n").map((line, i) => (
                  <span key={i} className="lenovo-cats__line">{line}</span>
                ))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
