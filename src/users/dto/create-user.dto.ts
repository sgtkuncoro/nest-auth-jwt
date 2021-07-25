import { ApiProperty } from '@nestjs/swagger';

export class CreatUserDto {
  @ApiProperty({ name: 'firstName' })
  firstName: string;

  @ApiProperty({ name: 'lastName' })
  lastName: string;

  @ApiProperty({ name: 'email' })
  email: string;

  @ApiProperty({ name: 'username' })
  username: string;

  @ApiProperty({ name: 'password' })
  password: string;
}
