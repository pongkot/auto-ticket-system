import { IsIn, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsIn(['s', 'm', 'l'])
  carSize: 's' | 'm' | 'l';

  @IsString()
  licencePlate: string;
}
