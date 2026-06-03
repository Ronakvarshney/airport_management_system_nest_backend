import { IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @MinLength(6, { message: 'password must atleast 6 characters long' })
  @MaxLength(20, { message: 'password not more than 20 characters in length' })
  password!: string;
}
