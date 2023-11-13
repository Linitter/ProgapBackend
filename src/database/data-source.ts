import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Objects } from '../models/Objects';
import { Nature } from '../models/Nature';
import { Model } from '../models/Model';
import { Axle } from '../models/Axle';
import { DeliveryObjects } from '../models/DeliveryObjects';
import { ResourceObject } from '../models/ResourceObject';
import { BottomToBottom } from '../models/BottomToBottom';
import { Goal } from '../models/Goal';
import { Covenant } from '../models/Covenant';
import { Author } from '../models/Author';
import { DestinationObjects } from '../models/DestinationObjects';
import { CovenantAuthor } from '../models/CovenantAuthor';
import { StateAmendment } from '../models/StateAmendment';
import { StateTreasury } from '../models/stateTreasury';
import { Fdd } from '../models/Fdd';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const APPDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [
    Objects /*Obejto*/,
    Nature /*Natureza*/,
    Model /*Modelo*/,
    Axle /*Eixo*/,
    DeliveryObjects /*Entrega do objeto do recurso*/,
    ResourceObject /*Obejtos do Recursos*/,
    BottomToBottom /*Fundo a Fundo*/,
    Covenant /*Convenio*/,
    Goal /*Meta*/,
    Author /*Autor*/,
    Fdd /*FDD*/,
    StateTreasury /*Tesouro Estadual*/,
    StateAmendment /*Emenda Estadual*/,
    DestinationObjects /*Destinações do obejtos do recurso*/,
    CovenantAuthor /* Autor de cada convenio*/,
  ],
  subscribers: [],
});
