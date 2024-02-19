import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { StateTreasury } from '../models/stateTreasury';

class StateTreasuryController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { source, year, position } = request.body;
    const schema = yup.object().shape({
      source: yup.string(),
      year: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const StateTreasuryRepository = APPDataSource.getRepository(StateTreasury);

    const stateTreasury = StateTreasuryRepository.create({
      source,
      year,
      position,
    });

    await StateTreasuryRepository.save(stateTreasury);

    return response.status(201).json(stateTreasury);
  }
  // funação para listar
  async all(request: Request, response: Response, next: NextFunction) {
    const StateTreasuryRepository = APPDataSource.getRepository(StateTreasury);

    const all = await StateTreasuryRepository.find({
      relations: {
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const StateTreasuryRepository = APPDataSource.getRepository(StateTreasury);

    const { id } = request.params;

    const one = await StateTreasuryRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { source, year, position } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string(),
      year: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const StateTreasuryRepository = APPDataSource.getRepository(StateTreasury);

    const stateTreasury = await StateTreasuryRepository.update(
      {
        id,
      },
      {
        source,
        year,
        position,
      },
    );

    return response.status(201).json(stateTreasury);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const StateTreasuryRepository = APPDataSource.getRepository(StateTreasury);

    const stateTreasuryToRemove = await StateTreasuryRepository.findOneBy({
      id: request.params.id,
    });

    if (!stateTreasuryToRemove) {
      return response
        .status(400)
        .json({ status: 'Tesouro estadual não encontrada!' });
    }

    const deleteResponse = await StateTreasuryRepository.softDelete(
      stateTreasuryToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'Tesouro estadual não foi excluido!' });
    }

    return response.json(stateTreasuryToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const StateTreasuryRepository = APPDataSource.getRepository(StateTreasury);

    const stateTreasuryToRestore = await StateTreasuryRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!stateTreasuryToRestore) {
      return response
        .status(400)
        .json({ status: 'Tesouro estadual não encontrado!' });
    }

    const restoreResponse = await StateTreasuryRepository.restore(
      stateTreasuryToRestore.id,
    );

    if (restoreResponse.affected) {
      return response
        .status(200)
        .json({ status: 'Tesouro estadual recuperado!' });
    }

    return response.json(StateTreasuryRepository);
  }
}

export { StateTreasuryController };
