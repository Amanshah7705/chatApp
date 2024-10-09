import { backend } from "./constant";
import { io } from "socket.io-client";
export const socket = io(`${backend}`);
