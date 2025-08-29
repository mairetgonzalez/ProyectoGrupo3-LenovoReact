import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listProdutos } from "../services/api";
import { useCart } from "../store/CartContext";

import "../styles/produtos.css";

export default function Produtos(){
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const { addToCart, isInCart, getItemQuantity } = useCart();

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
            <div 
              onClick={() => navigate(`/produto/${item.id}`)}
              style={{
                width:"100%", 
                aspectRatio:"4/3", 
                overflow:"hidden", 
                borderRadius:10, 
                background:"#f7f7f7",
                cursor: "pointer"
              }}
            >
              {item.image
                ? <img src={item.image} alt={item.name} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                : <div style={{display:"grid", placeItems:"center", height:"100%", color:"#999"}}>Sem imagem</div>
              }
            </div>
            <h3 
              onClick={() => navigate(`/produto/${item.id}`)} 
              style={{
                fontSize:16, 
                margin:"8px 0 4px", 
                cursor: "pointer",
                color: "#333333" 
              }}
            >
              {item.name}
            </h3>
            <strong style={{color:"#111"}}>
              R${Number(item.price||0).toLocaleString("pt-BR")}
            </strong>
            <button 
              onClick={() => addToCart(item.raw)}
              style={{
                marginTop:"auto",
                background: isInCart(item.id) ? "#28a745" : "#e1140a",
                color:"#fff",
                border:0,
                borderRadius:8,
                padding:"10px 12px",
                cursor:"pointer",
                fontWeight:600,
                transition: "background-color 0.3s ease"
              }}
            >
              {isInCart(item.id) 
                ? `En carrito (${getItemQuantity(item.id)})` 
                : "Adicionar ao carrinho"
              }
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
