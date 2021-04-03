import { IsIn } from 'class-validator';

export class CreateParkingLotDto {
  @IsIn(['3', '4', 'square3'])
  size: '3' | '4' | 'square3';
}
