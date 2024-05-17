import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

// DTO for user login
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
