import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid'; // Importando o uuid v4 e renomeando pra uuid
import { ResourceObject } from './ResourceObject';

@Entity('deliveryObjects', { schema: 'progap' }) // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class DeliveryObjects {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler
  // Unidade
  @Column({ nullable: true })
  unitId: number;
  // quantidade
  @Column({ nullable: true })
  amount: string;
  // Data da entrega
  @Column({ nullable: true })
  deliveryDate: string;
  // Data da liquidação
  @Column({ nullable: true })
  settlementDate: string;

  @ManyToOne(
    () => ResourceObject,
    resourceObjects => resourceObjects.deliveryObjects,
    {
      eager: true,
      nullable: true,
    },
  )
  resourceObjects: ResourceObject;

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
