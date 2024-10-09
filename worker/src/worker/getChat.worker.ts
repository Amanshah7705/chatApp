import { Queue, Worker } from "bullmq";
import { getChats } from "../controller/chat.controller";
const getChatQueue = new Queue("getChatQueueServer", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
export const getChatWorker = new Worker(
  "getChatQueue",
  async (job) => {
    const res = await getChats(job.data.displayData);
    const newData = {
      displayData: res,
      previous: job.data.previous,
    };
    await getChatQueue.add("friendFromServer", newData);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
