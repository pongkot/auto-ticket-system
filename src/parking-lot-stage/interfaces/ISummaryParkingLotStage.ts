export interface ISummaryParkingLotStage {
  capacity: number;
  parking: {
    small: number;
    medium: number;
    large: number;
    total: number;
  };
  available: {
    small: number;
    medium: number;
    large: number;
  };
}
