// src/components/payments/PaymentMethods.jsx
import "./PaymentMethods.css";
import visa from "../../assets/imgPayments/visa-desktop.svg";
import mastercard from "../../assets/imgPayments/mastercard-desktop.svg";
import amex from "../../assets/imgPayments/american-express-desktop.svg";
import elo from "../../assets/imgPayments/elo-desktop.svg";
import boleto from "../../assets/imgPayments/boleto-bancario-desktop.svg";
import pix from "../../assets/imgPayments/pix-desktop.svg";

export default function PaymentMethods() {
  return (
    <section className="pay">
      <h2 className="pay__title">Formas de pagamento:</h2>

      <div className="pay__grid">
        {/* Boleto */}
        <article className="pay__card">
          <div className="pay__row">
            <img src={boleto} alt="Boleto bancário" className="pay__chip-img" />
          </div>
        </article>

        {/* Pix */}
        <article className="pay__card">
          <div className="pay__row">
            <img src={pix} alt="Pix" className="pay__chip-img" />
          </div>
        </article>

        {/* Cartões de crédito */}
        <article className="pay__card pay__card--brands">
         

          <div className="pay__brands">
            <img src={visa} alt="Visa" className="pay__brand-img" />
            <span className="pay__divider" aria-hidden />
            <img src={mastercard} alt="Mastercard" className="pay__brand-img" />
            <span className="pay__divider" aria-hidden />
            <img src={amex} alt="American Express" className="pay__brand-img" />
            <span className="pay__divider" aria-hidden />
            <img src={elo} alt="Elo" className="pay__brand-img" />
          </div>
        </article>
      </div>

      <div className="infoPayment">
        <p>Notebooks PC, PC Computador e melhores notebooks</p>
      </div>
      
    </section>
  );
}
