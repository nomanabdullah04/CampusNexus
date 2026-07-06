import { Sequelize } from "sequelize";
import { envVars } from "./env";

export const sequelize = new Sequelize(
  envVars.DB_NAME,
  envVars.DB_USER,
  envVars.DB_PASS,
  {
    host: envVars.DB_HOST,
    port: Number(envVars.DB_PORT),
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
