import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import './ChatSideBar.css';

// ===================================
// INTERFACES E DADOS MOCKADOS INTEGRADOS
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
// ===================================
// FIM DAS INTERFACES E MOCKADOS INTEGRADOS
// ===================================

// Interface para as mensagens do chat, aprimorada para tipagem segura
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  isApplying?: boolean;
}

// Interface para as props do componente ChatSidebar
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

    // LÓGICA DE MOCK APRIMORADA
    if (userMessage.toUpperCase().includes("MOCK PLANO")) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, { sender: 'ai', text: 'Entendi! Tenho uma sugestão de plano atualizado para você:', isApplying: true }]);
      setAiGeneratedPlan(mockPlanejamento);
      setIsChatting(false);
      return;
    }
    
    if (userMessage.toUpperCase().includes("MOCK TEXTO")) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, { sender: 'ai', text: "Resposta de texto simulada." }]);
      setIsChatting(false);
      return;
    }

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