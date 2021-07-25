import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'user email',
    example: 'foo@mail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'user password',
    example: '',
  })
  password: string;
}
