// src/hooks/useCategoriaFiltro.js

// src/hooks/useCategoriaFiltro.js
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

/** Mapa alineado con tu API:
 *  1 Notebooks, 2 Desktops, 3 Smartphones, 4 Tablets, 5 Monitores
 */
export const CAT = {
  notebooks: { id: 1, nome: "Notebooks", aliases: ["notebook","notebooks","laptop","laptops","portatil","portátil","note"] },
  desktops:  { id: 2, nome: "Desktops",  aliases: ["desktop","desktops","computador","computadora","pc"] },
  mobile:    { id: 3, nome: "Smartphones", aliases: ["smartphone","smartphones","celular","celulares","telefone","telefono","movil","móvil"] },
  tablets:   { id: 4, nome: "Tablets",   aliases: ["tablet","tablets","tableta"] },
  monitores: { id: 5, nome: "Monitores", aliases: ["monitor","monitores","pantalla","monitor tv"] },
};

// Normaliza: minúsculas, sin acentos y reduce letras repetidas (noteboook → notebook)
export function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/(.)\1{2,}/g, "$1");
}

export function findCategoryBySlugOrAlias(value) {
  const nv = norm(value);
  for (const [slug, info] of Object.entries(CAT)) {
    if (slug === nv) return { slug, ...info };
    if (norm(info.nome) === nv) return { slug, ...info };
    if ((info.aliases || []).some((a) => nv.includes(norm(a)) || norm(a).includes(nv))) {
      return { slug, ...info };
    }
  }
  return null;
}

/** Lee ?categoria=<slug> o infiere por ?q=<texto> (monitor, computador, noteboook, etc.) */
export function useCategoriaFiltro() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const slug = params.get("categoria"); // p.ej. notebooks, desktops, monitores…
  const q = params.get("q") || "";

  return useMemo(() => {
    let info = null;
    if (slug) info = findCategoryBySlugOrAlias(slug);
    if (!info && q) info = findCategoryBySlugOrAlias(q);

    return {
      ready: true,
      categoriaId: info?.id || null,
      categoriaNome: info?.nome || null,
      categoriaSlug: info?.slug || null,
      q: q.trim(),
    };
  }, [slug, q, location.search]);
}



/*
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { listCategorias } from "../services/api";
import { slugify } from "../utils/slugify";

// Cache simple (5 min)
let _catsCache = null;
let _catsCacheAt = 0;
const CACHE_MS = 5 * 60 * 1000;

// Sinónimos por slug que usas en el Home
// Ajusta estos arrays según los nombres REALES que devuelve tu backend.
const SYNONYMS = {
  notebooks: ["notebooks", "laptops", "laptop", "note book", "IdeaPad"],
  desktops:  ["desktops", "desktop", "pc", "computadores", "ThinkCentre", "computador", "computers"],
  mobile:    ["celulares", "telefonos", "telefones", "mobile", "smartphones", "smartphone", "tablets-e-celulares"],
  tablets:   ["tablets", "tablet", "tablets-e-celulares"],
  monitores: ["monitores", "monitor", "monitors"]
};

// Dada la lista de categorias del backend, encuentra el id que mejor matchea el slug
function findIdForSlug(categorias, slug) {
  if (!slug) return null;
  const norm = (s) => slugify(String(s || ""));

  const target = norm(slug);
  // 1) Match exacto: slugify(nome) === slug
  let found = categorias.find(c => norm(c.nome) === target);
  if (found) return Number(found.id);

  // 2) Buscar por sinónimos definidos
  const syns = SYNONYMS[target] || [];
  if (syns.length) {
    const set = syns.map(norm);
    found = categorias.find(c => set.includes(norm(c.nome)));
    if (found) return Number(found.id);
  }

  // 3) Búsqueda flexible: incluye/prefijo/sufijo
  found = categorias.find(c => norm(c.nome).includes(target));
  if (found) return Number(found.id);

  // 4) Búsqueda flexible con sinónimos: incluye
  for (const s of syns) {
    const sN = norm(s);
    found = categorias.find(c => norm(c.nome).includes(sN));
    if (found) return Number(found.id);
  }

  return null;
}

export function useCategoriaFiltro() {
  const location = useLocation();
  const [categorias, setCategorias] = useState([]);
  const [ready, setReady] = useState(false);

  const search = new URLSearchParams(location.search);
  const categoriaSlug = search.get("categoria"); // p.ej. "mobile"

  useEffect(() => {
    if (!categoriaSlug) { setReady(true); return; } // sin filtro no pedimos nada

    let alive = true;
    (async () => {
      try {
        setReady(false);
        const now = Date.now();
        const fromCache = _catsCache && (now - _catsCacheAt) < CACHE_MS;
        const cats = fromCache ? _catsCache : await listCategorias();
        if (!fromCache) { _catsCache = cats; _catsCacheAt = now; }
        if (!alive) return;
        setCategorias(Array.isArray(cats) ? cats : []);
      } finally {
        if (alive) setReady(true);
      }
    })();

    return () => { alive = false; };
  }, [categoriaSlug]);

  const { categoriaId, categoriaNome } = useMemo(() => {
    if (!categoriaSlug || categorias.length === 0)
      return { categoriaId: null, categoriaNome: null };

    const id = findIdForSlug(categorias, categoriaSlug);
    const cat = categorias.find(c => Number(c.id) === Number(id)) || null;

    // 👉 ver cómo vienen las categorías normalizadas
     console.table(categorias.map(c => ({ id: c.id, nome: c.nome, slug: slugify(c.nome) })));

    return {
      categoriaId: id ?? null,
      categoriaNome: cat?.nome ?? null
    };
  }, [categoriaSlug, categorias]);

  return { ready, categoriaSlug, categoriaId, categoriaNome };
}
*/