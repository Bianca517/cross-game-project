import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../models/http-error';


export class errorController {
  public static get404(req: Request, res: Response, next: NextFunction) {
    const error = new HttpError("Not found.");
    error.statusCode = 404;
    next(error);
  }

  public static get500(error: HttpError, req: Request, res: Response, next: NextFunction) {
    res.status(error.statusCode || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  }
}
