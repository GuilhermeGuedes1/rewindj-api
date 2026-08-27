import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'RewindJ Agency',
    description: 'Organization name.',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: '12.345.678/0001-90',
    description: 'Organization document.',
  })
  @IsString()
  @IsNotEmpty()
  document!: string;

  @ApiProperty({
    example: 'contato@rewindj.com.br',
    description: 'Organization email.',
  })
  @IsEmail()
  email!: string;
}
