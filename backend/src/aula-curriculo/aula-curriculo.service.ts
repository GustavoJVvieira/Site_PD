import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AulaCurriculoEntity } from './aula-curriculo.entity';

@Injectable()
export class AulaCurriculoService {
  private readonly logger = new Logger(AulaCurriculoService.name);

  constructor(
    @InjectRepository(AulaCurriculoEntity)
    private aulaCurriculoRepository: Repository<AulaCurriculoEntity>,
  ) {}

  async findAllAulas(): Promise<AulaCurriculoEntity[]> {
    this.logger.log('Buscando todas as aulas do currículo no banco de dados...');
    return this.aulaCurriculoRepository.find();
  }

  // Método para formatar as aulas para o prompt do Gemini
  formatAulasForPrompt(aulas: AulaCurriculoEntity[]): string {
    if (aulas.length === 0) {
      this.logger.warn("Nenhuma aula de currículo encontrada no banco de dados. Contexto para o prompt será vazio.");
      return "Nenhuma aula de currículo disponível para referência.";
    }

    const formatted = aulas.map(aula => 
      `ID: ${aula.numero_aula}, Tema: "${aula.tema_aula}"`
    ).join('\n');

    this.logger.debug(`Contexto das aulas formatado para o prompt (primeiras 500 chars):\n${formatted.substring(0, 500)}`);
    return formatted;
  }
}
