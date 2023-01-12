import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolsComponent } from './tools.component';
import { RandomGameGeneratorModule } from "./random-game-generator/random-game-generator.module";



@NgModule({
    declarations: [
        ToolsComponent
    ],
    exports: [
        ToolsComponent
    ],
    imports: [
        CommonModule,
        RandomGameGeneratorModule
    ]
})
export class ToolsModule { }
