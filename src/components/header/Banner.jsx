import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Banner.css";
import './Header.css';

export default function Banner() {
    const mensajes = [
        <>
            <span style={{ fontWeight: 'bold', color: '#000' }}>LenovoPro.</span> Conheça nossos programas exclusivos de descontos e benefícios para empresas. <span style={{ fontWeight: 'bold', color: '#169ED9' }}>Cadastre-se gratuitamente.</span>
        </>,
        <>
            Fale conosco pelo <span style={{ fontWeight: 'bold', color: '#000' }}>Whatsapp</span> no número <span style={{ fontWeight: 'bold', color: '#169ED9' }}>+55 13 40420656</span> ou pelo número <span style={{ fontWeight: 'bold' }}>0800-536-6861 (Opção 2)</span>
        </>,
        <>
            Compre junto <span style={{ fontWeight: 'bold', color: '#000' }}>Office 365</span>! Produtividade total para o seu Lenovo! <span style={{ fontWeight: 'bold', color: '#169ED9' }}>Compre Agora</span>

        </>,
        <>
            <span style={{ fontWeight: 'bold', color: '#000' }}>Outlet Lenovo</span> Notebooks e Desktops com até 40% OFF! <span style={{ fontWeight: 'bold', color: '#169ED9' }}>Compre Agora</span>
        </>,
    ];

    const [index, setIndex] = useState(0);

    const anterior = () => {
        setIndex(index === 0 ? mensajes.length - 1 : index - 1);
    };

    const siguiente = () => {
        setIndex(index === mensajes.length - 1 ? 0 : index + 1);
    };

    useEffect(() => {
        const intervalo = setInterval(() => {
            setIndex(prevIndex => prevIndex === mensajes.length - 1 ? 0 : prevIndex + 1);
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="banner">
            <button onClick={anterior} className="flecha">
                <ChevronLeft size={24} />
            </button>
            <p className="mensaje">{mensajes[index]}</p>
            <button onClick={siguiente} className="flecha">
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
