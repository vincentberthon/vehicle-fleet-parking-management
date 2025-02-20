import "reflect-metadata";

import { Mediator } from "./App/Mediator.js";
import { ParkVehicleHandler } from "./App/Handlers/ParkVehicleHandler.js";
import { RegisterVehicleHandler } from "./App/Handlers/RegisterVehicleHandler.js";
import { connectDatabase } from "./Infra/database.js";
import { DatabaseFleetRepository } from "./Infra/DatabaseFleetRepository.js";

async function start() {
  await connectDatabase();

  const mediator = new Mediator();
  const fleetRepo = new DatabaseFleetRepository();

  mediator.register("RegisterVehicle", new RegisterVehicleHandler(fleetRepo).execute);
  mediator.register("ParkVehicle", new ParkVehicleHandler(fleetRepo).execute);

  console.log("Application is ready!");
}

start();
