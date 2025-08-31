import IntegrantesCards from "./integrantesCards";
import quemSomos from "../assets/fotosIntegrantes/quemSomos.png"

export default function SobreNos() {
    return (
        <div>
            <div className="divQuemSomosContainer">
                <img src={quemSomos} alt="Quem somos" className="imgQuemSomos" />
                <h1 className="textoSoreImagem">Quem somos</h1>
                {/*<h2 className="tituloIntegrantes">Integrantes</h2>*/}
            </div>
            <div className="totiLenovoVoke">
                <p>Toti Diversidade, Lenovo e Voke têm uma parceria focada em promover a diversidade e a inclusão no mercado de trabalho, especialmente de pessoas refugiadas e migrantes no Brasil. Essa colaboração envolve a criação de projetos de capacitação, voluntariado e programas de impacto social, nos quais Lenovo e Voke apoiam a Toti na inclusão de talentos diversos e qualificados, fortalecendo também seus posicionamentos e suas imagens como marcas empregadoras.
                </p>
            </div>
            <div className="integrantesTexto">
                <p><strong>Integrantes do grupo 3</strong></p>
            </div>
            <div className="SobreNos">
                <IntegrantesCards />
            </div>
            <div className="quadroBox2">
                <div className="textProjeto">
                    <p >
                        O nosso projeto
                    </p>
                </div>
                <div className="quadroBox">

                    <p className="tituloBox">
                        Motivação pessoal
                    </p>
                    <p className="textBox">
                        Este projeto final é uma chance de colocar em prática tudo o que aprendemos no curso de React. Queremos transformar a teoria em experiência real, enfrentando os desafios de criar uma aplicação funcional e colaborativa, mesmo sendo nossos primeiros passos como desenvolvedores Front-End.
                    </p>
                </div>
                <div className="quadroBox">
                    <p className="tituloBox">
                        Objetivo acadêmico
                    </p>
                    <p className="textBox">
                        Nosso principal objetivo é aplicar os conhecimentos de React que adquirimos, desde o mais basico de HTML, CSS e JavaScript, até versionamennto no GitHub. Também queremos praticar boas práticas de programação, trabalho em equipe e aprender a usar ferramentas modernas que fazem parte do dia a dia de um desenvolvedor Front-End.
                    </p>
                </div>
                <div className="quadroBox">
                    <p className="tituloBox">
                        Projeção profissional
                    </p>
                    <p className="textBox">
                        Com este projeto, queremos mostrar que conseguimos planejar, implementar e apresentar uma aplicação completa em React. Mais do que um exercício do curso, ele é um passo para construir nosso portfólio e demonstrar nossas habilidades para futuros desafios profissionais, mesmo como iniciantes na área.
                    </p>
                </div>
            </div>
        </div>
    );
}
