import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

import { Vehicle } from "./Vehicle.js";

@Entity()
export class Fleet {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  ownerId!: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.fleet, { cascade: true })
  vehicles!: Vehicle[];

  constructor(ownerId: string) {
    this.ownerId = ownerId;
  }

  registerVehicle(vehicle: Vehicle) {
    if (this.vehicles.some((v) => v.plateNumber === vehicle.plateNumber)) {
      throw new Error("Vehicle already registered in this fleet");
    }
    this.vehicles.push(vehicle);
  }
}
