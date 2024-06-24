import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER || "admin";
export const DB_PASSWORD = process.env.DB_PASSWORD || "proyecto2024";
export const DB_SERVER = process.env.DB_SERVER || "database-1.cwllrtvtnepe.us-east-1.rds.amazonaws.com";
export const DB_DATABASE = process.env.DB_DATABASE || "ProjectHub11";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
export const BUCKET_PROJECTS_FILE = 'projects';
export const BUCKET_COVERS_FILE = 'covers';