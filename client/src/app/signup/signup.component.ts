import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {

  firstName: String = "";
  lastName: String = "";
  email: String = "";
  password: String = "";

  constructor(private signupService: SignupService) {

  }

  alert_name:boolean=false;
  alert_usedemail:boolean=false;
  alert_invalidemail:boolean=false;
  alert_registered:boolean = false;

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
        this.alert_registered = true;
      },
      err => { 
        if (err.status === 409) { //Email already used!
          this.alert_usedemail = true;
        } 
        if (err.status === 400) { //Invalid email format! AND Password must be minimum 7 characters length!
          this.alert_invalidemail = true;
        }  
        if (!this.firstName || !this.lastName) {
          this.alert_name = true;
        }
    });
}

  closeAlert() {
    this.alert_usedemail=false;
    this.alert_invalidemail = false;
    this.alert_name = false;
    this.alert_registered = false;
  };
}
