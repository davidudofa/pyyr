import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() data: any;
  @Input() events: any;

  public username: string;
  public password: string;

  public isUsernameValid: boolean;
  public isPasswordValid: boolean;

  constructor() {
    this.isUsernameValid = true;
    this.isPasswordValid = true;
  }

  onEvent = (event: string): void => {
    if (event == "onLogin" && !this.validate()) {
      return;
    }
    if (this.events[event]) {
      this.events[event]({
        'username': this.username,
        'password': this.password
      });
    }
  }

  validate(): boolean {
    this.isUsernameValid = true;
    this.isPasswordValid = true;
    if (!this.username || this.username.length == 0) {
      this.isUsernameValid = false;
    }

    if (!this.password || this.password.length == 0) {
      this.isPasswordValid = false;
    }

    return this.isPasswordValid && this.isUsernameValid;
  }

  ngOnInit() {
  }

}
