import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(
    '------------------------------ ' +
      new Date().toLocaleString('pt-BR') +
      ' ------------------------------------',
  );
  console.log(`req:`, {
    headers: req.headers,
    body: req.body,
    originalUrl: req.originalUrl,
  });
  console.log(
    '---------------------------------------------------------------------------------------',
  );
  next();
}
