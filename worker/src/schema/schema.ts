import { z } from "zod";

export const chatSchema = z.object({
  text: z.string().min(1),
  sourceId: z.number(),
  groupId: z.number(),
});

export type chatData = z.infer<typeof chatSchema>;
