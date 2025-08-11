import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
// import { CsvService } from '../csv/csv.service'; // REMOVA OU COMENTE ESTA LINHA
import { AulaCurriculoService } from '../aula-curriculo/aula-curriculo.service'; // IMPORTE O NOVO SERVIÇO
import { AulaCurriculoEntity } from '../aula-curriculo/aula-curriculo.entity'; // Importe a entidade para tipagem

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
    "gemini-1.5-pro-latest", // Preferência por modelos mais recentes e poderosos
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.0-pro",
  ];

  constructor(
    private configService: ConfigService,
    private aulaCurriculoService: AulaCurriculoService, // Injete o novo serviço
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

    // BUSCA AS AULAS DO BANCO DE DADOS
    const aulasCurriculoEntities: AulaCurriculoEntity[] = await this.aulaCurriculoService.findAllAulas();
    const aulasCurriculoContext = this.aulaCurriculoService.formatAulasForPrompt(aulasCurriculoEntities);

    // Construa o prompt completo com o contexto do currículo do DB
    const fullPromptWithCurriculumContext = `
      Você é um especialista em design instrucional, atuando como autor de conteúdo para estudantes do ensino médio, técnico ou profissionalizante.
      Sua missão é transformar a demanda do professor (Tema: "${prompt}") em um conteúdo didático completo com base no método BRIDGE, falando diretamente COM O ESTUDANTE.

      ---
      **Aulas do Currículo Existente (para referência e sugestão de adequação):**
      ${aulasCurriculoContext}
      ---

      Com base na demanda do professor (Tema: "${prompt}") e nas aulas do currículo acima, faça o seguinte:
      1.  Gere o conteúdo didático completo usando o método BRIDGE, falando diretamente COM O ESTUDANTE, com linguagem clara, engajante e motivadora.
      2.  **IDENTIFIQUE A(S) AULA(S) DO "CURRÍCULO EXISTENTE" QUE MAIS SE ADEQUA(M) OU COMPLEMENTA(M) O TEMA PROPOSTO PELO PROFESSOR.**
          Para cada aula sugerida, preencha o array "sugestaoAulasCSV" com objetos contendo:
          - "idAula": O ID exato da aula do currículo (ex: "Aula 01", "Aula 45").
          - "temaAula": O tema exato da aula do currículo (ex: "O que é lógica de programação?").
          - "justificativa": Uma justificativa clara e concisa (1-2 frases) do porquê essa aula se adequa ou complementa o tema.
          **Priorize a identificação de pelo menos uma aula que se encaixe.** Se não houver nenhuma, retorne um array vazio \`[]\`.
      3.  No campo "observacoesIA", forneça uma observação geral sobre o plano gerado em relação ao currículo. Se o currículo fornecido estava vazio ou incompleto (ex: apenas IDs e temas, sem detalhes ricos), mencione isso aqui.

      Detalhes para a geração de cada momento do método BRIDGE, falando diretamente COM O ESTUDANTE, com linguagem clara, engajante e motivadora:
      - **Ativação (Bridge):** Crie uma pergunta inicial e uma atividade que conecte o tema ao conhecimento prévio do estudante. O objetivo é despertar a curiosidade.
      - **Problema Real (Real):** Apresente um cenário ou problema do mundo real que o estudante possa relacionar, mostrando a relevância do tema. Inclua uma pergunta-problema e a importância de resolver esse problema.
      - **Investigação (Investigate):** Formule perguntas guiadas que incentivem o estudante a explorar e descobrir o conteúdo por si mesmo. Sugira elementos que ele deve descobrir.
      - **Solução Prática (Demonstrate):** Descreva uma aplicação prática ou um pequeno experimento/demonstração que o estudante possa fazer para ver o conteúdo em ação. Se for código, inclua um bloco de código.
      - **Mini Projeto (Generate):** Proponha um desafio rápido e prático onde o estudante possa aplicar o que aprendeu, gerando algo concreto.

      ---
      **INSTRUÇÃO FINAL E CRÍTICA:**
      SUA RESPOSTA DEVE SER APENAS O OBJETO JSON VÁLIDO.
      NÃO INCLUA TEXTO INTRODUTÓRIO COMO "CLARO, AQUI ESTÁ..." OU "PLANOS DE AULA:", NEM INCLUA OS MARCADORES \`\`\`JSON\`\`\` OU \`\`\` OU QUALQUER OUTRO TEXTO.
      O ÚNICO CONTEÚDO DA RESPOSTA DEVE SER O OBJETO JSON.

      Exemplo do formato JSON que você deve retornar (exatamente este formato, sem os marcadores \`\`\`):
      {
        "tituloAula": "string",
        "ativacao": { "titulo": "string", "metodologia": "string", "pergunta_inicial": "string", "atividade": "string" },
        "problema_real": { "titulo": "string", "metodologia": "string", "cenario": "string", "pergunta_problema": "string", "importancia": "string" },
        "investigacao": { "titulo": "string", "metodologia": "string", "perguntas_guiadas": "string", "elementos_descobertos": "string" },
        "solucao_pratica": { "titulo": "string", "metodologia": "string", "descricao": "string" },
        "mini_projeto": { "titulo": "string", "metodologia": "string", "desafio": "string" },
        "sugestaoAulasCSV": [ { "idAula": "string", "temaAula": "string", "justificativa": "string" } ],
        "observacoesIA": "string"
      }
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

        // Limpeza preventiva de possíveis marcadores de código
        if (text.startsWith('```json') && text.endsWith('```')) {
          text = text.substring('```json'.length, text.length - '```'.length).trim();
          this.logger.debug(`Removidos marcadores \`\`\`json do texto da IA (modelo: ${modelName}).`);
        } else if (text.startsWith('```') && text.endsWith('```')) {
          text = text.substring('```'.length, text.length - '```'.length).trim();
          this.logger.debug(`Removidos marcadores \`\`\` do texto da IA (modelo: ${modelName}).`);
        }

        const parsedResponse: Planejamento = JSON.parse(text);
        this.logger.log(`Conteúdo gerado com sucesso pelo modelo: ${modelName}`);
        return parsedResponse;

      } catch (error: any) {
        lastError = error;
        // CORREÇÃO: Verifique se 'input' existe no objeto 'error' antes de acessá-lo
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

  // O código do método chatWithLessonPlan não precisa de alteração
  // A lógica de fallback para 'rawText' já é robusta para esse caso
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
        let text = response.text();

        if (text.startsWith('```json') && text.endsWith('```')) {
          text = text.substring('```json'.length, text.length - '```'.length).trim();
          this.logger.debug(`Removidos marcadores \`\`\`json do texto da IA (chat, modelo: ${modelName}).`);
        } else if (text.startsWith('```') && text.endsWith('```')) {
          text = text.substring('```'.length, text.length - '```'.length).trim();
          this.logger.debug(`Removidos marcadores \`\`\` do texto da IA (chat, modelo: ${modelName}).`);
        }

        try {
          const parsedJson = JSON.parse(text);
          if (
            typeof parsedJson === 'object' && parsedJson !== null &&
            'tituloAula' in parsedJson && 'ativacao' in parsedJson &&
            'problema_real' in parsedJson && 'investigacao' in parsedJson &&
            'solucao_pratica' in parsedJson && 'mini_projeto' in parsedJson
          ) {
            this.logger.log(`Plano de aula atualizado recebido do modelo: ${modelName}`);
            return { updatedPlan: parsedJson as Planejamento };
          } else {
            this.logger.warn(`Resposta da IA é JSON, mas não um plano de aula válido. Retornando como texto bruto (modelo: ${modelName}).`);
            return { rawText: text };
          }
        } catch (jsonError) {
          this.logger.log(`Resposta da IA não é JSON válido. Retornando como texto puro (modelo: ${modelName}).`);
          return { rawText: text };
        }

      } catch (error: any) {
        lastError = error;
        this.logger.warn(`Falha ao usar o modelo ${modelName} para chat: ${error.message}. Tentando o próximo...`);
      }
    }

    this.logger.error(`Todos os modelos para chat falharam. Último erro: ${lastError?.message}`, lastError?.stack);
    if (lastError && lastError.message.includes('503 Service Unavailable')) {
        throw new InternalServerErrorException('No momento, os modelos de IA estão sobrecarregados para chat. Por favor, tente novamente mais tarde.');
    } else if (lastError && lastError.message.includes('404 Not Found')) {
        throw new InternalServerErrorException('Não foi possível encontrar um modelo de IA disponível para chat.');
    }
    throw new InternalServerErrorException('Falha ao interagir com a IA para chat após múltiplas tentativas. Verifique os logs para mais detalhes.');
  }
}