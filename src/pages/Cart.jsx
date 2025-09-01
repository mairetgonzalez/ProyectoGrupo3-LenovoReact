import React, { useState } from 'react';
import { useCart } from '../store/CartContext';
import { FaTrash, FaPlus, FaMinus, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/checkout/CheckoutForm';
import './Cart.css';

// Estilos para la animación del spinner
const spinnerStyle = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


if (!document.querySelector('#spinner-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'spinner-styles';
  styleSheet.textContent = spinnerStyle;
  document.head.appendChild(styleSheet);
}

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    removeProductCompletely,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const total = getCartTotal();
  const itemsCount = getCartItemsCount();

  
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LNV-${timestamp}-${random}`;
  };

 
  const handleCheckout = () => {
    if (isProcessing || orderCompleted) return;
    setShowCheckoutForm(true);
  };
  
  const handleCheckoutComplete = async () => {
    setIsProcessing(true);
    setShowCheckoutForm(false);
    
    try {
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);
      setOrderCompleted(true);
      
  
      setTimeout(() => {
        clearCart();
      }, 2000);
      
    } catch (error) {
      console.error('Error en el checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCheckoutCancel = () => {
    setShowCheckoutForm(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty" style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
          Seu carrinho está vazio
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Adicione alguns produtos incríveis ao seu carrinho!
        </p>
        <NavLink 
          to="/produtos" 
          style={{
            background: '#000',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Continuar Comprando
        </NavLink>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{
      padding: '2rem 1rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div className="cart-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '2px solid #eee',
        paddingBottom: '1rem'
      }}>
        <h1 style={{ fontSize: '2rem', color: '#333', margin: 0 }}>
          Carrinho de Compras ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'})
        </h1>
        <button
          onClick={clearCart}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaTrash /> Limpar Carrinho
        </button>
      </div>

      <div className="cart-content" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Lista de productos */}
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item" style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr auto auto auto auto',
              gap: '1rem',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #eee',
              borderRadius: '8px',
              marginBottom: '1rem',
              background: '#fff'
            }}>
              {/* Imagen del producto */}
              <div 
                onClick={() => navigate(`/produto/${item.id}`)}
                style={{
                  width: '100px',
                  height: '80px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#f7f7f7',
                  cursor: 'pointer'
                }}>
                {item.imagens?.[0]?.url ? (
                  <img 
                    src={item.imagens[0].url} 
                    alt={item.nome}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#999',
                    fontSize: '0.8rem'
                  }}>
                    Sem imagem
                  </div>
                )}
              </div>

              {/* Información del producto */}
              <div>
                <h3 
                  onClick={() => navigate(`/produto/${item.id}`)}
                  style={{ 
                    margin: '0 0 0.5rem 0', 
                    fontSize: '1.1rem', 
                    color: '#333',
                    cursor: 'pointer'
                  }}
                >
                  {item.nome}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  Preço unitário: R$ {Number(item.preco || 0).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>

              {/* Controles de cantidad */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '4px'
              }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    color: '#666'
                  }}
                >
                  <FaMinus />
                </button>
                <span style={{
                  minWidth: '30px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    color: '#666'
                  }}
                >
                  <FaPlus />
                </button>
              </div>

              {/* Precio total del item */}
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '1.1rem', color: '#333' }}>
                  R$ {(Number(item.preco || 0) * item.quantity).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </strong>
              </div>

              {/* Botón eliminar completamente */}
              <button
                onClick={() => removeProductCompletely(item.id)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Eliminar producto completamente"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen del pedido */}
        <div className="cart-summary" style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #eee',
          position: 'sticky',
          top: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', color: '#333' }}>
            Resumo do Pedido
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.95rem'
          }}>
            <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'itens'}):</span>
            <span>R$ {total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</span>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.95rem'
          }}>
            <span>Frete:</span>
            <span style={{ color: '#28a745' }}>Grátis</span>
          </div>
          
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            <span>Total:</span>
            <span style={{ color: '#1f1312' }}>
              R$ {total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={isProcessing || orderCompleted}
            style={{
              width: '100%',
              background: orderCompleted ? '#28a745' : (isProcessing ? '#6c757d' : '#1b0504'),
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isProcessing || orderCompleted ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            {isProcessing ? (
               <>
                 <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                 Processando...
               </>
             ) : orderCompleted ? (
               <>
                 <FaCheck />
                 Pedido Realizado!
               </>
             ) : (
               'Finalizar Compra'
             )}
           </button>
           
           {orderCompleted && orderNumber && (
             <div style={{
               background: '#d4edda',
               border: '1px solid #c3e6cb',
               borderRadius: '8px',
               padding: '12px',
               marginBottom: '1rem',
               textAlign: 'center'
             }}>
               <p style={{ 
                 margin: '0 0 8px 0', 
                 color: '#155724',
                 fontWeight: '600',
                 fontSize: '0.95rem'
               }}>
                 ✅ Compra realizada com sucesso!
               </p>
               <p style={{ 
                 margin: 0, 
                 color: '#155724',
                 fontSize: '0.9rem'
               }}>
                 Número do pedido: <strong>{orderNumber}</strong>
               </p>
             </div>
           )}
          
          <NavLink 
            to="/produtos"
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#0c0b0b',
              textDecoration: 'none',
              fontSize: '0.95rem'
            }}
          >
            Continuar Comprando
          </NavLink>
        </div>
      </div>
      
      {showCheckoutForm && (
        <CheckoutForm
          cartItems={cartItems}
          totalPrice={total}
          onComplete={handleCheckoutComplete}
          onCancel={handleCheckoutCancel}
        />
      )}
    </div>
  );
};

export default Cart;