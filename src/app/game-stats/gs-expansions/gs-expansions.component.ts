import { Expansion } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { AllBoardGame, BoardGame, Link } from 'src/app/models/collection';
import { ownedAndUnownedExpansions } from 'src/app/models/play';

@Component({
  selector: 'tts-gs-expansions',
  templateUrl: './gs-expansions.component.html',
  styleUrls: ['./gs-expansions.component.scss']
})
export class GsExpansionsComponent implements OnInit {

  @Input() bothCol: BoardGame[] = [];
  @Input() expansions: ownedAndUnownedExpansions = {
    owned: [],
    unowned: [],
    ownedPromo: [],
    unownedPromo: [],
    ownedFan: [],
    unownedFan: []
  };

  expandOwned: boolean = false;
  expandUnowned: boolean = false;
  expandOwnedPromos: boolean = false;
  expandUnownedPromos: boolean = false;
  expandOwnedFan: boolean = false;
  expandUnownedFan: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  toggleOwned = () => {
    this.expandOwned = !this.expandOwned;
  }

  toggleUnowned = () => {
    this.expandUnowned = !this.expandUnowned;
  }

  toggleOwnedPromo = () => {
    this.expandOwnedPromos = !this.expandOwnedPromos;
  }

  toggleUnownedPromo = () => {
    this.expandUnownedPromos = !this.expandUnownedPromos;
  }

  toggleOwnedFan = () => {
    this.expandOwnedFan = !this.expandOwnedFan;
  }
  
  toggleUnownedFan = () => {
    this.expandUnownedFan = !this.expandUnownedFan;
  }

}
