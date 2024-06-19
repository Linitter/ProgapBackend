import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { Author } from './Author';
import { Covenant } from './Covenant';
// Ligação de autor com convenio
@Entity('covenantAuthor', { schema: 'progap' }) // Nome da tabela de junção
export class CovenantAuthor {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler
  //  VAlor de contribuição
  @Column()
  contributionValue: string;

  @ManyToOne(() => Covenant, covenant => covenant.covenantAuthor, {
    eager: true,
    nullable: false,
  })
  covenants: Covenant;

  @ManyToOne(() => Author, author => author.covenantAuthor, {
    eager: true,
    nullable: false,
  })
  authors: Author;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn() // Para já capturar a data e fazer a formatação
  created_at: Date;

  @UpdateDateColumn() // Para já capturar a data e fazer a formatação
  update_at: Date;

  /*
      A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
      Utilizando a bilioteca: yarn add uuid
      Tipos da biblioteca uuid: yarn add @types/uuid -D
  */
  constructor() {
    // Se esse ID não existir, gerar um id
    if (!this.id) {
      this.id = uuid();
    }
  }
}
