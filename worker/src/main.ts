import { PrismaClient } from "@prisma/client";
import { createChatWorker } from "./worker/createChat.worker";
import { getChatWorker } from "./worker/getChat.worker";
import { getFriendWorker } from "./worker/getFriend.worker";
import { getMyPreviousConWorker } from "./worker/getMyPreviousCon.worker";
export const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to Prisma");

    createChatWorker;
    getChatWorker;
    getFriendWorker;
    getMyPreviousConWorker;
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
