import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cursos.css';

// Link da planilha comum para todos os cursos
const LINK_PLANILHA = "https://docs.google.com/spreadsheets/d/190mufThDReVGP6i4SZEgwdnMkX-WrODY/edit?usp=sharing&ouid=106652312295532962498&rtpof=true&sd=true";

// Função para converter o link do Google Drive para um link de download direto
const getDownloadLink = (fileId: string) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

// 1. Definição da interface para o objeto de curso com os links
interface ICurso {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string;
  pdfLink: string;
  planilhaLink: string;
}

// 2. Dados dos 3 cursos em andamento
const cursos: ICurso[] = [
  {
    id: 1,
    titulo: 'Introdução ao Desenvolvimento Web',
    descricao: 'Aprenda os fundamentos de HTML, CSS e JavaScript para iniciar sua jornada.',
    imagem: 'https://codigofacil.com.br/wp-content/compressx-nextgen/uploads/2024/12/o-que-e-html-imagem-564x283.jpg.avif',
    pdfLink: getDownloadLink('1piBZrQLeH_XMo-ackoO3eZlO3JuiCiOm'),
    planilhaLink: LINK_PLANILHA,
  },
  {
    id: 2,
    titulo: 'Matemática Aplicada a Lógica de Programação',
    descricao: 'Desenvolva o raciocínio lógico essencial para a resolução de problemas complexos.',
    imagem: 'https://www.micurso.net/webapp/img/courses/5aeb85_razonamiento-matematico_w730.jpg',
    pdfLink: getDownloadLink('1nhrz3e5jIxe2HWBV7m-2S659y_1My48u'),
    planilhaLink: LINK_PLANILHA,
  },
  {
    id: 3,
    titulo: 'Comunicação Digital, Ética e Legislação em TI',
    descricao: 'Entenda como se comunicar de forma profissional e atuar com responsabilidade.',
    imagem: 'https://media.licdn.com/dms/image/v2/C4D12AQHEUAD6Tfw5Ow/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520806447268?e=1759968000&v=beta&t=W_e232bPBtF8Y8OqeIgyjeeNQfgKZONWC3yMo7buCC8',
    pdfLink: getDownloadLink('19skHJdlhG8tExWbLN-1paOkilxhOSSbU'),
    planilhaLink: LINK_PLANILHA,
  },
];

// 3. Componente "filho": renderiza um único card de curso
const Curso: React.FC<Omit<ICurso, 'id'>> = ({ titulo, descricao, imagem, pdfLink, planilhaLink }) => {
  return (
    <div className="card-curso">
      <img src={imagem} alt={`Capa do curso ${titulo}`} className="imagem-curso" />
      <div className="info-curso">
        <h3 className="titulo-curso">{titulo}</h3>
        <p className="descricao-curso">{descricao}</p>
        <div className="botoes-curso">
          <a href={pdfLink} className="botao-acao" target="_blank" rel="noopener noreferrer">Link PDF</a>
          <a href={planilhaLink} className="botao-acao" target="_blank" rel="noopener noreferrer">Link Planilha</a>
        </div>
      </div>
    </div>
  );
};

// 4. Componente "pai": renderiza a lista completa de cursos
const ListaDeCursos: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container-netflix">
      <div className="cabecalho">
        <button onClick={() => navigate('/home')} className="botao-voltar">
          &larr;
        </button>
        <h1 className="titulo-principal">Nossos Cursos</h1>
      </div>

      <div className="lista-cursos">
        {cursos.map((curso) => (
          <Curso
            key={curso.id}
            titulo={curso.titulo}
            descricao={curso.descricao}
            imagem={curso.imagem}
            pdfLink={curso.pdfLink}
            planilhaLink={curso.planilhaLink}
          />
        ))}
      </div>
    </div>
  );
};

// 5. Exporta o componente principal
export default ListaDeCursos;