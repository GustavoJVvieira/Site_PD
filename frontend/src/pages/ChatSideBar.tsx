import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
// Importação dos tipos e do mock centralizado
import type { Planejamento } from './types';
import { mockPlanejamento } from './types';
import './ChatSideBar.css';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  isApplying?: boolean;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonPlan: Planejamento | null;
  onApplyLessonPlan: (plan: Planejamento) => void;
  onError: (message: string) => void;
  isEditMode: boolean;
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState<boolean>(false);
  const [aiGeneratedPlan, setAiGeneratedPlan] = useState<Planejamento | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || isChatting || !currentLessonPlan) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setIsChatting(true);
    setAiGeneratedPlan(null);

    // ===================================
    // LÓGICA DE MOCK APRIMORADA, USANDO O OBJETO IMPORTADO
    // ===================================
    if (userMessage.toUpperCase().includes("MOCK PLANO")) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, { sender: 'ai', text: 'Entendi! Tenho uma sugestão de plano atualizado para você:', isApplying: true }]);
      setAiGeneratedPlan(mockPlanejamento);
      setIsChatting(false);
      return;
    }
    
    // Removendo o mock de texto, pois o `mockPlanejamento` já está definido.
    // O mock de texto pode ser mantido se for útil para testes específicos.
    // Caso contrário, a lógica da API real pode lidar com isso.
    if (userMessage.toUpperCase().includes("MOCK TEXTO")) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, { sender: 'ai', text: "Resposta de texto simulada." }]);
      setIsChatting(false);
      return;
    }
    // ===================================
    // FIM DA LÓGICA DE MOCK APRIMORADA
    // ===================================

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

      const response = await fetch('https://site-pd.onrender.com/gemini/chat-with-lesson-plan', {
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
        setMessages(prev => [...prev, { sender: 'ai', text: data.rawText }]);
      } else if (data.updatedPlan) {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Entendi! Tenho uma sugestão de plano atualizado para você:', isApplying: true }]);
        setAiGeneratedPlan(data.updatedPlan);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Desculpe, não consegui processar a resposta da IA como esperado.' }]);
      }

    } catch (err: any) {
      console.error('Erro na comunicação com o chat da IA:', err);
      setMessages(prev => [...prev, { sender: 'ai', text: `Ops! Algo deu errado: ${err.message || 'Falha na comunicação.'}` }]);
      onError(err.message || 'Falha ao conversar com a IA. Tente novamente.');
    } finally {
      setIsChatting(false);
    }
  }, [chatInput, isChatting, currentLessonPlan, onError]);

  const handleApplyAiPlan = useCallback(() => {
    if (aiGeneratedPlan) {
      onApplyLessonPlan(aiGeneratedPlan);
      setAiGeneratedPlan(null);
    }
  }, [aiGeneratedPlan, onApplyLessonPlan]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="chat-main-view">
      <div className="chat-header">
        <h2>Chat com a IA</h2>
        <button className="close-chat-button" onClick={onClose} aria-label="Fechar chat">
          <ArrowLeft size={24} />
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
                disabled={isChatting || isEditMode}
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
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          placeholder="Digite sua mensagem ou pedido..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="chat-textarea"
          disabled={isChatting || isEditMode}
          aria-label="Entrada do chat"
        />
        <button
          onClick={handleSendMessage}
          disabled={isChatting || !chatInput.trim() || isEditMode}
          className="send-button"
          aria-label="Enviar mensagem"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatSidebar;