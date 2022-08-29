import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsPlaysSectionComponent } from './gs-plays-section.component';
import { UtilsService } from 'src/app/services/utils.service';



@NgModule({
  declarations: [
    GsPlaysSectionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    GsPlaysSectionComponent
  ]
})
export class GsPlaysSectionModule { }
