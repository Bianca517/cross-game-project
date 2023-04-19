import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  email: String ="";
  password: String ="";

  constructor(private loginService: LoginService, private router: Router) {}

  alert:boolean=false;
  //true => showing
  routing:boolean=false;

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
      this.routing = true; // set routing to true after successful login
      this.router.navigate(['/start']); // navigate programmatically to the start page
    },
    err => this.alert=true
    );
   
  }
  
  closeAlert() {
    this.alert=false; //false => not showing
  }
}