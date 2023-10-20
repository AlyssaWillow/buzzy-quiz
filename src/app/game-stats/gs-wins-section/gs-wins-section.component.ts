import { Component, Input } from '@angular/core';
import { Wins } from 'src/app/models/play';

@Component({
  selector: 'app-gs-wins-section',
  templateUrl: './gs-wins-section.component.html',
  styleUrls: ['./gs-wins-section.component.scss']
})
export class GsWinsSectionComponent {
  @Input() winners: Wins[] = [];
}
