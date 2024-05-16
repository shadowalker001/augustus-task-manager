import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TasksService, FirebaseService],
  controllers: [TaskController],
})
export class TaskModule {}
