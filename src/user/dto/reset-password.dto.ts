import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from '../../validators/is-strong-password.validator';
import { Match } from './../../validators';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  // @Matches(
  //   /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  //   { message: 'password too weak' },
  // )
  password: string;

  // @IsString()
  @IsNotEmpty()
  // @MinLength(4)
  // @MaxLength(20)
  // @Match('password')
  confirmPassword: string;

  @IsString()
  resetPasswordToken: string;
}
