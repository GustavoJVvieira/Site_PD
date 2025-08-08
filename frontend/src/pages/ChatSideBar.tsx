import React, { useState } from 'react';
import {  Send, ArrowLeft } from 'lucide-react'; // Importe ArrowLeft para o botão de voltar
import type { Planejamento } from '../types/planejamento'; 
import './ChatSideBar.css';
interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void; // Função para fechar o chat (voltar ao plano)
  currentLessonPlan: Planejamento | null;
  onApplyLessonPlan: (plan: Planejamento) => void;
  onError: (message: string) => void;
  isEditMode: boolean; // Para desabilitar inputs do chat se o plano principal estiver em edição
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  currentLessonPlan,
  onApplyLessonPlan,
  onError,
  isEditMode,
}) => {
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; isApplying?: boolean }[]>([]);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState<Planejamento | null>(null);


  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatting || !currentLessonPlan) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setIsChatting(true);
    setAiGeneratedPlan(null); // Limpa o plano gerado anteriormente

    try {
      const prompt = `
        Com base no plano de aula atual em JSON (abaixo), responda à pergunta do usuário.
        Se a pergunta for um pedido de ALTERAÇÃO ou MELHORIA do plano, gere o JSON COMPLETO E ATUALIZADO do plano de aula, mantendo a estrutura EXATA.
        Se for apenas uma pergunta, responda em texto simples.

        Plano de Aula Atual (JSON):
        \`\`\`json
        ${JSON.stringify(currentLessonPlan, null, 2)}
        \`\`\`

        Pergunta do Usuário: "${userMessage}"

        Sua resposta DEVE ser:
        - OU um objeto JSON completo (se for uma alteração do plano).
        - OU um texto simples (se for uma resposta à pergunta).
        NUNCA inclua texto introdutório ou conclusivo FORA do JSON se for JSON.
        Se for JSON, inclua apenas o JSON.
      `.trim();

      const response = await fetch('http://localhost:3000/gemini/chat-with-lesson-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao conversar com a IA.');
      }

      const data = await response.json();

      if (data.rawText) {
        // AI respondeu com texto
        setMessages(prev => [...prev, { sender: 'ai', text: data.rawText }]);
      } else if (data.updatedPlan) {
        // AI respondeu com um plano atualizado
        setMessages(prev => [...prev, { sender: 'ai', text: 'Entendi! Tenho uma sugestão de plano atualizado para você:', isApplying: true }]);
        setAiGeneratedPlan(data.updatedPlan);
      } else {
        // Caso a resposta não seja nem rawText nem updatedPlan (erro inesperado)
        setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, não consegui processar a resposta da IA como esperado.' }]);
      }

    } catch (err: any) {
      console.error('Erro na comunicação com o chat da IA:', err);
      setMessages(prev => [...prev, { sender: 'ai', text: `Ops! Algo deu errado: ${err.message}` }]);
      onError(err.message || 'Falha ao conversar com a IA. Tente novamente.');
    } finally {
      setIsChatting(false);
    }
  };

  const handleApplyAiPlan = () => {
    if (aiGeneratedPlan) {
      onApplyLessonPlan(aiGeneratedPlan);
      setAiGeneratedPlan(null); // Limpa o plano depois de aplicado
      // onClose(); // Opcional: fechar o chat após aplicar o plano
    }
  };

  if (!isOpen) { // Se não estiver aberto, não renderiza nada
    return null;
  }

  return (
    // Removi as props de animação do motion.div aqui, elas ficam no pai (Dashboard)
    <div className="chat-main-view"> {/* Nova classe, remova "chat-sidebar" */}
      <div className="chat-header">
        <h2>Chat com a IA</h2>
        {/* Botão para voltar ao plano, mudando o ícone para uma seta */}
        <button className="close-chat-button" onClick={onClose}>
          <ArrowLeft size={24} /> {/* Ícone de seta para a esquerda */}
        </button>
      </div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-welcome-message">
            Olá! Eu sou sua IA assistente. O que você gostaria de discutir sobre o plano de aula?
            Posso te ajudar a refinar ideias, adicionar detalhes, ou até mesmo fazer sugestões de melhorias.
          </p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.sender}`}>
            {msg.text}
            {msg.isApplying && aiGeneratedPlan && (
              <button
                className="apply-ai-plan-button"
                onClick={handleApplyAiPlan}
                disabled={isChatting || isEditMode} // Desabilita se estiver em chat ou editando
              >
                Aplicar este Plano
              </button>
            )}
          </div>
        ))}
        {isChatting && (
          <div className="message-bubble ai thinking">
            <div className="dot-pulse"></div>
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <textarea
          placeholder="Digite sua mensagem ou pedido..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="chat-textarea"
          disabled={isChatting || isEditMode}
        />
        <button onClick={handleSendMessage} disabled={isChatting || !chatInput.trim() || isEditMode} className="send-button">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;