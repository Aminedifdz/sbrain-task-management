import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Render,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser, Public } from '../decorators';
import { JwtGuard } from '../auth/guard';
import {
  VerifyUserDto,
  EditUserDto,
  GetResetPasswordDto,
  ResetPasswordDto,
  RequestPasswordDto,
} from './dto';
import { UserService } from './user.service';
import { CustomResponse } from './../helpers';
import {
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return CustomResponse.customResponse(user);
  }

  @Patch()
  async editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    const result =
      await this.userService.editUser(
        userId,
        dto,
      );
    return CustomResponse.customResponse(result);
  }

  @Public()
  @Render('users/password-verify-response')
  @Get('verify/:verificationToken')
  async verifyUser(
    @Param('verificationToken')
    verificationToken: string,
    @Body() dto: VerifyUserDto,
  ) {
    const result =
      await this.userService.verifyUser(
        verificationToken,
      );

    return CustomResponse.customResponse(result);
  }

  @Public()
  @Render('users/password-reset')
  @Get(
    'get_reset_password/:id/:resetPasswordToken',
  )
  async getResetPassword(
    @Body() dto: GetResetPasswordDto,
    @Param('id') id: number,
    @Param('resetPasswordToken')
    resetPasswordToken: string,
  ) {
    const result =
      await this.userService.getResetPassword(
        id,
        resetPasswordToken,
        dto,
      );

    return {
      link: result.link,
      resetToken: result.resetPasswordToken,
    };
  }

  @Public()
  @Render('users/password-reset-response')
  @Post('reset_password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ) {
    console.log(`dto controller`, dto);
    const result =
      await this.userService.resetPassword(dto);

    return CustomResponse.customResponse(result);
  }

  @Public()
  @Post('forgot_password')
  async requestPasswordReset(
    @Body() dto: RequestPasswordDto,
  ) {
    const result =
      await this.userService.requestPasswordReset(
        dto,
      );

    return CustomResponse.customResponse(result);
  }
}
