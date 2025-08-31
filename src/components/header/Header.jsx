import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHeart, FaSearch, FaTrash, FaPlus, FaMinus, FaUserCircle, FaClipboardList, FaChevronDown } from 'react-icons/fa';
import './Header.css';
import logo from '../../assets/lenovo-logo.png';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const { getCartItemsCount, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user, isAuthenticated, logout, getUserInitials } = useAuth();
  const cartItemsCount = getCartItemsCount();
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
      {/* Banner gris superior */}
      <div className="header__top__promo" />

      {/* Logo, buscador e íconos */}
      <div className="header__top">
        <NavLink to="/" aria-label="Ir al inicio">
          <img src={logo} alt="Lenovo" className="header__logo" />
        </NavLink>

        {/* Centro: buscador */}
        <div className="header__search">
          <form className="header__search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Procurar produtos"
              className="header__search-input"
            />
            <button className="header__search-btn" aria-label="Buscar" type="submit">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Derecha: íconos */}
        <div className="header__icons">
          <div className="header__user-section" ref={userMenuRef}>
            {isAuthenticated ? (
              <>
                <div className="header__user-info" onClick={handleAuthClick}>
                  <div className="header__user-avatar">
                    {getUserInitials(user)}
                  </div>
                  <span className="header__user-name">
                    Olá, {user?.nome?.split(' ')[0] || 'Usuário'}
                  </span>
                </div>
                {showUserMenu && (
                  <div className="header__user-menu">
                    <NavLink 
                      to="/perfil" 
                      className="header__user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Meu Perfil
                    </NavLink>
                    <button 
                      className="header__user-menu-item header__logout-btn"
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div 
                className="header__user-section" 
                ref={loginDropdownRef}
                onMouseEnter={() => setShowLoginDropdown(true)}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <div className="header__user-login">
                  <FaUser className="header__icon" />
                  <span className="header__user-text">Iniciar sessão / Criar conta</span>
                  <FaChevronDown className="header__dropdown-arrow" />
                </div>
                {showLoginDropdown && (
                  <div className="header__login-dropdown">
                    <div className="header__dropdown-title">
                      Minha conta lenovo
                    </div>
                    <button 
                      className="header__login-btn"
                      onClick={handleLoginButtonClick}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "#000";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#000";
                        e.currentTarget.style.color = "#fff";
                      }}
                    >
                      Iniciar sessão / Criar conta
                    </button>
                    <div className="header__dropdown-item">
                      <FaUserCircle className="header__dropdown-icon" />
                      <span>Perfil</span>
                    </div>
                    <div className="header__dropdown-item">
                      <FaClipboardList className="header__dropdown-icon" />
                      <span>Pedidos</span>
                    </div>
                    <div className="header__dropdown-item">
                      <FaHeart className="header__dropdown-icon" />
                      <span>Lista de deseos</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <FaHeart className="header__icon" />
          <div 
            className="header__cart-container"
            onMouseEnter={() => setShowCartTooltip(true)}
            onMouseLeave={() => setShowCartTooltip(false)}
          >
            <NavLink to="/cart" className="header__cart-link">
              <FaShoppingCart className="header__icon" />
              {cartItemsCount > 0 && (
                <span className="header__cart-badge">{cartItemsCount}</span>
              )}
            </NavLink>
            
            {/* Tooltip do carrinho */}
            {showCartTooltip && cartItems.length > 0 && (
              <div 
                className="header__cart-tooltip"
                onMouseEnter={() => setShowCartTooltip(true)}
                onMouseLeave={() => setShowCartTooltip(false)}
              >
                <div className="cart-tooltip__header">
                  <h3>Carrinho ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'})</h3>
                </div>
                <div className="cart-tooltip__items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-tooltip__item">
                      <div className="cart-tooltip__item-header">
                        <img 
                          src={item.imagens?.[0]?.url || ''} 
                          alt={item.nome}
                          className="cart-tooltip__item-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          style={{
                            display: 'none',
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#f7f7f7',
                            borderRadius: '4px',
                            border: '1px solid #eee',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: '10px',
                            textAlign: 'center'
                          }}
                        >
                          Sem imagem
                        </div>
                        <div className="cart-tooltip__item-info">
                          <h4 className="cart-tooltip__item-name">{item.nome}</h4>
                        </div>
                      </div>
                      <div className="cart-tooltip__item-bottom">
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
                        <div className="cart-tooltip__item-price">
                          R$ {(item.preco * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-tooltip__footer">
                  <div className="cart-tooltip__total">
                    <strong>Total: R$ {getCartTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
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

      {/* Navegación */}
      <nav className="header__nav">
        <ul className="header__nav--left">
          <li className="has-submenu">
            <NavLink to="/" end>Home</NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/produtos">Loja</NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/promocoes">Promoções</NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/sobre">Sobre Nós</NavLink>
          </li>
          <li className="has-submenu">
            <NavLink to="/contatos">Contatos</NavLink>
          </li>
        </ul>

        <ul className="header__nav--right">
          <li><NavLink to="/empresa">Empresa</NavLink></li>
          <li><NavLink to="/educacao">Educação</NavLink></li>
          <li><NavLink to="/gaming">Gaming</NavLink></li>
        </ul>
      </nav>

      {/* Banner gris inferior del menú */}
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
};

export default Header;