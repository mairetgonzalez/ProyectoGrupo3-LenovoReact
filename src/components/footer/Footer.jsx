// Footer.jsx
// 🇧🇷 Rodapé com 3 colunas no topo + links em 5 colunas

import './Footer.css';

// Ícones de redes sociais (arquivos em src/assets/icons)
import facebookIcon from '../../assets/icons/icon-footer-facebook.svg';
import instagramIcon from '../../assets/icons/icon-footer-instagram.svg';
import linkedinIcon from '../../assets/icons/icon-footer-linkedin.svg';
import xIcon from '../../assets/icons/icon-footer-twitter.svg';
import youtubeIcon from '../../assets/icons/icon-footer-youtube.svg';

// Seletor de país com react-select
import CountrySelector from './CountrySelector';

export default function Footer() {
  return (
    <footer className="footer">
      {/* 🔹 Faixa superior: 3 colunas (newsletter | social | país) */}
      <div className="footer__top footer__container">
    
                {/* ESQUERDA: Newsletter */}
          <div className="footer-newsletter">
            <h3 className="titulo-news">Fique a par das novidades</h3>

            {/* Campo único com seta à direita */}
            <div className="newsletter-field">
              <input
                type="email"
                placeholder="Introduzir endereço de e-mail"
                className="newsletter-input"
                aria-label="E-mail para novidades"
              />
              <button className="newsletter-go" aria-label="enviar">›</button>
            </div>
          </div>


        {/* CENTRO: Ícones sociais */}
        <div className="footer-center footer-social">
          <a className="social-pill" href="#" aria-label="Facebook">
            <img src={facebookIcon} alt="" />
          </a>
          <a className="social-pill" href="#" aria-label="Instagram">
            <img src={instagramIcon} alt="" />
          </a>
          <a className="social-pill" href="#" aria-label="LinkedIn">
            <img src={linkedinIcon} alt="" />
          </a>
          <a className="social-pill" href="#" aria-label="X">
            <img src={xIcon} alt="" />
          </a>
          <a className="social-pill" href="#" aria-label="YouTube">
            <img src={youtubeIcon} alt="" />
          </a>
        </div>

        {/* DIREITA: Seletor de país */}
        <div className="footer-right country-select-wrap">
          <CountrySelector />
        </div>
      </div>

      {/* 📂 Links divididos por colunas */}
      <div className="footer-links">
        <div>
          <h4>Sobre a Lenovo</h4>
          <ul>
            <li><a href="#">Nossa Empresa</a></li>
            <li><a href="#">Informações Legais</a></li>
            <li><a href="#">ESC</a></li>
            <li><a href="#">Reciclagem</a></li>
            <li><a href="#">Instituto Ayrton Senna</a></li>
            <li><a href="#">Notícias</a></li>
            <li><a href="#">Trabalhe na Lenovo</a></li>
          </ul>
        </div>

        <div>
          <h4>Suporte e Garantia</h4>
          <ul>
            <li><a href="#">Central Lenovo de Suporte</a></li>
            <li><a href="#">Rastrear Pedido</a></li>
            <li><a href="#">Consultar Status do Reparo</a></li>
            <li><a href="#">Assistência Técnica</a></li>
            <li><a href="#">Download de Drivers</a></li>
            <li><a href="#">Suporte Produtos Lenovo e Think</a></li>
          </ul>
        </div>

        <div>
          <h4>Produtos</h4>
          <ul>
            <li><a href="#">Notebooks & Ultrabooks</a></li>
            <li><a href="#">Tablets</a></li>
            <li><a href="#">Desktops</a></li>
            <li><a href="#">Workstations</a></li>
            <li><a href="#">Servidores e Storage</a></li>
            <li><a href="#">Acessórios e Upgrades</a></li>
          </ul>
        </div>

        <div>
          <h4>Recursos</h4>
          <ul>
            <li><a href="#">Registro do produto</a></li>
            <li><a href="#">Fale conosco</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Quero ser um Parceiro</a></li>
            <li><a href="#">Glossário</a></li>
          </ul>
        </div>

        <div>
          <h4>PME</h4>
          <ul>
            <li><a href="#">Indústrias</a></li>
            <li><a href="#">Cotação</a></li>
          </ul>
        </div>
      </div>

      {/* © Direitos autorais */}
      <div className="footer-bottom">
        <p>© 2025 Lenovo. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
