import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { USER_ROLES } from 'src/user/schema/user.schema';

export class LoginDTO {
  @IsString({ message: 'email should be string' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString({ message: 'password should be string' })
  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password should be atleast of length 6.',
  })
  password!: string;

  @IsEnum(USER_ROLES, {
    message: 'Role must be either user or admin',
  })
  role!: USER_ROLES;
}
