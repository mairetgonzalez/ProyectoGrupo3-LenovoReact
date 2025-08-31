// src/components/featured/HomeFeatured.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProdutos } from "../../services/api";
import "./HomeFeatured.css";

export default function HomeFeatured() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;

    // ⏱️ timeout de seguridad (10s)
    const TO = setTimeout(() => {
      if (!alive) return;
      console.error("[HomeFeatured] Timeout de 10s esperando listProdutos()");
      setErr(new Error("Timeout ao carregar"));
      setLoading(false);
    }, 10000);

    async function run() {
      try {
        setLoading(true);
        setErr(null);
        console.debug("[HomeFeatured] cargando…");

        const data = await listProdutos(); // si tu API requiere params, pásalos aquí
        if (!alive) return;

        const arr = Array.isArray(data) ? data : [];
        const destacados = arr.filter((p) => p?.destaque === true);
        const fallback = arr.filter((p) => p?.imagens?.length).slice(0, 4);
        const pick = destacados.length ? destacados : fallback;

        console.debug("[HomeFeatured] recibidos:", { total: arr.length, mostrando: pick.length });
        setItems(pick);
      } catch (e) {
        if (!alive) return;
        console.error("[HomeFeatured] error listProdutos():", e);
        setErr(e);
      } finally {
        if (!alive) return;
        clearTimeout(TO);
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
      clearTimeout(TO);
    };
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
        <p className="error">Erro ao carregar. Tente novamente mais tarde.</p>
      </section>
    );
  }

  return (
    <section className="featured">
      <h2 className="featured__title">Produtos pensados para você</h2>

      <div className="grid">
        {items.length === 0 ? (
          <p className="muted" style={{ gridColumn: "1 / -1" }}>
            Nenhum produto em destaque no momento.
          </p>
        ) : (
          items.map((p) => {
            const img = p?.imagens?.[0]?.url || p?.imagens?.[0] || "";
            return (
              <article key={p.id} className="card">
                <Link to={`/produto/${p.id}`} className="thumb" aria-label={`Ver detalhes de ${p?.nome ?? "produto"}`}>
                  {img ? (
                    <img src={img} alt={p?.nome ?? "Produto"} loading="lazy" />
                  ) : (
                    <span className="noimg">Sem imagem</span>
                  )}
                </Link>

                <h3 className="name">
                  <Link to={`/produto/${p.id}`}>{p?.nome ?? "Produto"}</Link>
                </h3>

                <strong className="price">
                  R${Number(p?.preco || 0).toLocaleString("pt-BR")}
                </strong>

                <Link className="btn" to={`/produto/${p.id}`}>
                  Ver detalhes
                </Link>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
