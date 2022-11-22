import { Task } from './task.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<{ tasks: Task[]; num: Number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getTaskUpdateListener() {
    return this.tasksUpdated.asObservable();
  }

  addTask(task: any, token: any) {
    console.log('add task called', task);

    let taskFormData: any = new FormData();
    taskFormData.append('title', task.title);
    taskFormData.append('description', task.description);
    taskFormData.append('token', localStorage.getItem('login'));
    taskFormData.append('image', task.image);

    console.log(taskFormData.get('image'));

    this.http
      .post<{ message: string; data: Task }>(
        'http://localhost:3000/api/tasks/create',
        taskFormData
      )
      .subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/']);
        },
        (err) => {
          alert(err.message);
          this.router.navigate(['login']);
        }
      );
  }

  getTasks(taskPerPage?: Number, currentPage?: Number) {
    this.http
      .get<{ message: string; data: Task[]; num: Number; creatorMail: string }>(
        'http://localhost:3000/api/tasks?pagesize=' +
          taskPerPage +
          '&currentpage=' +
          currentPage
      )
      .subscribe((res) => {
        console.log(res);
        this.tasks = res.data;
        this.tasksUpdated.next({ tasks: [...this.tasks], num: res.num });
      });
  }

  getTask(id: string | null, token: any) {
    let taskSub = this.http.post<{ message: string; data: Task; num: Number }>(
      'http://localhost:3000/api/tasks/' + id,
      { token }
    );

    return taskSub;
  }

  updateTask(task: any, token: any) {
    console.log('update task called', task.image);

    let taskFormData: any = new FormData();
    taskFormData.append('title', task.title);
    taskFormData.append('description', task.description);
    taskFormData.append('token', localStorage.getItem('login'));
    if(task.image){
      taskFormData.append('image', task.image);
    }

    console.log(taskFormData.get('image'));

    this.http
      .patch<{
        num: Number;
        message: string;
        data: Task;
      }>('http://localhost:3000/api/tasks/' + task._id, taskFormData)
      .subscribe(
        (res) => {
          console.log(res);
          this.tasksUpdated.next({ tasks: [...this.tasks], num: res.num });
        },
        (err) => {
          if (err.status == 401) {
            alert('You are not authorized to make changes to this task');
          }
        }
      );
    this.router.navigate(['/']);
  }

  deleteTask(token: any, id?: string) {
    console.log(id, token);
    return this.http.post('http://localhost:3000/api/tasks/delete/' + id, {
      token,
    });
  }
}
