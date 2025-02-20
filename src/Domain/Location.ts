import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("double precision")
  latitude!: number;

  @Column("double precision")
  longitude!: number;

  @Column("double precision", { nullable: true })
  altitude?: number;

  constructor(latitude: number, longitude: number, altitude?: number) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
  }

  equals(other: Location): boolean {
    return (
      this.latitude === other.latitude &&
      this.longitude === other.longitude &&
      this.altitude === other.altitude
    );
  }
}
