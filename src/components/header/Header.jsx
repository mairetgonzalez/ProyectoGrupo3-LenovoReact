import React from 'react';
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
        <img src={logo} alt="Lenovo" className="header__logo" />

          {/* Centro: buscador */}
        <div className="header__search">
          <form className="header__search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Procurar produtos"
              className="header__search-input"
            />
            <button className="header__search-btn" aria-label="Buscar">
              <FaSearch />
            </button>
          </form>
        </div>

        {/* DERECHA: iconos */}
        <div className="header__icons">
          <FaUser className="header__icon" />
          <FaHeart className="header__icon" />
          <FaShoppingCart className="header__icon" />
        </div>
      </div>

      {/* Navegación */}
      <nav className="header__nav">
        <ul className="header__nav--left">
          <li className="has-submenu">Home</li>
          <li className="has-submenu">Promoções</li>
          <li className="has-submenu">Loja</li>
          <li>Suporte</li>
          <li className="has-submenu">Sobre Nós</li>
          <li className="has-submenu">Contatos</li>
        </ul>
        <ul className="header__nav--right">
          <li>Empresa</li>
          <li>Educação</li>
          <li>Gaming</li>
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
