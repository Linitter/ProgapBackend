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
import { ResourceObject } from './ResourceObject';
// Tesouro Estadual
@Entity('stateTreasury', { schema: 'progap' }) // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class StateTreasury {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler
  @Column({ nullable: true })
  position: number;
  //fonte
  @Column({ nullable: true })
  source: string;
  //ano
  @Column({ nullable: true })
  year: string;

  @Column({ nullable: true })
  recursoCaptado: boolean;

  @OneToMany(
    () => ResourceObject,
    resourceObjects => resourceObjects.stateAmendment,
  )
  resourceObjects: ResourceObject[];

  @DeleteDateColumn({ nullable: true, default: null })
  deleted_at: Date; // Coluna que indicará se o convênio foi excluído (null para não excluído, data para excluído)

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
