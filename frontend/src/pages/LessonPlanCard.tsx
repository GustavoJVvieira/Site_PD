import React, { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Presentation, Edit, CheckSquare } from 'lucide-react';
import jsPDF from 'jspdf';

export interface Planejamento {
  tituloAula: string;
  ativacao: {
    titulo: string;
    metodologia: string;
    pergunta_inicial: string;
    atividade: string;
  };
  problema_real: {
    titulo: string;
    metodologia: string;
    cenario: string;
    pergunta_problema: string;
    importancia: string;
  };
  investigacao: {
    titulo: string;
    metodologia: string;
    perguntas_guiadas: string;
    elementos_descobertos: string;
  };
  solucao_pratica: {
    titulo: string;
    metodologia: string;
    descricao: string;
  };
  mini_projeto: {
    titulo: string;
    metodologia: string;
    desafio: string;
  };
  sugestaoAulasCSV?: {
    idAula: string;
    temaAula: string;
    justificativa: string;
  }[];
  observacoesIA?: string; 
}

export interface LessonPlanCardProps {
  demanda: string;
  setDemanda: React.Dispatch<React.SetStateAction<string>>;
  planejamento: Planejamento | null;
  setPlanejamento: React.Dispatch<React.SetStateAction<Planejamento | null>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  editedPlanejamento: Planejamento | null;
  setEditedPlanejamento: React.Dispatch<React.SetStateAction<Planejamento | null>>;
}

export interface ManualSlide {
  title: string;
  text: string;
  image?: File;
  imageUrl?: string;
}

export const mockPlanejamento: Planejamento = {
  tituloAula: "Introdução à Inteligência Artificial",
  ativacao: {
    titulo: "Ativação",
    metodologia: "Debate em grupo",
    pergunta_inicial: "O que é Inteligência Artificial para vocês?",
    atividade: "Divida a turma em pequenos grupos e peça para cada grupo discutir e anotar suas definições e exemplos de IA que usam no dia a dia. Ao final, cada grupo apresenta suas anotações para a turma.",
  },
  problema_real: {
    titulo: "Problema Real",
    metodologia: "Estudo de caso",
    cenario: "A prefeitura de uma cidade deseja otimizar o fluxo de trânsito em horários de pico. Eles consideraram a implementação de semáforos inteligentes, mas não sabem o impacto real disso. Vocês, como engenheiros, precisam analisar o problema.",
    pergunta_problema: "Como a Inteligência Artificial poderia ser usada para melhorar o trânsito da cidade, considerando as variáveis de fluxo, horário e eventos especiais?",
    importancia: "Discuta como a IA pode resolver problemas complexos da vida real e a importância de analisar os dados para tomar decisões mais assertivas.",
  },
  investigacao: {
    titulo: "Investigação",
    metodologia: "Pesquisa guiada",
    perguntas_guiadas: `1. Quais são os principais desafios do trânsito na cidade?
    2. Que tipos de dados podem ser coletados para analisar o trânsito (ex: câmeras, sensores)?
    3. Como um algoritmo de IA poderia processar esses dados para tomar decisões?
    4. Qual a diferença entre um semáforo inteligente e um tradicional?`,
    elementos_descobertos: "Aprendizado de máquina, visão computacional, coleta e análise de dados, otimização de algoritmos.",
  },
  solucao_pratica: {
    titulo: "Solução Prática",
    metodologia: "Brainstorming e prototipagem",
    descricao: `\`\`\`javascript
    // Exemplo de pseudocódigo para um semáforo inteligente
    function SemafaroInteligente(dadosDeTrafego) {
      if (dadosDeTrafego.fluxoVeiculos > 80 && dadosDeTrafego.pedestres == 0) {
        // Semáforo da via principal permanece verde por mais tempo
        return "VERDE_LONGO";
      } else if (dadosDeTrafego.fluxoVeiculos < 20 && dadosDeTrafego.pedestres > 5) {
        // Priorizar pedestres
        return "VERMELHO_RAPIDO_VERDE_PEDESTRE";
      } else {
        // Seguir o padrão normal ou otimizar com base em dados históricos
        return "PADRAO";
      }
    }
    \`\`\`
    Peça aos alunos para expandirem este pseudocódigo, adicionando mais variáveis e condições.`,
  },
  mini_projeto: {
    titulo: "Mini-Projeto",
    metodologia: "Construção de modelo",
    desafio: "Crie um fluxograma ou um pequeno protótipo (pode ser com blocos de programação) de como um semáforo inteligente poderia funcionar, levando em conta os dados que vocês investigaram. O objetivo é apresentar sua solução para a turma.",
  },
  sugestaoAulasCSV: [
    {
      idAula: "101",
      temaAula: "Algoritmos e Lógica de Programação",
      justificativa: "A aula de IA requer uma base sólida em lógica e algoritmos, essencial para entender como as máquinas 'pensam'.",
    },
    {
      idAula: "105",
      temaAula: "Coleta e Análise de Dados",
      justificativa: "A IA é fortemente baseada em dados, e esta aula ensina as técnicas para coletá-los e interpretá-los, o que é crucial para qualquer projeto.",
    }
  ],
  observacoesIA: "O plano de aula foi gerado com foco em uma abordagem prática, conectando conceitos abstratos de IA a um problema cotidiano. As metodologias sugeridas visam o engajamento e o trabalho em equipe.",
};

const LessonPlanCard: React.FC<LessonPlanCardProps> = ({
  demanda,
  setDemanda,
  planejamento,
  setPlanejamento,
  isGenerating,
  setIsGenerating,
  error,
  setError,
  isEditMode,
  setIsEditMode,
  editedPlanejamento,
  setEditedPlanejamento,
}) => {
  const lessonPlanRef = useRef<HTMLDivElement>(null);
  const currentPlanejamento = isEditMode && editedPlanejamento ? editedPlanejamento : planejamento;
  const [isGeneratingSlides, setIsGeneratingSlides] = useState<boolean>(false);

  const gerarPdfPadronizado = () => {
    if (!currentPlanejamento) {
      setError("Não há um plano de aula para ser exportado.");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;
    const margin = 20;
    const h1FontSize = 16;
    const h2FontSize = 14;
    const pFontSize = 11;
    const lineHeight = 7;

    doc.setFont('helvetica');

    const addHeader = (doc: jsPDF) => {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Projeto Desenvolve - Plano de Aula', pdfWidth - margin, 15, { align: 'right' });
      doc.line(margin, 18, pdfWidth - margin, 18);
      currentY = 25;
    };

    const checkPageBreak = (doc: jsPDF, contentHeight: number) => {
      if (currentY + contentHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        addHeader(doc);
      }
    };

    addHeader(doc);
    doc.setFontSize(h1FontSize);
    doc.setTextColor(0, 0, 0);
    doc.text(currentPlanejamento.tituloAula, margin, currentY);
    currentY += lineHeight * 2;

    const sections = [
      { title: currentPlanejamento.ativacao.titulo, content: currentPlanejamento.ativacao, fields: ['metodologia', 'pergunta_inicial', 'atividade'] },
      { title: currentPlanejamento.problema_real.titulo, content: currentPlanejamento.problema_real, fields: ['metodologia', 'cenario', 'pergunta_problema', 'importancia'] },
      { title: currentPlanejamento.investigacao.titulo, content: currentPlanejamento.investigacao, fields: ['metodologia', 'perguntas_guiadas', 'elementos_descobertos'] },
      { title: currentPlanejamento.solucao_pratica.titulo, content: currentPlanejamento.solucao_pratica, fields: ['metodologia', 'descricao'] },
      { title: currentPlanejamento.mini_projeto.titulo, content: currentPlanejamento.mini_projeto, fields: ['metodologia', 'desafio'] },
    ];

    sections.forEach(section => {
      checkPageBreak(doc, lineHeight * 2);
      doc.setFontSize(h2FontSize);
      doc.setTextColor(50, 50, 50);
      doc.text(section.title, margin, currentY);
      currentY += lineHeight;

      doc.setFontSize(pFontSize);
      doc.setTextColor(80, 80, 80);

      section.fields.forEach(field => {
        const fieldText = (section.content as any)[field];
        if (fieldText) {
          doc.setFontSize(pFontSize);
          doc.setFont('helvetica', 'bold');
          doc.text(`${field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:`, margin, currentY);
          currentY += lineHeight * 0.7;
        }
      });
      currentY += lineHeight;
    });

    if (currentPlanejamento.observacoesIA) {
      checkPageBreak(doc, lineHeight * 3);
      doc.setFontSize(h2FontSize);
      doc.setTextColor(50, 50, 50);
      doc.text('Observações da IA', margin, currentY);
      currentY += lineHeight;
    }

    const fileName = currentPlanejamento?.tituloAula ? `${currentPlanejamento.tituloAula.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf` : 'plano_de_aula_padronizado.pdf';
    doc.save(fileName);
  };

  const gerarPlanoDeSlides = async () => {
    if (!planejamento) {
      setError("Gere um plano de aula primeiro para depois gerar o plano de slides.");
      return;
    }

    setIsGeneratingSlides(true);
    setError(null);

    const slidePrompt = `
      Você é o diretor criativo de uma equipe de design de apresentações. Sua missão é criar o roteiro de uma apresentação de slides completa sobre um tema específico. Você precisa seguir este esqueleto rigoroso de seis slides, preenchendo cada um com conteúdo criativo e relevante, além de sugestões de imagens.

      O tema da apresentação é: "${planejamento.tituloAula}".

      Slide 1: Título e Introdução
      Título: Dê um título impactante para o tema.
      Imagem: Sugira uma imagem que represente visualmente o título e capte a atenção do público.

      Slide 2: Conexão com o Cotidiano
      Título e Texto: Crie um título e um parágrafo que expliquem o assunto, conectando-o de forma clara e direta com situações do dia a dia das pessoas.
      Imagem: Proponha uma imagem que reforce a conexão entre o tema e a vida cotidiana.

      Slide 3: Problema Real
      Título e Texto: Desenvolva um título e um texto que liguem o assunto a um problema real e tangível, mostrando sua importância na prática.
      Imagem: Sugira uma imagem que ilustre o problema apresentado.

      Slide 4: Perguntas Investigativas
      Título e Texto: Formule um título e um parágrafo introdutório para o slide.
      Tópicos (2): Crie duas perguntas investigativas que incentivem a exploração e a curiosidade sobre o tema, levando a uma reflexão mais profunda.
      Imagem: Escolha uma imagem que represente a ideia de investigação ou descoberta.

      Slide 5: Aplicação Prática
      Título e Texto: Crie um título e um texto que descrevam uma aplicação prática e concreta do conteúdo.
      Imagem: Indique uma imagem que mostre a aplicação do conceito na prática.

      Slide 6: Mini-Desafio
      Título e Texto: Proponha um título e um texto para um mini-desafio rápido e prático. O objetivo é que o público possa realizar o desafio imediatamente para aplicar o que aprendeu.
      Imagem: Selecione uma imagem que represente a ideia de um desafio ou ação.

      Instruções Adicionais:
      - Seja criativo e direto em todas as suas sugestões.
      - As imagens devem ser sugestões de alta qualidade, que possam ser facilmente encontradas em bancos de imagens.
      - Mantenha a linguagem clara e envolvente para todos os slides.
      - Use o seguinte formato para a sua resposta:
      SLIDE 1 - TÍTULO
      [Título do Slide 1]
      IMAGEM
      [Descrição da imagem do Slide 1]
      SLIDE 2 - CONEXÃO COM O COTIDIANO
      [Título do Slide 2]
      [Texto do Slide 2]
      IMAGEM
      [Descrição da imagem do Slide 2]
      ... e assim por diante para todos os 6 slides.
    `;
      
    try {
      const response = await fetch('https://site-pd.onrender.com/gemini/chat-with-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: slidePrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao gerar o plano de slides.');
      }

      const data = await response.json();
      const slidePlanText = data.rawText;
      
      gerarPdfSlides(slidePlanText);

    } catch (err: any) {
      console.error('Erro ao gerar plano de slides:', err);
      setError(err.message || 'Falha ao gerar o plano de slides. Por favor, tente novamente.');
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  const gerarPdfSlides = (slidePlanText: string) => {
    if (!slidePlanText) {
      setError("Não há plano de slides para exportar.");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;
    const margin = 20;
    const bodyWidth = pdfWidth - 2 * margin;
    const h1FontSize = 16;
    const h2FontSize = 14;
    const pFontSize = 11;
    const lineHeight = 7;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const slides = slidePlanText.split(/SLIDE \d/);
    slides.shift(); // Remove o primeiro item vazio

    slides.forEach((slideContent, index) => {
      if (index > 0) {
        doc.addPage();
        currentY = 20;
      }
      
      const lines = slideContent.split('\n');
      lines.forEach(line => {
        if (line.trim().length > 0) {
          if (line.includes('TÍTULO')) {
            doc.setFontSize(h1FontSize);
            doc.setFont('helvetica', 'bold');
            doc.text(`SLIDE ${index + 1} - ${line.replace('- TÍTULO', '').trim()}`, margin, currentY);
            currentY += lineHeight * 1.5;
            doc.setFont('helvetica', 'normal');
          } else if (line.includes('IMAGEM')) {
            doc.setFontSize(h2FontSize);
            doc.setFont('helvetica', 'bold');
            doc.text('Sugestão de Imagem:', margin, currentY);
            currentY += lineHeight;
          } else {
            const wrappedText = doc.splitTextToSize(line, bodyWidth);
            doc.setFontSize(pFontSize);
            doc.setFont('helvetica', 'normal');
            doc.text(wrappedText, margin, currentY);
            currentY += wrappedText.length * lineHeight;
          }
        }
      });
    });

    const fileName = `plano_de_slides_${currentPlanejamento?.tituloAula?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'gerado'}.pdf`;
    doc.save(fileName);
  };

  const handlePlanejamentoChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    section: keyof Planejamento | 'tituloAula',
    field?: string
  ) => {
    if (editedPlanejamento) {
      setEditedPlanejamento((prev: Planejamento | null) => {
        if (!prev) return null;
        const newPlan = { ...prev };

        if (section === 'tituloAula') {
          newPlan.tituloAula = e.target.value;
        } else if (field) {
          if (typeof (newPlan as any)[section] === 'object' && (newPlan as any)[section] !== null) {
            (newPlan as any)[section][field] = e.target.value;
          } else if (section === 'observacoesIA') {
            newPlan.observacoesIA = e.target.value;
          }
        }
        return newPlan;
      });
    }
  };

  const gerarPlanejamentoBridge = async () => {
    if (!demanda.trim()) {
      setError('Por favor, descreva o tema ou conteúdo da aula.');
      return;
    }
    
    if (demanda.trim().toUpperCase() === "TESTE") {
        setPlanejamento(mockPlanejamento);
        setEditedPlanejamento(mockPlanejamento);
        setIsGenerating(false);
        setError(null);
        return;
    }

    setIsGenerating(true);
    setPlanejamento(null);
    setEditedPlanejamento(null);
    setIsEditMode(false);
    setError(null);

    const jsonPrompt = `
      Crie um plano de aula completo seguindo a metodologia de ensino "Desenvolve" para o seguinte tema: "${demanda}".

      O plano deve ser estruturado rigorosamente no formato JSON. Não inclua texto introdutório, explicações ou qualquer outro tipo de conteúdo fora do JSON. A sua resposta deve ser APENAS o objeto JSON.

      O objeto JSON deve ter a seguinte estrutura:

      {
        "tituloAula": "Título claro e direto da aula",
        "ativacao": {
          "titulo": "Ativação",
          "metodologia": "Metodologia a ser utilizada (Ex: Debate em grupo, Perguntas e Respostas)",
          "pergunta_inicial": "Uma pergunta provocadora para iniciar a aula.",
          "atividade": "Descrição da atividade inicial para ativar o conhecimento prévio dos alunos. Pode incluir listas com tópicos."
        },
        "problema_real": {
          "titulo": "Problema Real",
          "metodologia": "Metodologia a ser utilizada (Ex: Estudo de caso, Análise de cenários)",
          "cenario": "Descrição de um cenário real ou fictício que contextualiza o problema. Pode conter links ou imagens em formato markdown.",
          "pergunta_problema": "A pergunta central que o problema levanta.",
          "importancia": "Explicação da relevância do problema na vida real dos alunos. Pode ser em formato de lista."
        },
        "investigacao": {
          "titulo": "Investigação",
          "metodologia": "Metodologia a ser utilizada (Ex: Pesquisa guiada, Exploração de recursos)",
          "perguntas_guiadas": "Lista de perguntas que guiam a investigação dos alunos. O formato de lista é preferencial.",
          "elementos_descobertos": "Lista de conceitos ou elementos que os alunos devem descobrir na investigação. O formato de lista é preferencial."
        },
        "solucao_pratica": {
          "titulo": "Solução Prática",
          "metodologia": "Metodologia a ser utilizada (Ex: Brainstorming, Prototipagem, Codificação)",
          "descricao": "Descrição detalhada de como os alunos irão aplicar o conhecimento para criar uma solução prática. Pode incluir blocos de código markdown se for relevante."
        },
        "mini_projeto": {
          "titulo": "Mini-Projeto",
          "metodologia": "Metodologia do mini-projeto (Ex: Construção de modelo, Desenvolvimento de protótipo)",
          "desafio": "Descrição do desafio final para os alunos aplicarem o que aprenderam. O formato de lista é preferencial."
        },
        "sugestaoAulasCSV": [
            {
                "idAula": "ID da aula no currículo (ex: '101')",
                "temaAula": "Tema da aula",
                "justificativa": "Breve justificativa de por que essa aula se conecta ao tema."
            }
        ],
        "observacoesIA": "Observações adicionais ou notas pedagógicas da IA sobre o plano de aula gerado."
      }

      Garanta que a resposta seja um JSON válido. Não adicione nenhum outro texto além do objeto JSON.
    `;

    try {
      const response = await fetch('https://site-pd.onrender.com/gemini/chat-with-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: jsonPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Algo deu errado no servidor backend.');
      }

      const data = await response.json();
      setPlanejamento(data);
      setEditedPlanejamento(data);
    } catch (err: any) {
      console.error('Erro ao buscar plano de aula:', err);
      setError(err.message || 'Falha ao gerar o plano de aula. Por favor, tente novamente.');
    } finally {
      if (demanda.trim().toUpperCase() !== "TESTE") {
        setIsGenerating(false);
      }
    }
  };

  const saveEdits = () => {
    if (editedPlanejamento) {
      setPlanejamento(editedPlanejamento);
      setIsEditMode(false);
      setError(null);
    }
  };

  const toggleEditMode = () => {
    if (planejamento) {
      setIsEditMode(!isEditMode);
      if (!isEditMode) {
        setEditedPlanejamento(JSON.parse(JSON.stringify(planejamento)));
      }
      setError(null);
    }
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    setEditedPlanejamento(planejamento);
    setError(null);
  };
  
  const renderRichText = (text: string, isList: boolean = false) => {
    if (!text) return null;

    const imageRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
    const matches = [...text.matchAll(imageRegex)];

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach(match => {
      const [fullMatch, url] = match;
      const textBefore = text.substring(lastIndex, match.index);

      if (textBefore) {
        textBefore.split('\n').filter(p => p.trim() !== '').forEach((p, pIndex) => {
          elements.push(<p key={`text-${lastIndex}-${pIndex}`} className="text-content mb-2">{p.trim()}</p>);
        });
      }

      elements.push(<img key={match.index} src={url} alt="Imagem do plano de aula" className="embedded-image" />);
      lastIndex = match.index + fullMatch.length;
    });

    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      textAfter.split('\n').filter(p => p.trim() !== '').forEach((p, pIndex) => {
        elements.push(<p key={`text-after-${pIndex}`} className="text-content mb-2">{p.trim()}</p>);
      });
    }

    if (isList) {
      return (
        <ul className="text-content">
          {elements.map((el, index) => <li key={index} className="list-item">{el}</li>)}
        </ul>
      );
    }

    return <div className="rich-text-content">{elements}</div>;
  };
  
  const renderCodeBlock = (text: string, section: keyof Planejamento, field: string) => {
    if (isEditMode) {
      return (
        <textarea
          className="editable-textarea code-textarea"
          value={text}
          onChange={(e) => handlePlanejamentoChange(e, section, field)}
          rows={Math.max(5, text.split('\n').length + 2)}
        />
      );
    }
    const codeRegex = /```(?:\w+)?\n([\s\S]*?)\n```/g;
    const parts = text.split(codeRegex);

    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            const code = part.trim();
            return (
              <div key={`code-${index}`} className="code-block">
                <pre className="code-pre"><code>{code}</code></pre>
              </div>
            );
          } else {
            return part.split('\n').filter(p => p.trim() !== '').map((p, pIndex) => (
              <p key={`text-${index}-${pIndex}`} className="text-content mb-4">{p.trim()}</p>
            ));
          }
        })}
      </>
    );
  };
  
  const renderEditableText = (text: string | undefined, section: keyof Planejamento, field: string, isList: boolean = false) => {
    const value = text || '';
    if (isEditMode) {
      return (
        <textarea
          className="editable-textarea"
          value={value}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handlePlanejamentoChange(e, section, field)}
          rows={Math.max(3, value.split('\n').length + 2)}
        />
      );
    }
    return renderRichText(value, isList);
  };
  
  const shouldBlockMainInteractions = isGenerating || isEditMode;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="left-column"
    >
      {!isGenerating && (
        <div className="card">
          <div className="card-title-group">
            <Sparkles style={{ width: '20px', height: '20px', color: '#6b46c1' }} />
            Gerador de Aulas
          </div>
          <div className="card-description">
            Descreva o tema, habilidade ou conteúdo que deseja ensinar.
          </div>
          <div className="flex-col gap-4">
            <div className="textarea-container">
              <textarea
                placeholder="Ex: Ensinar o conceito de modais em Bootstrap para iniciantes... (Ou digite 'TESTE' para carregar os dados de exemplo)"
                value={demanda}
                onChange={(e) => setDemanda(e.target.value)}
                className="textarea"
                disabled={shouldBlockMainInteractions}
              />
            </div>
            <div className="button-container">
              <button
                onClick={gerarPlanejamentoBridge}
                disabled={!demanda.trim() || shouldBlockMainInteractions}
                className="generate-button"
              >
                {isGenerating ? (
                  <>
                    <div className="spinner-circle"></div>Gerando...
                  </>
                ) : (
                  <>Gerar Planejamento</>
                )}
              </button>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="spinner-container card flex-grow"
          >
            <div className="spinner-circle"></div>
          </motion.div>
        )}
        {currentPlanejamento && !isGenerating && (
          <motion.div
            key="lesson-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card flex-grow"
          >
            <div ref={lessonPlanRef}>
              <div className="lesson-header">
                {isEditMode ? (
                  <textarea
                    className="editable-title-textarea"
                    value={currentPlanejamento.tituloAula}
                    onChange={(e) => handlePlanejamentoChange(e, 'tituloAula')}
                    rows={1}
                  />
                ) : (
                  <div className="lesson-title">{currentPlanejamento.tituloAula}</div>
                )}
                <div className="button-group">
                  <button
                    onClick={gerarPdfPadronizado}
                    className="save-button"
                    disabled={!planejamento || isEditMode}
                    title="Exportar como PDF"
                  >
                    <FileText style={{ width: '16px', height: '16px', marginRight: '4px' }} /> PDF
                  </button>
                  <button
                    onClick={gerarPlanoDeSlides}
                    className="edit-button"
                    title="Gerar e Exportar Plano de Slides"
                    disabled={!planejamento || isEditMode || isGeneratingSlides}
                  >
                    {isGeneratingSlides ? (
                      <>
                        <div className="spinner-circle-small"></div> Gerando...
                      </>
                    ) : (
                      <>
                        <Presentation style={{ width: '16px', height: '16px', marginRight: '4px' }} />
                        Gerar Plano de Slides
                      </>
                    )}
                  </button>
                  {!isEditMode ? (
                    <button
                      onClick={toggleEditMode}
                      className="edit-button"
                      disabled={!planejamento || isGeneratingSlides}
                    >
                      <Edit style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Editar
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={saveEdits}
                        className="save-button confirm-edit-button"
                      >
                        <CheckSquare style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Salvar Edições
                      </button>
                      <button
                        onClick={cancelEditMode}
                        className="cancel-edit-button"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
                
              <AnimatePresence>
                <motion.div
                  key="auto-mode-ui"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-col gap-4"
                >
                  {/* CORREÇÃO AQUI: Verificações de segurança antes de renderizar cada seção */}
                  {currentPlanejamento.ativacao && (
                    <div className="flex-col gap-2">
                      <h3 className="section-title">{currentPlanejamento.ativacao.titulo}</h3>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.ativacao.metodologia}</p>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Pergunta inicial:</span> "{currentPlanejamento.ativacao.pergunta_inicial}"</p>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Atividade:</span></p>
                      {renderEditableText(currentPlanejamento.ativacao.atividade, 'ativacao', 'atividade', true)}
                    </div>
                  )}
                  <hr className="divider" />

                  {currentPlanejamento.problema_real && (
                    <div className="flex-col gap-2">
                      <h3 className="section-title">{currentPlanejamento.problema_real.titulo}</h3>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.problema_real.metodologia}</p>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Cenário:</span></p>
                      {renderEditableText(currentPlanejamento.problema_real.cenario, 'problema_real', 'cenario')}
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Pergunta problema:</span> "{currentPlanejamento.problema_real.pergunta_problema}"</p>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Importância:</span></p>
                      {renderEditableText(currentPlanejamento.problema_real.importancia, 'problema_real', 'importancia', true)}
                    </div>
                  )}
                  <hr className="divider" />
                  
                  {currentPlanejamento.investigacao && (
                    <div className="flex-col gap-2">
                      <h3 className="section-title">{currentPlanejamento.investigacao.titulo}</h3>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.investigacao.metodologia}</p>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Perguntas guiadas:</span></p>
                      {renderEditableText(currentPlanejamento.investigacao.perguntas_guiadas, 'investigacao', 'perguntas_guiadas', true)}
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Elementos descobertos:</span></p>
                      {renderEditableText(currentPlanejamento.investigacao.elementos_descobertos, 'investigacao', 'elementos_descobertos', true)}
                    </div>
                  )}
                  <hr className="divider" />
                  
                  {currentPlanejamento.solucao_pratica && (
                    <div className="flex-col gap-2">
                      <h3 className="section-title">{currentPlanejamento.solucao_pratica.titulo}</h3>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.solucao_pratica.metodologia}</p>
                      {renderCodeBlock(currentPlanejamento.solucao_pratica.descricao, 'solucao_pratica', 'descricao')}
                    </div>
                  )}
                  <hr className="divider" />

                  {currentPlanejamento.mini_projeto && (
                    <div className="flex-col gap-2">
                      <h3 className="section-title">{currentPlanejamento.mini_projeto.titulo}</h3>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.mini_projeto.metodologia}</p>
                      <p className="text-content"><span style={{ fontWeight: 600 }}>Desafio:</span></p>
                      {renderEditableText(currentPlanejamento.mini_projeto.desafio, 'mini_projeto', 'desafio', true)}
                    </div>
                  )}

                  {currentPlanejamento.sugestaoAulasCSV && currentPlanejamento.sugestaoAulasCSV.length > 0 && (
                    <>
                      <hr className="divider" />
                      <div className="flex-col gap-2">
                        <h3 className="section-title" style={{ color: '#6b46c1' }}>Aulas do Currículo que se Adequam</h3>
                        <ul className="text-content">
                          {currentPlanejamento.sugestaoAulasCSV.map((sugestao, idx) => (
                            <li key={idx} className="list-item">
                              <span style={{ fontWeight: 600 }}>Aula {sugestao.idAula}:</span> {sugestao.temaAula}
                              <br />
                              <span style={{ fontSize: '0.9em', color: '#555' }}>Justificativa: {sugestao.justificativa}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {currentPlanejamento.observacoesIA && (
                    <>
                      <hr className="divider" />
                      <div className="flex-col gap-2">
                        <h3 className="section-title" style={{ color: '#6b46c1' }}>Observações da IA</h3>
                        {isEditMode ? (
                          <textarea
                            className="editable-textarea"
                            value={currentPlanejamento.observacoesIA}
                            onChange={(e) => handlePlanejamentoChange(e, 'observacoesIA')}
                            rows={Math.max(3, currentPlanejamento.observacoesIA.split('\n').length + 2)}
                          />
                        ) : (
                          <p className="text-content">{currentPlanejamento.observacoesIA}</p>
                        )}
                      </div>
                    </>
                  )}
                </motion.div>
                </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LessonPlanCard;