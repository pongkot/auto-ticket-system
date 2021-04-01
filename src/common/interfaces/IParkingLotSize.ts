export interface IParkingLotSize {
  slotId: string;
  slotAddress: {
    lat: number;
    long: number;
  };
  available: boolean;
  assign: {
    ticketId: string;
    licencePlate: string;
    size: string;
  };
}
