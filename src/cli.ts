#!/usr/bin/env node
import { Command } from "commander";

import { ParkVehicleCommand } from "./App/Commands/ParkVehicleCommand.js";
import { RegisterVehicleCommand } from "./App/Commands/RegisterVehicleCommand.js";
import { ParkVehicleHandler } from "./App/Handlers/ParkVehicleHandler.js";
import { RegisterVehicleHandler } from "./App/Handlers/RegisterVehicleHandler.js";
import { Mediator } from "./App/Mediator.js";
import { Fleet } from "./Domain/Fleet.js";
import { connectDatabase } from "./Infra/database.js";
import { DatabaseFleetRepository } from "./Infra/DatabaseFleetRepository.js";

const program = new Command();
const mediator = new Mediator();
const fleetRepo = new DatabaseFleetRepository();

mediator.register(
	"RegisterVehicle",
	new RegisterVehicleHandler(fleetRepo).execute,
);
mediator.register("ParkVehicle", new ParkVehicleHandler(fleetRepo).execute);

async function init() {
	await connectDatabase();
	console.log("Database connected.");
}

program
	.command("create <userId>")
	.description("Create fleet and return fleetId")
	.action(async (userId) => {
		await init();
		const fleet = new Fleet(userId);
		await fleetRepo.saveFleet(fleet);
		console.log(`Fleet created ID : ${fleet.id}`);
	});

program
	.command("register-vehicle <fleetId> <plate>")
	.description("Register vehicle in fleet")
	.action(async (fleetId, plate) => {
		await init();
		await mediator.send(
			"RegisterVehicle",
			new RegisterVehicleCommand(fleetId, plate),
		);
		console.log(`Vehicle ${plate} added to fleet ${fleetId}`);
	});

program
	.command("localize-vehicle <fleetId> <plate> <lat> <lng> [alt]")
	.description("Localize a vehicle")
	.action(async (fleetId, plate, lat, lng, alt) => {
		await init();
		await mediator.send(
			"ParkVehicle",
			new ParkVehicleCommand(
				fleetId,
				plate,
				Number.parseFloat(lat),
				Number.parseFloat(lng),
				alt ? Number.parseFloat(alt) : undefined,
			),
		);
		console.log(`Localize vehicle ${plate} at coordinates ${lat}:${lng}`);
	});

program.parse(process.argv);
