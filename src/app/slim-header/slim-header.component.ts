import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'bzz-slim-header',
  templateUrl: './slim-header.component.html',
  styleUrls: ['./slim-header.component.scss']
})
export class SlimHeaderComponent implements OnInit {
  @Input() inputSideNav!: MatDrawer;
  
  groupId: string | null = null;
  pageName: string = 'Welcome!';
  color: string | null = 'GY';

  constructor(public authenticationService: AuthenticationService,
              public router: Router) { }

  ngOnInit(): void {
  }

  login = () => {
    this.router.navigate(['/login']);
  }

  signUp = () => {
    this.router.navigate(['/create-account']);
  }
}
