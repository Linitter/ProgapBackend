import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Model } from '../models/Model';

class ModelController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name } = request.body;

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

    const modelRepository = APPDataSource.getRepository(Model);

    const modelAlreadyExists = await modelRepository.findOne({
      where: { name: name },
    });

    if (modelAlreadyExists) {
      return response
        .status(400)
        .json({ status: 'Modelo ja existe já existe!' });
    }

    const model = modelRepository.create({
      name,
    });

    await modelRepository.save(model);

    return response.status(201).json(model);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(Model);

    const all = await modelRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(Model);

    const { id } = request.params;

    const one = await modelRepository.findOne({ where: { id: id } });

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

    const modelRepository = APPDataSource.getRepository(Model);

    const model = await modelRepository.update(
      {
        id,
      },
      {
        name,
      },
    );

    return response.status(201).json(model);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(Model);

    const modelToRemove = await modelRepository.findOneBy({
      id: request.params.id,
    });

    if (!modelToRemove) {
      return response.status(400).json({ status: 'Model não encontrado!' });
    }

    const deleteResponse = await modelRepository.softDelete(modelToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Model não excluido!' });
    }

    return response.json(modelToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(Model);

    const modelToRestore = await modelRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!modelToRestore) {
      return response.status(400).json({ status: 'Model não encontrado!' });
    }

    const restoreResponse = await modelRepository.restore(modelToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Model recuperado!' });
    }

    return response.json(modelRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const modelRepository = APPDataSource.getRepository(Model);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await modelRepository
      .createQueryBuilder('model')
      .take(parseInt(perPage.toString()))
      .skip(skip)
      .addOrderBy(column.toString(), 'ASC')
      .getMany();

    return response.json(all);
  }

  async token(request: Request, response: Response, next: NextFunction) {
    const id = 1;
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 43200,
    });

    return response.json({ auth: true, token });
  }
}

export { ModelController };
