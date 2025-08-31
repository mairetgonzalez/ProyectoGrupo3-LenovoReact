// src/components/featured/HomeFeatured.jsx
import { useEffect, useState } from "react";
import { listProdutos } from "../../services/api";
import "./HomeFeatured.css";

export default function HomeFeatured() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    listProdutos()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        const destacados = arr.filter(p => p.destaque === true);
        const fallback = arr.filter(p => p.imagens?.length).slice(0, 4);
        const pick = destacados.length ? destacados : fallback;
        if (alive) setItems(pick);
      })
      .catch((e) => alive && setErr(e))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <section className="featured">
        <h2 className="featured__title">Produtos pensados para você</h2>
        <div className="grid skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card sk" />
          ))}
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="featured">
        <h2 className="featured__title">Produtos pensados para você</h2>
        <p className="error">Erro ao carregar</p>
      </section>
    );
  }

  return (
    <section className="featured">
      <h2 className="featured__title">Produtos pensados para você</h2>
      <div className="grid">
        {items.map((p) => {
          const img = p.imagens?.[0]?.url || p.imagens?.[0] || "";
          return (
            <article key={p.id} className="card">
              <div className="thumb">
                {img ? (
                  <img src={img} alt={p.nome} loading="lazy" />
                ) : (
                  <span className="noimg">Sem imagem</span>
                )}
              </div>
              <h3 className="name">{p.nome}</h3>
              <strong className="price">
                R${Number(p.preco || 0).toLocaleString("pt-BR")}
              </strong>
              <a className="btn" href={`/ProductDetail/${p.id}`}>
                Ver detalhes
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
