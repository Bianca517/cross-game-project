import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private webReqService: WebrequestService) { }

  signUpUser(user: Object) {
    console.log("signup service");
    console.log(user);
    return this.webReqService.post('auth/signup', user);
  }
}
