import { Queue, Worker } from "bullmq";
import { myPreviousCon } from "../controller/chat.controller";
const myPreviousConQueue = new Queue("myPreviousConQueueServer", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
export const getMyPreviousConWorker = new Worker(
  "myPreviousConQueue",
  async (job) => {
    const res = await myPreviousCon(job.data.displayData);
    const newData = {
      displayData: res,
      previous: job.data.previous,
    };
    await myPreviousConQueue.add("friendFromServer", newData);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
