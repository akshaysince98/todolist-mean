import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private token: string;
  private userUpdated = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  createUser(authData: AuthData) {
    this.http
      .post('http://localhost:3000/auth/user/signup', authData)
      .subscribe((res) => {
        this.loginUser(authData)
      });
  }

  loginUser(authData: AuthData) {
    this.http
      .post<{
        message: string;
        data: string;
      }>('http://localhost:3000/auth/user/login', authData)
      .subscribe((res) => {
        console.log(res);
        this.token = res.data
        localStorage.setItem("login", this.token)
        if(res.data){
          this.router.navigate(['/']);
        }

        this.userUpdated.next(true)

      },
      (err)=>{
        alert("Could not login, check your email and/or passwrod again")
      }
      );
  }
}
