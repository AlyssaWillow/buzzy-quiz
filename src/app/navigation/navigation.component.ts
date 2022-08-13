import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { homedir } from 'os';

@Component({
  selector: 'tts-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  nav = [
    {
      value: '/home',
      disp: 'Home'
    },
    {
      value: '/collection',
      disp: 'Collection'
    }, 
    {
      value: '/shirts',
      disp: 'Convention Shirt History'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
