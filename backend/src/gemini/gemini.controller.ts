import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { Response } from 'express';
// import { CsvService } from '../csv/csv.service'; // REMOVA OU COMENTE ESTA LINHA

// DTO para a requisição de geração de plano
class GeneratePlanDto {
  prompt: string;
}

// DTO para a requisição de chat
class ChatRequestDto {
  prompt: string;
}

@Controller('gemini')
export class GeminiController {
  constructor(
    private readonly geminiService: GeminiService,
    // private readonly csvService: CsvService, // REMOVA OU COMENTE ESTA LINHA
  ) {}

  @Post('generate-lesson-plan')
  async generateLessonPlan(@Body() body: GeneratePlanDto, @Res() res: Response) {
    const { prompt } = body;

    if (!prompt) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'O prompt é obrigatório.' });
    }

    try {
      // O GeminiService agora buscará o contexto do currículo do AulaCurriculoService
      const plan = await this.geminiService.generateLessonPlan(prompt);

      if ('rawText' in plan) {
        return res.status(HttpStatus.OK).json({ rawText: plan.rawText });
      }

      return res.status(HttpStatus.OK).json(plan);
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message || 'Falha interna ao gerar plano de aula.',
        details: error.response || null, 
      });
    }
  }

  @Post('chat-with-lesson-plan')
  async chatWithLessonPlan(@Body() body: ChatRequestDto, @Res() res: Response) {
    const { prompt } = body;

    if (!prompt) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 'O prompt é obrigatório para o chat.' });
    }

    try {
      const result = await this.geminiService.chatWithLessonPlan(prompt);

      if ('updatedPlan' in result) {
        return res.status(HttpStatus.OK).json({ updatedPlan: result.updatedPlan });
      } else {
        return res.status(HttpStatus.OK).json({ rawText: result.rawText });
      }
    } catch (error: any) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message || 'Falha interna ao processar chat.',
        details: error.response || null,
      });
    }
  }
}
