import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Optional()
  firstName: string;

  @IsString()
  @Optional()
  lastName: string;
}
