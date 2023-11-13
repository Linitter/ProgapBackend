import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Author } from '../models/Author';

class AuthorController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { name } = request.body;
    const schema = yup.object().shape({
      name: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const authorRepository = APPDataSource.getRepository(Author);
    const authorAlreadyExists = await authorRepository.findOne({
      where: { name: name },
    });

    if (authorAlreadyExists) {
      return response.status(400).json({ status: 'author já existe!' });
    }

    const author = authorRepository.create({
      name,
    });

    await authorRepository.save(author);

    return response.status(201).json(author);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const authorRepository = APPDataSource.getRepository(Author);

    const all = await authorRepository.find({
      relations: {
        covenantAuthor: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const authorRepository = APPDataSource.getRepository(Author);

    const { id } = request.params;

    const one = await authorRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { name } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      name: yup.string(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const authorRepository = APPDataSource.getRepository(Author);

    const author = await authorRepository.update(
      {
        id,
      },
      {
        name,
      },
    );

    return response.status(201).json(author);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const authorRepository = APPDataSource.getRepository(Author);

    const authorToRemove = await authorRepository.findOneBy({
      id: request.params.id,
    });

    if (!authorToRemove) {
      return response
        .status(400)
        .json({ status: 'Concedente não encontrada!' });
    }

    const deleteResponse = await authorRepository.softDelete(authorToRemove.id);
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'Concedente não foi excluido!' });
    }

    return response.json(authorToRemove);
  }
}
export { AuthorController };
