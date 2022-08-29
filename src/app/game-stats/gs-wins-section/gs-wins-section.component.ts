import { Component, Input, OnInit } from '@angular/core';
import { Wins } from 'src/app/models/play';

@Component({
  selector: 'app-gs-wins-section',
  templateUrl: './gs-wins-section.component.html',
  styleUrls: ['./gs-wins-section.component.scss']
})
export class GsWinsSectionComponent implements OnInit {
@Input() winners: Wins[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  
}
