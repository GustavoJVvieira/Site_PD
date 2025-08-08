import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaCurriculoEntity } from './aula-curriculo.entity';
import { AulaCurriculoService } from './aula-curriculo.service';

@Module({
  imports: [TypeOrmModule.forFeature([AulaCurriculoEntity])], // Registra a entidade para este módulo
  providers: [AulaCurriculoService],
  exports: [AulaCurriculoService], // Exporta o serviço para ser usado por outros módulos (ex: GeminiModule)
})
export class AulaCurriculoModule {}
