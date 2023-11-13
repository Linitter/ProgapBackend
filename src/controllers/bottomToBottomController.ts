import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { BottomToBottom } from '../models/BottomToBottom';

class BottomToBottomController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { source, year, amount, axle } = request.body;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      amount: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const bottomToBottomRepository =
      APPDataSource.getRepository(BottomToBottom);

    const bottomToBottom = bottomToBottomRepository.create({
      source /*fonte*/,
      year /*ano*/,
      amount /*quantidade*/,
      axle /*eixo*/,
    });

    await bottomToBottomRepository.save(bottomToBottom);

    return response.status(201).json(bottomToBottom);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const bottomToBottomRepository =
      APPDataSource.getRepository(BottomToBottom);
    const all = await bottomToBottomRepository.find({
      relations: {
        axle: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const bottomToBottomRepository =
      APPDataSource.getRepository(BottomToBottom);
    const { id } = request.params;

    const one = await bottomToBottomRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { source, year, amount, balance, axle } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      amount: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const bottomToBottomRepository =
      APPDataSource.getRepository(BottomToBottom);
    const bottomToBottom = await bottomToBottomRepository.update(
      {
        id,
      },
      {
        source /*fonte*/,
        year /*ano*/,
        amount /*quantidade*/,
        axle /*eixo*/,
      },
    );

    return response.status(201).json(bottomToBottom);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const bottomToBottomRepository =
      APPDataSource.getRepository(BottomToBottom);
    const bottomToBottomToRemove = await bottomToBottomRepository.findOneBy({
      id: request.params.id,
    });

    if (!bottomToBottomToRemove) {
      return response
        .status(400)
        .json({ status: 'Fundo a fundo não encontrado!' });
    }

    const deleteResponse = await bottomToBottomRepository.softDelete(
      bottomToBottomToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'O fundo a fundo não excluido!' });
    }

    return response.json(bottomToBottomToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const bottomToBottomRepository =
      APPDataSource.getRepository(BottomToBottom);
    const bottomToBottomToRestore = await bottomToBottomRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!bottomToBottomToRestore) {
      return response
        .status(400)
        .json({ status: 'Fundo a fundo não encontrado!' });
    }

    const restoreResponse = await bottomToBottomRepository.restore(
      bottomToBottomToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Fundo a fundo recuperado!' });
    }

    return response.json(bottomToBottomRepository);
  }
}

export { BottomToBottomController };
