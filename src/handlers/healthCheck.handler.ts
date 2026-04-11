import { RequestHandler } from 'express';

export const healthCheckHandler: RequestHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
};
