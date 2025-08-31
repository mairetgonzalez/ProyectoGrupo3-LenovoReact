// src/pages/Produtos.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listProdutos } from "../services/api";
import { useCart } from "../store/CartContext";
import { useCategoriaFiltro } from "../hooks/useCategoriaFiltro";
import "../styles/produtos.css";

// Palabras/aliases que el usuario puede escribir para cada categoría
const CATEGORY_ALIASES = {
  notebooks: ["notebook", "notebooks", "laptop", "laptops", "portátil", "portatil", "note"],
  desktops:  ["desktop", "pc", "computador", "computadora"],
  monitores: ["monitor", "monitores", "pantalla"],
  mobile:    ["celular", "telefono", "telefone", "smartphone", "móvil", "movil"],
  tablets:   ["tablet", "tablets", "tableta"],
};

// 🔗 Mapa de IDs reales del backend (según tu API)
const CATEGORY_ID_BY_SLUG = {
  notebooks: 1,
  desktops: 2,
  mobile: 3,     // Smartphones
  tablets: 4,
  monitores: 5,
};

const CATEGORY_NAME_BY_ID = {
  1: "Notebooks",
  2: "Desktops",
  3: "Smartphones",
  4: "Tablets",
  5: "Monitores",
};

// Normaliza texto para comparar sin acentos y en minúsculas + reduce letras repetidas (noteboook → notebook)
const norm = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/(.)\1{2,}/g, "$1");

// 🧠 infiere ID de categoría desde el texto de búsqueda (q)
function inferCategoryIdFromQuery(qNorm) {
  for (const [slug, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some(a => qNorm.includes(norm(a)) || norm(a).includes(qNorm))) {
      return CATEGORY_ID_BY_SLUG[slug];
    }
  }
  return null;
}

export default function Produtos() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const { addToCart, isInCart, getItemQuantity } = useCart();

  // --- búsqueda (?q=) desde la URL ---
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const qNorm = norm(q);

  // --- categoría desde el hook ---
  const { ready, categoriaId, categoriaNome } = useCategoriaFiltro();

  // Carga (si hay categoriaId intenta server-side; si no, trae todos)
  useEffect(() => {
    setLoading(true);
    listProdutos(categoriaId ? { categoriaId } : {})
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        const mapped = arr.map((p) => ({
          id: p.id,
          name: p.nome,
          price: p.preco,
          image: p.imagens?.[0]?.url || p.imagens?.[0] || "",
          // 👇 guardamos info de categoría para filtros client-side robustos
          categoriaId: Number(p.categoriaId ?? p.categoria?.id ?? 0),
          categoriaNome: p.categoria?.nome || CATEGORY_NAME_BY_ID[p.categoriaId] || "",
          raw: p,
        }));
        setItems(mapped);
      })
      .catch(setErr)
      .finally(() => setLoading(false));
  }, [categoriaId]);

  // 1) Filtro por categoría (fallback client-side si el backend no filtró)
  const visibleByCategory = useMemo(() => {
    if (!categoriaId) return items;
    return items.filter((it) =>
      Number(it.categoriaId ?? it.raw?.categoriaId ?? it.raw?.categoria?.id) === Number(categoriaId)
    );
  }, [items, categoriaId]);

  // 2) Filtro por texto (?q=) aplicado sobre el resultado anterior
  const finalItems = useMemo(() => {
    if (!q) return visibleByCategory;

    const nq = qNorm;

    // 👇 Si q parece ser una categoría (monitor/computador/noteboook...), usamos ID inferido
    const inferredCatId = inferCategoryIdFromQuery(nq);

    return visibleByCategory.filter((p) => {
      const name = norm(p.name || p.raw?.nome);
      const priceStr = norm(String(p.price ?? p.raw?.preco ?? ""));
      const catName = norm(p.categoriaNome || p.raw?.categoria?.nome || "");

      // 0) Coincidencia directa por categoriaId si inferimos categoría por q
      const catIdMatch = inferredCatId
        ? Number(p.categoriaId ?? p.raw?.categoriaId ?? p.raw?.categoria?.id) === Number(inferredCatId)
        : false;

      // 1) Coincidencia por nombre, precio o nombre de categoría
      const hitsFreeText = name.includes(nq) || priceStr.includes(nq) || catName.includes(nq);

      // 2) Coincidencia por alias deducida del nombre del producto (por si el backend no trae catName)
      const nameHintsNotebook = /notebook|laptop|portatil/.test(name);
      const nameHintsDesktop  = /desktop|computador|computadora|pc\b/.test(name);
      const nameHintsMonitor  = /monitor|pantalla/.test(name);
      const nameHintsMobile   = /celular|telefono|telefone|smartphone|movil/.test(name);
      const nameHintsTablet   = /tablet|tableta/.test(name);

      const wantsNotebooks = CATEGORY_ALIASES.notebooks.some(a => nq.includes(norm(a)));
      const wantsDesktops  = CATEGORY_ALIASES.desktops.some(a => nq.includes(norm(a)));
      const wantsMonitores = CATEGORY_ALIASES.monitores.some(a => nq.includes(norm(a)));
      const wantsMobile    = CATEGORY_ALIASES.mobile.some(a => nq.includes(norm(a)));
      const wantsTablets   = CATEGORY_ALIASES.tablets.some(a => nq.includes(norm(a)));

      const hitsAliasByName =
        (wantsNotebooks && nameHintsNotebook) ||
        (wantsDesktops  && nameHintsDesktop)  ||
        (wantsMonitores && nameHintsMonitor)  ||
        (wantsMobile    && nameHintsMobile)   ||
        (wantsTablets   && nameHintsTablet);

      // 3) Coincidencia por alias en el nombre de categoría (si existe)
      const hitsAliasByCatName =
        (wantsNotebooks && /notebook|laptop|portatil/.test(catName)) ||
        (wantsDesktops  && /desktop|computador|computadora|pc\b/.test(catName)) ||
        (wantsMonitores && /monitor|pantalla/.test(catName)) ||
        (wantsMobile    && /celular|telefono|telefone|smartphone|movil/.test(catName)) ||
        (wantsTablets   && /tablet|tableta/.test(catName));

      return catIdMatch || hitsFreeText || hitsAliasByName || hitsAliasByCatName;
    });
  }, [visibleByCategory, q, qNorm]);

  if (loading || !ready) return <div style={{ padding: 16 }}>Carregando…</div>;
  if (err) {
    return (
      <div style={{ padding: 16, color: "red" }}>
        Erro: {String(err.message || err)}
      </div>
    );
  }

  return (
    <section className="produtos container" style={{ padding: "16px" }}>
      <h1 style={{ margin: "8px 0 16px" }}>
        Produtos
        {categoriaNome ? ` • ${categoriaNome}` : ""}
        {q ? (
          <small style={{ fontSize: 14, color: "#666" }}>
            {" "}
            • {finalItems.length} resultado{finalItems.length === 1 ? "" : "s"} para “{q}”
          </small>
        ) : null}
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {finalItems.map((item) => (
          <article
            key={item.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 12,
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {/* Imagen clickable al detalle */}
            <div
              onClick={() => navigate(`/produto/${item.id}`)}
              style={{
                width: "100%",
                aspectRatio: "4/3",
                overflow: "hidden",
                borderRadius: 10,
                background: "#f7f7f7",
                cursor: "pointer",
              }}
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  width="400"
                  height="300"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    height: "100%",
                    color: "#999",
                  }}
                >
                  Sem imagem
                </div>
              )}
            </div>

            {/* Título clickable */}
            <h3
              onClick={() => navigate(`/produto/${item.id}`)}
              style={{ fontSize: 16, margin: "8px 0 4px", cursor: "pointer", color: "#333" }}
            >
              {item.name}
            </h3>

            <strong style={{ color: "#111" }}>
              R${Number(item.price || 0).toLocaleString("pt-BR")}
            </strong>

            {/* Botón carrito */}
            <button
              onClick={() => addToCart(item.raw)}
              style={{
                marginTop: "auto",
                background: isInCart(item.id) ? "#28a745" : "#000",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 12px",
                cursor: "pointer",
                fontWeight: 600,
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {isInCart(item.id)
                ? `No carrinho (${getItemQuantity(item.id)})`
                : "Adicionar ao carrinho"}
            </button>
          </article>
        ))}

        {finalItems.length === 0 && (
          <p style={{ gridColumn: "1 / -1" }}>
            {q ? `Nenhum produto encontrado para “${q}”.` : "Nenhum produto nesta categoria."}
          </p>
        )}
      </div>
    </section>
  );
}
