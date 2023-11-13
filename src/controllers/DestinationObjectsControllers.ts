import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { DestinationObjects } from '../models/DestinationObjects';

class DestinationObjectsControllers {
  async create(request: Request, response: Response, next: NextFunction) {
    const { unitId, expectedQuantity, resourceObjects } = request.body;

    const schema = yup.object().shape({
      unitId: yup.number().nullable(),
      expectedQuantity: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const destinationObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const deliveryObject = destinationObjectRepository.create({
      unitId, //id da unidade
      expectedQuantity, //Qtde prevista
      resourceObjects,
    });

    await destinationObjectRepository.save(deliveryObject);

    return response.status(201).json(deliveryObject);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const all = await destinationObjectRepository.find({
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { unitId, expectedQuantity, resourceObjects } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      unitId: yup.number().nullable(),
      expectedQuantity: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const destinationObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const deliveryObject = await destinationObjectRepository.update(
      {
        id,
      },
      {
        unitId, //unidade
        expectedQuantity, //Qtde prevista
        resourceObjects,
      },
    );

    return response.status(201).json(deliveryObject);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const destinationObjectRepository =
      APPDataSource.getRepository(DestinationObjects);

    const destinationObjectsToRemove =
      await destinationObjectRepository.findOneBy({
        id: request.params.id,
      });

    if (!destinationObjectsToRemove) {
      return response
        .status(400)
        .json({ status: 'destinação do objeto não encontrado!' });
    }

    const deleteResponse = await destinationObjectRepository.softDelete(
      destinationObjectsToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'destinação do objeto não excluido!' });
    }

    return response.json(destinationObjectsToRemove);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(DestinationObjects);

    const { id } = request.params;

    const one = await modelRepository.findOne({ where: { id: id } });

    return response.json(one);
  }
}

export { DestinationObjectsControllers };
