import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly firebaseService: FirebaseService) {}
  
  async create(task: Task) {
    const result = await this.firebaseService.db.collection('tasks').add(task);
    return result.id;
  }

  findAll() {
    return `This action returns all tasks`;
  }

  async findOne(taskId: string) {
    const doc = await this.firebaseService.db.collection('tasks').doc(taskId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Task;
  }

  async update(taskId: string, task: Partial<Task>) {
    await this.firebaseService.db.collection('tasks').doc(taskId).update(task);
  }

  async remove(taskId: string) {
    await this.firebaseService.db.collection('tasks').doc(taskId).delete();
  }

  async getUserTasks(userId: string): Promise<Task[]> {
    const snapshot = await this.firebaseService.db.collection('tasks').where('userId', '==', userId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }
}
