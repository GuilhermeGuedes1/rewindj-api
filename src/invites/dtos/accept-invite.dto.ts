import { IsOptional, IsString, MinLength } from 'class-validator';

export class AcceptInviteDto {
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
