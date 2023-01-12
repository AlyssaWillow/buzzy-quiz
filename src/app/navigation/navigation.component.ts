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
      external: false,
      value: '/home',
      disp: 'Home',
      restricted: false
    },
    {
      external: false,
      value: '/game-stats',
      disp: 'Game Stats',
      restricted: false
    }, 
    {
      external: false,
      value: '/analytics',
      disp: 'Analytics',
      restricted: false
    }, 
    {
      external: false,
      value: '/tools',
      disp: 'Tools',
      restricted: false
    }, 
    {
      external: false,
      value: '/collection',
      disp: 'Collection',
      restricted: false
    }, 
    {
      external: false,
      value: '/pick-history',
      disp: 'Pick History',
      restricted: false
    }, 
    {
      external: false,
      value: '/shirts',
      disp: 'Convention Shirt History',
      restricted: true
    },
    {
      external: false,
      value: '/add',
      disp: 'Add / Edit',
      restricted: true
    },
    {
      external: true,
      value: 'https://sites.google.com/view/tabletop-syndicate',
      disp: 'Old Site',
      restricted: false
    }
  ]

  constructor(public authenticationService: AuthenticationService) { }

  ngOnInit(): void {
  }

}
