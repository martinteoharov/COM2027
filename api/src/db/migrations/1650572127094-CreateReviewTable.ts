import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from "typeorm";

export class CreateReviewTable1650572127094 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'review',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'review',
                    type: 'jsonb',
                }
            ]
        }), true)

        await queryRunner.addColumn('review', new TableColumn({
            name: 'userId',
            type: 'varchar'
        }));

        await queryRunner.addColumn('review', new TableColumn({
            name: 'publicationId',
            type: 'varchar'
        }));

        await queryRunner.createForeignKey('review', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE'
        }));

        await queryRunner.createForeignKey('review', new TableForeignKey({
            columnNames: ['publicationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'publication',
            onDelete: 'CASCADE'
        }));
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('review');    // Revert changes if needed
    }

}

