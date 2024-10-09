import { NextFunction } from "express";

const HandleMiddleware = (requestHandle: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandle(req, res, next)).catch((error) => {
      next(error);
    });
  };
};
export default HandleMiddleware;
