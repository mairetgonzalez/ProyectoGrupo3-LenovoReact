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
import Banner from './Banner';
import logo from '../../assets/lenovo-logo.png';
import { useCart } from '../../store/CartContext';
import { useAuth } from '../../store/AuthContext';
import SearchBar from '../search/SearchBar';
import AuthModal from '../auth/AuthModal';

const Header = () => {
  const { getCartItemsCount, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user, isAuthenticated, logout, getUserInitials } = useAuth();

  const cartItemsCount = getCartItemsCount();

  // UI
  const [showCartTooltip, setShowCartTooltip] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  // Refs
  const userMenuRef = useRef(null);
  const loginDropdownRef = useRef(null);
  const cartContainerRef = useRef(null);

  // Cerrar menús al hacer clic fuera
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

  // MouseLeave seguro para el tooltip del carrito
  const safeMouseLeave = (e) => {
    const related = e.relatedTarget; // snapshot antes del timeout
    setTimeout(() => {
      if (!related || !cartContainerRef.current?.contains(related)) {
        setShowCartTooltip(false);
      }
    }, 300);
  };

  return (
    <header className="header">
      {/* Faixa superior */}
      <div className="header__top__promo" />

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
<<<<<<< HEAD
                    <button className="header__user-menu-item header__logout-btn" onClick={handleLogout}>
=======
                    <button
                      className="header__user-menu-item header__logout-btn"
                      onClick={handleLogout}
                    >
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
                      Sair
                    </button>
                  </div>
                )}
              </>
            ) : (
<<<<<<< HEAD
              <div className={`header__user-login ${showLoginDropdown ? 'is-open' : ''}`} ref={loginDropdownRef}>
                <button
                  type="button"
                  className="header__user-login-btn"
                  onClick={handleAuthClick}
                  aria-expanded={showLoginDropdown}
                >
=======
              <div
                className="header__user-section"
                ref={loginDropdownRef}
                onMouseEnter={() => setShowLoginDropdown(true)}
                onMouseLeave={() => setShowLoginDropdown(false)}
              >
                <div className="header__user-login">
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
                  <FaUser className="header__icon" />
                  <span className="header__user-text">Iniciar sessão / Criar conta</span>
                  <FaChevronDown className="header__dropdown-arrow" />
                </button>

                {showLoginDropdown && (
                  <div className="header__login-dropdown">
<<<<<<< HEAD
                    <div className="header__dropdown-title">Minha conta lenovo</div>
                    <button className="header__login-btn" onClick={handleLoginButtonClick}>
=======
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
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
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
              </div>
            )}
          </div>

          {/* Favoritos (placeholder) */}
          <FaHeart className="header__icon" />
<<<<<<< HEAD

          {/* Carrinho */}
=======
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
          <div
            className="header__cart-container"
            ref={cartContainerRef}
            onMouseEnter={() => setShowCartTooltip(true)}
            onMouseLeave={safeMouseLeave}
          >
            {/* Link para a página do carrinho + badge */}
            <NavLink to="/cart" className="header__cart-link">
              <FaShoppingCart className="header__icon" />
              {cartItemsCount > 0 && <span className="header__cart-badge">{cartItemsCount}</span>}
            </NavLink>

            {/* Tooltip do carrinho */}
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
<<<<<<< HEAD
                            title={item.quantity > 1 ? 'Diminuir quantidade' : 'Remover produto'}
                          >
                            {item.quantity > 1 ? <FaMinus /> : <FaTrash />}
                          </button>

                          <span className="cart-tooltip__quantity">{item.quantity}</span>

=======
                            title={item.quantity > 1 ? "Diminuir quantidade" : "Remover produto"}
                          >
                            <FaTrash />
                          </button>
                          <span className="cart-tooltip__quantity">{item.quantity}</span>
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
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

<<<<<<< HEAD
      {/* Faixa inferior */}
=======
      {/* Banner verde inferior del menú */}
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
      <div className="header__bottom">
        <Banner />
      </div>
      {/*<div className="header__bottom">
        <p>
          <strong>LenovoPro.</strong> Conheça nossos programas exclusivos de descontos e benefícios
          para empresas. <strong>Cadastre-se gratuitamente.</strong>
        </p>
<<<<<<< HEAD
      </div>

      {/* Modal de Autenticação */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
=======
      </div>*/}

      {/* Modal de Autenticação */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
>>>>>>> 21ec3ce (modifiquei: tirei botão amarelo de reducir cantidade do carrinho, modifiquei tamanho do banner, modifiquei tamanho da fonte)
    </header>
  );
};

export default Header;