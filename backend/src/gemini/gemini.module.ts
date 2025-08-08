import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { GeminiController } from './gemini.controller';
import { ConfigModule } from '@nestjs/config';
// import { CsvModule } from '../csv/csv.module'; // REMOVA OU COMENTE ESTA LINHA
import { AulaCurriculoModule } from '../aula-curriculo/aula-curriculo.module'; // IMPORTE O NOVO MÓDULO

@Module({
  imports: [
    ConfigModule,
    // CsvModule, // REMOVA OU COMENTE ESTA LINHA
    AulaCurriculoModule, // ADICIONE O NOVO MÓDULO AQUI
  ], 
  providers: [GeminiService],
  controllers: [GeminiController],
})
export class GeminiModule {}
