import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduto } from "../services/api";
import { useCart } from "../store/CartContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const { addToCart, isInCart, getItemQuantity } = useCart();

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    getProduto(id)
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Error al cargar el producto");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);


  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} style={{ color: "#FFD700" }} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} style={{ color: "#FFD700" }} />);
      } else {
        stars.push(<FaRegStar key={i} style={{ color: "#FFD700" }} />);
      }
    }
    
    return stars;
  };

  if (loading) return <div style={{padding: 16}}>Cargando producto...</div>;
  if (error) return <div style={{padding: 16, color: "red"}}>Error: {error}</div>;
  if (!product) return <div style={{padding: 16}}>Producto no encontrado</div>;

 
  const productData = {
    ...product,
    nome: product.nome || "IdeaPad 1i Intel Core i3-1315U 8GB 256GB SSD Linux 15.6\" FHD",
    preco: product.preco || 2699.99,
    rating: 4.6,
    reviews: 7034,
    descricao: product.descricao || "Notebook Lenovo IdeaPad 1i con procesador Intel Core i3-1315U, 8GB de RAM, 256GB SSD, sistema operativo Linux y pantalla de 15.6 pulgadas Full HD. Ideal para trabajo y estudio.",
    imagens: product.imagens?.length ? product.imagens : [{ url: "https://i.imgur.com/example.jpg" }]
  };

  const images = productData.imagens || [];
  const currentImage = images[selectedImageIndex]?.url || "";

  return (
    <div className="product-detail container" style={{
      padding: "24px", 
      maxWidth: "1200px", 
      margin: "0 auto",
      backgroundColor: "#f9f9f9",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
    }}>
      {/* Breadcrumb */}
      <div style={{
        marginBottom: "20px", 
        fontSize: "14px", 
        color: "#666",
        padding: "10px 15px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
      }}>
        <span style={{cursor: "pointer", fontWeight: "500"}} onClick={() => navigate("/")}>Página Inicial</span> &gt; 
        <span style={{cursor: "pointer", fontWeight: "500"}} onClick={() => navigate("/produtos")}>Laptops</span> &gt; 
        <span style={{cursor: "pointer", fontWeight: "500"}} onClick={() => navigate("/produtos")}>IdeaPad</span> &gt; 
        <span style={{cursor: "pointer", fontWeight: "500"}} onClick={() => navigate("/produtos")}>IdeaPad 100 Series</span> &gt; 
        <span style={{cursor: "pointer", fontWeight: "500"}} onClick={() => navigate("/produtos")}>IdeaPad 1i Gen7 (15" Intel)</span> &gt; 
        <span style={{color: "#333", fontWeight: "600"}}>{productData.nome}</span>
      </div>

      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px"}}>
        {/* Imagen del producto con posición sticky */}
        <div style={{position: "relative", height: "fit-content"}}>
          <div style={{
            position: "sticky",
            top: "20px",
            width: "100%", 
            aspectRatio: "1", 
            overflow: "hidden", 
            borderRadius: "8px", 
            background: "#f7f7f7",
            marginBottom: "16px"
          }}>
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={productData.nome}
                style={{width: "100%", height: "100%", objectFit: "contain"}}
              />
            ) : (
              <div style={{display: "grid", placeItems: "center", height: "100%", color: "#999"}}>
                Sin imagen disponible
              </div>
            )}
          </div>

          {/* Miniaturas - también con posición sticky */}
          <div style={{
            display: "flex", 
            gap: "8px", 
            flexWrap: "wrap",
            position: "sticky",
            top: "440px", /* La imagen principal + margen */
            backgroundColor: "#f9f9f9",
            padding: "10px 0",
            zIndex: 1
          }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`${productData.nome} - ${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: selectedImageIndex === index ? "2px solid #e1140a" : "1px solid #eee",
                  boxShadow: selectedImageIndex === index ? "0 2px 8px rgba(225, 20, 10, 0.2)" : "none"
                }}
              />
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div>
          {/* Badge de aniversario */}
          <div style={{
            background: "#5D5D81", 
            color: "white", 
            padding: "8px 16px", 
            borderRadius: "4px", 
            display: "inline-block",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: "bold"
          }}>
            ANIVERSÁRIO LENOVO: ARMAZENAMENTO SSD 256GB
          </div>

          {/* Título del producto */}
          <h1 style={{
            fontSize: "28px", 
            fontWeight: "bold", 
            marginBottom: "20px", 
            color: "#333",
            borderBottom: "2px solid #eaeaea",
            paddingBottom: "12px"
          }}>
            {productData.nome}
          </h1>
          
          {/* Calificación */}
          <div style={{display: "flex", alignItems: "center", marginBottom: "16px"}}>
            <div style={{display: "flex", marginRight: "8px"}}>
              {renderRatingStars(productData.rating)}
            </div>
            <span style={{color: "#666"}}>
              {productData.rating} ({productData.reviews})
            </span>
          </div>
          
          {/* Precio */}
          <div style={{marginBottom: "24px"}}>
            <div style={{fontSize: "14px", color: "#666", textDecoration: "line-through"}}>
              De: R$ {(productData.preco * 1.2).toFixed(2).replace('.', ',')}
            </div>
            <div style={{fontSize: "32px", fontWeight: "bold", color: "#333"}}>
              R$ {Number(productData.preco).toLocaleString("pt-BR", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
          
     
          <button
            onClick={() => addToCart(product)}
            style={{
              width: "100%",
              background: isInCart(product.id) ? "#28a745" : "#3A5998", // Color azul como en la imagen
              color: "#fff",
              border: 0,
              borderRadius: "8px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "16px",
              transition: "all 0.3s ease" 
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = isInCart(product.id) ? "#28a745" : "#EAEEF5";
              e.currentTarget.style.color = isInCart(product.id) ? "#fff" : "#3A5998"; // Texto azul cuando el fondo es claro
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = isInCart(product.id) ? "#28a745" : "#3A5998";
              e.currentTarget.style.color = "#fff"; // Volver al color blanco
            }}
          >
            {isInCart(product.id) 
              ? `En carrito (${getItemQuantity(product.id)})` 
              : "Adicionar ao Carrinho"
            }
          </button>
          
         
          <div style={{display: "flex", alignItems: "center", marginBottom: "24px"}}>
            <IoShareSocialOutline style={{marginRight: "8px"}} />
            <span style={{marginRight: "16px", color: "#666"}}>Compartir</span>
            <FaWhatsapp style={{color: "#25D366", fontSize: "24px", cursor: "pointer"}} />
          </div>
          
          
          <div style={{marginBottom: "24px"}}>
            <h3 style={{fontSize: "18px", marginBottom: "8px"}}>Descripción</h3>
            <p style={{lineHeight: "1.6", color: "#666"}}>
              {productData.descricao}
            </p>
          </div>
          
          
          <div style={{
            backgroundColor: "#fff", 
            padding: "20px", 
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <h3 style={{
              fontSize: "18px", 
              marginBottom: "16px",
              borderLeft: "4px solid #3A5998",
              paddingLeft: "12px",
              fontWeight: "600"
            }}>Especificaciones</h3>
            <ul style={{listStyle: "none", padding: 0, backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee"}}>
              <li style={{padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex"}}>
                <strong style={{minWidth: "150px", color: "#555"}}>Procesador:</strong> 
                <span style={{color: "#333"}}>Intel Core i3-1315U</span>
              </li>
              <li style={{padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex"}}>
                <strong style={{minWidth: "150px", color: "#555"}}>Memoria RAM:</strong> 
                <span style={{color: "#333"}}>8GB</span>
              </li>
              <li style={{padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex"}}>
                <strong style={{minWidth: "150px", color: "#555"}}>Almacenamiento:</strong> 
                <span style={{color: "#333"}}>256GB SSD</span>
              </li>
              <li style={{padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex"}}>
                <strong style={{minWidth: "150px", color: "#555"}}>Sistema Operativo:</strong> 
                <span style={{color: "#333"}}>Linux</span>
              </li>
              <li style={{padding: "12px 16px", display: "flex"}}>
                <strong style={{minWidth: "150px", color: "#555"}}>Pantalla:</strong> 
                <span style={{color: "#333"}}>15.6" FHD</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}