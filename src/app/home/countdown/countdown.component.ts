import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { interval, Subscription, timestamp, Timestamp } from 'rxjs';
import { GameGroupEvent, GameGroups } from 'src/app/models/gameGroups';

@Component({
  selector: 'tts-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  @Input() groupId: string | null = '';

  constructor(public router: Router,
              private afs: AngularFirestore) { }

  //ORIJENS
  // June 21, 2023 8:00am
  //year,month,date[,hour,minute,second,millisecond ]
  countDownTo: string = "Pax Unplugged";
  startTime: Date = new Date(2023,11,1);

  private subscription: Subscription = new Subscription;

  public dateNow = new Date();
  public dDay = new Date('Dec 1 2023 00:00:01');
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference: any;
  public secondsToDday: any;
  public minutesToDday: any;
  public hoursToDday: any;
  public daysToDday: any;

  getTimeDifference = (): void => {
    this.timeDifference = this.dDay.getTime() - new  Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  allocateTimeUnits = (timeDifference: any): void => {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnInit() {
          this.afs.collection<GameGroupEvent>('game-group-events', ref => ref.where('groupId', '==', this.groupId))
            .valueChanges().subscribe(gameGroupEvent =>{
            
            let dateNow = new Date().getSeconds();
            gameGroupEvent.forEach(evnt => {
              if (dateNow > (parseInt(evnt.endDate.seconds) + 86400)) {
                this.deleteEvent(evnt)
              }
            })
            this.countDownTo = (gameGroupEvent.length > 0 ? gameGroupEvent?.sort((a, b) => (a.startDate.seconds > b.startDate.seconds) ? 1 : -1)[0]?.eventName : '')
      })
  
    this.getTimeDifference();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteEvent = (setEvent: GameGroupEvent): void => {
    if (setEvent) {
      const pickRef = this.afs.collection('game-group-events');
      pickRef.doc(setEvent.id).delete().then(() => {
        console.info("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }
  }

}
