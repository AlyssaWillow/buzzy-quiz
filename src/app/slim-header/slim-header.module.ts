import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';

import { MatIconModule } from '@angular/material/icon';
import { SlimHeaderComponent } from './slim-header.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    SlimHeaderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule 
  ],
  exports: [
    SlimHeaderComponent
  ]
})
export class SlimHeaderModule { }
