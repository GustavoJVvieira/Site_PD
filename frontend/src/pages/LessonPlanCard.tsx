import React, { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FileText, Presentation, Edit, CheckSquare, XCircle, UploadCloud } from 'lucide-react';
import jsPDF from 'jspdf';

interface Planejamento {
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

interface LessonPlanCardProps {
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

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).slice(0, 5);
      setUploadedImages(files);
      setError(null);
    }
  };

  const processTextAndImages = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const imageRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/g;
    let currentY = y;
    let lastIndex = 0;
    const matches = [...text.matchAll(imageRegex)];

    matches.forEach(match => {
      const [fullMatch, url] = match;
      const textBefore = text.substring(lastIndex, match.index);

      if (textBefore) {
        const lines = doc.splitTextToSize(textBefore, maxWidth);
        lines.forEach((line: string) => {
          doc.text(line, x, currentY);
          currentY += lineHeight;
        });
      }

      const img = new Image();
      img.src = url;
      img.onload = () => {
        const imgWidth = Math.min(img.width, maxWidth);
        const imgHeight = (img.height * imgWidth) / img.width;
        doc.addImage(img, 'JPEG', x, currentY, imgWidth, imgHeight);
      };
      currentY += 5;
      lastIndex = match.index + fullMatch.length;
    });

    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      const lines = doc.splitTextToSize(textAfter, maxWidth);
      lines.forEach((line: string) => {
        doc.text(line, x, currentY);
        currentY += lineHeight;
      });
    }

    return currentY;
  };
  
  const gerarPdfPadronizado = () => {
    if (!currentPlanejamento) {
      setError("Não há um plano de aula para ser exportado.");
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

          doc.setFont('helvetica', 'normal');
          currentY = processTextAndImages(doc, fieldText, margin, currentY, bodyWidth, lineHeight);
          currentY += lineHeight * 0.5;
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

      doc.setFontSize(pFontSize);
      doc.setTextColor(80, 80, 80);
      currentY = processTextAndImages(doc, currentPlanejamento.observacoesIA, margin, currentY, bodyWidth, lineHeight);
      currentY += lineHeight;
    }

    const fileName = currentPlanejamento?.tituloAula ? `${currentPlanejamento.tituloAula.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf` : 'plano_de_aula_padronizado.pdf';
    doc.save(fileName);
  };
  
  const processarImagem = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const gerarApresentacao = async () => {
    if (!currentPlanejamento) {
      setError("Não há um plano de aula para ser exportado como apresentação.");
      return;
    }

    const doc = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = doc.internal.pageSize.getWidth();
  
    const margin = 20;
    const lineHeight = 7;

    doc.setFont('helvetica');

    const imageUrls = await Promise.all(uploadedImages.map(processarImagem));

    const addImageToSlide = (doc: jsPDF, imgData: string, yPosition: number, scaleFactor = 0.5) => {
        const img = new Image();
        img.src = imgData;
        const imgAspectRatio = img.width / img.height;
        const imgWidth = (pdfWidth - 2 * margin) * scaleFactor;
        const imgHeight = imgWidth / imgAspectRatio;
        const xPosition = margin + (pdfWidth - 2 * margin - imgWidth) / 2;
        doc.addImage(imgData, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
        return yPosition + imgHeight + 10;
    };
    
    // Slide 1: Título e Imagem (Layout 1)
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(currentPlanejamento.tituloAula, pdfWidth / 2, 40, { align: 'center' });
    if (imageUrls[0]) {
      addImageToSlide(doc, imageUrls[0], 60, 0.8);
    }
    doc.addPage();

    // Slide 2: Imagem, Título e Texto (Layout 2) - Ativação
    let currentY = 30;
    if (imageUrls[1]) {
      currentY = addImageToSlide(doc, imageUrls[1], currentY, 0.4);
    }
    doc.setFontSize(20);
    doc.setTextColor(50, 50, 50);
    doc.text(currentPlanejamento.ativacao.titulo, margin, currentY);
    currentY += 10;
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    currentY = processTextAndImages(doc, `**Pergunta inicial:** "${currentPlanejamento.ativacao.pergunta_inicial}"\n\n**Atividade:**\n${currentPlanejamento.ativacao.atividade}`, margin, currentY, pdfWidth - 2 * margin, lineHeight);
    doc.addPage();

    // Slide 3: Imagem, Título e 2 Tópicos (Layout 3) - Problema Real
    currentY = 30;
    if (imageUrls[2]) {
      currentY = addImageToSlide(doc, imageUrls[2], currentY, 0.4);
    }
    doc.setFontSize(20);
    doc.setTextColor(50, 50, 50);
    doc.text(currentPlanejamento.problema_real.titulo, margin, currentY);
    currentY += 15;
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    
    doc.setFont('helvetica', 'bold');
    doc.text("Cenário:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    currentY = processTextAndImages(doc, currentPlanejamento.problema_real.cenario, margin + 2, currentY + 7, pdfWidth - 2 * margin, lineHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.text("Pergunta problema:", margin, currentY);
    doc.setFont('helvetica', 'normal');
    currentY = processTextAndImages(doc, `"${currentPlanejamento.problema_real.pergunta_problema}"`, margin + 2, currentY + 7, pdfWidth - 2 * margin, lineHeight);
    
    doc.addPage();

    // Slide 4: Título, 3 Tópicos (Layout 4) - Investigação
    currentY = 30;
    doc.setFontSize(20);
    doc.setTextColor(50, 50, 50);
    doc.text(currentPlanejamento.investigacao.titulo, margin, currentY);
    currentY += 15;
    
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    
    const perguntasGuiadas = currentPlanejamento.investigacao.perguntas_guiadas.split('\n').filter(p => p.trim() !== '');
    perguntasGuiadas.slice(0, 3).forEach((pergunta, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`Tópico ${idx + 1}:`, margin, currentY);
        doc.setFont('helvetica', 'normal');
        currentY = processTextAndImages(doc, pergunta, margin + 2, currentY + 7, pdfWidth - 2 * margin, lineHeight);
        currentY += 5;
    });
    doc.addPage();

    // Slide 5: Texto (Layout 5) - Solução Prática
    currentY = 30;
    doc.setFontSize(20);
    doc.setTextColor(50, 50, 50);
    doc.text(currentPlanejamento.solucao_pratica.titulo, margin, currentY);
    currentY += 15;
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    currentY = processTextAndImages(doc, currentPlanejamento.solucao_pratica.descricao, margin, currentY, pdfWidth - 2 * margin, lineHeight);
    doc.addPage();

    // Slide 6: Imagem, Título e Texto (Layout 6) - Mini Projeto
    currentY = 30;
    if (imageUrls[3]) {
      currentY = addImageToSlide(doc, imageUrls[3], currentY, 0.5);
    }
    doc.setFontSize(20);
    doc.setTextColor(50, 50, 50);
    doc.text(currentPlanejamento.mini_projeto.titulo, margin, currentY);
    currentY += 15;
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    currentY = processTextAndImages(doc, currentPlanejamento.mini_projeto.desafio, margin, currentY, pdfWidth - 2 * margin, lineHeight);
    doc.addPage();

    // Slide 7: Imagem, Título e Texto (Layout 7) - Observações (opcional)
    if (currentPlanejamento.observacoesIA) {
      currentY = 30;
      if (imageUrls[4]) {
        currentY = addImageToSlide(doc, imageUrls[4], currentY, 0.5);
      }
      doc.setFontSize(20);
      doc.setTextColor(50, 50, 50);
      doc.text("Observações da IA", margin, currentY);
      currentY += 15;
      doc.setFontSize(14);
      doc.setTextColor(80, 80, 80);
      currentY = processTextAndImages(doc, currentPlanejamento.observacoesIA, margin, currentY, pdfWidth - 2 * margin, lineHeight);
      doc.addPage();
    }
    
    if (currentPlanejamento.sugestaoAulasCSV && currentPlanejamento.sugestaoAulasCSV.length > 0) {
        let currentY = 30;
        doc.setFontSize(20);
        doc.setTextColor(50, 50, 50);
        doc.text("Aulas do Currículo que se Adequam", margin, currentY);
        currentY += 15;

        currentPlanejamento.sugestaoAulasCSV.forEach((sugestao) => {
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(`Aula ${sugestao.idAula}:`, margin, currentY);
            doc.setFont('helvetica', 'normal');
            doc.text(`${sugestao.temaAula}`, margin + 20, currentY);
            currentY += 7;
            
            doc.setFontSize(11);
            doc.text(`Justificativa: ${sugestao.justificativa}`, margin, currentY);
            currentY += 10;
        });
    }

    const fileName = currentPlanejamento?.tituloAula ? `${currentPlanejamento.tituloAula.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_apresentacao.pdf` : 'plano_de_aula_apresentacao.pdf';
    doc.save(fileName);
  };

  const handlePlanejamentoChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    section: keyof Planejamento | 'tituloAula',
    field?: string
  ) => {
    if (editedPlanejamento) {
      setEditedPlanejamento(prev => {
        if (!prev) return null;
        const newPlan = { ...prev };

        if (section === 'tituloAula') {
          newPlan.tituloAula = e.target.value;
        } else if (field) {
          if (typeof newPlan[section] === 'object' && newPlan[section] !== null) {
            (newPlan[section] as any)[field] = e.target.value;
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

    setIsGenerating(true);
    setPlanejamento(null);
    setEditedPlanejamento(null);
    setIsEditMode(false);
    setError(null);

    try {
      const response = await fetch('https://site-pd.onrender.com/gemini/generate-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: demanda }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Algo deu errado no servidor backend.');
      }

      const data = await response.json();

      if (data.rawText) {
        setError(
          `Recebido texto puro da IA. O formato JSON esperado não foi retornado.
          Por favor, refine seu prompt para que a IA gere um JSON válido.
          Resposta bruta: ${data.rawText.substring(0, 500)}...`
        );
        setPlanejamento(null);
      } else {
        setPlanejamento(data);
        setEditedPlanejamento(data);
      }
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
          onChange={(e) => handlePlanejamentoChange(e, section, field)}
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
                placeholder="Ex: Ensinar o conceito de modais em Bootstrap para iniciantes..."
                value={demanda}
                onChange={(e) => setDemanda(e.target.value)}
                className="textarea"
                disabled={shouldBlockMainInteractions}
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
                <label className="flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                    <UploadCloud size={16} />
                    Carregar Imagens
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" accept="image/*" />
                </label>
                {uploadedImages.length > 0 && (
                    <span className="text-sm text-gray-500">{uploadedImages.length} imagem(ns) carregada(s)</span>
                )}
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
                    onClick={gerarApresentacao}
                    className="save-button"
                    disabled={!planejamento || isEditMode}
                    title="Exportar como Apresentação"
                  >
                    <Presentation style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Apresentação
                  </button>
                  {!isEditMode ? (
                    <button
                      onClick={toggleEditMode}
                      className="edit-button"
                      disabled={!planejamento}
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
                        <XCircle style={{ width: '16px', height: '16px', marginRight: '4px' }} /> Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-col gap-4">
                <div className="flex-col gap-2">
                  <h3 className="section-title">{currentPlanejamento.ativacao.titulo}</h3>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.ativacao.metodologia}</p>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Pergunta inicial:</span> "{currentPlanejamento.ativacao.pergunta_inicial}"</p>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Atividade:</span></p>
                  {renderEditableText(currentPlanejamento.ativacao.atividade, 'ativacao', 'atividade', true)}
                </div>
                <hr className="divider" />
                <div className="flex-col gap-2">
                  <h3 className="section-title">{currentPlanejamento.problema_real.titulo}</h3>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.problema_real.metodologia}</p>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Cenário:</span></p>
                  {renderEditableText(currentPlanejamento.problema_real.cenario, 'problema_real', 'cenario')}
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Pergunta problema:</span> "{currentPlanejamento.problema_real.pergunta_problema}"</p>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Importância:</span></p>
                  {renderEditableText(currentPlanejamento.problema_real.importancia, 'problema_real', 'importancia', true)}
                </div>
                <hr className="divider" />
                <div className="flex-col gap-2">
                  <h3 className="section-title">{currentPlanejamento.investigacao.titulo}</h3>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.investigacao.metodologia}</p>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Perguntas guiadas:</span></p>
                  {renderEditableText(currentPlanejamento.investigacao.perguntas_guiadas, 'investigacao', 'perguntas_guiadas', true)}
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Elementos descobertos:</span></p>
                  {renderEditableText(currentPlanejamento.investigacao.elementos_descobertos, 'investigacao', 'elementos_descobertos', true)}
                </div>
                <hr className="divider" />
                <div className="flex-col gap-2">
                  <h3 className="section-title">{currentPlanejamento.solucao_pratica.titulo}</h3>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.solucao_pratica.metodologia}</p>
                  {renderCodeBlock(currentPlanejamento.solucao_pratica.descricao, 'solucao_pratica', 'descricao')}
                </div>
                <hr className="divider" />
                <div className="flex-col gap-2">
                  <h3 className="section-title">{currentPlanejamento.mini_projeto.titulo}</h3>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Metodologia:</span> {currentPlanejamento.mini_projeto.metodologia}</p>
                  <p className="text-content"><span style={{ fontWeight: 600 }}>Desafio:</span></p>
                  {renderEditableText(currentPlanejamento.mini_projeto.desafio, 'mini_projeto', 'desafio', true)}
                </div>

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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LessonPlanCard;