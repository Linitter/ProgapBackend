import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { CovenantAuthor } from '../models/CovenantAuthor';

class CovenantAuthorsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const { contributionValue, covenants, authors } = request.body;

    const convenantAuthorsRepository =
      APPDataSource.getRepository(CovenantAuthor);

    const covenantAuthor = convenantAuthorsRepository.create({
      contributionValue, //Valor de contribuição
      covenants, //Convenios
      authors, //Autores
    });

    await convenantAuthorsRepository.save(covenantAuthor);

    return response.status(201).json(covenantAuthor);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const convenantAuthorsRepository =
      APPDataSource.getRepository(CovenantAuthor);

    const all = await convenantAuthorsRepository.find({
      relations: {
        covenants: true,
        authors: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const convenantAuthorsRepository =
      APPDataSource.getRepository(CovenantAuthor);

    const { id } = request.params;

    const one = await convenantAuthorsRepository.findOne({ where: { id: id } });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { contributionValue, covenants, authors } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      contributionValue: yup.string().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      return response
        .status(400)
        .json({ status: 'Erro de validação dos campos!' });
    }

    const convenantAuthorsRepository =
      APPDataSource.getRepository(CovenantAuthor);

    const covenantAuthor = await convenantAuthorsRepository.update(
      {
        id,
      },
      {
        contributionValue, //Valor de contribuição
        covenants, //Convenios
        authors, //Autores
      },
    );

    return response.status(201).json(covenantAuthor);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const convenantAuthorsRepository =
      APPDataSource.getRepository(CovenantAuthor);

    const covenantAuthorToRemove = await convenantAuthorsRepository.findOneBy({
      id: request.params.id,
    });

    if (!covenantAuthorToRemove) {
      return response
        .status(400)
        .json({ status: 'convênio/concedente não encontrada!' });
    }

    const deleteResponse = await convenantAuthorsRepository.softDelete(
      covenantAuthorToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response
        .status(400)
        .json({ status: 'convênio/concedente não foi excluido!' });
    }

    return response.json(covenantAuthorToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const convenantAuthorsRepository =
      APPDataSource.getRepository(CovenantAuthor);

    const covenantAuthorToRestore = await convenantAuthorsRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!covenantAuthorToRestore) {
      return response
        .status(400)
        .json({ status: 'covenantAuthor não encontrado!' });
    }

    const restoreResponse = await convenantAuthorsRepository.restore(
      covenantAuthorToRestore.id,
    );

    if (restoreResponse.affected) {
      return response
        .status(200)
        .json({ status: 'covenantAuthor recuperado!' });
    }

    return response.json(convenantAuthorsRepository);
  }
}

export { CovenantAuthorsController };
