import { Request, Response, NextFunction } from "express";
import HandleMiddleware from "../utils/handleMiddleware";
import { registerSchema, loginSchema } from "../schema/schema";
import { prisma } from "../app/main";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = HandleMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const checkParse = registerSchema.safeParse(data);
      if (!checkParse.success) {
        return res.status(400).json({ error: checkParse.error.errors });
      }
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      checkParse.data.password = await bcrypt.hash(
        checkParse.data.password,
        salt
      );
      const newUser = await prisma.user.create({
        data: checkParse.data,
      });
      return res.status(201).json(newUser);
    } catch (error) {
      throw error;
    }
  }
);

export const loginUser = HandleMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      //@ts-ignore
      const checkParse = loginSchema.safeParse(data);
      if (!checkParse.success) {
        return res.status(400).json({ error: checkParse.error.errors });
      }
      const newUser = await prisma.user.findFirst({
        where: { username: checkParse.data.username },
      });

      if (!newUser) {
        return res.status(404).json({ error: "User does not exist" });
      }

      const checkPassword = await bcrypt.compare(
        checkParse.data.password,
        newUser.password
      );
      if (!checkPassword) {
        return res.status(401).json({ error: "Wrong password" });
      }
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        process.env.TOKEN_SECRET || "",
        { expiresIn: "3600s" }
      );
      const getToken = newUser.LoginUser.find(
        (device) => device === data.deviceId
      );
      if (!getToken) {
        const szn = newUser.LoginUser.length;
        if (szn < 6) {
          await prisma.user.updateMany({
            data: {
              LoginUser: {
                push: checkParse.data.deviceId,
              },
            },
            where: {
              username: checkParse.data.username,
            },
          });
        } else {
          return res.status(404).json({ error: "Device capacity excceded" });
        }
      }
      return res.status(201).json({
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          token,
        },
        message: "Success Login",
      });
    } catch (error) {
      next(error);
    }
  }
);

export const emailVerify = HandleMiddleware(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      if (!data.email || !data) {
        return res.status(401).json({ error: "email not be empty" });
      }
      const newUser = await prisma.user.findFirst({
        where: { email: data.email },
      });
      if (!newUser) {
        return res.status(404).json({ error: "User does not exist" });
      }
      return res.status(201).json({ message: "Success Login" });
    } catch (error) {
      next(error);
    }
  }
);
