import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";

import { Vehicle } from "../Domain/Vehicle.js";
import { Fleet } from "../Domain/Fleet.js";

dotenv.config();

export const database = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "fleet_management",
  synchronize: true,
  entities: [Fleet, Vehicle],
  logging: true,
});

export async function connectDatabase() {
  try {
    await database.initialize();
    console.log("Database connected.");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
