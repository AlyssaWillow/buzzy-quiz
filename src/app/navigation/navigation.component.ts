import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { homedir } from 'os';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'tts-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  nav = [
    {
      value: '/home',
      disp: 'Home',
      restricted: false
    },
    {
      value: '/game-stats',
      disp: 'Game Stats',
      restricted: false
    }, 
    {
      value: '/collection',
      disp: 'Collection',
      restricted: false
    }, 
    {
      value: '/shirts',
      disp: 'Convention Shirt History',
      restricted: false
    },
    {
      value: '/add-play',
      disp: 'Add Play',
      restricted: true
    },
    {
      value: '/add-faction',
      disp: 'Add Faction',
      restricted: true
    },
    {
      value: '/add-scenario',
      disp: 'Add Scenario',
      restricted: true
    }
  ]

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
