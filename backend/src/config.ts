import * as dotenv from "dotenv";
dotenv.config();

export const LISTEN_PORT = Number(process.env.LISTEN_PORT);
export const SOCKET_PORT = Number(process.env.SOCKET_PORT);
export const LOG_LEVEL = Number(process.env.LOG_LEVEL);
export const MONGO_URI = String(process.env.MONGO_URI);
