import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHeart, FaSearch, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './Header.css';
import logo from '../../assets/lenovo-logo.png';
import { useCart } from '../../store/CartContext';

const Header = () => {
  const { getCartItemsCount, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const cartItemsCount = getCartItemsCount();

  // Controla o hover do tooltip do carrinho
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const userMenuRef = useRef(null);
  const loginDropdownRef = useRef(null);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
    };

    if (showUserMenu || showLoginDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showLoginDropdown]);

  const handleAuthClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu);
    } else {
      setShowLoginDropdown(!showLoginDropdown);
    }
  };

  const handleLoginButtonClick = () => {
    setShowAuthModal(true);
    setShowLoginDropdown(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <header className="header">
      {/* Faixa superior cinza (pode conter avisos / anúncios curtos) */}
      <div className="header__top__promo" />

      {/* Topo: Logo | Busca | Ícones */}
      <div className="header__top">
        {/* Logo sempre leva para Home */}
        <NavLink to="/" aria-label="Ir ao início">
          <img src={logo} alt="Lenovo" className="header__logo" />
        </NavLink>

        {/* Centro: nossa barra de busca com autocomplete */}
        <div className="header__search">
          <SearchBar />
        </div>

        {/* Direita: Ações rápidas (usuário, favoritos, carrinho) */}
        <div className="header__icons">
          <div className="header__user-section">
            <FaUser className="header__icon" />
            <span className="header__user-text">Iniciar sessão / Criar conta</span>
          </div>

          {/* Favoritos (placeholder visual) */}
          <FaHeart className="header__icon" />

          {/* Carrinho com tooltip */}
          <div
            className="header__cart-container"
            onMouseEnter={() => setShowCartTooltip(true)}
            onMouseLeave={(e) => {
              // Agregar un pequeño delay para permitir movimiento hacia el tooltip
              setTimeout(() => {
                const relatedTarget = e.relatedTarget;
                if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
                  setShowCartTooltip(false);
                }
              }, 100);
            }}
          >
            {/* Link para a página do carrinho + badge de quantidade */}
            <NavLink to="/cart" className="header__cart-link">
              <FaShoppingCart className="header__icon" />
              {cartItemsCount > 0 && (
                <span className="header__cart-badge">{cartItemsCount}</span>
              )}
            </NavLink>

            {/* Tooltip do carrinho (só mostra quando hover + existem itens) */}
            {showCartTooltip && cartItems.length > 0 && (
              <div
                className="header__cart-tooltip"
                onMouseEnter={() => setShowCartTooltip(true)}
                onMouseLeave={(e) => {
                  setTimeout(() => {
                    const relatedTarget = e.relatedTarget;
                    if (!relatedTarget || !document.querySelector('.header__cart-container').contains(relatedTarget)) {
                      setShowCartTooltip(false);
                    }
                  }, 100);
                }}
              >
                <div className="cart-tooltip__header">
                  <h3>
                    Carrinho ({cartItemsCount} {cartItemsCount === 1 ? "item" : "itens"})
                  </h3>
                </div>

                <div className="cart-tooltip__items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-tooltip__item">
                      <div className="cart-tooltip__item-header">
                        {/* Imagem do produto (mostra bloco "sem imagem" caso falhe) */}
                        <img
                          src={item.imagens?.[0]?.url || ""}
                          alt={item.nome}
                          className="cart-tooltip__item-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling.style.display = "flex";
                          }}
                        />
                        <div
                          style={{
                            display: "none",
                            width: 50,
                            height: 50,
                            backgroundColor: "#f7f7f7",
                            borderRadius: 4,
                            border: "1px solid #eee",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#999",
                            fontSize: 10,
                            textAlign: "center",
                          }}
                        >
                          Sem imagem
                        </div>

                        <div className="cart-tooltip__item-info">
                          <h4 className="cart-tooltip__item-name">{item.nome}</h4>
                        </div>
                      </div>

                      <div className="cart-tooltip__item-bottom">
                        {/* Controles: remover/menos/mais (integra com CartContext) */}
                        <div className="cart-tooltip__item-controls">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1);
                              } else {
                                removeFromCart(item.id);
                              }
                            }}
                            className="cart-tooltip__control-btn cart-tooltip__remove-btn"
                            title={item.quantity > 1 ? "Diminuir quantidade" : "Remover produto"}
                          >
                            <FaTrash />
                          </button>

                          <span className="cart-tooltip__quantity">{item.quantity}</span>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            className="cart-tooltip__control-btn cart-tooltip__add-btn"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        {/* Preço total deste item (quantidade x preço unitário) */}
                        <div className="cart-tooltip__item-price">
                          R$
                          {(item.preco * item.quantity).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rodapé do tooltip: total + CTA para ver carrinho completo */}
                <div className="cart-tooltip__footer">
                  <div className="cart-tooltip__total">
                    <strong>
                      Total: R$
                      {getCartTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </strong>
                  </div>
                  <NavLink 
                    to="/cart" 
                    className="cart-tooltip__view-cart-btn"
                    onClick={() => setShowCartTooltip(false)}
                  >
                    Ver carrinho completo
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navegação principal */}
      <nav className="header__nav">
        <ul className="header__nav--left">
          <li className="has-submenu">
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/produtos">Loja</NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/sobre">Sobre Nós</NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/contato">Contato</NavLink>
          </li>
        </ul>

        <ul className="header__nav--right">
          <li>
            <NavLink to="/empresa">Empresa</NavLink>
          </li>
          <li>
            <NavLink to="/educacao">Educação</NavLink>
          </li>
          <li>
            <NavLink to="/gaming">Gaming</NavLink>
          </li>
        </ul>
      </nav>

      {/* Faixa inferior do menu (chamada para programas/pro) */}
      <div className="header__bottom">
        <p>
          <strong>LenovoPro.</strong> Conheça nossos programas exclusivos de descontos e benefícios
          para empresas. <strong>Cadastre-se gratuitamente.</strong>
        </p>
      </div>
      
      {/* Modal de Autenticação */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}
