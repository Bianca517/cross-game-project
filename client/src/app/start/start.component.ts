import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { GameConfigurationService } from '../services/game-configuration.service';
import { UserServiceService } from 'app/services/user-service.service';
import { GamesWonService } from 'app/services/games-won.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class StartComponent {

  constructor(private gameConfigDetails: GameConfigurationService, private userService: UserServiceService, private gamesWonService: GamesWonService) {
  }

  ngOnInit() {
    const sidePannel = document.querySelector(".side-panel-toggle") as HTMLElement
    sidePannel.addEventListener("click", () => {
      (document.querySelector(".everything-container") as HTMLElement).classList.toggle("side-panel-open");
    });

    this.userService.userEmail = 'igor@abc.com';
    
    let nrGamesWon: number = 0;
    this.gamesWonService.getNumberOfGamesWonByEmail(this.userService.userEmail).subscribe(
      response => {
        console.log('Response:', response);
        nrGamesWon = response;
        // Perform further operations with the gamesWon value
      });
    console.log("aici trb sa dea 10 ", nrGamesWon);

    this.updateLevelBar(5);
  }

  updateLevelBar(userLevel:number) {
    const lv1 = document.getElementById('lv-bar-item1');
    const lv2 = document.getElementById('lv-bar-item2');
    const lv3 = document.getElementById('lv-bar-item3');
    const lv4 = document.getElementById('lv-bar-item4');

    const level_bar = [lv1, lv2, lv3, lv4]
    if(userLevel > 0) {
      if(userLevel <= 4) {
        let i;
        for(i = 0; i < 4; i++) {
          level_bar[i]?.classList.remove('active');
        }
        level_bar[userLevel]?.classList.add('active');
      } 
      else {
        let i;
        for(i = 0; i < 4; i++) {
          if (level_bar[i] !== null) {
            level_bar[i]!.innerText = (userLevel - 3 + i).toString();
          }
          level_bar[i]?.classList.remove('active');
        }
        lv4?.classList.add('active');
      }
    }
  }

  selectGameMode(target: EventTarget | null): void {
    if (target instanceof HTMLElement) {
      const option1 = document.getElementById('easy');
      const option2 = document.getElementById('medium');
      const option3 = document.getElementById('hard');
      let options = [option1, option2, option3];

      for (let option of options) {
        option?.classList.remove("selected");
      }
      target.classList.add("selected");

      let gameMode = target.textContent;
      this.gameConfigDetails.gameMode = String(gameMode);
      //console.log(this.gameConfigDetails.gameMode);
    }
  }

  selectOption(target: EventTarget | null): void {
    if (target instanceof HTMLElement) {
      const option1 = document.getElementById('7p');
      const option2 = document.getElementById('11p');
      const option3 = document.getElementById('21p');
      let options = [option1, option2, option3];

      for (let option of options) {
        option?.classList.remove("selected");
      }
      target.classList.add("selected");

      let gameTotalPointsNumber = target.textContent?.split(' ')[0];
      this.gameConfigDetails.gameTotalPoints = Number(gameTotalPointsNumber);
      //console.log(this.gameConfigDetails.gameTotalPoints);
    }
  }
}
