import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('login')) {
      this.router.navigate(['/']);
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const auth: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };

    // console.log(auth)
    this.authService.loginUser(auth);
  }
}
