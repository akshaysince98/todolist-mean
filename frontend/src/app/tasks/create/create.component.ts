import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Task } from '../task.model';
// import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { imageTypeValidator } from './image-type.validator';

@Component({
  selector: 'app-task-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateTaskComponent implements OnInit {
  public mode = 'Create';
  private taskId: string | null;
  public task: Task | any;

  taskForm: FormGroup;

  isLoading = false;

  imagePreview: any = null;

  constructor(
    public tasksService: TasksService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskForm = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required, imageTypeValidator],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.mode = 'Edit';
        this.taskId = paramMap.get('taskId');
        this.isLoading = true;
        let loginToken = localStorage.getItem('login');
        this.task = this.tasksService
          .getTask(this.taskId, loginToken)
          .subscribe(
            (res) => {
              this.isLoading = false;

              this.task = res.data;
              this.imagePreview = this.task.imagePath;
              this.taskForm.setValue({
                title: this.task.title,
                description: this.task.description,
                image: null,
              });
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
      } else {
        this.mode = 'Create';
        this.taskId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.taskForm.patchValue({ image: file });
    this.taskForm.get('image')?.updateValueAndValidity();

    console.log(this.taskForm.value.image);
    this.imageToDataUrl(file);
  }

  imageToDataUrl(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      // console.log(this.imagePreview)
    };

    reader.readAsDataURL(file);
  }

  loginToken = localStorage.getItem('login');
  onSaveTask() {
    this.isLoading = true;

    if (this.mode == 'Edit') {
      const task: any = {
        _id: this.task._id || null,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        image: this.taskForm.value.image,
      };

      this.tasksService.updateTask(task, this.loginToken);
    } else {
      if (!this.taskForm.valid) {
        this.isLoading = false;
        alert('Add image file');
        return;
      }
      const task: any = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        image: this.taskForm.value.image,
      };
      // console.log(task);

      this.tasksService.addTask(task, this.loginToken);
    }
    this.isLoading = false;
    this.taskForm.reset();
  }
}
