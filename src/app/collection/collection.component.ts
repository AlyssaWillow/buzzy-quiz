import { Component, OnInit } from '@angular/core';
interface CollectionGroups {
  value: string;
  viewValue: string;
}
interface Players {
  value: number;
  viewValue: string;
}
interface Time {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  display: string = 'ALL';
  players: number = 0;
  time: number = 0;
  playerCountList: Players[] = [
    {value: 0, viewValue: 'Any'},
    {value: 1, viewValue: '1'},
    {value: 2, viewValue: '2'},
    {value: 3, viewValue: '3'},
    {value: 4, viewValue: '4'},
    {value: 5, viewValue: '5'},
    {value: 6, viewValue: '6'},
    {value: 7, viewValue: '7'},
    {value: 8, viewValue: '8'},
    {value: 9, viewValue: '9'},
    {value: 10, viewValue: '10'},
    {value: 11, viewValue: '11'},
    {value: 12, viewValue: '12'},
    {value: 13, viewValue: '13'},
    {value: 14, viewValue: '14'},
    {value: 15, viewValue: '15'},
    {value: 16, viewValue: '16'},
    {value: 17, viewValue: '17'},
    {value: 18, viewValue: '18'},
    {value: 19, viewValue: '19'},
    {value: 20, viewValue: '20'},
    {value: 21, viewValue: '21'},
    {value: 22, viewValue: '22'},
    {value: 23, viewValue: '23'},
    {value: 24, viewValue: '24'},
    {value: 25, viewValue: '25'},
    {value: 26, viewValue: '26'},
    {value: 27, viewValue: '27'},
    {value: 28, viewValue: '28'},
    {value: 29, viewValue: '29'},
    {value: 30, viewValue: '30'},
  ];
  timeList: Time[] = [
    {value: 0, viewValue: 'Any'},
    {value: 15, viewValue: '15'},
    {value: 30, viewValue: '30'},
    {value: 45, viewValue: '45'},
    {value: 60, viewValue: '60'},
    {value: 75, viewValue: '75'},
    {value: 90, viewValue: '90'},
    {value: 105, viewValue: '105'},
    {value: 120, viewValue: '120'},
    {value: 135, viewValue: '135'},
    {value: 150, viewValue: '150'},
    {value: 165, viewValue: '165'},
    {value: 180, viewValue: '180'},
    {value: 195, viewValue: '195'},
    {value: 210, viewValue: '210'},
    {value: 225, viewValue: '225'},
    {value: 240, viewValue: '240'},
    {value: 255, viewValue: '255'},
    {value: 270, viewValue: '270'},
    {value: 285, viewValue: '285'},
    {value: 300, viewValue: '300'},
  ];
  collections: CollectionGroups[] = [
    {value: 'ALL', viewValue: 'All'},
    {value: 'LEM', viewValue: 'Leman'},
    {value: 'HEN', viewValue: 'Hendrickson'},
  ];
  constructor() { 
    }

  ngOnInit(): void {
  }

  playerSuffix = (i: number) => {
    if (i === 0) {
      return '';
    } else if (i === 1) {
      return 'Player';
    } else {
      return 'Players';
    }
  }

  minuteSuffix = (i: number) => {
    if (i === 0) {
      return '';
    } else {
      return 'Minutes';
    }
  }

}
