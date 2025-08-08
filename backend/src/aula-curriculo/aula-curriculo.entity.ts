import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('aulas_curriculo') 
@Unique(['numero_aula']) 
export class AulaCurriculoEntity {
  @PrimaryGeneratedColumn()
  id: number; // ID primário gerado automaticamente

  @Column({ type: 'text', nullable: true })
  tema: string;

  @Column({ type: 'text', nullable: false })
  numero_aula: string; // Ex: "Aula 01"

  @Column({ type: 'text', nullable: false })
  tema_aula: string; // Ex: "O que é lógica de programação?"

  @Column({ type: 'text', nullable: true })
  objetivo: string;

  @Column({ type: 'text', nullable: true })
  problema_resolvido: string;

  @Column({ type: 'text', nullable: true })
  duracao: string;
}
