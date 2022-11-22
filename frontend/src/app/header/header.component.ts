import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedIn = false;

  constructor(public authService: AuthService, private router: Router) {}

  private loginSub: Subscription = new Subscription();

  ngOnInit(): void {
    let loginToken = localStorage.getItem('login');

    this.loginSub = this.authService
      .getUserUpdateListener()
      .subscribe((res) => {
        this.loggedIn = res;
      });

    if (loginToken) {
      this.loggedIn = true;
    }
  }

  logoutUser() {
    this.authService.logout();
    this.loggedIn = false;
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe;
  }
}
