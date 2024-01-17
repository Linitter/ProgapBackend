import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { BottomToBottom } from './BottomToBottom';
import { ResourceObject } from './ResourceObject';
// Meta
@Entity('goal')
export class Goal {
  @PrimaryColumn()
  readonly id: string;
  // Descrição
  @Column({ nullable: true })
  description: string;
  // Valor previsto
  @Column({ nullable: true })
  predictedValue: string;
  //  Saldo
  @Column({ nullable: true })
  balance: string;

  @Column({ nullable: true })
  executedValue: string;

  @ManyToOne(() => BottomToBottom, bottomToBottom => bottomToBottom.goal)
  bottomToBottom: BottomToBottom;

  @OneToMany(() => ResourceObject, resourceObjects => resourceObjects.goal, {
    eager: true,
  })
  resourceObjects: ResourceObject[];

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
