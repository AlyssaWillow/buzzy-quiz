import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'bzz-slim-header',
  templateUrl: './slim-header.component.html',
  styleUrls: ['./slim-header.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule 
  ]
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
