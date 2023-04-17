import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private webReqService: WebrequestService) { }

  loginUser(user: Object) {
    console.log("login service");
    console.log(user);
    return this.webReqService.post('', user);
  }
}
