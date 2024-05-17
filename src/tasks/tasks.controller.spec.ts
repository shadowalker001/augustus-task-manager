import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { FirebaseService } from '../firebase/firebase.service';

describe('TasksController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TasksService, FirebaseService],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
