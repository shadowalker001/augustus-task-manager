import { Controller, Post, Body, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint for user registration
  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto): Promise<any> {
    try {
      return await this.authService.registerUser(registerDto);
    } catch (error) {
      throw new HttpException(`Registration failed, ${error.message??''}`, HttpStatus.BAD_REQUEST);
    }
  }

  // Endpoint for user login
  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto): Promise<any> {
    try {
      const result = await this.authService.loginUser(loginDto);
      if (!result) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return result;
    } catch (error) {
      throw new HttpException(`Login failed, Invalid email or password`, HttpStatus.UNAUTHORIZED);
    }
  }
}
