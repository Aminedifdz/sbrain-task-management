import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { SignInDto } from './dto';
import { CustomResponse } from './../helpers';
import { RefreshTokenDto } from './dto';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    const result = await this.authService.signup(
      dto,
    );

    return CustomResponse.customResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: SignInDto) {
    const result = await this.authService.signin(
      dto,
    );

    return CustomResponse.customResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  async generateToken(
    @Body() dto: RefreshTokenDto,
  ) {
    const result =
      await this.authService.valiateRefreshToken(
        dto,
      );

    return CustomResponse.customResponse(result);
  }

  @Delete('refreshToken')
  async deleteToken(
    @Body() dto: RefreshTokenDto,
  ) {
    const result =
      await this.authService.deleteRefreshToken(
        dto,
      );

    return CustomResponse.customResponse(result);
  }
}
