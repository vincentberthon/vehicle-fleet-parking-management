import { Location } from "../../Domain/Location.js";
import type { DatabaseFleetRepository } from "../../Infra/DatabaseFleetRepository.js";
import type { ParkVehicleCommand } from "../Commands/ParkVehicleCommand.js";

export class ParkVehicleHandler {
  constructor(private fleetRepo: DatabaseFleetRepository) {}

  async execute(command: ParkVehicleCommand) {
    const vehicle = await this.fleetRepo.getVehicle(command.fleetId, command.vehiclePlateNumber);
    if (!vehicle) throw new Error("Vehicle not found in fleet");

    const location = new Location(command.latitude, command.longitude, command.altitude);
    vehicle.park(location);

    await this.fleetRepo.saveVehicle(vehicle);
  }
}
