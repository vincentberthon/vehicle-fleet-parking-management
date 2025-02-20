import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import { Fleet } from "./Fleet.js";
import type { Location } from "./Location.js";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  plateNumber!: string;

  @ManyToOne(() => Fleet, (fleet) => fleet.vehicles)
  fleet!: Fleet;

  private location?: Location;

  park(location: Location) {
    if (this.location?.equals(location)) {
      throw new Error("Vehicle is already parked at this location");
    }
    this.location = location;
  }

  getLocation(): Location | undefined {
    return this.location;
  }
}
