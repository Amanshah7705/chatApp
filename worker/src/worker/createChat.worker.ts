import { Queue, Worker } from "bullmq";
import { createChat } from "../controller/chat.controller";
const createChatQueue = new Queue("createChatQueueServer", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
export const createChatWorker = new Worker(
  "createChatQueue",
  async (job) => {
    const res = await createChat(job.data.displayData);
    const newData = {
      displayData: res,
      previous: job.data.previous,
    };
    await createChatQueue.add("friendFromServer", newData);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
