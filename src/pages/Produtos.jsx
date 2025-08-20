// src/pages/Produtos.jsx
// 🇧🇷 Página que lista produtos da API e renderiza cards simples

import { useEffect, useState } from "react";
import { listProdutos } from "../services/api";

export default function Produtos(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    listProdutos()
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        const mapped = arr.map((p) => ({
          id: p.id,
          name: p.nome,
          price: p.preco,
          image: p.imagens?.[0]?.url || "", // a API manda {id, produtoId, url}
          raw: p,
        }));
        setItems(mapped);
      })
      .catch(setErr)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding:16}}>Carregando…</div>;
  if (err) return <div style={{padding:16, color:"red"}}>Erro: {String(err.message || err)}</div>;

  return (
    <section className="produtos container" style={{padding:"16px"}}>
      <h1 style={{margin:"8px 0 16px"}}>Produtos</h1>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
        gap:"16px"
      }}>
        {items.map(item => (
          <article key={item.id} style={{
            border:"1px solid #eee",
            borderRadius:12,
            padding:12,
            background:"#fff",
            display:"flex",
            flexDirection:"column",
            gap:8
          }}>
            <div style={{width:"100%", aspectRatio:"4/3", overflow:"hidden", borderRadius:10, background:"#f7f7f7"}}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                : <div style={{display:"grid", placeItems:"center", height:"100%", color:"#999"}}>Sem imagem</div>
              }
            </div>
            <h3 style={{fontSize:16, margin:"8px 0 4px"}}>{item.name}</h3>
            <strong style={{color:"#111"}}>
              R${Number(item.price||0).toLocaleString("pt-BR")}
            </strong>
            <button style={{
              marginTop:"auto",
              background:"#e1140a",
              color:"#fff",
              border:0,
              borderRadius:8,
              padding:"10px 12px",
              cursor:"pointer",
              fontWeight:600
            }}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
