import { ViewEncapsulation } from '@angular/core';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { GameConfigurationService } from '../services/game-configuration.service';
//import { UserServiceService } from 'app/services/user-service.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  //encapsulation: ViewEncapsulation.None
})
export class StartComponent {

  constructor(private gameConfigDetails: GameConfigurationService) {
  }

  ngOnInit() {
    const sidePannel = document.querySelector(".side-panel-toggle") as HTMLElement
    sidePannel.addEventListener("click", () => {
      (document.querySelector(".everything-container") as HTMLElement).classList.toggle("side-panel-open");
    });
    //onsole.log("fmm ", this.userService.getUserEmail());
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
