import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaUserCircle,
  FaClipboardList,
  FaChevronDown,
} from 'react-icons/fa';
import './Header.css';
import logo from '../../assets/lenovo-logo.png';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import SearchBar from '../search/SearchBar';
import AuthModal from '../auth/AuthModal';
import Banner from "./Banner"

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
  const cartContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (showLoginDropdown && loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
    };

    if (showUserMenu || showLoginDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showLoginDropdown]);

  const handleAuthClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated) {
      setShowUserMenu((v) => !v);
      setShowLoginDropdown(false);
    } else {
      setShowLoginDropdown((v) => !v);
      setShowUserMenu(false);
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

  const safeMouseLeave = (e) => {
    const related = e.relatedTarget;
    setTimeout(() => {
      if (!related || !cartContainerRef.current?.contains(related)) {
        setShowCartTooltip(false);
      }
    }, 300);
  };

  return (
    <header className="header">
      {/* Faixa superior */}
      <div className="header_top_promo" />

      {/* Topo: Logo | Busca | Ícones */}
      <div className="header__top">
        {/* Logo */}
        <NavLink to="/" aria-label="Ir ao início">
          <img src={logo} alt="Lenovo" className="header__logo" />
        </NavLink>

        {/* Busca */}
        <div className="header__search">
          <SearchBar />
        </div>

        {/* Ações rápidas */}
        <div className="header__icons">
          {/* Usuario / Auth */}
          <div
            className={`header__user-section ${isAuthenticated ? (showUserMenu ? 'is-open' : '') : ''}`}
            ref={isAuthenticated ? userMenuRef : loginDropdownRef}
          >
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="header__user-info"
                  onClick={handleAuthClick}
                  aria-expanded={showUserMenu}
                >
                  <div className="header__user-avatar">
                    {typeof getUserInitials === 'function' ? getUserInitials(user) : (user?.nome?.[0] || 'U')}
                  </div>
                  <span className="header__user-name">Olá, {user?.nome?.split(' ')[0] || 'Usuário'}</span>
                  <FaChevronDown className="header__dropdown-arrow" />
                </button>

                {showUserMenu && (
                  <div className="header__user-menu">
                    <NavLink
                      to="/perfil"
                      className="header__user-menu-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Meu Perfil
                    </NavLink>
                    <button className="header_user-menu-item header_logout-btn" onClick={handleLogout}>
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="header__user-login-btn"
                  onClick={handleAuthClick}
                  aria-expanded={showLoginDropdown}
                >
                  <FaUser className="header__icon" />
                  <span className="header__user-text">Iniciar sessão / Criar conta</span>
                  <FaChevronDown className="header__dropdown-arrow" />
                </button>

                {showLoginDropdown && (
                  <div className="header__login-dropdown">
                    <div className="header__dropdown-title">Minha conta Lenovo</div>
                    <button className="header__login-btn" onClick={handleLoginButtonClick}>
                      Iniciar sessão / Criar conta
                    </button>

                    <div className="header__dropdown-item">
                      <FaUserCircle className="header__dropdown-icon" />
                      <div>
                        <div>Perfil</div>
                        <small className="header__dropdown-help">Editar nome da conta, senha e configurações</small>
                      </div>
                    </div>

                    <div className="header__dropdown-item">
                      <FaClipboardList className="header__dropdown-icon" />
                      <div>
                        <div>Pedidos</div>
                        <small className="header__dropdown-help">Visualize e acompanhe seus pedidos</small>
                      </div>
                    </div>

                    <div className="header__dropdown-item">
                      <FaHeart className="header__dropdown-icon" />
                      <div>
                        <div>Lista de desejos</div>
                        <small className="header__dropdown-help">Crie sua lista de produtos favoritos</small>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Favoritos (placeholder) */}
          <FaHeart className="header__icon" />

          {/* Carrinho */}
          <div
            className="header__cart-container"
            ref={cartContainerRef}
            onMouseEnter={() => setShowCartTooltip(true)}
            onMouseLeave={safeMouseLeave}
          >
            <NavLink to="/cart" className="header__cart-link">
              <FaShoppingCart className="header__icon" />
              {cartItemsCount > 0 && <span className="header__cart-badge">{cartItemsCount}</span>}
            </NavLink>

            {showCartTooltip && cartItems.length > 0 && (
              <div
                className="header__cart-tooltip"
                onMouseEnter={() => setShowCartTooltip(true)}
                onMouseLeave={safeMouseLeave}
              >
                <div className="cart-tooltip__header">
                  <h3>
                    Carrinho ({cartItemsCount} {cartItemsCount === 1 ? 'item' : 'itens'})
                  </h3>
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
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div
                          style={{
                            display: 'none',
                            width: 50,
                            height: 50,
                            backgroundColor: '#f7f7f7',
                            borderRadius: 4,
                            border: '1px solid #eee',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#999',
                            fontSize: 10,
                            textAlign: 'center',
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
                            title={item.quantity > 1 ? 'Diminuir quantidade' : 'Remover produto'}
                          >
                            {item.quantity > 1 ? <FaMinus /> : <FaTrash />}
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
                          R$
                          {(Number(item.preco) * Number(item.quantity)).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-tooltip__footer">
                  <div className="cart-tooltip__total">
                    <strong>
                      Total: R$
                      {Number(getCartTotal()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

      {/* Faixa inferior */}
      <div className="header__bottom">
        <Banner />
      </div>


      {/* Modal de Autenticação */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};

export default Header;
