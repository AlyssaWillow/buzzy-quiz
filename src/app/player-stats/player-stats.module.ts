import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerStatsComponent } from './player-stats.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModuleModule } from '../pipes/shared-module/shared-module.module';



@NgModule({
    declarations: [
        PlayerStatsComponent
    ],
    exports: [
        PlayerStatsComponent
    ],
    imports: [
        CommonModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule, 
        FormsModule,
        SharedModuleModule
    ]
})
export class PlayerStatsModule { }
