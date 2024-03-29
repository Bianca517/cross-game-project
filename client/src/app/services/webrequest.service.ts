import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class WebrequestService {

  readonly ROOT_URL;

  constructor(private http : HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
  }

  post(uri: string, payload: Object) {
    console.log("WebReq service!");  
    console.log(payload);
    console.log(`${this.ROOT_URL}/${uri}`);
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload, {observe: 'response'});
  }

  getGamesWon(uri: string, email: string) {
    return this.http.get(this.ROOT_URL + '/' + uri + '?email=' + email, {observe: 'response'});
  }

  updateGamesWon(uri: string, payload: Object) {
    console.log("aici3");
    return this.http.put(`${this.ROOT_URL}/${uri}`, payload, {observe: 'response'});
  }
}
