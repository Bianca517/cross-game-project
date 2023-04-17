import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  email: String ="";
  password: String ="";

  constructor(private loginService: LoginService) {
  }

  ngOnInit(): void {
      console.log("Login page created!");
  }

  loginUser() {
    console.log("Button Pressed!");
    console.log("Email: ", this.email);
    console.log("Password: ", this.password);

    const userData = {
      email: this.email,
      password: this.password
    }

    return this.loginService.loginUser(userData)
    .subscribe((response: any) => {
      console.log(response);
    });
  }
}
