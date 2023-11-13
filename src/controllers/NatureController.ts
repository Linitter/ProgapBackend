import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import jwt from 'jsonwebtoken';
import { Nature } from '../models/Nature';

class NatureController {
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
    const natureRepository = APPDataSource.getRepository(Nature);

    const natureAlreadyExists = await natureRepository.findOne({
      where: { name: name },
    });

    if (natureAlreadyExists) {
      return response.status(400).json({ status: 'natureza já existe!' });
    }

    const nature = natureRepository.create({
      name,
    });

    await natureRepository.save(nature);

    return response.status(201).json(nature);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const natureRepository = APPDataSource.getRepository(Nature);
    const all = await natureRepository.find();

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const natureRepository = APPDataSource.getRepository(Nature);

    const { id } = request.params;

    const one = await natureRepository.findOne({ where: { id: id } });

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

    const natureRepository = APPDataSource.getRepository(Nature);

    const nature = await natureRepository.update(
      {
        id,
      },
      {
        name,
      },
    );

    return response.status(201).json(nature);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const natureRepository = APPDataSource.getRepository(Nature);

    const natureToRemove = await natureRepository.findOneBy({
      id: request.params.id,
    });

    if (!natureToRemove) {
      return response.status(400).json({ status: 'natureza não encontrada!' });
    }

    const deleteResponse = await natureRepository.softDelete(natureToRemove.id);
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'natureza não excluida!' });
    }

    return response.json(natureToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const natureRepository = APPDataSource.getRepository(Nature);

    const natureToRestore = await natureRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!natureToRestore) {
      return response.status(400).json({ status: 'natureza não encontrada!' });
    }

    const restoreResponse = await natureRepository.restore(natureToRestore.id);

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'natureza recuperada!' });
    }

    return response.json(natureRepository);
  }

  async paginar(request: Request, response: Response, next: NextFunction) {
    const natureRepository = APPDataSource.getRepository(Nature);

    const { perPage, page, column } = request.query;
    const skip = parseInt(page.toString()) * parseInt(perPage.toString());

    const all = await natureRepository
      .createQueryBuilder('nature')
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

export { NatureController };
