import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  storedTasks: any[] = [];

  totalTasks: any = 0;
  pageIndex = 0;
  pageSize = 3;
  pageSizeOptions = [1, 3, 5, 10];
  creatorMail = '';

  private tasksSub: Subscription = new Subscription();

  constructor(
    public tasksService: TasksService,
    private router: Router,
    public authService: AuthService
  ) {}

  private loginSub: Subscription = new Subscription();

  public loggedIn = false;

  isLoading = false;
  ngOnInit(): void {
    this.tasksService.getTasks(this.pageSize, this.pageIndex);
    this.isLoading = true;
    this.tasksSub = this.tasksService
      .getTaskUpdateListener()
      .subscribe((res) => {
        this.isLoading = false;
        console.log(res.tasks, this.pageIndex);
        this.storedTasks = res.tasks;
        if (this.pageIndex > 0 && this.storedTasks.length == 0) {
          this.pageIndex--;
        }
        this.totalTasks = res.num;
        console.log(this.storedTasks);
      });

    let loginToken = localStorage.getItem('login');
    if (loginToken) {
      this.loggedIn = true;
    }

    this.loginSub = this.authService
      .getUserUpdateListener()
      .subscribe((res) => {
        this.loggedIn = res;
      });
  }

  onChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.tasksService.getTasks(this.pageSize, this.pageIndex);
  }

  loginToken = localStorage.getItem('login');

  onDelete(id?: string) {
    // console.log(id);
    // console.log(this.loginToken)
    this.tasksService.deleteTask(this.loginToken, id).subscribe(
      (res) => {
        console.log(res);

        this.tasksService.getTasks(this.pageSize, this.pageIndex);
      },
      (err) => {
        if (err.status == 401) {
          alert('You are not authorized to make changes to this task');
          this.router.navigate(['/']);
          return;
        }

        alert('You are not logged in');
        this.router.navigate(['login']);
      }
    );
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }
}
