import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'tts-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  inputSideNav!: MatDrawer;
  ngOnInit(): void {
  }

  
  constructor(public authenticationService: AuthenticationService,
              public router: Router) {}

  pageName: string = 'Tabletop Syndicate';

  login = () => {
    this.router.navigate(['/login']);
  }


}
