import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'pdita', nullable: false })
  pdita: string;

  @Column({ name: 'nome_aluno', nullable: false })
  nome_aluno: string;

  @Column({ name: 'nome_monitor', nullable: false })
  nome_monitor: string;

  @Column({ name: 'moedas', nullable: false })
  moedas: number;

  @Column({ name: 'link_monitoria', nullable: false })
  link_monitoria: string;

  @Column({ name: 'dia_monitoria', nullable: false })
  dia_monitoria: string;

  @Column({ name: 'data_nasc', nullable: false })
  data_nasc: string;
}
