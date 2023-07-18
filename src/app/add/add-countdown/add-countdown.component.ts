import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { combineLatest } from 'rxjs';
import { GameGroupEvent, GameGroups } from 'src/app/models/gameGroups';
import { Timestamp } from 'src/app/models/play';
import { Players } from 'src/app/models/player-selection';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { UserUtilsService } from 'src/app/services/userUtils.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-countdown',
  templateUrl: './add-countdown.component.html',
  styleUrls: ['./add-countdown.component.scss']
})
export class AddCountdownComponent implements OnInit {

  gameGroups: GameGroups[] = [];
  eventId: string = '';
  eventName: string  = ''
  deletesEnabled: boolean = false;
  playDeleted: boolean = false;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  selectedGameGroup: string = '';
  events: GameGroupEvent[] = [];
  user: Players = {
    firstName: '',
    lastName: '',
    id: '',
    acctId: '',
    color: '',
    collection: []
  };
  subscriptions: any;
  overwritesEnabled: boolean =  false;

  constructor(public utils: UtilsService,
    private afs: AngularFirestore,
    public userUtils: UserUtilsService,
    public authenticationService: AuthenticationService
  ) {
  }


  ngOnInit(): void {
    this.subscriptions = combineLatest(
      this.authenticationService.userData
    ).subscribe( 
      ([userData]) => {
    if (userData) {
      this.afs.collection('tabletop-syndicate').doc('player-data')
      .collection<Players>('player-names', ref => ref.where('acctId', '==', userData.uid))
      .valueChanges().subscribe(playerz=>{
        this.user = playerz[0];
        this.afs.collection<GameGroups>('game-groups', ref => ref.where('members', 'array-contains', this.user['id']))
          .valueChanges().subscribe(groupz=>{
        this.gameGroups = groupz;
        this.gameGroups.push({
          id: this.user.id,
          name: 'Solo',
          members: [this.user.id]
        })
      })
      })

      this.afs.collection<GameGroupEvent>('game-group-events', ref => ref.where('groupId', '==', userData.uid))
      .valueChanges().subscribe(eventz=>{
        this.afs.collection<GameGroups>('game-groups', ref => ref.where('members', 'array-contains', this.user['id']))
          .valueChanges().subscribe(groupz=>{
        this.gameGroups = groupz;
        this.gameGroups.push({
          id: this.user.id,
          name: 'Solo',
          members: [this.user.id]
        })
      })
      })
    }
  })
  }

  getEventsForGroup = (selectedGameGroup: string) => {
    console.log('asdjflkajsdfj',selectedGameGroup)
    this.afs.collection<GameGroupEvent>('game-group-events', ref => ref.where('groupId', '==', (selectedGameGroup)))
    .valueChanges().subscribe(gameGroupEvent =>{
    this.events = gameGroupEvent
})
  }

  addStart(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedStartDate = event.value;
  }
  addEnd(type: string, event: MatDatepickerInputEvent<Date>) {
    this.selectedEndDate = event.value;
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  submit = async () => {
    let eventId: string = (this.eventId ? this.eventId : '')
    let gameGroupId: string = (this.selectedGameGroup ? this.selectedGameGroup : '')
    let eventName: string = (this.eventName ? this.eventName : '')
    let startDate: number =  (this.selectedStartDate ? this.selectedStartDate.valueOf() : 0)
    let endDate: number =  (this.selectedEndDate ? this.selectedEndDate.valueOf() : 0)
    let startDateTs: Timestamp = {
      nanoseconds: (startDate * 1000).toString(),
      seconds: startDate.toString(),
    }
    let endDateTs: Timestamp = {
      nanoseconds: (endDate * 1000).toString(),
      seconds: endDate.toString(),
    }
    if (gameGroupId !== '' && eventName !== '' && startDate > 0 && endDate > 0) {
      if (this.eventId != '') {
        const docData: GameGroupEvent = {
          id: eventId,
          groupId: gameGroupId,
          eventName: eventName,
          startDate: startDateTs,
          endDate: endDateTs
        };
        console.log(docData)
        const pickRef = this.afs.collection('game-group-events');
        await pickRef.doc(this.eventId).set(docData).then(() => {
          this.eventId = '';
          this.selectedGameGroup = '';
          this.eventName = '';
          this.selectedStartDate = null;
          this.selectedStartDate = null;
          console.info("Document successfully added!");
        this.overwritesEnabled = false;
      }).catch((error) => {
        console.error("Error adding document: ", error);
      });

      } else {
        const docData: GameGroupEvent = {
          id: '',
          groupId: gameGroupId,
          eventName: eventName,
          startDate: startDateTs,
          endDate: endDateTs
        };

        const pickRef = this.afs.collection('game-group-events');
        await pickRef.add(docData).then(() => {
          console.info("Document successfully added!");
        }).then((doc) => {
          console.log('doc',doc)
          this.afs.collection<GameGroups>('game-group-events', ref => ref.where('gameGroupId', '==', gameGroupId)
                                                                         .where('id', '==', ''))
                  .snapshotChanges().subscribe(eventz=>{
                    eventz.forEach(event => {
                console.log('0',event.payload.doc.id)
                docData.id = event.payload.doc.id;
                pickRef.doc(event.payload.doc.id).set(docData).then(() => {
                  this.eventId = '';
                  this.selectedGameGroup = '';
                  this.eventName = '';
                  this.selectedStartDate = null;
                  this.selectedStartDate = null;
                  console.info("Document successfully added!");
                this.overwritesEnabled = false;
              }).catch((error) => {
                console.error("Error adding document: ", error);
              });
          })
        })
      })
    }
  }}

  editEventData = (setEvent: GameGroupEvent): void => {
    this.overwritesEnabled = false;
    this.eventId = setEvent.groupId;
    this.eventName = setEvent.eventName;
    this.selectedStartDate = new Date(setEvent.startDate.nanoseconds);
    this.selectedEndDate = new Date(setEvent.endDate.nanoseconds);
    this.selectedGameGroup = setEvent.groupId;
  }

  deleteSelectedEvent = (setEvent: GameGroupEvent): void => {
    if (setEvent && this.deletesEnabled) {
      const pickRef = this.afs.collection('game-group-events');
      pickRef.doc(setEvent.id).delete().then(() => {
        this.playDeleted = true;
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }

  enableDeletes = () => {
    this.deletesEnabled = !this.deletesEnabled
  }
}
