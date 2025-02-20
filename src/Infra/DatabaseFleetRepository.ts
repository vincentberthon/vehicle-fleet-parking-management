import type { Repository } from "typeorm";

import { Fleet } from "../Domain/Fleet.js";
import { Vehicle } from "../Domain/Vehicle.js";
import { database } from "./database.js";

export class DatabaseFleetRepository {
  private fleetRepo: Repository<Fleet>;
  private vehicleRepo: Repository<Vehicle>;

  constructor() {
    this.fleetRepo = database.getRepository(Fleet);
    this.vehicleRepo = database.getRepository(Vehicle);
  }

  async getFleet(id: string): Promise<Fleet | null> {
    return await this.fleetRepo.findOne({
      where: { id },
      relations: ["vehicles"],
    });
  }

  async getVehicle(fleetId: string, plateNumber: string): Promise<Vehicle | null> {
    return await this.vehicleRepo.findOne({
      where: { fleet: { id: fleetId }, plateNumber },
      relations: ["fleet"],
    });
  }

  async saveFleet(fleet: Fleet): Promise<void> {
    await this.fleetRepo.save(fleet);
  }

  async saveVehicle(vehicle: Vehicle): Promise<void> {
    await this.vehicleRepo.save(vehicle);
  }
}
