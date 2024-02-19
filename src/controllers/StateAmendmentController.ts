import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { StateAmendment } from '../models/StateAmendment';

class StateAmendmentController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      source, //fonte
      amendmentNumber, //numero da emenda
      year, //ano
      transferAmount, // Valor do repasse"
      description, //decrição
      balance, //saldo
      authors, // auores
      totalValueExecuted, //valor total exec
      position,
    } = request.body;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      amendmentNumber: yup.string().nullable(),
      year: yup.string().nullable(),
      transferAmount: yup.string().nullable(),
      description: yup.string().nullable(),
      balance: yup.string().nullable(),
      totalValueExecuted: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const stateAmendmentRepository =
      APPDataSource.getRepository(StateAmendment);

    const stateAmendment = stateAmendmentRepository.create({
      source, //fonte
      amendmentNumber, //numero da emenda
      year, //ano
      transferAmount, // Valor do repasse"
      description, //decrição
      balance, //saldo
      authors, // auores
      totalValueExecuted, //valor total exec
      position,
    });

    await stateAmendmentRepository.save(stateAmendment);

    return response.status(201).json(stateAmendment);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const stateAmendmentRepository =
      APPDataSource.getRepository(StateAmendment);

    const all = await stateAmendmentRepository.find({
      relations: {
        authors: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const stateAmendmentRepository =
      APPDataSource.getRepository(StateAmendment);

    const { id } = request.params;

    const one = await stateAmendmentRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const {
      source, //fonte
      amendmentNumber, //numero da emenda
      year, //ano
      transferAmount, // Valor do repasse"
      description, //decrição
      balance, //saldo
      authors, // auores
      totalValueExecuted, //valor total exec
      position,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      amendmentNumber: yup.string().nullable(),
      year: yup.string().nullable(),
      transferAmount: yup.string().nullable(),
      description: yup.string().nullable(),
      balance: yup.string().nullable(),
      totalValueExecuted: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const stateAmendmentRepository =
      APPDataSource.getRepository(StateAmendment);

    const stateAmendment = await stateAmendmentRepository.update(
      {
        id,
      },
      {
        source, //fonte
        amendmentNumber, //numero da emenda
        year, //ano
        transferAmount, // Valor do repasse"
        description, //decrição
        balance, //saldo
        authors, // auores
        totalValueExecuted, //valor total exec
        position,
      },
    );

    return response.status(201).json(stateAmendment);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const stateAmendmentRepository =
      APPDataSource.getRepository(StateAmendment);

    const tipoRecursoToRemove = await stateAmendmentRepository.findOneBy({
      id: request.params.id,
    });

    if (!tipoRecursoToRemove) {
      return response
        .status(400)
        .json({ status: 'Emenda estadual não encontrado!' });
    }

    const deleteResponse = await stateAmendmentRepository.softDelete(
      tipoRecursoToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'Emenda estadual não excluido!' });
    }

    return response.json(tipoRecursoToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const stateAmendmentRepository =
      APPDataSource.getRepository(StateAmendment);

    const stateAmendmentToRestore = await stateAmendmentRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!stateAmendmentToRestore) {
      return response
        .status(400)
        .json({ status: 'Emenda estadual não encontrado!' });
    }

    const restoreResponse = await stateAmendmentRepository.restore(
      stateAmendmentToRestore.id,
    );

    if (restoreResponse.affected) {
      return response
        .status(200)
        .json({ status: 'Emenda estadual recuperado!' });
    }

    return response.json(stateAmendmentRepository);
  }
}

export { StateAmendmentController };
