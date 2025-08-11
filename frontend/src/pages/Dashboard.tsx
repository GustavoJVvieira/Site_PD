import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import './Dashboard.css';
import Header from './Header';
import LessonPlanCard from './LessonPlanCard';
import BridgeSteps from './BridgeSteps';
import ChatSidebar from './ChatSideBar';

// ===================================
// INTERFACE INTEGRADA
// ===================================
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
// ===================================
// FIM DA INTERFACE INTEGRADA
// ===================================

// Componente para lidar com a lógica e exibição do chat
const ChatContainer: React.FC<{
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  planejamento: Planejamento | null;
  editedPlanejamento: Planejamento | null;
  isEditMode: boolean;
  isGenerating: boolean;
  setError: (error: string | null) => void;
  handleApplyLessonPlanFromChat: (aiPlan: Planejamento) => void;
}> = ({
  isChatOpen,
  setIsChatOpen,
  planejamento,
  editedPlanejamento,
  isEditMode,
  isGenerating,
  setError,
  handleApplyLessonPlanFromChat,
}) => {
  const isChatDisabled = isGenerating || isEditMode || !planejamento;

  const handleChatCardClick = () => {
    if (isChatDisabled) {
      setError("Por favor, gere um plano de aula antes de usar o chat.");
      return;
    }
    setIsChatOpen(true);
    setError(null);
  };

  return (
    <AnimatePresence mode="wait">
      {isChatOpen ? (
        <motion.div
          key="chat-view"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          className="card flex-grow chat-view-container"
        >
          <ChatSidebar
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            currentLessonPlan={isEditMode && editedPlanejamento ? editedPlanejamento : planejamento}
            onApplyLessonPlan={handleApplyLessonPlanFromChat}
            onError={setError}
            isEditMode={isEditMode}
          />
        </motion.div>
      ) : (
        <motion.div
          key="chat-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card chat-card-entry"
          onClick={handleChatCardClick}
          style={{ cursor: isChatDisabled ? 'not-allowed' : 'pointer' }}
        >
          <div className="card-title-group">
            <MessageSquare style={{ width: '20px', height: '20px', color: '#6b46c1' }} />
            Conversar com a IA
          </div>
          <div className="card-description">
            Faça perguntas, peça revisões ou explore novas ideias para sua aula.
          </div>
          {!planejamento && (
            <p className="hint-message">Gere um plano de aula primeiro para ativar o chat!</p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Dashboard: React.FC = () => {
  const [demanda, setDemanda] = useState<string>('');
  const [planejamento, setPlanejamento] = useState<Planejamento | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedPlanejamento, setEditedPlanejamento] = useState<Planejamento | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Sincroniza editedPlanejamento com planejamento quando planejamento é atualizado
  useEffect(() => {
    if (planejamento) {
      setEditedPlanejamento(JSON.parse(JSON.stringify(planejamento)));
    }
  }, [planejamento]);

  const handleApplyLessonPlanFromChat = (aiPlan: Planejamento) => {
    setPlanejamento(aiPlan);
    // Não é necessário setEditedPlanejamento aqui, o useEffect fará isso
    setIsEditMode(false);
    setError(null);
    setIsChatOpen(false);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="main-content-grid">
        <LessonPlanCard
          demanda={demanda}
          setDemanda={setDemanda}
          planejamento={planejamento}
          setPlanejamento={setPlanejamento}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          error={error}
          setError={setError}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          editedPlanejamento={editedPlanejamento}
          setEditedPlanejamento={setEditedPlanejamento}
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="right-column"
        >
          <BridgeSteps openAccordion={openAccordion} setOpenAccordion={setOpenAccordion} />
          <ChatContainer
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            planejamento={planejamento}
            editedPlanejamento={editedPlanejamento}
            isEditMode={isEditMode}
            isGenerating={isGenerating}
            setError={setError}
            handleApplyLessonPlanFromChat={handleApplyLessonPlanFromChat}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;