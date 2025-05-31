import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1651234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'pdita',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'nome_aluno',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'nome_monitor',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'moedas',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'link_monitoria',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'dia_monitoria',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'data_nasc',
            type: 'varchar',
            length: '10', // Exemplo: "YYYY-MM-DD"
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
