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

export const parking1x3: Array<IParkingLotSize> = [
  {
    slotId: 'A-1',
    slotAddress: {
      lat: 0,
      long: 1,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
  {
    slotId: 'A-2',
    slotAddress: {
      lat: 0,
      long: 2,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
  {
    slotId: 'A-3',
    slotAddress: {
      lat: 0,
      long: 3,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
];

export const parking1x4: Array<IParkingLotSize> = [
  {
    slotId: 'A-1',
    slotAddress: {
      lat: 0,
      long: 1,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
  {
    slotId: 'A-2',
    slotAddress: {
      lat: 0,
      long: 2,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
  {
    slotId: 'A-3',
    slotAddress: {
      lat: 0,
      long: 3,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
  {
    slotId: 'A-4',
    slotAddress: {
      lat: 0,
      long: 4,
    },
    available: true,
    assign: {
      ticketId: '',
      licencePlate: '',
      size: '',
    },
  },
];
