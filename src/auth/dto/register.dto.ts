import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'user first name',
    example: 'foo',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'user last name',
    example: 'foo',
  })
  lastName: string;

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
    description: 'user username',
    example: 'foo123',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    description: 'user password',
    example: '',
  })
  password: string;
}
