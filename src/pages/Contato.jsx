// src/pages/Contato.jsx
import React, { useState } from "react";
import "./Contato.css";
import HeroCarousel from "../components/header/HeroCarousel";

// Banner especial para Contato
import bannerContato from "../assets/banner/banner2.jpg"; 

export default function Contato() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setForm({ nome: "", email: "", mensagem: "" });
  };

  const slidesContato = [
    {
      imagen: bannerContato,     // o reutiliza banner1 si aún no tienes esta imagen
      titulo: "Fale Conosco",
      desc1: "Suporte e Atendimento Lenovo",
      desc2: "Estamos prontos para ajudar você.",
      boton: "Falar com Suporte",
      link: "https://support.lenovo.com/br/pt",     // baja al formulario
    },
  ];

  return (
    <>
      <HeroCarousel slides={slidesContato} />

      <section id="contato-form" className="contato container" style={{ marginTop: 24 }}>
        <h1 className="contato__title">Entre em Contato</h1>
        <p className="contato__subtitle">Tem alguma dúvida ou precisa de suporte? Fale conosco.</p>

        <div className="contato__grid">
          <div className="contato__info">
            <h2>Informações de Contato</h2>
            <p>📍 Endereço: Rua Exemplo, 123 - São Paulo/SP</p>
            <p>📞 Telefone: (11) 99999-9999</p>
            <p>✉️ Email: suporte@lenovo.com</p>
          </div>

          <form className="contato__form" onSubmit={handleSubmit}>
            <label>Nome<input name="nome" value={form.nome} onChange={handleChange} required /></label>
            <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
            <label>Mensagem<textarea name="mensagem" rows="5" value={form.mensagem} onChange={handleChange} required /></label>
            <button type="submit" className="contato__btn">Enviar Mensagem</button>
            {enviado && <p className="contato__success">✅ Mensagem enviada!</p>}
          </form>
        </div>
      </section>
    </>
  );
}
