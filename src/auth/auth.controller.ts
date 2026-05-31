import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @Get('verify/:token')
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.authService.login(body);
    res.cookie('refresh-token', (await result).token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'login successfully',
      user: (await result).user,
      token: (await result).token.accessToken,
    };
  }
}
