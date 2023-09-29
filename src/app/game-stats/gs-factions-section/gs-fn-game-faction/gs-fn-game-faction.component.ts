import { Component, Input, OnInit } from '@angular/core';
import { Players } from 'src/app/models/player-selection';
import { BoardGame } from 'src/app/models/collection';
import { Faction, factionDb3, FactionGame } from 'src/app/models/faction';
import { nameId } from 'src/app/models/generic';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-gs-fn-game-faction',
  templateUrl: './gs-fn-game-faction.component.html',
  styleUrls: ['./gs-fn-game-faction.component.scss']
})
export class GsFnGameFactionComponent implements OnInit {
  @Input('factionTypeId') factionTypeId: nameId = {
    id: '',
    name: ''
  };
  @Input('factionGame') factionGame: FactionGame = {
    gameId: '',
    factions: []
  };
  @Input('bothCol') bothCol: BoardGame[] = [];
  @Input('players') players: Players[] = [];
  @Input('factions') factions: factionDb3[] = [];
  @Input('last') last: boolean = false;

  factionListForGame: factionDb3[] = [];
  constructor(public utils: UtilsService) { }

  ngOnInit(): void {
    this.players.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1)
    this.getFactionList(this.factionGame.gameId, this.factionTypeId.id)
  }

  getFactionList = (gameId: string, factionTypeId: string): void => {
      this.factionListForGame = this.factions.filter(ref => ref.gameId.includes(gameId) && ref.typeId === factionTypeId)
                                             .sort((a, b) => (a.name > b.name) ? 1 : -1)
      this.addZeros(this.factionGame, this.factionListForGame);
  }

  addZeros = (factionGame: FactionGame, factionListForGame: factionDb3[]) => {
    let found = false;
    factionListForGame.forEach(allFaction => {
      found = false;
      factionGame.factions.forEach(faction => {
        if (faction.factionId === allFaction.id) {
          found = true
        }
      })
      if (!found) {
        let newFaction: Faction = {
          factionId: allFaction.id,
          name: allFaction.name,
          playerCount: []
        }
        this.players.forEach(player => {
          newFaction.playerCount.push({
            playerId: player.id,
            count: 0
          })
        });
        factionGame.factions.push(newFaction)
      }

    })

  }

}
