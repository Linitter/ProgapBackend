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
import { Goal } from './Goal';
import { Axle } from './Axle';
// Fundo a Fundo
@Entity('bottomToBottom') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class BottomToBottom {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler
  // Fonte
  @Column({ nullable: true })
  source: string;
  // Ano
  @Column({ nullable: true })
  year: string;
  // Qunatidade
  @Column({ nullable: true })
  amount: string;

  @OneToMany(() => Goal, goal => goal.bottomToBottom, { eager: true })
  goal: Goal[];

  @ManyToOne(() => Axle, axle => axle.bottomToBottom, {
    eager: true,
    nullable: true,
  })
  axle: Axle;

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
