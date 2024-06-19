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
import { Covenant } from './Covenant';
import { DeliveryObjects } from './DeliveryObjects';
import { DestinationObjects } from './DestinationObjects';
import { Fdd } from './Fdd';
import { Goal } from './Goal';
import { Objects } from './Objects';
import { StateAmendment } from './StateAmendment';
import { StateTreasury } from './stateTreasury';

@Entity('resourceObjects', { schema: 'progap' }) // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class ResourceObject {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler
  // Quantidade
  @Column({ nullable: true })
  amount: string;
  //valor unitario
  @Column({ nullable: true })
  unitaryValue: string;
  // Valor total estimado
  @Column({ nullable: true })
  estimatedTotalValue: string;
  // status
  @Column({ nullable: true })
  status: string;
  //Andamento
  @Column({ nullable: true })
  progress: string;
  //numero do processo
  @Column({ nullable: true })
  processNumber: string;
  //natureza de despensa
  @Column({ nullable: true })
  natureExpense: string;
  // modo de aquisição
  @Column({ nullable: true })
  acquisitionMode: string;
  // valor executado
  @Column({
    nullable: true,
  })
  executedValue: string;
  // Data do empenho
  @Column({
    nullable: true,
  })
  commitmentDate: string;
  // Data de previsão
  @Column({
    nullable: true,
  })
  forecastDate: string;

  @ManyToOne(
    () => StateAmendment,
    stateAmendment => stateAmendment.resourceObjects,
    {
      eager: true,
      nullable: true,
    },
  )
  stateAmendment: StateAmendment;

  @ManyToOne(() => Covenant, covenants => covenants.resourceObjects, {
    eager: true,
    nullable: true,
  })
  covenants: Covenant;

  @ManyToOne(() => Goal, goal => goal.resourceObjects, {
    nullable: true,
  })
  goal: Goal;

  @ManyToOne(
    () => StateTreasury,
    stateTreasury => stateTreasury.resourceObjects,
    {
      eager: true,
      nullable: true,
    },
  )
  stateTreasury: StateTreasury;

  @ManyToOne(() => Fdd, fdd => fdd.resourceObjects, {
    eager: true,
    nullable: true,
  })
  fdd: Fdd;

  @ManyToOne(() => Objects, objetc => objetc.resourceObjects, {
    eager: true,
    nullable: false,
  })
  objects: Objects;

  @OneToMany(
    () => DeliveryObjects,
    deliveryObjects => deliveryObjects.resourceObjects,
  )
  deliveryObjects: DeliveryObjects[];

  @OneToMany(
    () => DestinationObjects,
    destinationObjects => destinationObjects.resourceObjects,
  )
  destinationObjects: DestinationObjects[];

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
