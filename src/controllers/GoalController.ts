import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Goal } from '../models/Goal';

class GoalController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { description, predictedValue, balance, bottomToBottom } =
      request.body;
    const schema = yup.object().shape({
      description: yup.string().nullable(),
      predictedValue: yup.string().nullable(),
      balance: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const goalRepository = APPDataSource.getRepository(Goal);
    const goalAlreadyExists = await goalRepository.findOne({
      where: { description: description },
    });

    if (goalAlreadyExists) {
      return response.status(400).json({ status: 'meta já existe!' });
    }

    const goal = goalRepository.create({
      description, // descrição
      predictedValue, // Valor previsto
      balance, // saldo
      bottomToBottom, // id fundo a fundo
    });

    await goalRepository.save(goal);

    return response.status(201).json(goal);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const goalRepository = APPDataSource.getRepository(Goal);

    const all = await goalRepository.find({
      relations: {
        bottomToBottom: true,
      },
    });
    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const goalRepository = APPDataSource.getRepository(Goal);

    const { id } = request.params;

    const one = await goalRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { description, predictedValue, balance, bottomToBottom } =
      request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      description: yup.string().nullable(),
      predictedValue: yup.string().nullable(),
      balance: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const goalRepository = APPDataSource.getRepository(Goal);

    const axle = await goalRepository.update(
      {
        id,
      },
      {
        description, // descrição
        predictedValue, // Valor previsto
        balance, // saldo
        bottomToBottom, // id fundo a fundo
      },
    );

    return response.status(201).json(axle);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const goalRepository = APPDataSource.getRepository(Goal);

    const goalToRemove = await goalRepository.findOneBy({
      id: request.params.id,
    });

    if (!goalToRemove) {
      return response.status(400).json({ status: 'meta não encontrada!' });
    }

    const deleteResponse = await goalRepository.softDelete(goalToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'A meta não foi excluido!' });
    }

    return response.json(goalToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const goalRepository = APPDataSource.getRepository(Goal);

    const goalToRestore = await goalRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!goalToRestore) {
      return response.status(400).json({ status: 'meta não encontrado!' });
    }

    const restoreResponse = await goalRepository.restore(goalToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'meta recuperado!' });
    }

    return response.json(goalRepository);
  }
}

export { GoalController };
