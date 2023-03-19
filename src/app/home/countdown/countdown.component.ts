import { Component, OnInit } from '@angular/core';
import { interval, Subscription, timestamp, Timestamp } from 'rxjs';

@Component({
  selector: 'tts-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  constructor() { }

  //ORIJENS
  // June 21, 2023 8:00am
  //year,month,date[,hour,minute,second,millisecond ]
  countDownTo: string = "Origins";
  startTime: Date = new Date(2023,6,21);

  private subscription: Subscription = new Subscription;

  public dateNow = new Date();
  public dDay = new Date('Jun 21 2023 08:00:00');
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
    this.getTimeDifference();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
