import { Queue, Worker } from "bullmq";
import { SocketIOService } from "../utils/socketHelp";
import { prisma } from "../app/main";
const getChatQueue = new Queue("getChatQueue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
export const getFriendWorkerNode = new Worker(
  "getFriendQueueServer",
  async (job) => {
    SocketIOService.instance().sendMessage(
      job.data.previous,
      "getFriendFromServer",
      job.data.displayData
    );
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

export const getChatWorkerNode = new Worker(
  "getChatQueueServer",
  async (job) => {
    SocketIOService.instance().sendMessage(
      job.data.previous,
      "getChatFromServer",
      job.data.displayData
    );
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

export const myPreviousConWorkerNode = new Worker(
  "myPreviousConQueueServer",
  async (job) => {
    SocketIOService.instance().sendMessage(
      job.data.previous,
      "myPreviousConQueueServer",
      job.data.displayData
    );
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);

export const createChatWorkerNode = new Worker(
  "createChatQueueServer",
  async (job) => {
    if (job.data.displayData.destinationId) {
      const sockets = await prisma.socket.findMany({
        where: {
          OR: [
            {
              userId: job.data.displayData.sourceId,
            },
            {
              userId: job.data.displayData.destinationId,
            },
          ],
        },
        select: {
          socketId: true,
          userId: true,
        },
      });
      const jobs = sockets.map((socketData) => {
        const isSameUser = socketData.userId === job.data.displayData.sourceId;
        const newData = {
          name: "FirstQueue-GetChats",
          data: {
            previous: socketData.socketId,
            displayData: {
              sourceId: isSameUser
                ? job.data.displayData.sourceId
                : job.data.displayData.destinationId,
              destinationId: isSameUser
                ? job.data.displayData.destinationId
                : job.data.displayData.sourceId,
            },
          },
        };
        return newData;
      });
      const newData1 = {
        displayData: {
          sourceId: job.data.displayData.sourceId,
        },
        previous: job.data.previous,
      };
      await getChatQueue.addBulk(jobs);
    } else {
      const sockets = await prisma.group.findFirst({
        where: {
          id: job.data.displayData.groupId,
        },
        select: {
          admin: {
            select: {
              id: true,
            },
          },
          members: {
            select: {
              id: true,
            },
          },
        },
      });
      if (sockets) {
        const idsArray = [
          ...sockets.admin.map((ids) => ids.id),
          ...sockets.members.map((ids) => ids.id),
        ];
        const newSockets = await prisma.socket.findMany({
          where: {
            userId: {
              in: idsArray,
            },
          },
          select: {
            socketId: true,
            userId: true,
          },
        });
        const jobs = newSockets.map((socketData) => {
          const newData = {
            name: "FirstQueue-GetChats",
            data: {
              previous: socketData.socketId,
              displayData: {
                sourceId: socketData.userId,
              },
            },
          };
          return newData;
        });
        await getChatQueue.addBulk(jobs);
      }
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
