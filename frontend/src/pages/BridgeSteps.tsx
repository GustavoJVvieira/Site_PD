import React from 'react';
import { BookOpen, Target, Search, Play, Lightbulb } from 'lucide-react';

interface BridgeStep {
  letter: string;
  title: string;
  time: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

interface BridgeStepsProps {
  openAccordion: string | null;
  setOpenAccordion: React.Dispatch<React.SetStateAction<string | null>>;
}

const BridgeSteps: React.FC<BridgeStepsProps> = ({ openAccordion, setOpenAccordion }) => {
  const bridgeSteps: BridgeStep[] = [
    { letter: 'B', title: 'Bridge (Conectar)', time: '2 min', icon: BookOpen, color: '#9b59b6', description: 'Conecte o novo conteúdo com o conhecimento prévio do estudante.' },
    { letter: 'R', title: 'Real (Problema Real)', time: '3 min', icon: Target, color: '#8e44ad', description: 'Apresente um problema real ou desafio contextualizado.' },
    { letter: 'I', title: 'Investigar', time: '4 min', icon: Search, color: '#6b46c1', description: 'Gere perguntas investigativas que levem à exploração.' },
    { letter: 'D', title: 'Demonstrar', time: '4 min', icon: Play, color: '#5d3fd3', description: 'Descreva uma aplicação prática do conteúdo.' },
    { letter: 'G', title: 'Gerar', time: '2 min', icon: Lightbulb, color: '#4a2c9b', description: 'Proponha um mini-desafio prático rápido.' },
  ];

  return (
    <div className="card">
      <div className="card-title-group">
        Método de Ensino
      </div>
      <div className="card-description">
        5 etapas para aulas transformadoras
      </div>
      {bridgeSteps.map((step, index) => (
        <div key={step.letter}>
          <div
            className="accordion-item"
            onClick={() => setOpenAccordion(openAccordion === `item-${index}` ? null : `item-${index}`)}
            style={{ borderBottom: index === bridgeSteps.length - 1 ? 'none' : undefined }}
          >
            <div className="accordion-letter" style={{ background: step.color }}>
              {step.letter}
            </div>
            <div className="accordion-title">{step.title}</div>
            <div className="accordion-time">{step.time}</div>
          </div>
          <div className={`accordion-content ${openAccordion === `item-${index}` ? 'active' : ''}`}>
            {step.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BridgeSteps;