import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER || "admin";
export const DB_PASSWORD = process.env.DB_PASSWORD || "proyecto2024";
export const DB_SERVER = process.env.DB_SERVER || "database-1.cwllrtvtnepe.us-east-1.rds.amazonaws.com";
export const DB_DATABASE = process.env.DB_DATABASE || "ProjectHub11";
