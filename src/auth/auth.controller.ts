import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // async register(@Body(new ValidationPipe()) registerDto: RegisterDto): Promise<any> {
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    try {
      return await this.authService.registerUser(registerDto);
    } catch (error) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const result = await this.authService.loginUser(loginDto);
      if (!result) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return result;
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
