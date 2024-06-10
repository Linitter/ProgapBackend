import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

export async function verifyToken(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const token = request.headers['token'];

  if (!token) {
    return response
      .status(401)
      .json({ auth: false, message: 'O token não foi fornecido!' });
  }

  try {
    const hostname = request.hostname;
    let validationUrl = `https://ssows-h.ssp.go.gov.br/validate?token=${token}`;

    if (hostname === 'progap.policiacivil.go.gov.br') {
      validationUrl = `https://ssows.ssp.go.gov.br/validate?token=${token}`;
    }

    const apiResponse = await axios.get(validationUrl);
    if (!apiResponse.data.token || apiResponse.data.token === '') {
      return response.status(401).json({
        auth: false,
        message: 'Token inválido!',
      });
    }

    next();
  } catch (error) {
    return response.status(500).json({
      auth: false,
      message: 'Erro ao autenticar o token!',
    });
  }
}
