import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { CovenantAuthor } from './CovenantAuthor';
import { StateAmendment } from './StateAmendment';
//autor
@Entity('author')
export class Author {
  @PrimaryColumn()
  readonly id: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => CovenantAuthor, covenant => covenant.authors)
  covenantAuthor: CovenantAuthor[];

  @OneToMany(() => StateAmendment, objects => objects.authors)
  stateAmendment: StateAmendment[];

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
