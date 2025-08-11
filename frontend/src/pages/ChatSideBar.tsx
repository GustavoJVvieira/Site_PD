import React, { useState } from 'react';
import {  Send, ArrowLeft } from 'lucide-react';
import type { Planejamento } from './types'; 
import './ChatSideBar.css';

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonPlan: Planejamento | null;
  onApplyLessonPlan: (plan: Planejamento) => void;
  onError: (message: string) => void;
  isEditMode: boolean;
}

// ===================================
// INÍCIO DO CÓDIGO MOCADO
// ===================================
const MOCKED_UPDATED_PLAN: Planejamento = {
  tituloAula: "Introdução à Programação com JavaScript - Versão Melhorada",
  ativacao: {
    titulo: "Ativação: O que é um 'bug' e como evitá-los?",
    metodologia: "Tempestade de ideias digital",
    pergunta_inicial: "Além dos bugs em jogos, onde mais podemos encontrar 'erros' no dia a dia?",
    atividade: "Vamos usar um quadro online (como o Miro) para criar um mapa mental de 'bugs' e suas soluções."
  },
  problema_real: {
    titulo: "Problema Real: Criando um App de Tarefas",
    metodologia: "Aprendizagem baseada em problemas",
    cenario: "A equipe de marketing precisa de uma maneira simples de gerenciar as tarefas diárias, e a solução atual com planilhas é ineficiente. Eles pedem sua ajuda para criar um aplicativo simples.",
    pergunta_problema: "Como podemos criar um aplicativo web que permita adicionar, editar e remover tarefas de forma fácil e intuitiva, mesmo com pouca experiência em programação?",
    importancia: "Essa é uma demanda comum em muitas empresas e um excelente primeiro passo para entender como a programação resolve problemas do dia a dia."
  },
  investigacao: {
    titulo: "Investigação: Os Blocos de Construção do JavaScript",
    metodologia: "Exploração guiada e hands-on",
    perguntas_guiadas: "O que são variáveis? Como guardamos informações nelas? O que são funções e como elas nos ajudam a organizar o código?",
    elementos_descobertos: "Variáveis (let, const), Tipos de Dados (string, number, boolean), Funções e Eventos do DOM."
  },
  solucao_pratica: {
    titulo: "Solução Prática: O Primeiro Código",
    metodologia: "Programação pareada",
    descricao: "Em duplas, os alunos criarão a estrutura HTML básica e, com a ajuda do professor, vão escrever o primeiro trecho de código JavaScript para adicionar uma nova tarefa à lista, usando as variáveis e funções descobertas."
  },
  mini_projeto: {
    titulo: "Mini Projeto: Finalizando o App",
    metodologia: "Trabalho individual e apresentação",
    desafio: "Individualmente, cada aluno irá refinar o aplicativo de tarefas, implementando as funcionalidades de 'marcar como concluída' e 'remover' uma tarefa. Ao final, cada um apresenta seu trabalho."
  },
  observacoesIA: "Este plano de aula foi aprimorado com uma metodologia mais interativa na etapa de ativação, visando maior engajamento dos alunos.",
};
const MOCKED_TEXT_RESPONSE = "A Aprendizagem Baseada em Problemas (ABP) é uma metodologia de ensino onde o aprendizado acontece através da resolução de problemas complexos e significativos.";
// ===================================
// FIM DO CÓDIGO MOCADO
// ===================================

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
    setAiGeneratedPlan(null);

    // ===================================
    // LÓGICA DE MOCK DO CHAT
    // ===================================
    // Verifica se a mensagem do usuário é para mockar uma resposta
    if (userMessage.toUpperCase().includes("MOCK PLANO")) {
      // Simula um tempo de resposta da IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, { sender: 'ai', text: 'Entendi! Tenho uma sugestão de plano atualizado para você:', isApplying: true }]);
      setAiGeneratedPlan(MOCKED_UPDATED_PLAN);
      setIsChatting(false);
      return; // Sai da função para não chamar a API real
    }
    
    if (userMessage.toUpperCase().includes("MOCK TEXTO")) {
      // Simula um tempo de resposta da IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, { sender: 'ai', text: MOCKED_TEXT_RESPONSE }]);
      setIsChatting(false);
      return; // Sai da função para não chamar a API real
    }
    // ===================================
    // FIM DA LÓGICA DE MOCK DO CHAT
    // ===================================

    // Código original para chamada da API
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
      setMessages(prev => [...prev, { sender: 'ai', text: `Ops! Algo deu errado: ${err.message}` }]);
      onError(err.message || 'Falha ao conversar com a IA. Tente novamente.');
    } finally {
      setIsChatting(false);
    }
  };

  const handleApplyAiPlan = () => {
    if (aiGeneratedPlan) {
      onApplyLessonPlan(aiGeneratedPlan);
      setAiGeneratedPlan(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="chat-main-view">
      <div className="chat-header">
        <h2>Chat com a IA</h2>
        <button className="close-chat-button" onClick={onClose}>
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