import { Injectable } from '@angular/core';
import { WebrequestService } from './webrequest.service';
import { ConstantPool } from '@angular/compiler';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class GamesWonService {

  constructor(private webReqService: WebrequestService, private userService: UserServiceService) { }

  getNumberOfGamesWonByEmail(email: string): Observable<number> {
    return this.webReqService.getGamesWon('games-won', email).pipe(
      map(response => {
        const gamesWon = (response.body as { gamesWon: number }).gamesWon;
        console.log('Number of games won:', gamesWon);
        return gamesWon;
      })
    );
  }

  incrementNumberOfGamesWonByEmail() {
    let currentNrOfGamesWon;
    let email = this.userService.userEmail;
    console.log("aici1");
    this.getNumberOfGamesWonByEmail(email).subscribe(
      response => {
        console.log('Response:', response);
        currentNrOfGamesWon = response;
        // Perform further operations with the gamesWon value
      });
      
    const newNrOfGamesWon = currentNrOfGamesWon? + 1: currentNrOfGamesWon;
    console.log("aici2", newNrOfGamesWon);

    const data = {
      email: email,
      gamesWon: newNrOfGamesWon
    }
    return this.webReqService.updateGamesWon('games-won', data);
  }
}
