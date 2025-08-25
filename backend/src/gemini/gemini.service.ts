import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { AulaCurriculoService } from '../aula-curriculo/aula-curriculo.service';
import { AulaCurriculoEntity } from '../aula-curriculo/aula-curriculo.entity';

// Interface para o plano de aula
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

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly logger = new Logger(GeminiService.name);

  private readonly model_priority = [
    "gemini-1.5-pro-latest", // Priorizar modelos mais estáveis
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-2.5-pro", // Movido para o final devido a problemas de resposta vazia
  ];

  constructor(
    private configService: ConfigService,
    private aulaCurriculoService: AulaCurriculoService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY não definida nas variáveis de ambiente.');
      throw new InternalServerErrorException('Chave de API do Gemini não configurada.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateLessonPlan(prompt: string): Promise<Planejamento> {
    let lastError: any = null;

    const aulasCurriculoEntities: AulaCurriculoEntity[] = await this.aulaCurriculoService.findAllAulas();
    const aulasCurriculoContext = this.aulaCurriculoService.formatAulasForPrompt(aulasCurriculoEntities);

    const fullPromptWithCurriculumContext = `
      Você é um especialista em design instrucional, atuando como autor de conteúdo para estudantes do ensino médio, técnico ou profissionalizante.
      Sua missão é transformar a demanda do professor (Tema: "${prompt}") em um conteúdo didático completo com base no método BRIDGE, falando diretamente COM O ESTUDANTE.

      ---
      **Aulas do Currículo Existente (para referência e sugestão de adequação):**
      ${aulasCurriculoContext}
      ---

      Com base na demanda do professor (Tema: "${prompt}") e nas aulas do currículo acima, faça o seguinte:
      1. Gere o conteúdo didático completo usando o método BRIDGE, falando diretamente COM O ESTUDANTE, com linguagem clara, engajante e motivadora.
      2. **IDENTIFIQUE A(S) AULA(S) DO "CURRÍCULO EXISTENTE" QUE MAIS SE ADEQUA(M) OU COMPLEMENTA(M) O TEMA PROPOSTO PELO PROFESSOR.**
          Para cada aula sugerida, preencha o array "sugestaoAulasCSV" com objetos contendo:
          - "idAula": O ID exato da aula do currículo (ex: "Aula 01", "Aula 45").
          - "temaAula": O tema exato da aula do currículo (ex: "O que é lógica de programação?").
          - "justificativa": Uma justificativa clara e concisa (1-2 frases) do porquê essa aula se adequa ou complementa o tema.
          **Priorize a identificação de pelo menos uma aula que se encaixe.** Se não houver nenhuma, retorne um array vazio \`[]\`.
      3. No campo "observacoesIA", forneça uma observação geral sobre o plano gerado em relação ao currículo. Se o currículo fornecido estava vazio ou incompleto (ex: apenas IDs e temas, sem detalhes ricos), mencione isso aqui.

      Detalhes para a geração de cada momento do método BRIDGE, falando diretamente COM O ESTUDANTE, com linguagem clara, engajante e motivadora:
      - **Ativação (Bridge):** Crie uma pergunta inicial e uma atividade que conecte o tema ao conhecimento prévio do estudante. O objetivo é despertar a curiosidade.
      - **Problema Real (Real):** Apresente um cenário ou problema do mundo real que o estudante possa relacionar, mostrando a relevância do tema. Inclua uma pergunta-problema e a importância de resolver esse problema.
      - **Investigação (Investigate):** Formule perguntas guiadas que incentivem o estudante a explorar e descobrir o conteúdo por si mesmo. Sugira elementos que ele deve descobrir.
      - **Solução Prática (Demonstrate):** Descreva uma aplicação prática ou um pequeno experimento/demonstração que o estudante possa fazer para ver o conteúdo em ação. Se for código, inclua um bloco de código.
      - **Mini Projeto (Generate):** Proponha um desafio rápido e prático onde o estudante possa aplicar o que aprendeu, gerando algo concreto.

      ---
      **INSTRUÇÃO FINAL E CRÍTICA:**
      SUA RESPOSTA DEVE SER APENAS O OBJETO JSON VÁLIDO.
      POR FAVOR, ENVOLVA O JSON DENTRO DE UM BLOCO DE CÓDIGO MARKDOWN (\`\`\`json...\`\`\`).
      NÃO INCLUA NENHUM OUTRO TEXTO OU EXPLICAÇÃO ADICIONAL ANTES OU DEPOIS DO BLOCO DE CÓDIGO.
      APENAS O BLOCO DE CÓDIGO COM O JSON.
    `.trim();

    for (const modelName of this.model_priority) {
      try {
        this.logger.log(`Tentando gerar conteúdo com o modelo: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: fullPromptWithCurriculumContext }] }],
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        });

        const response = await result.response;
        let text = response.text().trim();

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        let jsonString: string;

        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1].trim();
          this.logger.debug(`JSON extraído com sucesso do bloco de código. (modelo: ${modelName})`);
        } else {
          jsonString = text;
          this.logger.debug(`Não foi encontrado um bloco de código. Tentando parsear o texto completo. (modelo: ${modelName})`);
        }

        const parsedResponse: Planejamento = JSON.parse(jsonString);
        this.logger.log(`Conteúdo gerado com sucesso pelo modelo: ${modelName}`);
        return parsedResponse;

      } catch (error: any) {
        lastError = error;
        if (error instanceof SyntaxError && 'input' in error) {
          this.logger.error(`Erro de JSON.parse no modelo ${modelName}. Resposta bruta da IA: \n---\n${error.input}\n---`);
        }
        this.logger.warn(`Falha ao usar o modelo ${modelName}: ${error.message}. Tentando o próximo...`);
      }
    }

    this.logger.error(`Todos os modelos na lista de prioridade falharam. Último erro: ${lastError?.message}`, lastError?.stack);
    if (lastError && lastError.message.includes('503 Service Unavailable')) {
      throw new InternalServerErrorException('No momento, os modelos de IA estão sobrecarregados. Por favor, tente novamente mais tarde.');
    } else if (lastError && lastError.message.includes('404 Not Found')) {
      throw new InternalServerErrorException('Não foi possível encontrar um modelo de IA disponível para a geração de conteúdo.');
    }
    throw new InternalServerErrorException('Falha ao gerar o plano de aula da IA após múltiplas tentativas. Verifique os logs para mais detalhes.');
  }

  async chatWithLessonPlan(prompt: string): Promise<{ updatedPlan?: Planejamento; rawText?: string }> {
    let lastError: any = null;

    for (const modelName of this.model_priority) {
      try {
        this.logger.log(`Tentando conversar com o modelo: ${modelName}`);
        const model = this.genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
        });
        const response = await result.response;

        // Log detalhado da resposta do modelo
        console.log('--- Detalhes da Resposta do Modelo ---');
        console.log('Candidates:', JSON.stringify(response.candidates, null, 2));
        console.log('Prompt Feedback:', JSON.stringify(response.promptFeedback, null, 2));
        console.log('Finish Reason:', response.candidates[0]?.finishReason || 'N/A');
        
        let text = response.text().trim();
        console.log('--- Resposta bruta da IA (Chat) ---');
        console.log(text);
        console.log('------------------------------------');

        // Verificar se a resposta é vazia
        if (!text) {
          this.logger.warn(`Resposta vazia do modelo ${modelName}. Tentando próximo modelo.`);
          continue;
        }

        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        let jsonString: string;

        if (jsonMatch && jsonMatch[1]) {
          jsonString = jsonMatch[1].trim();
          this.logger.debug(`JSON extraído com sucesso do bloco de código. (modelo: ${modelName})`);
        } else {
          jsonString = text;
          this.logger.debug(`Não foi encontrado um bloco de código. Usando texto completo. (modelo: ${modelName})`);
        }

        try {
          const parsedJson = JSON.parse(jsonString);
          if (
            typeof parsedJson === 'object' && parsedJson !== null &&
            'slides' in parsedJson && Array.isArray(parsedJson.slides)
          ) {
            this.logger.log(`Plano de slides gerado com sucesso pelo modelo: ${modelName}`);
            return { rawText: text };
          } else if (
            typeof parsedJson === 'object' && parsedJson !== null &&
            'tituloAula' in parsedJson && 'ativacao' in parsedJson &&
            'problema_real' in parsedJson && 'investigacao' in parsedJson &&
            'solucao_pratica' in parsedJson && 'mini_projeto' in parsedJson
          ) {
            this.logger.log(`Plano de aula atualizado recebido do modelo: ${modelName}`);
            return { updatedPlan: parsedJson as Planejamento };
          } else {
            this.logger.warn(`Resposta JSON não contém slides ou plano de aula válido. Retornando como texto bruto (modelo: ${modelName}).`);
            return { rawText: text };
          }
        } catch (jsonError) {
          this.logger.warn(`Resposta não é JSON válido: ${jsonError.message}. Retornando como texto bruto (modelo: ${modelName}).`);
          return { rawText: text };
        }

      } catch (error: any) {
        lastError = error;
        this.logger.warn(`Falha ao usar o modelo ${modelName} para chat: ${error.message}. Tentando o próximo...`);
      }
    }

    this.logger.error(`Todos os modelos para chat falharam. Último erro: ${lastError?.message}`, lastError?.stack);
    throw new InternalServerErrorException(
      lastError?.message.includes('503') ? 'Modelos de IA sobrecarregados. Tente novamente mais tarde.' :
      lastError?.message.includes('404') ? 'Modelo de IA não encontrado.' :
      'Falha ao interagir com a IA. Resposta vazia ou inválida. Verifique o prompt ou tente novamente.'
    );
  }
}
