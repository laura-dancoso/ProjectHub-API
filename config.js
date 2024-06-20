import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const TEST = process.env.TEST || "THIS IS A TEST";