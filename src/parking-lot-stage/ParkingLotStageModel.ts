import { ObjectId } from 'mongodb';

export class ParkingLotStageModel {
  private _id: ObjectId;
  private slotId: string;
  private slotAddressLat: number;
  private slotAddressLong: number;
  private available: boolean;
  private ticketId: string;
  private licencePlate: string;
  private size: string;

  setId(id: ObjectId): this {
    this._id = id;
    return this;
  }

  getId(): ObjectId {
    return this._id;
  }

  getSlotId(): string {
    return this.slotId;
  }

  setSlotId(slotId: string): this {
    this.slotId = slotId;
    return this;
  }

  getSlotAddressLat(): number {
    return this.slotAddressLat;
  }

  setSlotAddressLat(slotAddressLat: number): this {
    this.slotAddressLat = slotAddressLat;
    return this;
  }

  getSlotAddressLong(): number {
    return this.slotAddressLong;
  }

  setSlotAddressLong(slotAddressLong: number): this {
    this.slotAddressLong = slotAddressLong;
    return this;
  }

  getAvailable(): boolean {
    return this.available;
  }

  setAvailable(available: boolean): this {
    this.available = available;
    return this;
  }

  getTicketId(): string {
    return this.ticketId;
  }

  setTicketId(ticketId: string): this {
    this.ticketId = ticketId;
    return this;
  }

  getLicencePlate(): string {
    return this.licencePlate;
  }

  setLicencePlate(licencePlate: string): this {
    this.licencePlate = licencePlate;
    return this;
  }

  getSize(): string {
    return this.size;
  }

  setSize(size: string): this {
    this.size = size;
    return this;
  }
}
