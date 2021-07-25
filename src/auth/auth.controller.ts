import {
  UseGuards,
  Body,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpCode } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { User } from '../users/users.entity';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() request: any) {
    const { id: userId } = request.user;
    const jwtAccessToken = this.authService.getJwtAccessToken(userId);
    const jwtRefreshToken = this.authService.getJwtAccessToken(userId);
    await this.usersService.setCurrentRefreshToken(jwtRefreshToken, userId);

    return {
      success: true,
      message: 'Authenticated',
      data: {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
      },
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  refresh(@Request() request: any) {
    const { id: userId } = request.user;
    const jwtRefreshToken = this.authService.getJwtRefreshToken(userId);
    return {
      success: true,
      message: 'Authenticated',
      data: {
        refreshToken: jwtRefreshToken,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @HttpCode(200)
  async logOut(@Request() request: any) {
    const { id: userId } = request.user;
    await this.usersService.removeRefreshToken(userId);
    return {};
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.usersService.create(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Request() request: any) {
    const { id: adminId } = request.user;
    const resp = this.authService.getById(adminId);

    return resp;
  }
}
