import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Objects } from '../models/Objects';

class ObjectsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, nature, model } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const resourceObjectRepository = APPDataSource.getRepository(Objects);

    const objectsAlreadyExists = await resourceObjectRepository.findOne({
      where: { name: name },
    });

    if (objectsAlreadyExists) {
      return response.status(400).json({ status: 'Objeto já existe!' });
    }

    const objects = resourceObjectRepository.create({
      name,
      nature,
      model,
    });

    await resourceObjectRepository.save(objects);

    return response.status(201).json(objects);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Objects);

    const all = await resourceObjectRepository.find({
      relations: {
        nature: true,
        model: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Objects);

    const { id } = request.params;

    const one = await resourceObjectRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const resourceObjectRepository = APPDataSource.getRepository(Objects);

    const objects = await resourceObjectRepository.update(
      {
        id,
      },
      {
        name,
      },
    );

    return response.status(201).json(objects);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Objects);

    const tipoRecursoToRemove = await resourceObjectRepository.findOneBy({
      id: request.params.id,
    });

    if (!tipoRecursoToRemove) {
      return response.status(400).json({ status: 'Objeto não encontrado!' });
    }

    const deleteResponse = await resourceObjectRepository.softDelete(
      tipoRecursoToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Objeto não excluido!' });
    }

    return response.json(tipoRecursoToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const resourceObjectRepository = APPDataSource.getRepository(Objects);

    const objectToRestore = await resourceObjectRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!objectToRestore) {
      return response.status(400).json({ status: 'Objeto não encontrado!' });
    }

    const restoreResponse = await resourceObjectRepository.restore(
      objectToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Objeto recuperado!' });
    }

    return response.json(resourceObjectRepository);
  }
}

export { ObjectsController };
