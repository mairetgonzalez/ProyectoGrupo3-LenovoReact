import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { listProdutos, listCategorias } from "../../services/api";
import "./SearchBar.css";

/** Aliases para buscar por categoría con palabras comunes */
const CATEGORY_ALIASES = {
  notebooks: ["notebook", "notebooks", "laptop", "laptops", "portátil", "portatil"],
  desktops:  ["desktop", "pc", "computador", "computadora"],
  monitores: ["monitor", "monitores", "pantalla"],
  mobile:    ["celular", "telefono", "telefone", "smartphone", "móvil", "movil"],
  tablets:   ["tablet", "tablets", "tableta"]
};

const DEBOUNCE_MS = 250;
const MAX_SUGGESTIONS = 8;

export default function SearchBar() {
  const nav = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialQ = params.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [catMap, setCatMap] = useState({}); // { [id]: { id, nome, slug } }

  const searchBoxRef = useRef(null);
  const timerRef = useRef(null);

  // Cerrar panel al hacer click fuera
  useEffect(() => {
    function onDocClick(e) {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Cargar categorías para poder matchear por nombre/alias
  useEffect(() => {
    (async () => {
      try {
        const cats = await listCategorias();
        const byId = {};
        (Array.isArray(cats) ? cats : []).forEach((c) => {
          // intenta crear un slug simple
          const slug = String(c.nome || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .replace(/\s+/g, "-");
          byId[Number(c.id)] = { id: c.id, nome: c.nome, slug };
        });
        setCatMap(byId);
      } catch {
        setCatMap({});
      }
    })();
  }, []);

  // Debounce para sugerencias
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const query = q.trim();
    if (!query) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await listProdutos(); // si tu backend soporta q server-side, usa listProdutos({ q: query })
        const arr = Array.isArray(data) ? data : [];

        // normalizador
        const norm = (s) =>
          String(s || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "");

        const nq = norm(query);

        // Detecta si el query encaja con algún alias de categoría
        const wantedSlug = matchCategoryByAliases(nq);

        // Mapea productos + categoría
        const mapped = arr.map((p) => {
          const cat = catMap[Number(p.categoriaId)];
          return {
            id: p.id,
            name: p.nome,
            price: p.preco,
            image: p.imagens?.[0]?.url || p.imagens?.[0] || "",
            categoriaId: p.categoriaId,
            categoriaNome: cat?.nome || "",
            categoriaSlug: cat?.slug || "",
          };
        });

        // Filtro: si hay categoría detectada por alias, filtra por esa categoría;
        // además, si el texto tiene más cosas, también busca en nombre
        let filtered = mapped.filter((prod) => {
          const inName = norm(prod.name).includes(nq);
          const inCatName = norm(prod.categoriaNome).includes(nq);
          const inCatAlias =
            wantedSlug &&
            (prod.categoriaSlug === wantedSlug ||
              norm(prod.categoriaNome).includes(wantedSlug));
          return inName || inCatName || inCatAlias;
        });

        // Prioriza productos CON IMAGEN (para que “salgan las imágenes”)
        filtered.sort((a, b) => {
          const ai = a.image ? 1 : 0;
          const bi = b.image ? 1 : 0;
          if (bi !== ai) return bi - ai; // primero los que tienen imagen
          // opcional: prioriza coincidencia exacta de alias
          const aAliasHit =
            wantedSlug &&
            (norm(a.categoriaNome).includes(wantedSlug) ||
              a.categoriaSlug === wantedSlug);
          const bAliasHit =
            wantedSlug &&
            (norm(b.categoriaNome).includes(wantedSlug) ||
              b.categoriaSlug === wantedSlug);
          return (bAliasHit ? 1 : 0) - (aAliasHit ? 1 : 0);
        });

        filtered = filtered.slice(0, MAX_SUGGESTIONS);

        setSuggestions(filtered);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, catMap]);

  function matchCategoryByAliases(nq) {
    // devuelve un "slug" lógico si el query coincide con alias conocidos
    for (const [slug, arr] of Object.entries(CATEGORY_ALIASES)) {
      if (arr.some((alias) => nq.includes(alias))) return slug;
    }
    return null;
  }

  function submitToProdutos(nextQ) {
    const qs = new URLSearchParams(location.search);
    if (nextQ?.trim()) qs.set("q", nextQ.trim());
    else qs.delete("q");
    nav(`/produtos?${qs.toString()}`);
    setOpen(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      submitToProdutos(suggestions[activeIndex].name);
    } else {
      submitToProdutos(q);
    }
  }

  function pickSuggestion(s) {
    setQ(s.name);
    submitToProdutos(s.name);
  }

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        submitToProdutos(suggestions[activeIndex].name);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="header__search" ref={searchBoxRef}>
      <form className="searchbar" onSubmit={onSubmit} role="search">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Procurar produtos"
          className="searchbar__input"
          aria-label="Buscar produtos"
        />
        <button className="searchbar__button" aria-label="Buscar" type="submit">
          <FaSearch />
        </button>
      </form>

      {open && (loading || suggestions.length > 0) && (
        <div className="searchpanel" role="listbox">
          <div className="searchpanel__head">Principais sugestões</div>

          {loading && <div className="searchpanel__hint">Buscando…</div>}

          {!loading &&
            suggestions.map((s, idx) => (
              <button
                key={s.id ?? s.name + idx}
                className={`searchpanel__item ${
                  idx === activeIndex ? "is-active" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickSuggestion(s)}
                role="option"
                aria-selected={idx === activeIndex}
                tabIndex={-1}
              >
                <div className="searchpanel__thumb">
                  {s.image ? (
                    <img src={s.image} alt="" />
                  ) : (
                    <div className="searchpanel__noimg" aria-hidden>
                      🖼️
                    </div>
                  )}
                </div>
                <div className="searchpanel__text">
                  <div className="searchpanel__name">{s.name}</div>
                  {s.categoriaNome && (
                    <div style={{ fontSize: ".85rem", color: "#666" }}>
                      {s.categoriaNome}
                    </div>
                  )}
                  {typeof s.price === "number" && (
                    <div className="searchpanel__price">
                      R${Number(s.price).toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              </button>
            ))}

          {!loading && suggestions.length === 0 && (
            <div className="searchpanel__hint">Sem resultados</div>
          )}

          {!loading && suggestions.length > 0 && (
            <button
              className="searchpanel__seeall"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submitToProdutos(q)}
            >
              Ver tudo &rsaquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}





/*import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { listProdutos } from "../../services/api";
import "./SeachBar.css"; 


export default function SearchBar() {
  const nav = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const initialQ = params.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchBoxRef = useRef(null);
  const timerRef = useRef(null);
  const DEBOUNCE_MS = 250;
  const MAX_SUGGESTIONS = 6;

  // Cierra el panel al click fuera
  useEffect(() => {
    function onDocClick(e) {
      if (!searchBoxRef.current) return;
      if (!searchBoxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Busca sugerencias con debounce
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const query = q.trim();
    if (!query) {
      setSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await listProdutos();
        const arr = Array.isArray(data) ? data : [];
        const mapped = arr.map((p) => ({
          id: p.id,
          name: p.nome,
          price: p.preco,
          image: p.imagens?.[0]?.url || p.imagens?.[0] || "",
        }));

        const filtered = mapped
          .filter((p) =>
            (p.name || "").toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, MAX_SUGGESTIONS);

        setSuggestions(filtered);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }, [q]);

  function submitToProdutos(nextQ) {
    const qs = new URLSearchParams(location.search);
    if (nextQ?.trim()) qs.set("q", nextQ.trim());
    else qs.delete("q");
    nav(`/produtos?${qs.toString()}`);
    setOpen(false);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      submitToProdutos(suggestions[activeIndex].name);
    } else {
      submitToProdutos(q);
    }
  }

  function pickSuggestion(s) {
    setQ(s.name);
    submitToProdutos(s.name);
  }

  function onKeyDown(e) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        submitToProdutos(suggestions[activeIndex].name);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="header__search" ref={searchBoxRef}>
      <form className="searchbar" onSubmit={onSubmit} role="search">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim() && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Procurar produtos"
          className="searchbar__input"
          aria-label="Buscar produtos"
        />
        <button className="searchbar__button" aria-label="Buscar" type="submit">
          <FaSearch />
        </button>
      </form>

      {open && (loading || suggestions.length > 0) && (
        <div className="searchpanel" role="listbox">
          <div className="searchpanel__head">Principais sugestões</div>

          {loading && <div className="searchpanel__hint">Buscando…</div>}

          {!loading &&
            suggestions.map((s, idx) => (
              <button
                key={s.id ?? s.name + idx}
                className={`searchpanel__item ${
                  idx === activeIndex ? "is-active" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pickSuggestion(s)}
                role="option"
                aria-selected={idx === activeIndex}
                tabIndex={-1}
              >
                <div className="searchpanel__thumb">
                  {s.image ? (
                    <img src={s.image} alt="" />
                  ) : (
                    <div className="searchpanel__noimg" aria-hidden>
                      🖼️
                    </div>
                  )}
                </div>
                <div className="searchpanel__text">
                  <div className="searchpanel__name">{s.name}</div>
                  {typeof s.price === "number" && (
                    <div className="searchpanel__price">
                      R${Number(s.price).toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              </button>
            ))}

          {!loading && suggestions.length === 0 && (
            <div className="searchpanel__hint">Sem resultados</div>
          )}

          {!loading && suggestions.length > 0 && (
            <button
              className="searchpanel__seeall"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => submitToProdutos(q)}
            >
              Ver tudo &rsaquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
*/