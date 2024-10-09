import { Queue, Worker } from "bullmq";
import { getFriends } from "../controller/chat.controller";
const getFriendQueue = new Queue("getFriendQueueServer", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
export const getFriendWorker = new Worker(
  "getFriendQueue",
  async (job) => {
    const res = await getFriends(job.data.displayData);
    const newData = {
      displayData: res,
      previous: job.data.previous,
    };
    await getFriendQueue.add("friendFromServer", newData);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
