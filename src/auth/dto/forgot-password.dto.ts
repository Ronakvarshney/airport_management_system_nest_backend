import { IsEmail } from 'class-validator';

export class ForgotPassDTO {
  @IsEmail()
  email!: string;
}
