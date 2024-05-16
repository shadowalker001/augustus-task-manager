import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  welcome(): Record<string, string> {
    return {message: 'Welcome to my Task Manager!'};
  }
}
