import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './users.entity';
import { CreatUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  /**
   *
   * @param userId
   * @returns
   */
  async getById(userId: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ id: userId });

      if (user) {
        return user;
      }

      return new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param refreshToken
   * @param userId
   */
  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hashSync(refreshToken, 10);
    await this.usersRepository.update(
      { id: userId },
      {
        currentHashedRefreshToken,
      }
    );
  }

  /**
   *
   * @param refreshToken
   * @param userId
   * @returns
   */
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.usersRepository.findOne({ id: userId });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken
    );

    if (!isRefreshTokenMatching) {
      throw new HttpException('Incorrect refresh token!', HttpStatus.FORBIDDEN);
    }

    return user;
  }

  /**
   *
   * @param userId
   * @returns
   */
  async removeRefreshToken(userId: number) {
    return this.usersRepository.update(
      { id: userId },
      {
        currentHashedRefreshToken: null,
      }
    );
  }

  /**
   *
   * @param create
   * @returns
   */
  create(createUserDto: CreatUserDto): Promise<User> {
    const admin = new User();
    admin.firstName = createUserDto.firstName;
    admin.lastName = createUserDto.lastName;
    admin.username = createUserDto.username;
    admin.email = createUserDto.email;

    return this.usersRepository.save(admin);
  }
}
