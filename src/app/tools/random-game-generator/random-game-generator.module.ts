import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomGameGeneratorComponent } from './random-game-generator.component';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModuleModule } from 'src/app/pipes/shared-module/shared-module.module';



@NgModule({
  declarations: [
    RandomGameGeneratorComponent
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    SharedModuleModule,
    FormsModule,
  ],
  exports: [
    RandomGameGeneratorComponent
  ]
})
export class RandomGameGeneratorModule { }
