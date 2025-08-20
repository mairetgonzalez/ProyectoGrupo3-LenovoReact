// src/components/header/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import './Header.css';
import logo from '../../assets/lenovo-logo.png';

const Header = () => {
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
          <FaUser className="header__icon" />
          <FaHeart className="header__icon" />
          <FaShoppingCart className="header__icon" />
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
    </header>
  );
};

export default Header;
