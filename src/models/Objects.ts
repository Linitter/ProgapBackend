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
import { Nature } from './Nature';
import { Model } from './Model';
import { ResourceObject } from './ResourceObject';

@Entity('objects') // Do TypeORM, pois será uma entidade do banco de dados, utilizada no controller
export class Objects {
  @PrimaryColumn()
  readonly id: string; // o readonly para não deixar quem tem informação do id mudar o valor, nesse caso o controller poderá só ler
  // nome
  @Column() // Poderia passar o nome da coluna: @Column("name"), mas o atributo já está com mesmo nome
  name: string;

  @OneToMany(() => ResourceObject, resourceObjects => resourceObjects.objects)
  resourceObjects: ResourceObject[];

  @ManyToOne(() => Nature, nature => nature.objects, { eager: true })
  nature: Nature;

  @ManyToOne(() => Model, model => model.objects, { eager: true })
  model: Model;

  @DeleteDateColumn()
  deleted_at: Date;

  @CreateDateColumn() // Para já capturar a data e fazer a formatação
  created_at: Date;

  @UpdateDateColumn() // Para já capturar a data e fazer a formatação
  update_at: Date;

  /*
      A geração do uuID automático não será por meio do SGBD, e sim aqui pelo código
      Utilizando a bilioteca: yarn add uuid
      Tipos da biblioteca uuid: yarn add @tyapes/uuid -D
  */
  constructor() {
    // Se esse ID não existir, gerar um id
    if (!this.id) {
      this.id = uuid();
    }
  }
}
