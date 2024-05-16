import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FirebaseService } from 'src/firebase/firebase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 8);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateToken(user: User): Promise<string> {
    return this.jwtService.sign(user);
  }

  async validateUser(email: string, password: string):Promise<User> {
    const userRecord = await this.firebaseService.auth.getUserByEmail(email);
    if (!userRecord) {
      return null;
    }
    const userDoc = await this.firebaseService.db.collection('users').doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return null;
    }
    const userData = userDoc.data() as User;
    const passwordIsValid = await this.comparePassword(password, userData.password);
    if (!passwordIsValid) {
      return null;
    }

    return userData;
  }

  async registerUser(registerDto: RegisterDto): Promise<Record<string, any>> {
    const { email, firstname, lastname, password } = registerDto;
    const hashedPassword = await this.hashPassword(password);
    const userRecord = await this.firebaseService.auth.createUser({
      email,
      password: hashedPassword,
      displayName: `${firstname} ${lastname}`
    });
    const user:User = {
      email: userRecord.email,
      id: userRecord.uid,
      firstname: registerDto.firstname,
      lastname: registerDto.lastname,
      password: hashedPassword,
    } 
    await this.firebaseService.db.collection('users').add(user);
    delete user.password;
    let accessToken = this.generateToken(user);
    return { message: 'User registered successfully', accessToken,  user }
  }

  async loginUser(loginDto: LoginDto): Promise<Record<string, any>> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      return null;
    }
    delete user.password;
    let accessToken = this.generateToken(user);
    return {accessToken, user};
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
