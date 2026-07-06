import dotenv from "dotenv";

dotenv.config({ override: true });

interface EnvConfig {
  PORT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRE: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredEnvVariable: string[] = [
    "PORT",
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "NODE_ENV",
    "BCRYPT_SALT_ROUND",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRE",
  ];
  requiredEnvVariable.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: process.env.DB_PORT || "3306",
    DB_NAME: process.env.DB_NAME as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASS: process.env.DB_PASS || "",
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE as string,
  };
};

export const envVars: EnvConfig = loadEnvVariables();