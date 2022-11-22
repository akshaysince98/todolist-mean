import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from '../auth-data.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('login')) {
      this.router.navigate(['/']);
    }
  }

  onSignup(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      this.isLoading = false
      return;
    }

    const auth: AuthData = {
      email: form.value.email,
      password: form.value.password,
    };

    // console.log(auth)
    this.authService.createUser(auth);
    this.isLoading = false
  }
}
