import { Vehicle } from "../../Domain/Vehicle.js";
import type { DatabaseFleetRepository } from "../../Infra/DatabaseFleetRepository.js";
import type { RegisterVehicleCommand } from "../Commands/RegisterVehicleCommand.js";

export class RegisterVehicleHandler {
  constructor(private fleetRepo: DatabaseFleetRepository) {}

  async execute(command: RegisterVehicleCommand) {
    const fleet = await this.fleetRepo.getFleet(command.fleetId);
    if (!fleet) throw new Error("Fleet not found");

    const vehicle = new Vehicle();
    fleet.registerVehicle(vehicle);

    await this.fleetRepo.saveFleet(fleet);
  }
}
