import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Players } from 'src/app/models/player-selection';
import { BoardGame } from 'src/app/models/collection';
import { Faction, factionDb, factionDb2, FactionGame } from 'src/app/models/faction';
import { nameId } from 'src/app/models/generic';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';

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
  @Input('factions') factions: factionDb2[] = [];
  @Input('last') last: boolean = false;

  factionListForGame: factionDb[] = [];
  constructor(public utils: UtilsService,
    private firebaseDataService: FirebaseDataService,
    private afs: AngularFirestore) { }

  ngOnInit(): void {
    this.getFactionList(this.factionGame.gameId, this.factionTypeId.id)
  }

  getFactionList = (gameId: string, factionTypeId: string): void => {
    this.factionListForGame = this.factions.filter(ref => ref.gameId === gameId && ref.typeId === factionTypeId);
    this.addZeros(this.factionGame, this.factionListForGame);
    this.factionListForGame.sort((a, b) => (a.order > b.order) ? 1 : -1)
  }

  addZeros = (factionGame: FactionGame, factionListForGame: factionDb[]) => {
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
          name: '',
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
