import { PrismaClient } from "@prisma/client";
import express from "express";
import http from "http";
import cors from "cors";
import authRouter from "../routes/auth.router";
import { SocketIOService } from "../utils/socketHelp";
import cookieParser from "cookie-parser";

import { Queue } from "bullmq";
import {
  createChatWorkerNode,
  getChatWorkerNode,
  getFriendWorkerNode,
  myPreviousConWorkerNode,
} from "../controllers/chat.controllers";
export const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
const getChatQueue = new Queue("getChatQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
const getFriendQueue = new Queue("getFriendQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
const myPreviousConQueue = new Queue("myPreviousConQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
const createChatQueue = new Queue("createChatQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
const server = http.createServer(app);

SocketIOService.instance().initialize(server, {
  cors: {
    origin: "*",
  },
});

const io = SocketIOService.instance().getServer();

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join-server", async (data) => {
    try {
      const cust = await prisma.socket.create({
        data: {
          socketId: socket.id.toString(),
          userId: data.userId,
        },
      });
    } catch (error) {
      console.error("Error creating socket record:", error);
    }
  });

  socket.on("GetChats", async (data) => {
    try {
      const newData = {
        displayData: data,
        previous: socket.id,
      };
      await getChatQueue.add("FirstQueue-GetChats", newData, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    } catch (error) {
      console.error("Error in GetChats:", error);
    }
  });

  socket.on("GetFriends", async (data) => {
    try {
      const newData = {
        displayData: data,
        previous: socket.id,
      };
      await getFriendQueue.add("FirstQueue-GetFriends", newData, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    } catch (error) {
      console.error("Error in GetFriends:", error);
    }
  });

  socket.on("myPreviousCon", async (data) => {
    try {
      const newData = {
        displayData: data,
        previous: socket.id,
      };
      await myPreviousConQueue.add("FirstQueue-myPreviousCon", newData, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    } catch (error) {
      console.error("Error in myPreviousCon:", error);
    }
  });

  socket.on("createChat", async (data) => {
    try {
      const newData = {
        displayData: data,
        previous: socket.id,
      };
      await createChatQueue.add("FirstQueue-createChat", newData, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    } catch (error) {
      console.error("Error in createChat:", error);
    }
  });

  socket.on("disconnect", async () => {
    const id = socket.id.toString();
    await prisma.socket.deleteMany({
      where: {
        socketId: id,
      },
    });
    console.log("Client disconnected");
  });
});

async function startServer() {
  try {
    await prisma.$connect();
    getFriendWorkerNode;
    getChatWorkerNode;
    myPreviousConWorkerNode;
    createChatWorkerNode;
    server.listen(process.env.PORT, () =>
      console.log(`Server is running on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
