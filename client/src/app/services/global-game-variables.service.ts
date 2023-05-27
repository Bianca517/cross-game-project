import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalGameVariablesService {
  opponentSum:number = 0;
  yourSum:number = 0;
  deck:string[] = []; 
  opponentCards:string[] = [];
  yourCards:string[] = [];
  chosenTromf:string = "";
}
