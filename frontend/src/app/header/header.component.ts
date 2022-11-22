import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{


  loggedIn = false;

  constructor(public authService: AuthService, private router: Router){}

  private loginSub: Subscription = new Subscription();

  ngOnInit(): void {
      let loginToken = localStorage.getItem("login")


      this.loginSub = this.authService
      .getUserUpdateListener()
      .subscribe((res) => {
        this.loggedIn = true;
      });

      if(loginToken){
        this.loggedIn = true
      }
    }

    logoutUser(){
      console.log("in logout user")
      localStorage.removeItem("login");
      this.loggedIn = false
  }

}