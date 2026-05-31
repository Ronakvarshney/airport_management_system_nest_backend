import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_ROLES } from 'src/user/schema/user.schema';

export class RegisterDTO {
  @IsString({ message: 'name should be string' })
  @IsNotEmpty()
  @MinLength(3, {
    message: 'Name should minimum have greater than equal to 3 characters',
  })
  @MaxLength(30, {
    message: 'Name length not max than 30 characters.',
  })
  name!: string;

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
