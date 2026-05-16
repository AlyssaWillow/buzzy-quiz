import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'tts-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class HeaderComponent implements OnInit {
  @Input()
  inputSideNav!: MatDrawer;
  ngOnInit(): void {
  }

  
  constructor(public authenticationService: AuthenticationService,
              public router: Router) {}

  pageName: string = 'Buzzy Quiz';

  login = () => {
    this.router.navigate(['/login']);
  }


}
