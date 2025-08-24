import integrantesData from "../data/IntegrantesData";
import "../styles/cards.css";

//icones:
import { IoLocationOutline } from "react-icons/io5";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { TiWorldOutline } from "react-icons/ti";
import { IoBulbOutline } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { MdOutlineWhatsapp } from "react-icons/md";


export default function IntegrantesCards() {
  return (
    <>
      {integrantesData.map((integrante) => (
        <div key={integrante.id} className="integrantesCards">
          <img
            className="integranteFoto"
            src={integrante.img}
            alt={`Foto de ${integrante.alt}`}
          />
          <div className="infoContainer">
            <h3 className="nomeIntegrante">{integrante.nome}</h3>

            <div className="rowIdadePais">
              <p className="idadeIntegrante">
                <LiaBirthdayCakeSolid className="icon" />Idade: {integrante.idade}
              </p>
              <p className="paisIntegrante">
                <TiWorldOutline className="icon" />Pais: {integrante.pais}
              </p>
            </div>

            <p className="moraIntegrante">
              <IoLocationOutline className="icon" />Mora em: {integrante.mora}
            </p>
            <p className="profissaoIntegrante">
              <LuBriefcaseBusiness className="icon" />Profissão Atual: {integrante.profissao}
            </p>
            <p className="interesseIntegrante">
              <IoBulbOutline className="icon" />Interesse na profissão: {integrante.interesse}
            </p>

            <p className="contatoIntegrante">Contato:</p>
            <p className="emailIntegrante">
              <MdMailOutline className="icon" />E-mail: {integrante.email}
            </p>
            <p className="telefoneIntegrante">
              <MdOutlineWhatsapp className="icon" />Telefone: {integrante.telefone}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
