import { NextFunction, Request, Response } from 'express';
import * as yup from 'yup';
import { APPDataSource } from '../database/data-source';
import { Covenant } from '../models/Covenant';
import { CovenantAuthor } from '../models/CovenantAuthor';

class CovenantsController {
  async create(request: Request, response: Response, next: NextFunction) {
    const {
      source, //fonte
      year, // Ano
      amendmentNumber, // Numero da emenda
      agreementNumber, // Número do convênio
      amendment, // Emenda
      transferAmount, // Valor do repasse
      counterpartValue, // Valor contrapartida
      globalValue, // Valor Golbal
      description, // Descrição
      balance, // Saldo
      covenantAuthor, //Array que sera injetado dados de autor e valor de contribuição
      totalValueExecuted, //valor total exec
      position,
      recursoCaptado,
    } = request.body;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      amendmentNumber: yup.string().nullable(),
      agreementNumber: yup.string().nullable(),
      amendment: yup.string().nullable(),
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

    const covenantsRepository = APPDataSource.getRepository(Covenant);

    const covenants = covenantsRepository.create({
      source, //fonte
      year, // Ano
      amendmentNumber, // Numero da emenda
      agreementNumber, // Número do convênio
      amendment, // Emenda
      transferAmount, // Valor do repasse
      counterpartValue, // Valor contrapartida
      globalValue, // Valor Golbal
      description, // Descrição
      balance, // Saldo
      totalValueExecuted, //valor total exec
      position,
      recursoCaptado,
    });

    await covenantsRepository.save(covenants);

    const covenantAuthorPromises = covenantAuthor.map(async element => {
      const contributionValue = element.contributionValue;
      const authors = element.authors;

      const convenantAuthorRepository =
        APPDataSource.getRepository(CovenantAuthor);

      const covenantAuthor = convenantAuthorRepository.create({
        contributionValue, // valor de contribuiçao
        covenants, // id do conveio
        authors, //autor
      });

      return convenantAuthorRepository.save(covenantAuthor);
    });

    try {
      await Promise.all(covenantAuthorPromises);
    } catch (err) {
      return response
        .status(500)
        .json({ status: 'Erro ao criar covenantAuthors', error: err });
    }
    return response.status(201).json(covenants);
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
    const all = await covenantsRepository.find({
      relations: {
        covenantAuthor: true,
        resourceObjects: true,
      },
    });

    return response.json(all);
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
    const { id } = request.params;

    const one = await covenantsRepository.findOne({
      where: { id: id },
      relations: {
        covenantAuthor: true,
        resourceObjects: true,
      },
    });

    return response.json(one);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const {
      source,
      year,
      amendmentNumber,
      agreementNumber,
      amendment,
      transferAmount,
      counterpartValue,
      globalValue,
      description,
      balance,
      covenantAuthor,
      totalValueExecuted, //valor total exec
      position,
      recursoCaptado,
    } = request.body;
    const id = request.params.id;

    const schema = yup.object().shape({
      source: yup.string().nullable(),
      year: yup.string().nullable(),
      amendmentNumber: yup.string().nullable(),
      agreementNumber: yup.string().nullable(),
      amendment: yup.string().nullable(),
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

    const covenantsRepository = APPDataSource.getRepository(Covenant);

    // Atualizando os dados do convênio
    await covenantsRepository.update(
      { id },
      {
        source, //fonte
        year, // Ano
        amendmentNumber, // Numero da emenda
        agreementNumber, // Número do convênio
        amendment, // Emenda
        transferAmount, // Valor do repasse
        counterpartValue, // Valor contrapartida
        globalValue, // Valor Golbal
        description, // Descrição
        balance, // Saldo
        totalValueExecuted, //valor total exec
        position,
        recursoCaptado,
      },
    );

    // Agora, vamos lidar com os covenantAuthors
    if (covenantAuthor && covenantAuthor.length > 0) {
      const covenantAuthorPromises = covenantAuthor.map(async element => {
        const contributionValue = element.contributionValue;
        const authors = element.authors;

        const convenantAuthorRepository =
          APPDataSource.getRepository(CovenantAuthor);

        // Aqui você pode checar se precisa substituir ou editar os covenantAuthors existentes
        if (element.id) {
          // Se element.id estiver presente, você pode atualizar o existente
          await convenantAuthorRepository.update(
            { id: element.id },
            {
              contributionValue,
              authors,
            },
          );
        } else {
          // Caso contrário, crie um novo covenantAuthor
          const covenantAuthor = convenantAuthorRepository.create({
            contributionValue,
            covenants: { id }, // Pode ser necessário ajustar isso dependendo da estrutura de dados
            authors,
          });
          await convenantAuthorRepository.save(covenantAuthor);
        }
      });

      try {
        await Promise.all(covenantAuthorPromises);
      } catch (err) {
        return response
          .status(500)
          .json({ status: 'Erro ao atualizar covenantAuthors', error: err });
      }
    }

    return response
      .status(201)
      .json({ status: 'Atualização concluída com sucesso!' });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
    const covenantsToRemove = await covenantsRepository.findOneBy({
      id: request.params.id,
    });

    if (!covenantsToRemove) {
      return response.status(400).json({ status: 'Covenants não encontrado!' });
    }

    const deleteResponse = await covenantsRepository.softDelete(
      covenantsToRemove.id,
    );
    if (!deleteResponse.affected) {
      return response.status(400).json({ status: 'Covenants não excluido!' });
    }

    return response.json(covenantsToRemove);
  }

  async restore(request: Request, response: Response, next: NextFunction) {
    const covenantsRepository = APPDataSource.getRepository(Covenant);
    const covenantsToRestore = await covenantsRepository.findOne({
      where: { id: request.params.id },
      withDeleted: true,
    });

    if (!covenantsToRestore) {
      return response.status(400).json({ status: 'Covenantsnão encontrado!' });
    }

    const restoreResponse = await covenantsRepository.restore(
      covenantsToRestore.id,
    );

    if (restoreResponse.affected) {
      return response.status(200).json({ status: 'Covenants recuperado!' });
    }

    return response.json(covenantsRepository);
  }
}

export { CovenantsController };
