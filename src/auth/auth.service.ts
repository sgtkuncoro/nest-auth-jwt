import {
  HttpException,
  Injectable,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';

import { RegisterDto } from './dto/register.dto';
import { User } from './../users/users.entity';
import { TokenPayload } from './interfaces/tokenPayload.interface';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   *
   * @param userId
   * @returns string
   */
  public getJwtAccessToken(userId: number): any {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
      )}s`,
    });

    return token;
  }

  /**
   *
   * @param userId
   * @returns object of cookie and token
   */
  public getJwtRefreshToken(userId: number): string {
    const payload: TokenPayload = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
      )}s`,
    });

    return refreshToken;
  }

  async validateCredentials(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    try {
      const user = await this.usersRepository.findOne({ email });
      const match = await bcrypt.compare(password, user.hash);
      if (user && match) {
        return user;
      }

      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST
      );
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getById(userId): Promise<any> {
    try {
      const resp = await this.usersRepository.findOne({ id: userId });

      if (!resp) {
        return new UnauthorizedException();
      }

      return new HttpException(
        {
          status: HttpStatus.OK,
          message: 'Success',
          data: resp,
        },
        HttpStatus.OK
      );
    } catch (error) {
      throw error;
    }
  }
}
