import HandleMiddleware from "../utils/handleMiddleware";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../app/main";
const AuthMiddleWare = HandleMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization?.split(" ");
      //@ts-ignore
      const token = accessToken[1];
      const checkjwt = jwt.verify(token, process.env.TOKEN_SECRET || "");
      if (!checkjwt) {
        throw new Error("Invalid jwt");
      }
      const user = await prisma.user.findFirst({
        where: {
          //@ts-ignore
          id: checkjwt.id,
        },
      });
      if (!user) {
        throw new Error("Invalid user");
      }
      //@ts-ignore

      req.user = user;

      next();
    } catch (error) {
      throw error;
    }
  }
);

export default AuthMiddleWare;
