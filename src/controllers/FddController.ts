import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Fdd } from '../models/Fdd';

class FddController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      source, // fonte
      year, // ano
      agreementNumber, // numero da convênio
      transferAmount, // Valor do repasse
      counterpartValue, // Valor contrapartida
      globalValue, // Valor global
      description, // Descrição
      balance, // Saldo
      totalValueExecuted, //valor total exec
    } = request.body;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      agreementNumber: yup.string().nullable(),
      transferAmount: yup.string().nullable(),
      counterpartValue: yup.string().nullable(),
      globalValue: yup.string().nullable(),
      description: yup.string().nullable(),
      balance: yup.string().nullable(),
      totalValueExecuted: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const fddRepository = APPDataSource.getRepository(Fdd);

    const fdd = fddRepository.create({
      source, // fonte
      year, // ano
      agreementNumber, // numero da convênio
      transferAmount, // Valor do repasse
      counterpartValue, // Valor contrapartida
      globalValue, // Valor global
      description, // Descrição
      balance, // Saldo
      totalValueExecuted, //valor total exec
    });

    await fddRepository.save(fdd);

    return response.status(201).json(fdd);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const fddRepository = APPDataSource.getRepository(Fdd);
    const all = await fddRepository.find({
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const fddRepository = APPDataSource.getRepository(Fdd);
    const { id } = request.params;

    const one = await fddRepository.findOne({
      where: { id: id },
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const {
      source, // fonte
      year, // ano
      agreementNumber, // numero da convênio
      transferAmount, // Valor do repasse
      counterpartValue, // Valor contrapartida
      globalValue, // Valor global
      description, // Descrição
      balance, // Saldo
      totalValueExecuted, //valor total exec
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      agreementNumber: yup.string().nullable(),
      transferAmount: yup.string().nullable(),
      counterpartValue: yup.string().nullable(),
      globalValue: yup.string().nullable(),
      description: yup.string().nullable(),
      balance: yup.string().nullable(),
      totalValueExecuted: yup.string().nullable(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!', errors: err.errors });
    }

    const fddRepository = APPDataSource.getRepository(Fdd);

    await fddRepository.update(
      { id },
      {
        source, // fonte
        year, // ano
        agreementNumber, // numero da convênio
        transferAmount, // Valor do repasse
        counterpartValue, // Valor contrapartida
        globalValue, // Valor global
        description, // Descrição
        balance, // Saldo
        totalValueExecuted, //valor total exec
      },
    );

    return response
      .status(201)
      .json({ status: 'Atualização concluída com sucesso!' });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const fddRepository = APPDataSource.getRepository(Fdd);
    const fddToRemove = await fddRepository.findOneBy({
      id: request.params.id,
    });

    if (!fddToRemove) {
      return response.status(400).json({ status: 'Fdd não encontrado!' });
    }

    const deleteResponse = await fddRepository.softDelete(fddToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Fdd não excluido!' });
    }

    return response.json(fddToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const fddRepository = APPDataSource.getRepository(Fdd);
    const fddToRestore = await fddRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!fddToRestore) {
      return response.status(400).json({ status: 'Fdd não encontrado!' });
    }

    const restoreResponse = await fddRepository.restore(fddToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Fdd recuperado!' });
    }

    return response.json(fddRepository);
  }
}

export { FddController };
