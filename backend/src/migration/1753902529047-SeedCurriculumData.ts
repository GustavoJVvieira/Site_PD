import { MigrationInterface, QueryRunner, Table } from "typeorm";


export class SeedCurriculumData1753902529047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "aulas_curriculo", // Nome da tabela deve ser 'aulas_curriculo' para corresponder à entidade
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                { 
                    name: "tema", 
                    type: "text", // Usar 'text' para strings longas no PostgreSQL
                    isNullable: true // Conforme a entidade AulaCurriculoEntity
                },
                { 
                    name: "numero_aula", 
                    type: "text", // Usar 'text'
                    isNullable: false, 
                    isUnique: true // Conforme a entidade AulaCurriculoEntity
                },
                { 
                    name: "tema_aula", 
                    type: "text", // Usar 'text'
                    isNullable: false 
                },
                { 
                    name: "objetivo", 
                    type: "text", 
                    isNullable: true 
                },
                { 
                    name: "problema_resolvido", // Corrigido para 'problema_resolvido' para corresponder à entidade
                    type: "text", 
                    isNullable: true 
                },
                { 
                    name: "duracao", 
                    type: "text", // Usar 'text'
                    isNullable: true 
                }
            ],
        }), true); // O 'true' aqui significa que se a tabela já existir, ele não tentará criá-la novamente
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("aulas_curriculo"); // Nome da tabela deve ser 'aulas_curriculo'
    }
}
