import { Component, OnInit } from '@angular/core';
import { SignupService } from '../services/signup.service';
import { ViewEncapsulation } from '@angular/core';
import { UserServiceService } from '../services/user-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {

  firstName: String = "";
  lastName: String = "";
  email: String = "";
  password: String = "";

  constructor(private signupService: SignupService, private userService: UserServiceService, private router: Router) {

  }

  routing:boolean = false;
  alert_name:boolean=false;
  alert_usedemail:boolean=false;
  alert_invalidemail:boolean=false;
  alert_registered:boolean = false;
  isRegistered:boolean = false;

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

    this.userService.userEmail = this.email.toString();

      return this.signupService.signUpUser(userData)
      .subscribe((response: any) => {
        console.log(response);
        this.alert_registered = true;
        this.isRegistered = true;
        console.log(this.isRegistered);
        this.routing = true;
        this.router.navigate(['/start']);
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

        this.email = '';
        this.password = '';
    });
}

  closeAlert() {
    this.alert_usedemail=false;
    this.alert_invalidemail = false;
    this.alert_name = false;
    this.alert_registered = false;
  };
}
