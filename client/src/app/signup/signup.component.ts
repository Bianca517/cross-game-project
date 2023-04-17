import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { response } from 'express';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  firstName: String = "";
  lastName: String = "";
  email: String = "";
  password: String = "";

  constructor(private signupService: SignupService) {

  }

  ngOnInit(): void {
      
  }

  signupUser() {
    console.log("SignUp Button Pressed!");
    console.log(this.firstName + "\n" + this.lastName + "\n" + this.email + "\n" + this.password);
    
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    }

    return this.signupService.signUpUser(userData)
      .subscribe((response: any) => {
        console.log(response);
      });
    
  }
}
