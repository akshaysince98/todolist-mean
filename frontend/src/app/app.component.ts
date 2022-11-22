import { Component } from '@angular/core';
import { Task } from './tasks/task.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  // delete these
  tasks: Task[] = [];

  onTaskAdd(task: Task) {
    this.tasks.push(task);
    console.log(task, this.tasks)
  }
}
