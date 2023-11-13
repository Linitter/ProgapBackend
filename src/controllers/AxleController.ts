import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Axle } from '../models/Axle';

class AxleController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name, description } = request.body;
    const schema = yup.object().shape({
      name: yup.string(),
      description: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const axleRepository = APPDataSource.getRepository(Axle);
    const axleAlreadyExists = await axleRepository.findOne({
      where: { name: name },
    });

    if (axleAlreadyExists) {
      return response.status(400).json({ status: 'eixo já existe!' });
    }

    const axle = axleRepository.create({
      name,
      description,
    });

    await axleRepository.save(axle);

    return response.status(201).json(axle);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const axleRepository = APPDataSource.getRepository(Axle);

    const all = await axleRepository.find({
      relations: {
        bottomToBottom: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const axleRepository = APPDataSource.getRepository(Axle);

    const { id } = request.params;

    const one = await axleRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name, description } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string(),
      description: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const axleRepository = APPDataSource.getRepository(Axle);

    const axle = await axleRepository.update(
      {
        id,
      },
      {
        name,
        description,
      },
    );

    return response.status(201).json(axle);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const axleRepository = APPDataSource.getRepository(Axle);

    const axleToRemove = await axleRepository.findOneBy({
      id: request.params.id,
    });

    if (!axleToRemove) {
      return response.status(400).json({ status: 'eixo não encontrada!' });
    }

    const deleteResponse = await axleRepository.softDelete(axleToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'eixo não foi excluido!' });
    }

    return response.json(axleToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const axleRepository = APPDataSource.getRepository(Axle);

    const axleToRestore = await axleRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!axleToRestore) {
      return response.status(400).json({ status: 'axle não encontrado!' });
    }

    const restoreResponse = await axleRepository.restore(axleToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'axle recuperado!' });
    }

    return response.json(axleRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const axleRepository = APPDataSource.getRepository(Axle);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await axleRepository
      .createQueryBuilder('axle')
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

export { AxleController };
