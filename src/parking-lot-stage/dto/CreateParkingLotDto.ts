import { IsInt, Max, Min } from 'class-validator';

export class CreateParkingLotDto {
  @IsInt()
  @Max(4)
  @Min(3)
  size: 3 | 4;
}
