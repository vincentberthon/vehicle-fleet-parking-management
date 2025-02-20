export class ParkVehicleCommand {
  constructor(
    public readonly fleetId: string,
    public readonly vehiclePlateNumber: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly altitude?: number
  ) {}
}
