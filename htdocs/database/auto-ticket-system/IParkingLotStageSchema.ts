import { ObjectId } from 'mongodb';

export interface IParkingLotStageSchema {
  _id: ObjectId;
  slotId: string;
  slotAddress: {
    lat: number;
    long: number;
  };
  available: boolean;
  assign: {
    ticketId: string;
    licencePlate: string;
    carSize: string;
  };
}
